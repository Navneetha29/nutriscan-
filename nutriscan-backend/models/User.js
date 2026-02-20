const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const {
      full_name,
      email,
      phone,
      password,
      age,
      gender,
      diabetes = false,
      high_blood_pressure = false,
      nut_allergy = false,
      lactose_intolerance = false,
      celiac_disease = false,
      heart_disease = false
    } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users 
       (full_name, email, phone, password, age, gender, diabetes, high_blood_pressure, nut_allergy, lactose_intolerance, celiac_disease, heart_disease) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        hashedPassword,
        age,
        gender,
        diabetes,
        high_blood_pressure,
        nut_allergy,
        lactose_intolerance,
        celiac_disease,
        heart_disease
      ]
    );

    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Find user by phone
  static async findByPhone(phone) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, phone, age, gender, diabetes, high_blood_pressure, nut_allergy, lactose_intolerance, celiac_disease, heart_disease, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Check if email exists
  static async emailExists(email) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  }

  // Check if phone exists
  static async phoneExists(phone) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );
    return rows.length > 0;
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;