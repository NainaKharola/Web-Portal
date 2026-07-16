const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { isMongoAvailable } = require("../config/runtime");

const dataDirectory = path.join(__dirname, "..", "data");
const uploadsDirectory = path.join(__dirname, "..", "uploads");

const dateFields = new Set([
  "approvedDate", "reviewedAt", "submittedAt", "uploadedAt", "issueDate",
  "sentAt", "offerLetterUploadedDate", "offerLetterSentDate", "joinedDate",
  "completedDate", "completionDate", "updatedAt", "createdAt", "generatedDate",
]);

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function getValue(object, key) {
  return key.split(".").reduce((value, part) => value?.[part], object);
}

function matchesCondition(value, condition) {
  if (condition && typeof condition === "object" && !Array.isArray(condition) && !(condition instanceof Date)) {
    return Object.entries(condition).every(([operator, expected]) => {
      if (operator === "$in") return expected.map(String).includes(String(value));
      if (operator === "$ne") return value !== expected;
      if (operator === "$exists") return expected ? value !== undefined : value === undefined;
      if (operator === "$regex") return new RegExp(expected, condition.$options || "").test(String(value || ""));
      if (operator === "$options") return true;
      if (operator === "$gte") return new Date(value) >= new Date(expected);
      if (operator === "$lt") return new Date(value) < new Date(expected);
      return false;
    });
  }
  return String(value) === String(condition);
}

function matches(record, filter = {}) {
  return Object.entries(filter).every(([key, condition]) => {
    if (key === "$or") return condition.some((entry) => matches(record, entry));
    if (key === "$and") return condition.every((entry) => matches(record, entry));
    return matchesCondition(getValue(record, key), condition);
  });
}

function selectFields(record, projection) {
  if (!projection || typeof projection !== "string") return record;
  const selected = projection.split(/\s+/).filter(Boolean);
  const result = { _id: record._id };
  selected.forEach((key) => { if (record[key] !== undefined) result[key] = record[key]; });
  return result;
}

class LocalQuery {
  constructor(loader) { this.loader = loader; this.projection = null; this.sortSpec = null; }
  select(projection) { this.projection = projection; return this; }
  sort(sortSpec) { this.sortSpec = sortSpec; return this; }
  async resolve() {
    let records = await this.loader();
    if (this.sortSpec) {
      const [[key, direction]] = Object.entries(this.sortSpec);
      records.sort((a, b) => {
        const left = getValue(a, key) ?? "";
        const right = getValue(b, key) ?? "";
        return (left > right ? 1 : left < right ? -1 : 0) * (direction === -1 || direction === "desc" ? -1 : 1);
      });
    }
    return records.map((record) => selectFields(record, this.projection));
  }
  lean() { return this.resolve(); }
  then(resolve, reject) { return this.resolve().then(resolve, reject); }
}

class LocalSingleQuery extends LocalQuery {
  async resolve() {
    const records = await super.resolve();
    return records[0] ? new this.Document(records[0]) : null;
  }
  lean() { return this.resolve().then((document) => document?.toObject?.() || null); }
}

async function ensureJsonFile(fileName) {
  await fs.mkdir(dataDirectory, { recursive: true });
  const filePath = path.join(dataDirectory, fileName);
  try { await fs.access(filePath); } catch { await fs.writeFile(filePath, "[]\n", "utf8"); }
  return filePath;
}

async function readJson(fileName) {
  const filePath = await ensureJsonFile(fileName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeJson(fileName, records) {
  const filePath = await ensureJsonFile(fileName);
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, filePath);
}

function applyUpdate(record, update = {}) {
  const next = { ...record, ...clone(update) };
  if (update.$set) {
    Object.entries(update.$set).forEach(([key, value]) => {
      const parts = key.split(".");
      let target = next;
      while (parts.length > 1) { const part = parts.shift(); target[part] ||= {}; target = target[part]; }
      target[parts[0]] = value;
    });
  }
  return next;
}

function createLocalModel(MongoModel, fileName, defaults = {}, methods = {}) {
  class LocalDocument {
    constructor(data = {}) { Object.assign(this, clone({ ...defaults, ...data })); this._id ||= crypto.randomBytes(12).toString("hex"); }
    toObject() { return clone(this); }
    async save() {
      if (methods.beforeSave) await methods.beforeSave(this);
      const records = await readJson(fileName);
      const next = this.toObject();
      const index = records.findIndex((record) => String(record._id) === String(this._id));
      if (index >= 0) records[index] = next; else records.push(next);
      await writeJson(fileName, records);
      return this;
    }
  }
  Object.assign(LocalDocument.prototype, methods);

  function Model(data) {
    if (isMongoAvailable()) return new MongoModel(data);
    return new LocalDocument(data);
  }

  async function localRecords() { return readJson(fileName); }
  Model.find = (filter = {}) => isMongoAvailable() ? MongoModel.find(filter) : new LocalQuery(async () => (await localRecords()).filter((record) => matches(record, filter)));
  Model.findOne = (filter = {}) => {
    if (isMongoAvailable()) return MongoModel.findOne(filter);
    const query = new LocalSingleQuery(async () => { const record = (await localRecords()).find((entry) => matches(entry, filter)); return record ? [record] : []; });
    query.Document = LocalDocument;
    return query;
  };
  Model.findById = (id) => isMongoAvailable() ? MongoModel.findById(id) : Model.findOne({ _id: id });
  Model.exists = async (filter = {}) => isMongoAvailable() ? MongoModel.exists(filter) : Boolean((await localRecords()).find((record) => matches(record, filter)));
  Model.countDocuments = async (filter = {}) => isMongoAvailable() ? MongoModel.countDocuments(filter) : (await localRecords()).filter((record) => matches(record, filter)).length;
  Model.create = async (data) => { const document = new Model(data); return document.save(); };
  Model.findByIdAndUpdate = async (id, update) => {
    if (isMongoAvailable()) { const result = await MongoModel.findByIdAndUpdate(id, update); await syncMongoCollection(MongoModel, fileName); return result; }
    const document = await Model.findById(id); if (!document) return null; Object.assign(document, applyUpdate(document.toObject(), update)); return document.save();
  };
  Model.updateMany = async (filter, update) => {
    if (isMongoAvailable()) { const result = await MongoModel.updateMany(filter, update); await syncMongoCollection(MongoModel, fileName); return result; }
    const records = await localRecords(); let modifiedCount = 0;
    const next = records.map((record) => { if (!matches(record, filter)) return record; modifiedCount += 1; return applyUpdate(record, update); });
    await writeJson(fileName, next); return { modifiedCount };
  };
  Model.deleteMany = async (filter) => {
    if (isMongoAvailable()) { const result = await MongoModel.deleteMany(filter); await syncMongoCollection(MongoModel, fileName); return result; }
    const records = await localRecords(); const next = records.filter((record) => !matches(record, filter)); await writeJson(fileName, next); return { deletedCount: records.length - next.length };
  };
  Model.nativeModel = MongoModel;
  return Model;
}

async function saveLocalFile(buffer, folder, originalName = "document.pdf") {
  const extension = path.extname(originalName) || ".pdf";
  const filename = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${extension.toLowerCase()}`;
  const directory = path.join(uploadsDirectory, folder);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), buffer);
  return { filename, localPath: path.join(directory, filename), url: `/uploads/${folder}/${filename}` };
}

async function syncMongoCollection(MongoModel, fileName) {
  if (!isMongoAvailable()) return;
  const records = await MongoModel.find({}).lean();
  await writeJson(fileName, records);
}

module.exports = { createLocalModel, readJson, saveLocalFile, syncMongoCollection, writeJson };
