const Scan = require('../models/Scan');
const User = require('../models/User');
const { analyzeFoodWithGPT } = require('../utils/gptService');

// Analyze food product
exports.analyzeFood = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      frontText, 
      backText, 
      productName,
      manufacturingDate,
      expiryDate 
    } = req.body;

    console.log('📱 Received scan request from user:', userId);
    console.log('📦 Product:', productName);
    console.log('📅 Dates:', { manufacturingDate, expiryDate });
    console.log('📝 Text length - Front:', frontText?.length || 0, 'Back:', backText?.length || 0);

    // Validate required fields
    if (!productName || !manufacturingDate || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Product name, manufacturing date, and expiry date are required'
      });
    }

    // Get user health profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('🧠 Starting GPT analysis...');

    // Analyze with ChatGPT
    let analysisResult;
    try {
      analysisResult = await analyzeFoodWithGPT(
        frontText || '',
        backText || '',
        user,
        productName,
        manufacturingDate,
        expiryDate
      );
    } catch (gptError) {
      console.error('❌ GPT analysis failed:', gptError.message);
      analysisResult = {
        product_name: productName,
        ingredients: ["Analysis based on extracted text"],
        analysis: "AI analysis temporarily unavailable. Please consult product label and healthcare provider.",
        health_recommendations: {
          suitable: ["General food items"],
          not_suitable: ["Check for specific allergens"],
          overall_verdict: "Consult with healthcare provider for personalized advice"
        },
        suitable_ages: {
          below_18: true,
          above_18: true,
          above_60: true,
          reason: "General recommendation"
        },
        shelf_life: "Check packaging",
        vegan_friendly: false,
        cautions: ["Always check for allergens"],
        alternative_products: ["Fresh alternatives recommended"]
      };
    }

    console.log('✅ Analysis completed, saving to database...');

    // Save scan to database
    const scanId = await Scan.create({
      user_id: userId,
      front_image_url: null,
      back_image_url: null,
      extracted_text_front: frontText || '',
      extracted_text_back: backText || '',
      product_name: productName,
      manufacturing_date: manufacturingDate,
      expiry_date: expiryDate,
      ingredients: analysisResult.ingredients || [],
      analysis_result: analysisResult.analysis || '',
      health_recommendations: analysisResult.health_recommendations || {},
      suitable_ages: analysisResult.suitable_ages || {},
      shelf_life: analysisResult.shelf_life || '',
      vegan_friendly: analysisResult.vegan_friendly || false,
      cautions: analysisResult.cautions || [],
      alternative_products: analysisResult.alternative_products || []
    });

    // Get the saved scan
    const scan = await Scan.findById(scanId);

    console.log('💾 Scan saved with ID:', scanId);

    res.status(200).json({
      success: true,
      message: 'Food analysis completed successfully',
      data: scan
    });

  } catch (error) {
    console.error('❌ Food analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze food product',
      error: error.message
    });
  }
};

// Get user's scan history
exports.getScanHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const scans = await Scan.findByUserId(userId, parseInt(limit));

    res.json({
      success: true,
      data: scans
    });

  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan history',
      error: error.message
    });
  }
};

// Get specific scan details
exports.getScanDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scanId } = req.params;

    const scan = await Scan.findById(scanId);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    // Check if scan belongs to user
    if (scan.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: scan
    });

  } catch (error) {
    console.error('Get scan details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan details',
      error: error.message
    });
  }
};

// Delete scan
exports.deleteScan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scanId } = req.params;

    const deleted = await Scan.delete(scanId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Scan deleted successfully'
    });

  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete scan',
      error: error.message
    });
  }
};