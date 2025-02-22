const LoginDataDetails = require('../Models/LoginModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const generateEmailTemplate = (otp) => {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
            position: relative; /* For positioning the ::before element */
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
            position: relative;
            overflow: hidden; /* To contain the ::before element */
          }
          .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://as1.ftcdn.net/v2/jpg/04/31/55/92/1000_F_431559277_rkkDdPgYlypnPwf4EoDIlvkVDiWNBBft.jpg'); /* Background image */
            background-size: cover;
            background-position: center;
            opacity: 0.2; /* Light opacity for the background */
            z-index: 1; /* Place it behind other elements */
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #008080;
            margin-bottom: 20px;
            position: relative; /* To place above the background */
            z-index: 2;
          }
          .header h1 {
            color: #008080; /* Teal color */
            font-size: 28px;
            margin: 0;
            font-weight: bold;
          }
          .otp {
            font-size: 48px; /* Larger OTP */
            font-weight: bold;
            color: #ffffff; /* White for contrast */
            background-color: #008080; /* Teal background */
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            position: relative; /* To place above the background */
            z-index: 2;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
            position: relative; /* To place above the background */
            z-index: 2;
          }
          .footer p {
            margin: 5px 0;
          }
          p {
            position: relative; /* To place above the background */
            z-index: 2;
            text-align: center; /* Center alignment for text */
            font-size: 18px; /* Consistent font size */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Service!</h1>
            <p>Thank you for registering with us. We're excited to have you on board.</p>
          </div>
          <p>Your One-Time Password (OTP) is:</p>
          <div class="otp">${otp}</div>
          <p>Please enter this code to complete your registration.</p>
          <div class="footer">
            <p>Best regards,<br>PowerX Team</p>
          </div>
        </div>
      </body>
    </html>
    `;
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "harshaithireddy446@gmail.com",
        pass: "wajn omib sjer vlpd"
    }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const newUser = new LoginDataDetails({ username, email, password: hashedPassword, otp });
        await newUser.save();

        // Send OTP email
        const emailContent = generateEmailTemplate(otp);
        await transporter.sendMail({
            from: "harshaithireddy446@gmail.com",
            to: email,
            subject: "Your OTP Code",
            html: emailContent
        });

        res.status(200).json({ success: true, message: "User registered. OTP sent to your email." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error registering user." });
    }
};


exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await LoginDataDetails.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        
        if (user.otp === otp) {
            user.isVerified = true;
            await user.save();
            res.status(200).json({ success: true, message: "OTP verified successfully!" });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying OTP." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await LoginDataDetails.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, message: "Invalid password." });

        if (!user.isVerified) return res.status(403).json({ success: false, message: "Please verify your email first." });

        res.status(200).json({ 
            success: true, 
            message: "Logged in successfully!", 
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging in." });
    }
};
