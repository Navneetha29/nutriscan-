-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nutriscan;
USE nutriscan;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    
    -- Health conditions (from your third screen)
    diabetes BOOLEAN DEFAULT FALSE,
    high_blood_pressure BOOLEAN DEFAULT FALSE,
    nut_allergy BOOLEAN DEFAULT FALSE,
    lactose_intolerance BOOLEAN DEFAULT FALSE,
    celiac_disease BOOLEAN DEFAULT FALSE,
    heart_disease BOOLEAN DEFAULT FALSE,
    
    -- Account status
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_phone ON users(phone);
CREATE INDEX idx_created_at ON users(created_at);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    front_image_url VARCHAR(500),
    back_image_url VARCHAR(500),
    extracted_text_front TEXT,
    extracted_text_back TEXT,
    product_name VARCHAR(255),
    ingredients JSON,
    analysis_result TEXT,
    health_recommendations JSON,
    suitable_ages JSON,
    shelf_life VARCHAR(100),
    vegan_friendly BOOLEAN DEFAULT FALSE,
    cautions JSON,
    alternative_products JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

