-- Create a sequence if it doesn't already exist
CREATE SEQUENCE IF NOT EXISTS my_sequence START 100000;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  signup_type TEXT NOT NULL, 
  fcm TEXT,
  reset_password_otp TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create images table
CREATE TABLE IF NOT EXISTS uploadImages (
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
  project_title TEXT, -- Title of the project
  user_id INT REFERENCES users(user_id), -- Foreign key to link to the users table
  pages INT, -- Number of pages in the project
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the project was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the project was last updated
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,         -- Unique identifier for each container
  project_id INT REFERENCES projects(project_id), -- Foreign key to link to the projects 
  height INT,        -- Height of the container
  width INT,         -- Width of the container
  background_color VARCHAR(20) DEFAULT '#FFFFFF', -- Background color of the container
  background_image TEXT, -- Background image URL for the container
  background_image_type TEXT,    -- Type of the background image (e.g., 'IMAGE', 'COLOR')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the container was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the container was last updated
);

-- Create Text table
CREATE TABLE IF NOT EXISTS texts (
  id SERIAL PRIMARY KEY,            -- Unique identifier for each text entry
  page_id INT REFERENCES pages(id) ON DELETE CASCADE, -- Foreign key to link to the pages table
  name VARCHAR(100) NOT NULL,       -- Name of the text/image
  text TEXT,                     -- The content (text or image URL)
  color VARCHAR(20) DEFAULT '#000000', -- Text color
  rotation INT DEFAULT 0,           -- Rotation value for text
  x INT ,                 -- X-coordinate for the text/image
  y INT ,                 -- Y-coordinate for the text/image
  width INT ,            -- Width of the text/image
  height INT,            -- Height of the text/image
  font_size INT DEFAULT 16,         -- Font size for text
  font_style VARCHAR(50) DEFAULT 'normal',  -- Font style (e.g., 'italic', 'bold', etc.)
  font_alignment VARCHAR(50) DEFAULT 'center', -- Text alignment (e.g., 'left', 'center', 'right')
  line_height INT DEFAULT 20,       -- Line height for the text
  font_family VARCHAR(100) DEFAULT 'Arial', -- Font family for text
  font_weight VARCHAR(50) DEFAULT 'normal', -- Font weight (e.g., 'bold', 'normal', etc.)
  text_decoration VARCHAR(50) DEFAULT 'none', -- Text decoration (e.g., 'underline', 'line-through', etc.)
  text_transform VARCHAR(50) DEFAULT 'none',  -- Text transformation (e.g., 'uppercase', 'lowercase', etc.)
  text_shadow TEXT,                 -- Text shadow effect
  text_outline TEXT,                -- Text outline effect
  text_background TEXT,             -- Text background effect
  text_border TEXT,                 -- Text border effect
  border_radius INT DEFAULT 0,      -- Border radius for text/image
  border_color VARCHAR(20) DEFAULT '#000000', -- Border color
  border_width INT DEFAULT 0,       -- Border width for text/image
  background_color VARCHAR(20) DEFAULT '#FFFFFF', -- Background color for text/image
  z_index INT DEFAULT 1,            -- Z-index for text/image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the text/image was added
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the text/image was last updated
);

-- Create Images table
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,            -- Unique identifier for each text entry
  pages INT REFERENCES pages(id) ON DELETE CASCADE, -- Foreign key to link to the pages table
  name VARCHAR(100) NOT NULL,       -- Name of the text/image
  rotation_z INT DEFAULT 0,           -- Rotation value for text
  x INT ,                 -- X-coordinate for the text/image
  y INT ,                 -- Y-coordinate for the text/image
  width INT ,            -- Width of the text/image
  height INT,            -- Height of the text/image
  border_radius INT DEFAULT 0,      -- Border radius for text/image
  border_color VARCHAR(20) DEFAULT '#000000', -- Border color
  border_width INT DEFAULT 0,       -- Border width for text/image
  shadow_h INT DEFAULT 0,           -- Rotation value for text
  shadow_w INT DEFAULT 0,           -- Rotation value for text
  shadow_blur INT DEFAULT 0,           -- Rotation value for text
  shadow_color VARCHAR(20) DEFAULT '#000000', -- Text color
  flip_x BOOLEAN DEFAULT FALSE,     -- Flip horizontally
  flip_y BOOLEAN DEFAULT FALSE,     -- Flip vertically
  z_index INT DEFAULT 1,            -- Z-index for text/image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the text/image was added
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the text/image was last updated
);

-- Create Text tablecc
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,            -- Unique identifier for each text entry
  pages INT REFERENCES pages(id) ON DELETE CASCADE, -- Foreign key to link to the pages table
  name VARCHAR(100) NOT NULL,       -- Name of the text/image
  image_url TEXT NOT NULL,          -- The URL of the image
  rotation_x INT DEFAULT 0,           -- Rotation value for text
  rotation_y INT DEFAULT 0,           -- Rotation value for text
  rotation_z INT DEFAULT 0,           -- Rotation value for 
  skew_x INT DEFAULT 0,           -- Rotation value for text
  skew_y INT DEFAULT 0,           -- Rotation value for text
  shadow_h INT DEFAULT 0,           -- Rotation value for text
  shadow_w INT DEFAULT 0,           -- Rotation value for text
  shadow_blur INT DEFAULT 0,           -- Rotation value for text
  shadow_color VARCHAR(20) DEFAULT '#000000', -- Text color
  x INT ,                 -- X-coordinate for the text/image
  y INT ,                 -- Y-coordinate for the text/image
  width INT ,            -- Width of the text/image
  height INT,            -- Height of the text/image
  z_index INT DEFAULT 1,            -- Z-index for text/image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the text/image was added
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the text/image was last updated
);
-- Create Text table
CREATE TABLE IF NOT EXISTS elements (
  id SERIAL PRIMARY KEY,            -- Unique identifier for each text entry
  page_id INT REFERENCES pages(id) ON DELETE CASCADE, -- Foreign key to link to the pages table
  name VARCHAR(100) NOT NULL,       -- Name of the text/image
  rotation_z INT DEFAULT 0,           -- Rotation value for 
  x INT ,                 -- X-coordinate for the text/image
  y INT ,                 -- Y-coordinate for the text/image
  width INT ,            -- Width of the text/image
  height INT,            -- Height of the text/image
  z_index INT DEFAULT 1,            -- Z-index for text/image
  background_color VARCHAR(20) DEFAULT '#FFFFFF', -- Background color for text/image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the text/image was added
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the text/image was last updated
);



