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

    const { name, email, password, type, fcm, token } = req.body;

    // Validate type
    const validTypes = ["EMAIL", "GOOGLE", "APPLE"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: true,
        message: "Invalid signup type. Allowed types: EMAIL, GOOGLE, APPLE.",
      });
    }

    // Validate required fields based on type
    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required.",
      });
    }

    if ((type === "GOOGLE" || type === "APPLE") && !token) {
      return res.status(400).json({
        error: true,
        message: "Token is required for Google and Apple signup.",
      });
    }

    if (type === "EMAIL" && !password) {
      return res.status(400).json({
        error: true,
        message: "Password is required for Email signup.",
      });
    }

    try {
      // Check if the user already exists
      const userDataCheck = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );

      if (userDataCheck.rows.length > 0) {
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

      let hashed = null;
      if (type === "EMAIL") {
        // Hash the password

        hashed = await hashedPassword(password);
      }

      // Insert new user with appropriate fields
      const userData = await pool.query(
        `INSERT INTO users (name, email, password, type, fcm, token, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
        [name, email, hashed, type, fcm || null, token || null]
      );

      const user = userData.rows[0];

      // Generate token
      const authToken = createToken(
        {
          id: user.user_id,
          name: user.name,
        },
        "7d"
      );

      return res.status(201).json({
        error: false,
        message: "User created successfully.",
        data: user,
        token: authToken,
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
    const { email, password, type, fcm } = req.body;
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
      if (user.type === "GOOGLE" && type === "EMAIL") {
        return res.status(400).json({
          error: true,
          message:
            "This account was registered using Google. Please log in using Google.",
        });
      }

      // Handle Google login
      if (type === "GOOGLE") {
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
            name: user.name,
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
      if (type === "EMAIL") {
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
            name: user.name,
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
  // Controller to update the user 'name' and 'avatar' using user_id from req.params
  async updateUser(req, res) {
    const { user_id } = req.params; // Get user_id from the request params
    const { name, avatar } = req.body; // Get 'name' and 'avatar' from the request body

    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: true });
    }

    // Check if user exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    if (!userCheck.rows[0]) {
      return res.status(404).json({ error: true, message: "User not found!" });
    }

    try {
      // Update user name and avatar
      const updatedUser = await pool.query(
        `UPDATE users
         SET name = $1, avatar = $2, updated_at = NOW()
         WHERE user_id = $3
         RETURNING *`,
        [name, avatar, user_id]
      );

      // Return the updated user data
      return res.status(200).json({
        error: false,
        message: "User updated successfully!",
        data: updatedUser.rows[0],
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error!",
      });
    }
  }

  //get user by id
  async getUserById(req, res) {
    const { user_id } = req.params; // Get user_id from the request params

    // Check if user exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    if (!userCheck.rows[0]) {
      return res.status(404).json({ error: true, message: "User not found!" });
    }

    try {
      // Get user by user_id
      const user = await pool.query(
        "SELECT user_id, name, email, avatar, type FROM users WHERE user_id = $1",
        [user_id]
      );

      return res.status(200).json({
        error: false,
        message: "User fetched successfully!",
        data: user.rows[0],
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error!",
      });
    }
  }
}

module.exports = new User();
