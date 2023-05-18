/* eslint-disable */
const EMAILBODY = (name, resetCode) => {
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
          span{
            font-weight: 700;
            font-size: 2.5rem;
            padding: 0.25rem 1rem;
            border: 1px solid dodgerblue;
            margin: 0.25rem;
            border-radius: 4px;
          }
          .btn{
            text-decoration: none;
            color: #fff;
            background-color: dodgerblue;
            padding: 1.25rem 2.8rem;
            margin: 0.5rem 0;
            display: inline-block;
          }
          .line{
            line-height: 0.5em;
          }
          .touch{
            margin-top: 3rem;
          }
        </style>
        <div class="container">
            <img src="https://ecentials.vercel.app/favicon.ico" alt="">
            <h1>Confirm Verification Code</h1>
            <p>Hi ${name}</p>
            <p>This is your verification code</p>
            <span>${resetCode.charAt(0)}</span><span>${resetCode.charAt(1)}</span><span>${resetCode.charAt(2)}</span><span>${resetCode.charAt(3)}</span><span>${resetCode.charAt(4)}</span><span>${resetCode.charAt(5)}</span>
            <p>This code will only be valid for the next 15 minutes. If the code does not work, you can use this login verification link:</p>
            <a href="" class="btn">Verify Email</a>
           <div class="line">
            <p>Thanks</p>
            <p>ecentials Team</p>
           </div>
           <p class="touch">At the touch of a button! Download our app for Google & Mac.</p>
           <a href="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="" width="100"></a>
           <a href="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg"><img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg" alt="" width="100" style="margin-bottom: 0.4rem;"></a>
           <p style="margin-bottom: 1rem;">Questions or faq? Contact us at <a href="" style="color: dodgerblue;">faq@ecentials.com</a></p>
           <div class="line">
            <p>100 Ololade Street, Accra Ghana</p>
            <p style="font-size: 10px;">© 2023 ecentials
            </p>
           </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = EMAILBODY;
