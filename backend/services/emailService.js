const nodemailer = require("nodemailer");

function hasEmailConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function createTransporter() {
  if (!hasEmailConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:
      String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOfferLetterEmail(student) {
  const transporter = createTransporter();

  console.log("========== SMTP CONFIG ==========");
  console.log({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    from: process.env.MAIL_FROM,
  });
  console.log("=================================");

  if (!transporter) {
    console.log("SMTP NOT CONFIGURED");
    return {
      skipped: true,
      reason: "SMTP is not configured.",
    };
  }

  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connected successfully");
  } catch (err) {
    console.error("SMTP VERIFY ERROR:");
    console.error(err);
    throw err;
  }

  const issueDate = student.offerLetterUploadedDate
    ? new Date(student.offerLetterUploadedDate).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: student.email,
      subject: "Internship Application Approved - Offer Letter",
      text: [
        `Dear ${student.name},`,
        "",
        "Congratulations!",
        "Your internship application has been approved.",
        "",
        `Offer Letter Issue Date: ${issueDate}`,
        "",
        "Please find your Offer Letter attached with this email.",
        "",
        "Regards,",
        "Internship Management Team",
      ].join("\n"),
      attachments: [
        {
          filename: "Offer-Letter.pdf",
          path: student.offerLetterUrl,
        },
      ],
    });

    console.log("MAIL SENT SUCCESSFULLY");
    console.log(info);

    return {
      skipped: false,
    };
  } catch (err) {
    console.error("SEND MAIL ERROR:");
    console.error(err);
    throw err;
  }
}

async function sendRejectionEmail(student) {
  const transporter = createTransporter();

  if (!transporter) {
    return {
      skipped: true,
      reason: "SMTP is not configured.",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: student.email,
      subject: "Internship Application Status",
      text: [
        `Dear ${student.name},`,
        "",
        "We regret to inform you that your internship application has been rejected.",
        "",
        `Remark: ${
          student.remark ||
          "Please contact the administration for more information."
        }`,
        "",
        "Regards,",
        "Internship Management Team",
      ].join("\n"),
    });

    console.log("REJECTION MAIL SENT");
    console.log(info);

    return {
      skipped: false,
    };
  } catch (err) {
    console.error("REJECTION MAIL ERROR:");
    console.error(err);
    throw err;
  }
}

module.exports = {
  sendOfferLetterEmail,
  sendRejectionEmail,
};