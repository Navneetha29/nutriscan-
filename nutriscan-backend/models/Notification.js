const { pool } = require('../config/database');

class Notification {
  static async create(notificationData) {
    const {
      user_id,
      title,
      message,
      type = 'info', // info, warning, alert, success
      related_scan_id = null,
      is_read = false
    } = notificationData;

    const [result] = await pool.execute(
      `INSERT INTO notifications 
       (user_id, title, message, type, related_scan_id, is_read) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, message, type, related_scan_id, is_read]
    );

    return result.insertId;
  }

  static async findByUserId(userId, limit = 20) {
    const [rows] = await pool.execute(
      `SELECT n.*, s.product_name, s.expiry_date 
       FROM notifications n
       LEFT JOIN scans s ON n.related_scan_id = s.id
       WHERE n.user_id = ? 
       ORDER BY n.created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async markAsRead(notificationId, userId) {
    const [result] = await pool.execute(
      'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    return result.affectedRows > 0;
  }

  static async markAllAsRead(userId) {
    const [result] = await pool.execute(
      'UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false',
      [userId]
    );
    return result.affectedRows > 0;
  }

  static async delete(notificationId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    return result.affectedRows > 0;
  }

  static async getUnreadCount(userId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
      [userId]
    );
    return rows[0].count;
  }
}

module.exports = Notification;