/* eslint-disable */
const TRANSACTION_EMAIL = (
  customer_name,
  invoice_number,
  items,
  subtotal,
  discount,
  total
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;400;700;900&display=swap" rel="stylesheet">
        <title>ecentials</title>
    </head>
    <body>
        <style>
            body{
              font-family: 'Poppins', Arial, Helvetica, sans-serif;
            }
            h1{
              font-size: 1.5rem;
              font-weight: 900;
            }
            p{
              color: #384860;
            }
            .container{
              width: 90%;
              margin: 0 auto;
            }
  
            .btn{
              text-decoration: none;
              color: #fff;
              background-color: dodgerblue;
              padding: 1.25rem 2.8rem;
              margin: 0.5rem 0;
              display: inline-block;
              font-weight: bold;
            }
            .line{
              line-height: 0.5em;
            }
            .touch{
              margin-top: 3rem;
            }
            .flex-container{
                display: flex;
                align-items: center;
                justify-content: start;
            }
            .flex-row{
                display: flex;
                justify-content: space-between;
                align-items: start;
            }
  
            .flex-inner-row{
                display: flex;
                align-items: center;
            }
            .flex-column{
                display: flex;
                flex-direction: column;
                line-height: 0.02em;
            }
            .flex-inner{
                display: flex;
                justify-content: space-between;
            }
          </style>
          <div class="container">
            <div class="flex-container">
                <img src="https://ecentials.vercel.app/favicon.ico" alt="" width="30"><h3>Notion Labs</h3>
            </div>
            <p>Hello <b style="color: #000;">${customer_name}</b></p>
            <p>Thank you for your purchase! We’ve received your order, we will notify you when delivery begins.</p>
            <h5>Order details:</h5>
            <p>No. Invoice: <span style="color: dodgerblue;">${invoice_number}</span></p>
            <div class="flex-row">
                <div class="flex-inner-row">
                    <img src="./900 (4) 1.png" alt="" width="50">
                    <div class="flex-column">
                        <h4>Paracetamol</h4>
                        <div class="flex-inner">
                            <p>500mg</p>
                            <p style="margin-left: 3px;">Qty: x2</p>
                        </div>
                    </div>
                </div>
                <p>GHC 80.00</p>
            </div>
            <hr color="#E2E8F0" size="" style="margin-top: 2rem;">
            <div class="flex-row">
                <div class="flex-inner-row">
                    <img src="./900 (4) 1.png" alt="" width="50">
                    <div class="flex-column">
                        <h4>Paracetamol</h4>
                        <div class="flex-inner">
                            <p>500mg</p>
                            <p style="margin-left: 3px;">Qty: x2</p>
                        </div>
                    </div>
                </div>
                <p>GHC 80.00</p>
            </div>
            <hr color="#E2E8F0" size="" style="margin-top: 2rem;">
           <div class="line">
            <div class="flex-row">
                <p>Subtotal</p>
                <p style="font-weight: bold;">GHC ${subtotal}</p>
            </div>
            <div class="flex-row">
                <p>Discount</p>
                <p style="font-weight: bold;">GHC ${discount}</p>
            </div>
            <div class="flex-row">
                <p style="font-weight: bold;">Total</p>
                <p style="font-weight: bold;">GHC ${total}</p>
            </div>
           </div>
  
           <p class="touch">At the touch of a button! Download our app for Google & Mac.</p>
           <a href="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="" width="100"></a>
           <a href="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg"><img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg" alt="" width="100" style="margin-bottom: 0.4rem;"></a>
           <p style="margin-bottom: 1rem;">Questions or faq? Contact us at <a href="" style="color: dodgerblue;">faq@ecentials.com</a></p>
           <div class="line">
            <p>100 Ololade Street, Accra Ghana</p>
            <p style="font-size: 11px;">© 2023 ecentials
            </p>
           </div>
  
            </div>
  
  
  
    </body>
    </html>
    `;
};

module.exports = TRANSACTION_EMAIL;
