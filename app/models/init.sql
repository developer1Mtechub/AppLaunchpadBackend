-- Create sequence
CREATE SEQUENCE IF NOT EXISTS my_sequence START 100000;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    user_name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    signup_type TEXT NOT NULL,
    access_token TEXT,
    reset_password_otp TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    project_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
    project_title TEXT
);

-- Create containers table
CREATE TABLE containers (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id),
    height INT,
    width INT,
    background_color VARCHAR(7),
    background_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    container INT REFERENCES containers(id) ON DELETE CASCADE,
    content TEXT,
    type VARCHAR(20) DEFAULT 'text',
    rotation INT DEFAULT 0,
    image_url TEXT,
    x INT DEFAULT 50,
    y INT DEFAULT 50,
    width INT DEFAULT 100,
    height INT DEFAULT 50,
    font_size INT DEFAULT 16,
    text_color VARCHAR(100) DEFAULT 'black',
    font_family VARCHAR(100) DEFAULT 'Arial',
    font_style VARCHAR(50) DEFAULT 'normal',
    font_alignment VARCHAR(50) DEFAULT 'center',
    line_height INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create elements table
CREATE TABLE elements (
    id SERIAL PRIMARY KEY,
    container INT REFERENCES containers(id),
    height INT,
    width INT,
    name VARCHAR(255) NOT NULL,
    elements_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    image VARCHAR(255) NOT NULL,
    image_type TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
