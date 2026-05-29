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

// FAQ Data for popular calculators
const faqData = {
    'bmi-calculator': [
        { q: 'What is BMI?', a: 'BMI (Body Mass Index) is a measure calculated using your height and weight to assess if your weight is healthy. Formula: weight(kg) / height(m)².' },
        { q: 'What is a healthy BMI range?', a: 'A BMI between 18.5 and 24.9 is considered a healthy weight. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is obese.' },
        { q: 'Is BMI accurate for everyone?', a: 'BMI is a useful screening tool but has limitations. It may overestimate body fat in athletes and underestimate it in older adults. Consult a doctor for a full assessment.' },
        { q: 'How is BMI calculated?', a: 'BMI = weight in kilograms divided by height in meters squared. For example, a person weighing 70 kg at 1.75 m has a BMI of 70 / (1.75²) = 22.9.' }
    ],
    'calorie-calculator': [
        { q: 'How many calories do I need per day?', a: 'Daily calorie needs depend on age, gender, weight, height, and activity level. Most adults need between 1,600–3,000 calories per day.' },
        { q: 'How do I calculate my daily calorie needs?', a: 'Use the Mifflin-St Jeor equation to find your BMR, then multiply by your activity level (TDEE). Adjust by ±500 calories for weight loss or gain.' },
        { q: 'How many calories should I eat to lose weight?', a: 'A deficit of 500 calories/day leads to approximately 0.5 kg (1 lb) of weight loss per week. Do not go below 1,200 calories for women or 1,500 for men.' }
    ],
    'tdee-calculator': [
        { q: 'What is TDEE?', a: 'TDEE (Total Daily Energy Expenditure) is the total number of calories you burn in a day, including exercise and daily activities.' },
        { q: 'How is TDEE calculated?', a: 'TDEE = BMR × Activity Multiplier. Sedentary (×1.2), Lightly Active (×1.375), Moderately Active (×1.55), Very Active (×1.725), Extra Active (×1.9).' },
        { q: 'Should I eat my TDEE to maintain weight?', a: 'Yes. Eating at your TDEE maintains your current weight. Eat less to lose weight, eat more to gain weight.' }
    ],
    'bmr-calculator': [
        { q: 'What is BMR?', a: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell production.' },
        { q: 'What is the Mifflin-St Jeor formula?', a: 'Men: BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5. Women: BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) − 161.' },
        { q: 'What is the difference between BMR and TDEE?', a: 'BMR is calories burned at rest. TDEE includes physical activity. TDEE = BMR × activity factor. Use TDEE for real-world calorie planning.' }
    ],
    'water-intake-calculator': [
        { q: 'How much water should I drink per day?', a: 'A common guideline is 8 glasses (2 litres) per day, but needs vary. This calculator factors in weight, activity level, and climate for a personalised recommendation.' },
        { q: 'Does coffee or tea count towards my water intake?', a: 'Yes, coffee and tea contribute to hydration, despite mild diuretic effects. However, plain water is the most effective for hydration.' },
        { q: 'How do I know if I am drinking enough water?', a: 'Check your urine colour. Pale yellow (like lemonade) indicates good hydration. Dark yellow or amber means you need to drink more.' }
    ],
    'calorie-deficit-calculator': [
        { q: 'What is a calorie deficit?', a: 'A calorie deficit means eating fewer calories than your body burns. A deficit of approximately 7,700 calories results in losing 1 kg of body fat.' },
        { q: 'How fast should I lose weight?', a: '0.5–1 kg (1–2 lbs) per week is considered safe and sustainable. Losing weight faster may result in muscle loss and nutrient deficiencies.' },
        { q: 'What is the minimum safe calorie intake?', a: 'Generally, women should not eat fewer than 1,200 calories/day and men fewer than 1,500 calories/day without medical supervision.' }
    ],
    'keto-calculator': [
        { q: 'What is the ketogenic diet?', a: 'A very low-carb, high-fat diet that shifts your body into a metabolic state called ketosis, where fat becomes the primary fuel source instead of glucose.' },
        { q: 'How many carbs can I eat on keto?', a: 'Typically 20–50g of net carbs per day. Most people enter ketosis below 25g net carbs. Net carbs = total carbs minus dietary fibre.' },
        { q: 'What is the standard keto macro split?', a: 'A typical keto diet consists of approximately 70–75% fat, 20–25% protein, and 5% carbohydrates.' }
    ],
    'intermittent-fasting-calculator': [
        { q: 'What is intermittent fasting?', a: 'An eating pattern that cycles between fasting and eating periods. It focuses on when you eat, not what you eat. Common protocols include 16:8, 18:6, and 5:2.' },
        { q: 'Which intermittent fasting protocol is best for beginners?', a: 'The 16:8 method (16 hours fasting, 8 hours eating) is most popular and beginner-friendly as it aligns with natural sleep patterns.' },
        { q: 'Can I drink anything during the fasting window?', a: 'Yes. Water, plain black coffee, and unsweetened herbal tea are generally allowed and will not break your fast.' }
    ],
    'one-rep-max-calculator': [
        { q: 'What is one rep max (1RM)?', a: 'The maximum amount of weight you can lift for exactly one repetition of a given exercise with proper form.' },
        { q: 'Which 1RM formula is most accurate?', a: 'Epley and Brzycki formulas are the most widely used. Accuracy decreases significantly when the rep count exceeds 10.' },
        { q: 'How do I use my 1RM for training?', a: 'Use 70–80% of 1RM for hypertrophy (muscle building), 85–95% for strength training, and 50–65% for muscular endurance work.' }
    ],
    'vo2-max-calculator': [
        { q: 'What is VO2 Max?', a: 'VO2 Max is the maximum rate at which your body can consume oxygen during intense exercise. It is the gold standard measure of cardiovascular fitness.' },
        { q: 'What is a good VO2 Max?', a: 'For untrained adults: 35–45 ml/kg/min. Recreational athletes: 45–55. Elite endurance athletes can exceed 70–85 ml/kg/min.' },
        { q: 'How can I improve my VO2 Max?', a: 'High-intensity interval training (HIIT) and consistent aerobic training (running, cycling, swimming) are the most effective ways to improve VO2 Max.' }
    ],
    'child-bmi-calculator': [
        { q: 'How is child BMI different from adult BMI?', a: 'Child BMI (BMI-for-age) is plotted on age- and gender-specific growth charts, as children\'s body fat levels change with age and differ between boys and girls.' },
        { q: 'What is a healthy BMI percentile for a child?', a: 'A BMI between the 5th and 85th percentile for the child\'s age and gender is considered a healthy weight.' },
        { q: 'What should I do if my child has a high BMI?', a: 'Consult your paediatrician. Focus on healthy eating habits and physical activity rather than weight loss, as children are still growing.' }
    ],
    'body-type-calculator': [
        { q: 'What are the 3 body types (somatotypes)?', a: 'Ectomorph (naturally lean, fast metabolism), Mesomorph (naturally muscular, athletic build), and Endomorph (naturally higher body fat, slower metabolism).' },
        { q: 'Can I change my body type?', a: 'Your somatotype is largely genetic, but diet and training can significantly change your body composition regardless of your natural type.' },
        { q: 'How do I train for my body type?', a: 'Ectomorphs: focus on strength training and calorie surplus. Mesomorphs: balanced training works well. Endomorphs: prioritise cardio and a calorie deficit.' }
    ]
};

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
    'blood-pressure-calculator': { title: 'Blood Pressure Calculator', description: 'Check your blood pressure category (Normal, Elevated, High Stage 1 & 2, or Hypertensive Crisis) using your systolic and diastolic readings. Understand your cardiovascular health risk.' },
    'diabetes-risk-calculator': { title: 'Diabetes Risk Calculator', description: 'Assess your risk of developing Type 2 diabetes using the FINDRISC method. Based on age, BMI, waist circumference, physical activity, diet, blood glucose history, and family history.' },
    'protein-intake-calculator': { title: 'Protein Intake Calculator', description: 'Calculate your optimal daily protein intake based on your weight, activity level, and fitness goal (muscle gain, fat loss, or maintenance). Get a personalized protein recommendation.' },
    'steps-to-calories-calculator': { title: 'Steps to Calories Calculator', description: 'Convert your daily step count into calories burned. Find out how many calories you burn walking 5,000, 10,000 or more steps based on your weight and stride.' },
    'age-calculator': { title: 'Age Calculator', description: 'Calculate your exact age in years, months, days, hours, and minutes from your date of birth. Also find the day of the week you were born and days until your next birthday.' },
    'alcohol-units-calculator': { title: 'Alcohol Units Calculator', description: 'Calculate the number of alcohol units and calories in your drinks. Compare with UK and WHO safe drinking limits and understand your weekly alcohol consumption.' },
    'calorie-deficit-calculator': { title: 'Calorie Deficit Calculator', description: 'Calculate your daily calorie deficit to lose weight safely. Find out exactly how many calories to eat per day to reach your target weight loss rate of 0.25 to 1 kg per week.' },
    'one-rep-max-calculator': { title: 'One Rep Max Calculator', description: 'Estimate your one repetition maximum (1RM) for any exercise. Use Epley, Brzycki, or 5 other formulas and get a full percentage training table to plan your workouts.' },
    'keto-calculator': { title: 'Keto Calculator', description: 'Calculate your ideal macros for a ketogenic diet. Get personalized daily targets for calories, protein, fat, and net carbs based on your weight, activity level, and goal.' },
    'vo2-max-calculator': { title: 'VO2 Max Calculator', description: 'Estimate your VO2 Max (maximum oxygen uptake) using the resting heart rate method, Cooper 12-minute run test, or 1.5-mile run test. Find your cardiovascular fitness level.' },
    'intermittent-fasting-calculator': { title: 'Intermittent Fasting Calculator', description: 'Calculate your fasting and eating windows for popular IF protocols including 16:8, 18:6, 20:4, 5:2, and OMAD. Get a visual timeline to plan your intermittent fasting schedule.' },
    'child-bmi-calculator': { title: 'Child BMI Calculator', description: 'Calculate BMI for children and teenagers aged 2 to 19. Uses CDC guidelines to determine healthy weight, underweight, overweight, and obese categories by age and gender.' },
    'body-type-calculator': { title: 'Body Type Calculator', description: 'Discover your somatotype — Ectomorph, Mesomorph, or Endomorph. Get personalized diet and training recommendations based on your natural body type and measurements.' },
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
        const faqs = faqData[calculatorName] || [];
        
        // Build FAQ schema if FAQs exist
        let faqSchema = null;
        if (faqs.length > 0) {
            faqSchema = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.a
                    }
                }))
            });
        }
        
        res.render(viewName, { 
            title: data.title,
            description: data.description,
            schema: generateSchema(data.title, data.description, req.url, true),
            faqSchema: faqSchema
        });
    } else {
        res.status(404).send('Calculator not found');
    }
});

// Start Server
app.listen(port, '0.0.0.0', () => {
    console.log(`Health-Hub server is running on port ${port}`);
});