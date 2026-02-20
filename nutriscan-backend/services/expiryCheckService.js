const { pool } = require('../config/database');
const Notification = require('../models/Notification');

class ExpiryCheckService {
  // Check for expired or expiring products and create notifications
  static async checkExpiringProducts() {
    try {
      console.log('🔔 Checking for expiring products...');
      
      // Get scans that are expiring soon (within 7 days) or expired
      const [scans] = await pool.execute(`
        SELECT s.id, s.user_id, s.product_name, s.expiry_date, s.manufacturing_date,
               DATEDIFF(s.expiry_date, CURDATE()) as days_remaining
        FROM scans s
        WHERE s.expiry_date IS NOT NULL 
          AND (s.expiry_date = CURDATE() OR 
               s.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY))
          AND NOT EXISTS (
            SELECT 1 FROM notifications n 
            WHERE n.related_scan_id = s.id 
            AND n.type IN ('alert', 'warning') 
            AND DATE(n.created_at) = CURDATE()
          )
      `);

      console.log(`📦 Found ${scans.length} expiring products to notify`);

      let notificationsCreated = 0;

      for (const scan of scans) {
        let title, message, type;

        if (scan.days_remaining === 0) {
          // Expired today
          title = '🚨 Product Expired!';
          message = `"${scan.product_name}" has expired today. Please discard the product.`;
          type = 'alert';
        } else if (scan.days_remaining < 0) {
          // Already expired
          title = '⚠️ Product Expired';
          message = `"${scan.product_name}" expired ${Math.abs(scan.days_remaining)} days ago. Please check and discard if necessary.`;
          type = 'warning';
        } else {
          // Expiring soon
          title = '📅 Product Expiring Soon';
          message = `"${scan.product_name}" will expire in ${scan.days_remaining} day(s). Consider using it soon.`;
          type = 'info';
        }

        // Check if we already notified about this product today
        const [existingNotifications] = await pool.execute(
          `SELECT id FROM notifications 
           WHERE related_scan_id = ? AND type = ? AND DATE(created_at) = CURDATE()`,
          [scan.id, type]
        );

        if (existingNotifications.length === 0) {
          // Create notification
          await Notification.create({
            user_id: scan.user_id,
            title,
            message,
            type,
            related_scan_id: scan.id
          });

          notificationsCreated++;
          console.log(`📨 Created ${type} notification for: ${scan.product_name}`);
        }
      }

      console.log(`✅ Created ${notificationsCreated} expiry notifications`);
      return notificationsCreated;

    } catch (error) {
      console.error('❌ Expiry check error:', error);
      throw error;
    }
  }

  // Get statistics for dashboard
  static async getExpiryStats(userId) {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_scans,
          SUM(CASE WHEN expiry_date < CURDATE() THEN 1 ELSE 0 END) as expired_count,
          SUM(CASE WHEN expiry_date = CURDATE() THEN 1 ELSE 0 END) as expiring_today_count,
          SUM(CASE WHEN expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as expiring_soon_count
        FROM scans 
        WHERE user_id = ?
      `, [userId]);

      return stats[0];
    } catch (error) {
      console.error('Get expiry stats error:', error);
      throw error;
    }
  }
}

module.exports = ExpiryCheckService;