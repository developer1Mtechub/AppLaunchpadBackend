const { validationResult } = require("express-validator");
const { pool } = require("../../config/db");
const nodemailer = require("nodemailer");
const {
  createToken,
  hashedPassword,
  comparePassword,
} = require("../../services/authServices");
const { emailUser, emailPass } = require("../../config/envConfig");
const { verifyToken } = require("../../services/Authrization");

class User {
  // Register user controller
  async register(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: true });
    }

    const { user_name, email, password, signup_type, fcm } = req.body;

    if (!email || !signup_type || !fcm) {
      return res.status(400).json({
        error: true,
        message: "Please provide both Email and Signup Type.",
      });
    }
    if (signup_type === "GOOGLE" && !fcm) {
      return res.status(400).json({
        error: true,
        message: "Please provide Access Token for Google Signup.",
      });
    }
    try {
      // Check if the user already exists
      const userDataCheck = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );

      if (userDataCheck?.rows[0]?.email) {
        return res.status(400).json({
          errors: [
            {
              message: `${email} is already taken`,
              param: "email",
              error: true,
            },
          ],
        });
      }

      // Hash password
      const hashed = await hashedPassword(password);

      // Insert new user
      const userData = await pool.query(
        "INSERT INTO users (user_name, email, password, signup_type, fcm) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [user_name, email, hashed, signup_type, fcm]
      );

      const user = userData.rows[0];

      // Generate token
      const token = createToken(
        {
          id: user.user_id,
          name: user.user_name,
        },
        "7d"
      );

      return res.status(201).json({
        error: false,
        message: "User created successfully.",
        data: user,
        token,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error!",
      });
    }
  }

  // Login user controller
  async login(req, res) {
    const { email, password, signup_type, fcm } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: true });
    }

    try {
      // Check if the user exists
      const userData = await pool.query("SELECT * FROM users WHERE email=$1", [
        email,
      ]);

      if (!userData?.rows[0]?.email) {
        return res.status(400).json({
          error: true,
          message: "Invalid Credentials!",
        });
      }

      const user = userData.rows[0];

      // If the signup type in the database is 'google' and the user tries to log in with email/password
      if (user.signup_type === "GOOGLE" && signup_type === "EMAIL") {
        return res.status(400).json({
          error: true,
          message:
            "This account was registered using Google. Please log in using Google.",
        });
      }

      // Handle Google login
      if (signup_type === "GOOGLE") {
        // Ensure fcm is provided
        if (!fcm) {
          return res.status(400).json({
            error: true,
            message: "Access token is required for Google login.",
          });
        }

        // Generate a new token
        const newToken = createToken(
          {
            id: user.user_id,
            name: user.user_name,
          },
          "7d"
        );

        // Optionally update the fcm in the database
        await pool.query("UPDATE users SET fcm = $1 WHERE email = $2", [
          fcm,
          email,
        ]);

        return res.status(200).json({
          error: false,
          message: "Login successful via Google.",
          data: user,
          token: newToken,
        });
      }

      // Handle email/password login
      if (signup_type === "EMAIL") {
        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
          return res.status(400).json({
            error: true,
            message: "Invalid Credentials!",
          });
        }

        // Generate token for email login
        const token = createToken(
          {
            id: user.user_id,
            name: user.user_name,
          },
          "7d"
        );

        return res.status(200).json({
          error: false,
          message: "Login successful.",
          data: user,
          token,
        });
      }

      // Default response for unsupported cases
      return res.status(400).json({
        error: true,
        message: "Invalid login method.",
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error!",
      });
    }
  }

  //forgot password

  async sendOTP(req, res) {
    const { email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: true });
    }

    try {
      // Check if the user exists
      const userData = await pool.query("SELECT * FROM users WHERE email=$1", [
        email,
      ]);

      if (!userData?.rows[0]?.email) {
        return res.status(400).json({
          error: true,
          message: "Invalid Email!",
        });
      }

      const user = userData.rows[0];

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP in the database (for example, in a 'reset_password_otp' column)
      await pool.query(
        "UPDATE users SET reset_password_otp = $1 WHERE email = $2",
        [otp, email]
      );

      // Send OTP to the user's email
      const transporter = nodemailer.createTransport({
        secure: true,
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: "baheer224@gmail.com",
          pass: "jgxibghgdkvmfdno",
        },
      });

      const mailOptions = {
        from: emailUser,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
      };

      await transporter.sendMail(mailOptions);
      // Generate token
      const token = createToken(
        {
          otp: otp,
        },
        "1d"
      );
      return res.status(200).json({
        error: false,
        message: "OTP has been sent to your email.",
        otp,
        token,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error!",
      });
    }
  }

  //change Password

  async changePassword(req, res) {
    const { email, password, otp, token } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: true });
    }

    try {
      // Check if the user exists
      const userData = await pool.query("SELECT * FROM users WHERE email=$1", [
        email,
      ]);

      if (!userData?.rows[0]?.email) {
        return res.status(400).json({
          error: true,
          message: "Invalid Email!",
        });
      }
      // Verify JWT token
      const tokenVerification = verifyToken(token);

      if (!tokenVerification.valid) {
        return res.status(400).json({
          error: true,
          message: tokenVerification.message,
        });
      }
      const user = userData.rows[0];

      // Check if the OTP matches
      if (user.reset_password_otp !== otp) {
        return res.status(400).json({
          error: true,
          message: "Invalid OTP!",
        });
      }

      // Hash the new password
      const hashed = await hashedPassword(password);

      // Update the password in the database
      await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
        hashed,
        email,
      ]);

      // Clear the OTP from the database
      await pool.query(
        "UPDATE users SET reset_password_otp = $1 WHERE email = $2",
        [null, email]
      );

      return res.status(200).json({
        error: false,
        message: "Password has been changed successfully.",
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error!",
      });
    }
  }
}

module.exports = new User();
