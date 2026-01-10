const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Folder Setup
app.use(express.static(path.join(__dirname, 'public')));

// --- Helper Function: Generate Schema ---
// এটি অবশ্যই রাউটের আগে থাকতে হবে
function generateSchema(title, description, url, isApp = true) {
    const baseUrl = "https://health-hub.calculatorfree.in"; // আপনার সাব-ডোমেইন
    const fullUrl = url === '/' ? baseUrl : baseUrl + url;
    
    // Base Schema with Graph
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "Health Hub",
                "url": baseUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.calculatorfree.in/wp-content/uploads/2025/07/cropped-calculatorfree.png"
                }
            },
            {
                "@type": "WebSite",
                "name": "Health Hub",
                "url": baseUrl,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${baseUrl}/?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    if (isApp) {
        // Add WebApplication Schema for calculators
        schema["@graph"].push({
            "@type": "SoftwareApplication",
            "name": title,
            "operatingSystem": "Any",
            "applicationCategory": "HealthApplication",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "description": description
        });
        
        // Add Breadcrumb for calculators
        schema["@graph"].push({
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem", 
                "position": 1, 
                "name": "Home", 
                "item": baseUrl 
            }, {
                "@type": "ListItem",
                "position": 2,
                "name": title
            }]
        });
    }

    return JSON.stringify(schema);
}

// Centralized Calculator Data
const calculatorData = {
    'bmi-calculator': { title: 'BMI Calculator', description: 'Calculate your Body Mass Index (BMI) instantly. Check if you are in a healthy weight range with our accurate BMI calculator for adults.' },
    'bmr-calculator': { title: 'BMR Calculator', description: 'Estimate your Basal Metabolic Rate (BMR) - the number of calories your body burns at rest. Understand your daily calorie needs.' },
    'tdee-calculator': { title: 'TDEE Calculator', description: 'Calculate your Total Daily Energy Expenditure (TDEE). Find out how many calories you burn per day based on your activity level.' },
    'calorie-calculator': { title: 'Calorie Calculator', description: 'Determine your daily calorie needs for weight loss, maintenance, or gain. Get a personalized calorie plan based on your goals.' },
    'macro-calculator': { title: 'Macro Calculator', description: 'Calculate your daily macronutrient needs (protein, carbs, and fat) based on your calorie goals and diet plan (balanced, low-carb, high-protein).' },
    'calorie-burn-calculator': { title: 'Calorie Burn Calculator', description: 'Estimate the number of calories burned during various activities and exercises. Find out how many calories you burn while walking, running, and more.' },
    'body-fat-calculator': { title: 'Body Fat Calculator', description: 'Estimate your body fat percentage using the U.S. Navy method. A simple way to measure your body composition without special equipment.' },
    'lean-body-mass-calculator': { title: 'Lean Body Mass Calculator', description: 'Calculate your Lean Body Mass (LBM) using popular formulas. Understand your body composition beyond just weight.' },
    'ponderal-index-calculator': { title: 'Ponderal Index Calculator', description: 'Calculate your Ponderal Index (PI), an alternative to BMI that measures leanness. It is particularly useful for very tall or short individuals.' },
    'waist-to-hip-ratio-calculator': { title: 'Waist-to-Hip Ratio Calculator', description: 'Assess your health risk by calculating your Waist-to-Hip Ratio (WHR). A key indicator of abdominal fat and related health risks.' },
    'waist-to-height-ratio-calculator': { title: 'Waist-to-Height Ratio Calculator', description: 'Use the Waist-to-Height Ratio (WHtR) to assess your health risk. A simple and effective indicator of central obesity.' },
    'body-surface-area-calculator': { title: 'Body Surface Area Calculator', description: 'Calculate your Body Surface Area (BSA) using 8 different popular formulas. Get a comprehensive estimation of your body\'s total surface area.' },
    'food-calorie-calculator': { title: 'Food Calorie Calculator', description: 'Calculate the total calories in your food based on its protein, carbohydrate, and fat content. Understand nutrition labels better.' },
    'running-pace-calculator': { title: 'Running Pace Calculator', description: 'Calculate your running pace, time, or distance. An essential tool for runners to track performance and plan their training.' },
    'sleep-calculator': { title: 'Sleep Calculator', description: 'Find the best time to wake up or go to sleep based on natural 90-minute sleep cycles. Wake up feeling refreshed and energized.' },
    'water-intake-calculator': { title: 'Water Intake Calculator', description: 'Get a personalized daily water intake recommendation. Our world-class calculator considers your weight, activity level, climate, and more for accurate results.' },
    'heart-rate-zones-calculator': { title: 'Heart Rate Zones Calculator', description: 'Determine your target heart rate zones for exercise (fat burning, cardio, etc.). Optimize your workouts for better results.' },
    'ideal-weight-calculator': { title: 'Ideal Weight Calculator', description: 'Find your ideal body weight range using multiple popular formulas. Get a healthy weight estimate based on your height and gender.' },
    'pregnancy-due-date-calculator': { title: 'Pregnancy Due Date Calculator', description: 'Estimate your baby\'s due date based on your last menstrual period (LMP) and cycle length. Track your pregnancy timeline and key milestones.' },
    'ovulation-calculator': { title: 'Ovulation Calculator', description: 'Predict your most fertile days and ovulation period. Our calculator helps you identify the best time to conceive based on your menstrual cycle.' },
    'fertility-window-calculator': { title: 'Fertility Window Calculator', description: 'Pinpoint your most fertile days to increase your chances of conception. This calculator identifies your key fertility window based on your cycle.' },
    'menstrual-cycle-and-next-period-calculator': { title: 'Menstrual Cycle & Next Period Calculator', description: 'Track your menstrual cycle and predict your next period date. Get insights into your cycle phases and plan ahead with our easy-to-use calculator.' },
    'pregnancy-weight-gain-calculator': { title: 'Pregnancy Weight Gain Calculator', description: 'Track your pregnancy weight gain with our calculator. Get personalized recommendations based on your pre-pregnancy BMI for a healthy pregnancy.' },
};

// Home Route
app.get('/', (req, res) => {
    const calculators = Object.keys(calculatorData).map(key => ({
        name: calculatorData[key].title,
        url: `/${key}`,
        description: calculatorData[key].description.split('.')[0] + '.'
    }));
    
    const title = 'Health Hub - All-in-One Health Calculators';
    const desc = 'A free collection of online health and fitness calculators. Calculate BMI, BMR, TDEE and more instantly.';

    res.render('index', { 
        title: title,
        description: desc,
        calculators: calculators,
        schema: generateSchema(title, desc, '/', false)
    });
});

// Disclaimer Page Route (Added based on your previous request)
app.get('/disclaimer', (req, res) => {
    const title = 'Disclaimer | Health Hub';
    const desc = 'Please read the disclaimer for Health Hub. Our tools are for informational purposes only.';
    res.render('disclaimer', { 
        title: title,
        description: desc,
        schema: generateSchema(title, desc, '/disclaimer', false)
    });
});

// Dynamic Route for Calculators
app.get('/:calculator', (req, res) => {
    const calculatorName = req.params.calculator;
    const data = calculatorData[calculatorName];

    if (data) {
        const viewName = calculatorName.replace(/-/g, '_');
        // Check if view exists would be good, but trusting express for now
        res.render(viewName, { 
            title: data.title,
            description: data.description,
            schema: generateSchema(data.title, data.description, req.url, true)
        });
    } else {
        res.status(404).send('Calculator not found');
    }
});

// Start Server
app.listen(port, '0.0.0.0', () => {
    console.log(`Health-Hub server is running on port ${port}`);
});