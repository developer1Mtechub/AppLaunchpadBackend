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

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY, -- Unique identifier for each asset
  user_id INT REFERENCES users(user_id), -- Foreign key to link to the users table
  image VARCHAR(255) NOT NULL, -- Stores the image file path or URL
  image_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the record was created
  updated_at TIMESTAMP DEFAULT NOW() -- Timestamp for the last update
);

-- Create project table
CREATE TABLE IF NOT EXISTS projects (
  project_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  project_title TEXT
);


CREATE TABLE containers (
    id SERIAL PRIMARY KEY,         -- Unique identifier for each container
    project_id INT REFERENCES projects(project_id), -- Foreign key to link to the users table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the container was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the container was last updated
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,            -- Unique identifier for each text entry
    container  INT REFERENCES containers(id), -- Foreign key to link to the users table
    content TEXT,                     -- The content (text or image URL)
    type VARCHAR(20) DEFAULT 'text',  -- Type of the content, either 'text' or 'image'
    rotation INT DEFAULT 0,            -- Rotation value for text
    image_url TEXT NOT NULL,               -- The URL of the image
    x INT DEFAULT 50,                  -- X-coordinate for the text/image
    y INT DEFAULT 50,                  -- Y-coordinate for the text/image
    width INT DEFAULT 100,             -- Width of the text/image
    height INT DEFAULT 50,             -- Height of the text/image
    font_size INT DEFAULT 16,          -- Font size for text
    font_family VARCHAR(100) DEFAULT 'Arial', -- Font family for text
    font_style VARCHAR(50) DEFAULT 'normal',  -- Font style (e.g., 'italic', 'bold', etc.)
    font_alignment VARCHAR(50) DEFAULT 'center', -- Text alignment (e.g., 'left', 'center', 'right')
    line_height INT DEFAULT 20,        -- Line height for the text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the text/image was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the text/image was last updated
    FOREIGN KEY (container_id) REFERENCES containers(id) ON DELETE CASCADE -- Delete texts when container is deleted
);


