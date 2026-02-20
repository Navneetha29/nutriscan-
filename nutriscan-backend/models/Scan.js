const { pool } = require('../config/database');

class Scan {
  static async create(scanData) {
    const {
      user_id,
      front_image_url,
      back_image_url,
      extracted_text_front,
      extracted_text_back,
      product_name,
      manufacturing_date,
      expiry_date,
      ingredients,
      analysis_result,
      health_recommendations,
      suitable_ages,
      shelf_life,
      vegan_friendly,
      cautions,
      alternative_products
    } = scanData;

    console.log('💾 Inserting scan data:', {
      user_id,
      product_name,
      manufacturing_date,
      expiry_date
    });

    // Handle JSON serialization with proper error handling
    const ingredientsStr = Array.isArray(ingredients) ? JSON.stringify(ingredients) : '[]';
    const healthRecStr = health_recommendations && typeof health_recommendations === 'object' ? JSON.stringify(health_recommendations) : '{}';
    const suitableAgesStr = suitable_ages && typeof suitable_ages === 'object' ? JSON.stringify(suitable_ages) : '{}';
    const cautionsStr = Array.isArray(cautions) ? JSON.stringify(cautions) : '[]';
    const alternativesStr = Array.isArray(alternative_products) ? JSON.stringify(alternative_products) : '[]';

    try {
      const [result] = await pool.execute(
        `INSERT INTO scans 
         (user_id, front_image_url, back_image_url, extracted_text_front, extracted_text_back, 
          product_name, manufacturing_date, expiry_date, ingredients, analysis_result, 
          health_recommendations, suitable_ages, shelf_life, vegan_friendly, cautions, alternative_products) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          front_image_url,
          back_image_url,
          extracted_text_front || '',
          extracted_text_back || '',
          product_name,
          manufacturing_date,
          expiry_date,
          ingredientsStr,
          analysis_result || '',
          healthRecStr,
          suitableAgesStr,
          shelf_life || '',
          vegan_friendly ? 1 : 0,
          cautionsStr,
          alternativesStr
        ]
      );

      console.log('✅ Scan inserted with ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('❌ Database insertion error:', error);
      throw error;
    }
  }

  static async findByUserId(userId, limit = 10) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM scans 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, limit]
      );
      
      return rows.map(row => this.parseScanRow(row));
    } catch (error) {
      console.error('❌ Error fetching user scans:', error);
      throw error;
    }
  }

  static async findById(scanId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM scans WHERE id = ?',
        [scanId]
      );
      
      if (rows.length === 0) return null;
      
      return this.parseScanRow(rows[0]);
    } catch (error) {
      console.error('❌ Error fetching scan by ID:', error);
      throw error;
    }
  }

  static async delete(scanId, userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM scans WHERE id = ? AND user_id = ?',
        [scanId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Error deleting scan:', error);
      throw error;
    }
  }

  // Helper method to parse database rows
  static parseScanRow(row) {
    const parseJSON = (str, fallback) => {
      try {
        return str ? JSON.parse(str) : fallback;
      } catch (e) {
        console.error('JSON parse error for:', str);
        return fallback;
      }
    };

    return {
      ...row,
      ingredients: parseJSON(row.ingredients, []),
      health_recommendations: parseJSON(row.health_recommendations, {}),
      suitable_ages: parseJSON(row.suitable_ages, {}),
      cautions: parseJSON(row.cautions, []),
      alternative_products: parseJSON(row.alternative_products, []),
      vegan_friendly: Boolean(row.vegan_friendly)
    };
  }
}

module.exports = Scan;