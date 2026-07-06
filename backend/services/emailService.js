const nodemailer = require("nodemailer");
const { google } = require("googleapis");

function hasEmailConfig() {
  return Boolean(
    process.env.EMAIL_USER &&
    process.env.MAIL_FROM &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}

async function createTransporter() {
  if (!hasEmailConfig()) {
    return null;
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
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

  return {
    skipped: false,
    messageId: info.messageId,
  };
}

async function sendRejectionEmail(student) {
  const transporter = await createTransporter();

  if (!transporter) {
    return {
      skipped: true,
      reason: "Email configuration missing.",
    };
  }

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

  return {
    skipped: false,
    messageId: info.messageId,
  };
}

module.exports = {
  sendOfferLetterEmail,
  sendRejectionEmail,
};