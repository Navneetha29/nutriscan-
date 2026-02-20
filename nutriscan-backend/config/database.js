const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // XAMPP default is empty
  database: process.env.DB_NAME || 'nutriscan',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL (XAMPP) connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.log('💡 Make sure XAMPP MySQL is running on port 3306');
    return false;
  }
};

// Initialize database and tables
const initializeDatabase = async () => {
  try {
    // Test if database exists, if not create it
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
    
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log('✅ Database checked/created successfully');
    
    // Switch to our database
    await tempPool.execute(`USE ${process.env.DB_NAME}`);
    
    // Create users table
    await tempPool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20) UNIQUE,
        password VARCHAR(255) NOT NULL,
        age INT,
        gender ENUM('Male', 'Female', 'Other'),
        diabetes BOOLEAN DEFAULT FALSE,
        high_blood_pressure BOOLEAN DEFAULT FALSE,
        nut_allergy BOOLEAN DEFAULT FALSE,
        lactose_intolerance BOOLEAN DEFAULT FALSE,
        celiac_disease BOOLEAN DEFAULT FALSE,
        heart_disease BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Users table created successfully');
    await tempPool.end();
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection, initializeDatabase };