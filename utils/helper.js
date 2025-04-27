const axios = require("axios");

exports.mailSend = async (mail, otp, sub) => {
  try {
    const response = await axios.post(
      "https://api.smtp2go.com/v3/email/send",
      {
        api_key: "api-7C43A99E6AC011EEBC97F23C91C88F4E",
        sender: "S-Finder <support@s-finderadmin.com>",
        to: [mail],
        subject: `S-Finder ${sub}`,
        html_body: `
                  <div style="background-color: #f2f2f2; padding: 20px;">
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
                      <h1 style="text-align: center; color: #1A63A6;">S-Finder</h1>
                      <h1 style="text-align: center; color: #000000;">OTP :  <strong>${otp}</strong></h1>
                    </div>
                  </div>
                `,
        text_body: "Please verify your email",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the response if needed
    console.log(response.data);
  } catch (error) {
    // Handle the error if needed
    console.error(error);
  }
};

exports.generateOTP = () => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const otpLength = 6;
  let otp = "";

  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};
