const puppeteer = require("puppeteer");

async function generatePdfFromHtml(html) {
  let browser;

  try {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

    browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    // Allow loading of Base64 images
    await page.setBypassCSP(true);

    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });

    // Wait until all images are loaded
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

    // Small delay to ensure rendering is complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    return pdfBuffer;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generatePdfFromHtml };