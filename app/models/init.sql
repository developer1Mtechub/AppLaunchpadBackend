-- Create a sequence if it doesn't already exist
CREATE SEQUENCE IF NOT EXISTS my_sequence START 100000;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  type TEXT NOT NULL, 
  fcm TEXT,
  token TEXT,
  avatar TEXT,
  plan TEXT,
  reset_password_otp TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- Create Image Group table
CREATE TABLE IF NOT EXISTS imageGroup (
  id SERIAL PRIMARY KEY, -- Unique identifier for each asset
  image_group_name TEXT, -- Name of the image group
  created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the record was created
  updated_at TIMESTAMP DEFAULT NOW() -- Timestamp for the last update
);
-- Create images table
CREATE TABLE IF NOT EXISTS uploadImages (
  id SERIAL PRIMARY KEY, -- Unique identifier for each asset
  user_id INT REFERENCES users(user_id), -- Foreign key to link to the users table
  image VARCHAR(255) NOT NULL, -- Stores the image file path or URL
  image_type TEXT,
  image_group_id INT REFERENCES imageGroup(id), -- Foreign key to link to the imageGroup table
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
  background_type TEXT,    -- Type of the background image (e.g., 'IMAGE', 'COLOR')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the container was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the container was last updated
);

-- Create Texts table
CREATE TABLE IF NOT EXISTS texts (
  id SERIAL PRIMARY KEY,                                
  page_id INT REFERENCES pages(id) ON DELETE CASCADE,  
  name VARCHAR(100) NOT NULL,                          
  text TEXT,                                           
  color VARCHAR(20) DEFAULT '#000000',                 
  rotation DECIMAL(10,2) DEFAULT 0.00,                 -- Rotation as a decimal
  x DECIMAL(10,2), y DECIMAL(10,2),                    -- Position with decimal values
  width DECIMAL(10,2), height DECIMAL(10,2),           -- Size with decimal values
  font_size DECIMAL(10,2) DEFAULT 16.00,               -- Font size with decimals
  font_style VARCHAR(50) DEFAULT 'normal',             
  font_alignment VARCHAR(50) DEFAULT 'center',         
  line_height DECIMAL(10,2) DEFAULT 20.00,             -- Line height as decimal
  font_family VARCHAR(100) DEFAULT 'Arial',            
  font_weight VARCHAR(50) DEFAULT 'normal',            
  text_decoration VARCHAR(50) DEFAULT 'none',          
  text_transform VARCHAR(50) DEFAULT 'none',           
  text_shadow TEXT, text_outline TEXT,                 
  text_background TEXT, text_border TEXT,              
  border_radius DECIMAL(10,2) DEFAULT 0.00,            -- Border radius with decimal
  border_color VARCHAR(20) DEFAULT '#000000',          
  border_width DECIMAL(10,2) DEFAULT 0.00,             -- Border width as decimal
  background_color VARCHAR(20) DEFAULT '#FFFFFF',      
  z_index INT DEFAULT 1,                               
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP       
);


-- Create Images table
CREATE TABLE IF NOT EXISTS imagesDevice  (
  id SERIAL PRIMARY KEY,            -- Unique identifier for each text entry
  page_id INT REFERENCES pages(id) ON DELETE CASCADE, -- Foreign key to link to the pages table
  name VARCHAR(100) NOT NULL,       -- Name of the text/image
  image_url TEXT NOT NULL,          -- The URL of the image
  rotation_x INT ,           -- Rotation value for text
  rotation_y INT ,           -- Rotation value for text
  rotation_z INT ,           -- Rotation value for text
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
  page_id INT REFERENCES pages(id) ON DELETE CASCADE, -- Foreign key to link to the pages table
  name VARCHAR(100) NOT NULL,       -- Name of the text/image
  image_url TEXT NOT NULL,          -- The URL of the image
  rotation_x INT ,           -- Rotation value for text
  rotation_y INT ,           -- Rotation value for text
  rotation_z INT ,           -- Rotation value for 
  skew_x INT ,           -- Rotation value for text
  skew_y INT ,           -- Rotation value for text
  shadow_h INT ,           -- Rotation value for text
  shadow_w INT ,           -- Rotation value for text
  shadow_blur INT ,           -- Rotation value for text
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
  rotation_z INT ,           -- Rotation value for 
  x INT ,                 -- X-coordinate for the text/image
  y INT ,                 -- Y-coordinate for the text/image
  width INT ,            -- Width of the text/image
  height INT,            -- Height of the text/image
  z_index INT DEFAULT 1,            -- Z-index for text/image
  background_color VARCHAR(20) DEFAULT '#FFFFFF', -- Background color for text/image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the text/image was added
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the text/image was last updated
);

-- Create Project Mutiple Image table
CREATE TABLE IF NOT EXISTS projectMultipleImages (
  id SERIAL PRIMARY KEY, -- Unique identifier for each asset
  project_id INT REFERENCES projects(project_id), -- Foreign key to link to the projects table
  user_id INT REFERENCES users(user_id), -- Foreign key to link to the users table
  --multiple_image arrary of object save
  multiple_image JSONB, -- Stores the multiple image file path or URL
  created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the record was created
  updated_at TIMESTAMP DEFAULT NOW() -- Timestamp for the last update
);








