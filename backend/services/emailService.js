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

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendOfferLetterEmail(student) {
  const transporter = createTransporter();

  if (!transporter) {
    return {
      skipped: true,
      reason: "Email is not configured.",
    };
  }

  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP Connected Successfully");
  } catch (err) {
    console.error("❌ Gmail Verify Error");
    console.error(err);
    throw err;
  }

  const issueDate = student.offerLetterUploadedDate
    ? new Date(student.offerLetterUploadedDate).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
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
        "Please find your Offer Letter attached.",
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

    console.log("✅ Offer Letter Email Sent Successfully");
    console.log(info);

    return {
      skipped: false,
    };
  } catch (err) {
    console.error("❌ Offer Letter Email Error");
    console.error(err);
    throw err;
  }
}

async function sendRejectionEmail(student) {
  const transporter = createTransporter();

  if (!transporter) {
    return {
      skipped: true,
      reason: "Email is not configured.",
    };
  }

  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP Connected Successfully");
  } catch (err) {
    console.error("❌ Gmail Verify Error");
    console.error(err);
    throw err;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
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

    console.log("✅ Rejection Email Sent Successfully");
    console.log(info);

    return {
      skipped: false,
    };
  } catch (err) {
    console.error("❌ Rejection Email Error");
    console.error(err);
    throw err;
  }
}

module.exports = {
  sendOfferLetterEmail,
  sendRejectionEmail,
};