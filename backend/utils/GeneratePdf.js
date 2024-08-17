import puppeteer from "puppeteer";

async function generatePDF(data) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naila Arts Bill</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap");

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
         padding: 0.2rem;
      }
      html {
        -webkit-print-color-adjust: exact;
      }

      body {
        font-family: "Lato", sans-serif;
      }

      .header {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-block: 1rem;
      }

      .logo {
        width: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .logo img {
        width: 80%;
      }

      .company_header {
        width: 65%;
        height: 100%;
        padding-left: 2rem;
        border-left: 0.5px solid black;
      }

      .company_header_title {
        font-weight: 500;
        font-size: 1.75rem;
        letter-spacing: 1px;
        margin-bottom: 1rem;
      }

      .company_header_slogan {
        background-color: #252525;
        color: white;
        border-radius: 5px;
        padding-block: 0.4rem;
        padding-inline: 0.5rem;
        font-weight: 500;
        font-size: 0.9rem;
        letter-spacing: 1px;
      }

      .company_header_type {
        font-weight: 500;
        font-size: 1.6rem;
        letter-spacing: 1px;
        margin-top: 1rem;
      }

      .contact_info {
        margin-top: 0.5rem;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 1.5rem;
      }

      .contact_info_box {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }

      .contact_info_title {
        font-weight: 500;
        font-size: 0.9rem;
        margin-bottom: 0.2rem;
      }

      .contact_info_number {
        font-weight: 500;
        font-size: 0.9rem;
        margin-bottom: 0.2rem;
      }

      .phone_logo {
        width: 1rem;
      }

      .company_details {
        width: 100%;
      }

      .company_details_boxes {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-wrap: wrap;
      }

      .details_input {
        width: 25%;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 0.2rem;
        padding-block: 1rem;
      }

      .field_title {
        min-width: 5rem !important;
      }

      .details_input input {
        border: none;
        background: transparent;
        padding-top: 0.25rem;
      }

      .details_input input:focus {
        border: none;
        outline: none;
        background: transparent;
      }

      /* table */
      .table-container {
        margin-top: 20px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      thead {
        background-color: #f0f0f0;
      }

      thead th {
        border: 1px solid #ddd;
        padding-inline: 8px;
        padding-block: 1.2rem;
        text-align: left;
      }

      tbody td {
        border: 1px solid #ddd;
        padding-inline: 8px;
        padding-block: 1.2rem;
      }

      .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .bill_text {
        width: 60%;
      }

      .bill_text h2 {
        font-size: 1.5rem;
        font-weight: 500;
      }

      .bill_total {
        width: 40%;
      }

      .bill_row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .bill_title {
        border: 1px solid #eee;
        width: 100%;
        padding-block: 1.1rem;
        padding-inline: 1.2rem;
      }

      .bill_value {
        border: 1px solid #eee;
        text-align: right;
        width: 100%;
        padding-block: 1.1rem;
        padding-inline: 1.2rem;
      }

      .dark_class {
        background-color: #252525;
        color: #fff;
      }

      .account_details {
        width: 100%;
        border-block: 1px solid rgb(194, 194, 194);
        padding-block: 1rem;
        margin-top: 2rem;
      }

      .account_details_title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #252525;
      }

      .account {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.8rem;
      }

      .account_box h3 {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      .border-l {
        border-left: 1px solid black;
        padding-left: 2rem;
      }

      .address {
        width: 100%;
        text-align: center;
        padding-block: 1rem;
      }

      .address h2 {
        font-size: 1.1rem;
        font-weight: 500;
        letter-spacing: 1px;
      }

      .dua {
        width: 100%;
        text-align: center;
        padding-block: 1rem;
        background-color: #252525;
        color: #fff;
      }

      .dua h2 {
        font-size: 1.1rem;
        font-weight: 500;
        letter-spacing: 1px;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="header">
        <!-- logo -->
        <div class="logo">
          <img
            src="https://cdn.shopify.com/s/files/1/0704/6378/2946/files/Naila_1.png?v=1721839653"
            alt="logo"
          />
        </div>

        <!-- company header -->
        <div class="company_header">
          <h2 class="company_header_title">Naila Arts</h2>
          <span class="company_header_slogan">
            ہمارے ہاں ہر قسم کی فینسی رپلیکا کی تمام ورائٹی ہول سیل ریٹ پر
            دستیاب ہے
          </span>
          <p class="company_header_type">ہول سیل ڈیلر</p>

          <div class="contact_info">
            <div class="contact_info_box">
              <img
                class="phone_logo"
                src="https://cdn.shopify.com/s/files/1/0704/6378/2946/files/call.png?v=1723468531"
                alt="phone logo"
              />
              <div class="">
                <h2 class="contact_info_title">Bilal Sheikh</h2>
                <p class="contact_info_number">0324-4103514</p>
                <p class="contact_info_number">0332-4867447</p>
              </div>
            </div>
            <div class="contact_info_box">
              <img
                class="phone_logo"
                src="https://cdn.shopify.com/s/files/1/0704/6378/2946/files/call.png?v=1723468531"
                alt="phone logo"
              />
              <div class="">
                <h2 class="contact_info_title">Amir Sheikh</h2>
                <p class="contact_info_number">0309-7026733</p>
                <p class="contact_info_number">0335-4299291</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="company_details">
        <div class="company_details_boxes">
          <div class="details_input">
            <span class="field_title">Serial No:</span>
            <input
              type="text"
              class="border-none w-full"
              placeholder="_______________"
              value=${data.serialNumber}
            />
          </div>
          <div class="details_input">
            <span>Name: </span>
            <input
              type="text"
              class="border-none w-full"
              placeholder="_______________"
              value=${data.name}
            />
          </div>
          <div class="details_input">
            <span>City: </span>
            <input
              type="text"
              class="border-none w-full"
              placeholder="_______________"
              value=${data.city}
            />
          </div>
          <div class="details_input">
            <span>Cargo: </span>
            <input
              type="text"
              class="border-none w-full"
              placeholder="_______________"
                value=${data.cargo}
            />
          </div>
          <div class="details_input">
            <span class="text-start">Phone: </span>
            <input
              type="text"
              class="border-none w-full"
              placeholder="_______________"
                value=${data.phone}
            />
          </div>
          <div class="details_input">
            <span class="text-start">Date: </span>
            <input
              type="text"
              class="border-none w-full"
              placeholder="_______________"
                value=${data.date}
            />
          </div>
          <div class="details_input">
            <span class="field_title">Bill By: </span>
            <input
              type="text"
              class="border-none w-full"
              placeholder="_______________"
                value=${data.bill_by}
            />
          </div>
        </div>
      </section>
 <section class="table-container">
        <table>
          <thead>
            <tr>
              <th>Qty</th>
              <th>Design No</th>
              <th>Colors</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
        <tbody>
  ${data.suits_data
    .map(
      (suit) => `
    <tr>
      <td>${suit.quantity}</td>
      <td>${suit.d_no}</td>
      <td>${suit.color}</td>
      <td>${suit.price}</td>
      <td>${suit.price * suit.quantity}</td>
    </tr>
  `
    )
    .join("")}
</tbody>

        </table>
      </section> 

      <section class="total">
        <!-- bill text -->
        <div class="bill_text">
          <h2>بل کہ بغیر مال کی واپسی یا تبدیلی نہیں کی جائے گی</h2>
        </div>

        <!-- bill total -->
        <div class="bill_total">
          <div class="bill_row dark_class">
            <div class="bill_title">Total</div>
            <div class="bill_value">${data.total + data.discount}</div>
          </div>
          <div class="bill_row">
            <div class="bill_title">Discount</div>
            <div class="bill_value">${data.discount}</div>
          </div>
          <div class="bill_row dark_class">
            <div class="bill_title">Advance</div>
            <div class="bill_value">${data.paid}</div>
          </div>
          <div class="bill_row">
            <div class="bill_title">Balance</div>
            <div class="bill_value">${data.remaining}</div>
          </div>
        </div>
      </section>

      <section class="account_details">
        <h2 class="account_details_title">Account Detail :</h2>

        <div class="account">
          <div class="account_box account1">
            <h3>Title: Bilal Khan</h3>
            <h3>Bank: Meezan Bank</h3>
            <h3>Account No: 02820103264090</h3>
          </div>
          <div class="account_box account2 border-l">
            <h3>Title: Bilal Khan</h3>
            <h3>Bank: Jazz Cash</h3>
            <h3>Account No: 0324-4103514</h3>
          </div>
          <div class="account_box account3 border-l">
            <h3>Title: Bilal Khan</h3>
            <h3>Bank: EasyPaisa</h3>
            <h3>Account No: 0332-4867447</h3>
          </div>
        </div>
      </section>
      <section class="address">
        <h2>Address: دوکان نمبر UK-66G سنٹر اعظم کلاتھ مارکیٹ لاہور ۔</h2>
      </section>
      <section class="dua">
        <h2>ہماری دعا ہے ہم سے لئے گئے مال میں آپکے لئے خیر و برکت ہو۔</h2>
      </section>
    </main>
  </body>
</html>`;

    await page.setContent(htmlContent);

    // Ensure the page is fully loaded before generating the PDF
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve();
        } else {
          window.addEventListener("load", resolve);
        }
      });
    });

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    throw new Error(error);
  }
}

export default generatePDF;
