
CREATE SEQUENCE IF NOT EXISTS my_sequence START 100000;

CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  signup_type TEXT NOT NULL, -- Using ENUM for signup type
  access_token TEXT,
  reset_password_otp TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
