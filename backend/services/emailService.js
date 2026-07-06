const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dns = require("dns");

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

  const accessTokenResponse = await oAuth2Client.getAccessToken();
  const accessToken =
    typeof accessTokenResponse === "string"
      ? accessTokenResponse
      : accessTokenResponse?.token;

  console.log("========== EMAIL CONFIG ==========");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("MAIL_FROM:", process.env.MAIL_FROM);
  console.log("Access Token Exists:", !!accessToken);
  console.log(
    "Refresh Token Exists:",
    !!process.env.GOOGLE_REFRESH_TOKEN
  );
  console.log("==================================");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER.trim(),
      clientId: process.env.GOOGLE_CLIENT_ID.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN.trim(),
      accessToken,
    },

    lookup(hostname, options, callback) {
      return dns.lookup(hostname, { family: 4 }, callback);
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