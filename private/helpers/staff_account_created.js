/* eslint-disable */
const StaffAccount = (staff_name, account_id, password, facility_name) => {
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
          .flex-container{
                    display: flex;
                    align-items: center;
                    justify-content: start;
                }
        </style>
        <div class="container">
            <div class="flex-container">
                <img src="https://ecentials.vercel.app/favicon.ico" alt="" width="30"><h3>${facility_name}</h3>
            </div>
            <h1>New staff employee credentials</h1>
            <p>Hi ${staff_name}</p>
            <p>Congratulations on your new role🎉🎉</p>
            <p>Now you can login to <a href="https://ecentials.vercel.app/" style="color: dodgerblue; text-decoration: none;">ecentials.vercel.app</a></p>
            <p>This is your <b>employee ID: </b></p>
            <span>${account_id}</span>
            <p>and your <b>employee password: </b></p>
            <span style="font-weight: 400; font-size: 1.2rem;">${password}</span>
            <p>You can setup a new password <a href="https://ecentials.vercel.app/forgot-password" style="color: dodgerblue; text-decoration: none;" target="_blank">here</a> or use </p>
    
           <div class="line">
            <p>Thanks</p>
            <p>ecentials Team</p>
           </div>
           <p class="touch">At the touch of a button! Download our app for Google & Mac.</p>
           <a href="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="" width="200"></a>
           <a href="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg"><img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg" alt="" width="200" style="margin-bottom: 0.8rem;"></a>
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

module.exports = StaffAccount;
