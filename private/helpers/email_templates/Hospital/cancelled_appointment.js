const CancelledAppointmentTemplate = (
  patientName,
  date,
  time,
  hospitalName,
  hospitalLocation,
  hospitalPhoneNumber
) => `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;400;700;900&display=swap"
            rel="stylesheet">
        <title>ecentials</title>
    </head>
    
    <body>
        <style>
            body {
                font-family: 'Poppins', Arial, Helvetica, sans-serif;
            }
    
            h1 {
                font-size: 1.5rem;
                font-weight: 900;
            }
    
            p {
                color: #384860;
            }
    
            .container {
                width: 90%;
                margin: 0 auto;
            }
    
            span {
                font-weight: 700;
                font-size: 2.5rem;
                padding: 0.25rem 1rem;
                border: 1px solid dodgerblue;
                margin: 0.25rem;
                border-radius: 4px;
            }
    
            .btn {
                text-decoration: none;
                color: #fff;
                background-color: dodgerblue;
                padding: 1.25rem 2.8rem;
                margin: 0.5rem 0;
                display: inline-block;
                font-weight: bold;
            }
    
            .line {
                line-height: 0.5em;
            }
    
            .touch {
                margin-top: 3rem;
            }
    
            .flex-container {
                display: flex;
                align-items: center;
                justify-content: start;
            }
        </style>
        <div class="container">
            <div class="flex-container">
    
                <img src="https://ecentials.vercel.app/favicon.ico" alt="" width="30">
                <h3>${hospitalName}</h3>
            </div>
            <h1>Confirm Verification Code</h1>
            <p>Dear ${patientName},</p>
            <p>Dear ${patientName}, I am writing to confirm your upcoming hospital appointment, scheduled for ${date} at ${time},
                at ${hospitalName} located at ${hospitalLocation} has been cancelled.</p>
            <p>If you have any questions or concerns regarding your appointment, please feel free to contact us at ${hospitalPhoneNumber} or reply to this email. We look forward to seeing you soon. Best regards</p>
            <a href="" class="btn">Add to calendar</a>
            <div class="line">
                <p>54 Smith Street, Melbourne VIC.</p>
                <p style="font-size: 11px;">© 2023 Notion Labs
    
                </p>
            </div>
        </div>
    
    </body>
    
    </html>
    `;

module.exports = CancelledAppointmentTemplate;
