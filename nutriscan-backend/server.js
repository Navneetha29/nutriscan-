const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, initializeDatabase } = require('./config/database');
const ExpiryCheckService = require('./services/expiryCheckService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'NutriScan Backend API is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'OK',
    database: dbStatus ? 'Connected ✅' : 'Disconnected ❌',
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));

// In your server.js, add this before your routes
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.originalUrl}`);
  next();
});
app.use('/api/scan', require('./routes/scan'));
app.use('/api/notifications', require('./routes/notification'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5001;

// Schedule expiry checks
const scheduleExpiryChecks = () => {
  console.log('⏰ Setting up automatic expiry checks...');
  
  // Run immediately on server start
  setTimeout(async () => {
    try {
      console.log('🔄 Running initial expiry check...');
      await ExpiryCheckService.checkExpiringProducts();
    } catch (error) {
      console.error('❌ Initial expiry check failed:', error);
    }
  }, 5000); // Wait 5 seconds after server start

  // For development: run every 30 minutes
  setInterval(async () => {
    try {
      console.log('🔄 Running scheduled expiry check...');
      const notificationsCreated = await ExpiryCheckService.checkExpiringProducts();
      if (notificationsCreated > 0) {
        console.log(`✅ Created ${notificationsCreated} new expiry notifications`);
      }
    } catch (error) {
      console.error('❌ Scheduled expiry check failed:', error);
    }
  }, 30 * 60 * 1000); // Every 30 minutes

  // For production, you can use this instead (runs daily at 9 AM):
  /*
  const cron = require('node-cron');
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('🔄 Running daily expiry check...');
      const notificationsCreated = await ExpiryCheckService.checkExpiringProducts();
      console.log(`✅ Created ${notificationsCreated} new expiry notifications`);
    } catch (error) {
      console.error('❌ Daily expiry check failed:', error);
    }
  });
  */

  console.log('✅ Expiry checks scheduled: Every 30 minutes');
};

// Manual trigger endpoint for testing
app.post('/api/trigger-expiry-check', async (req, res) => {
  try {
    console.log('🔔 Manual expiry check triggered');
    const notificationsCreated = await ExpiryCheckService.checkExpiringProducts();
    
    res.json({
      success: true,
      message: `Expiry check completed. Created ${notificationsCreated} notifications.`,
      notificationsCreated
    });
  } catch (error) {
    console.error('Manual expiry check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run expiry check',
      error: error.message
    });
  }
});

// Get expiry statistics
app.get('/api/expiry-stats', async (req, res) => {
  try {
    // This would typically require authentication
    // For demo purposes, we'll return general stats
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_scans,
        SUM(CASE WHEN expiry_date < CURDATE() THEN 1 ELSE 0 END) as expired_count,
        SUM(CASE WHEN expiry_date = CURDATE() THEN 1 ELSE 0 END) as expiring_today_count,
        SUM(CASE WHEN expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as expiring_soon_count
      FROM scans
    `);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get expiry stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expiry statistics',
      error: error.message
    });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('🔄 Attempting to initialize database...');
      await initializeDatabase();
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`⏰ Expiry check: http://localhost:${PORT}/api/trigger-expiry-check`);
      
      // Start the expiry check scheduler
      scheduleExpiryChecks();
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();