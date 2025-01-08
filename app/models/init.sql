-- Create a sequence if it doesn't already exist
CREATE SEQUENCE IF NOT EXISTS my_sequence START 100000;

-- Create users table
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

-- Create project table
CREATE TABLE IF NOT EXISTS project (
  project_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  project_title TEXT
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY, -- Unique identifier for each asset
  user_id INT REFERENCES users(user_id), -- Foreign key to link to the users table
  image VARCHAR(255) NOT NULL, -- Stores the image file path or URL
  image_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the record was created
  updated_at TIMESTAMP DEFAULT NOW() -- Timestamp for the last update
);

