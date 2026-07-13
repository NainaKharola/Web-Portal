const puppeteer = require("puppeteer");
const path = require("path");

async function createBrowser() {
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_PATH ||
    "/opt/render/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome";

  console.log("Using Chrome:", executablePath);

  return puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
}

async function renderPdf(browser, html) {
  const page = await browser.newPage();

  try {
    await page.setBypassCSP(true);
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });
    await page.emulateMediaType("screen");

    await page.evaluate(async () => {
      const images = Array.from(document.images);

      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

async function generatePdfsFromHtml(htmlDocuments) {
  let browser;

  try {
    browser = await createBrowser();
    return await Promise.all(htmlDocuments.map((html) => renderPdf(browser, html)));
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

async function generatePdfFromHtml(html) {
  const [pdf] = await generatePdfsFromHtml([html]);
  return pdf;
}

module.exports = { generatePdfFromHtml, generatePdfsFromHtml };
