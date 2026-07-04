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
  if (!hasEmailConfig()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOfferLetterEmail(student) {
  const transporter = createTransporter();

  if (!transporter) {
    return { skipped: true, reason: "SMTP is not configured." };
  }

  const issueDate = student.offerLetterUploadedDate
    ? new Date(student.offerLetterUploadedDate).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: student.email,
    subject: "Internship Application Approved - Offer Letter",
    text: [
      `Dear ${student.name},`,
      "",
      "Congratulations. Your internship application has been approved.",
      `Offer Letter Issue Date: ${issueDate}`,
      "",
      "Please review the attached offer letter and follow the joining instructions provided by the administration.",
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

  return { skipped: false };
}

async function sendRejectionEmail(student) {
  const transporter = createTransporter();

  if (!transporter) {
    return { skipped: true, reason: "SMTP is not configured." };
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: student.email,
    subject: "Internship Application Status",
    text: [
      `Dear ${student.name},`,
      "",
      "Your internship application has been rejected.",
      `Reason: ${student.remark || "Please contact the administration for more information."}`,
      "",
      "Regards,",
      "Internship Management Team",
    ].join("\n"),
  });

  return { skipped: false };
}

module.exports = {
  sendOfferLetterEmail,
  sendRejectionEmail,
};
