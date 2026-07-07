const puppeteer = require("puppeteer");

async function generatePdfFromHtml(html) {
  let browser;
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      ...(executablePath ? { executablePath } : {}),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    return page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generatePdfFromHtml };
