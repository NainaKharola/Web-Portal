const nodemailer = require("nodemailer");

function hasEmailConfig() {
  return Boolean(
    process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.MAIL_FROM
  );
}

function createTransporter() {
  if (!hasEmailConfig()) {
    return null;
  }

  console.log("========== EMAIL CONFIG ==========");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("MAIL_FROM:", process.env.MAIL_FROM);
  console.log("EMAIL_PASS Exists:", !!process.env.EMAIL_PASS);
  console.log("==================================");

  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,

    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASS.trim(),
    },

    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,

    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });
}

async function sendOfferLetterEmail(student) {
  const transporter = await createTransporter();

  if (!transporter) {
    return {
      skipped: true,
      reason: "Email configuration missing.",
    };
  }

  const issueDate = student.offerLetterUploadedDate
    ? new Date(student.offerLetterUploadedDate).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  try {
    console.log("📧 Sending Offer Letter Email...");

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: student.email,
      subject: "Internship Application Approved - Offer Letter",

      text: `Dear ${student.name},

Congratulations!

Your internship application has been approved.

Offer Letter Issue Date: ${issueDate}

Please find your Offer Letter attached.

Regards,
Internship Management Team`,

      attachments: [
        {
          filename: "Offer-Letter.pdf",
          path: student.offerLetterUrl,
        },
      ],
    });

    console.log("✅ Offer Letter Email Sent");
    console.log("Message ID:", info.messageId);

    return {
      skipped: false,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error("❌ Offer Letter Email Error");
    console.error(err);

    throw new Error(`Email sending failed: ${err.message}`);
  }
}

async function sendRejectionEmail(student) {
  const transporter = await createTransporter();

  if (!transporter) {
    return {
      skipped: true,
      reason: "Email configuration missing.",
    };
  }

  try {
    console.log("📧 Sending Rejection Email...");

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: student.email,
      subject: "Internship Application Status",

      text: `Dear ${student.name},

We regret to inform you that your internship application has been rejected.

Remark:
${student.remark || "Please contact the administration for more information."}

Regards,
Internship Management Team`,
    });

    console.log("✅ Rejection Email Sent");
    console.log("Message ID:", info.messageId);

    return {
      skipped: false,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error("❌ Rejection Email Error");
    console.error(err);

    throw new Error(`Email sending failed: ${err.message}`);
  }
}

module.exports = {
  sendOfferLetterEmail,
  sendRejectionEmail,
};
