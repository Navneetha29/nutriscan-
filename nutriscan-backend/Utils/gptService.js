const OpenAI = require('openai');

// Initialize OpenAI with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize OpenAI:', error.message);
}

exports.analyzeFoodWithGPT = async (frontText, backText, user, productName, manufacturingDate, expiryDate) => {
  // If OpenAI initialization failed, use fallback immediately
  if (!openai) {
    console.log('Using fallback due to OpenAI initialization failure');
    return getFallbackAnalysis(frontText, backText, user, productName, manufacturingDate, expiryDate);
  }

  try {
    const userHealthProfile = {
      age: user.age,
      gender: user.gender,
      conditions: {
        diabetes: user.diabetes,
        high_blood_pressure: user.high_blood_pressure,
        nut_allergy: user.nut_allergy,
        lactose_intolerance: user.lactose_intolerance,
        celiac_disease: user.celiac_disease,
        heart_disease: user.heart_disease
      }
    };

    const prompt = `
    Analyze this food product with the following information:

    PRODUCT NAME: ${productName}
    MANUFACTURING DATE: ${manufacturingDate}
    EXPIRY DATE: ${expiryDate}

    FRONT PACKAGE TEXT: ${frontText || 'No text available from front image'}
    BACK PACKAGE TEXT: ${backText || 'No text available from back image'}

    USER HEALTH PROFILE:
    - Age: ${userHealthProfile.age}
    - Gender: ${userHealthProfile.gender}
    - Health Conditions: ${JSON.stringify(userHealthProfile.conditions)}

    Provide analysis in this exact JSON format:
    {
      "product_name": "Product Name",
      "ingredients": ["ingredient1", "ingredient2"],
      "analysis": "Detailed nutritional analysis considering user's health conditions and product dates",
      "health_recommendations": {
        "suitable": ["List ingredients that are safe for user"],
        "not_suitable": ["List ingredients that user should avoid with reasons"],
        "overall_verdict": "Overall recommendation based on user profile and product freshness"
      },
      "suitable_ages": {
        "below_18": true/false,
        "above_18": true/false,
        "above_60": true/false,
        "reason": "Explanation for age suitability"
      },
      "shelf_life": "Realistic shelf life based on manufacturing and expiry dates",
      "vegan_friendly": true/false,
      "cautions": ["Specific warnings based on user health conditions and product dates"],
      "alternative_products": ["Healthier alternative products"]
    }

    IMPORTANT: 
    - Consider the product freshness based on manufacturing and expiry dates
    - Be specific about ingredients that interact with user's health conditions
    - For diabetes: focus on sugar and carbohydrate content
    - For high blood pressure: focus on sodium content  
    - For nut allergy: identify any nut-based ingredients
    - For lactose intolerance: identify dairy ingredients
    - For celiac disease: identify gluten-containing ingredients
    - For heart disease: analyze saturated fats and cholesterol
    - Return ONLY valid JSON, no additional text or markdown
    `;

    console.log('🧠 Sending request to OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert nutritionist and food safety specialist. 
          Analyze food products and provide personalized health recommendations based on user profiles and product dates. 
          Always return valid JSON format. Be specific about health condition interactions and product freshness.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    console.log('✅ OpenAI response received');
    
    // Parse JSON response
    const analysisResult = JSON.parse(responseText);
    
    console.log('📊 Analysis completed successfully');
    return analysisResult;

  } catch (error) {
    console.error('❌ GPT analysis error:', error.message);
    console.log('🔄 Using fallback analysis');
    return getFallbackAnalysis(frontText, backText, user, productName, manufacturingDate, expiryDate);
  }
};

// Enhanced fallback analysis with dates
function getFallbackAnalysis(frontText, backText, user, productName, manufacturingDate, expiryDate) {
  console.log('🔄 Generating enhanced fallback analysis');
  
  const userConditions = [];
  if (user.diabetes) userConditions.push('diabetes');
  if (user.high_blood_pressure) userConditions.push('high blood pressure');
  if (user.nut_allergy) userConditions.push('nut allergy');
  if (user.lactose_intolerance) userConditions.push('lactose intolerance');
  if (user.celiac_disease) userConditions.push('celiac disease');
  if (user.heart_disease) userConditions.push('heart disease');

  const conditionsText = userConditions.length > 0 
    ? `User has: ${userConditions.join(', ')}. ` 
    : '';

  const datesInfo = manufacturingDate && expiryDate 
    ? `Manufactured: ${manufacturingDate}, Expires: ${expiryDate}. `
    : '';

  return {
    product_name: productName || "Food Product Analysis",
    ingredients: [
      "Based on general food composition",
      "Check actual product label for specific ingredients"
    ],
    analysis: `Basic food safety analysis. ${conditionsText}${datesInfo}For personalized recommendations, consult the product label and your healthcare provider.`,
    health_recommendations: {
      suitable: ["Generally safe food components when consumed in moderation"],
      not_suitable: ["Check for specific allergens and ingredients that may interact with your health conditions"],
      overall_verdict: "Please verify with actual product information and consult healthcare provider for personalized advice"
    },
    suitable_ages: {
      below_18: true,
      above_18: true,
      above_60: true,
      reason: "General food safety guidelines apply"
    },
    shelf_life: manufacturingDate && expiryDate ? "Based on provided dates" : "Refer to product packaging for expiration date",
    vegan_friendly: false,
    cautions: [
      "Always check for allergens",
      "Consult healthcare provider if you have specific health conditions",
      "Verify ingredients list on actual product packaging",
      manufacturingDate && expiryDate ? "Check product freshness based on provided dates" : "Verify product expiration date"
    ].filter(Boolean),
    alternative_products: [
      "Fresh fruits and vegetables",
      "Whole grain products", 
      "Low-sodium alternatives",
      "Sugar-free options where applicable"
    ]
  };
}