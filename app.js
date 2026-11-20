const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 3000;

const { categoryMeta, calculators: masterCalculators } = require('./data/calculatorCatalog');

// Base URL configuration for Health Hub
const BASE_URL = "https://health-hub.calculatorfree.in";

// Security & Performance Middlewares
app.disable('x-powered-by');
app.use(compression());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Folder Setup with Cache Control
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',
    etag: true
}));

// Helper Function: Generate Schema (Valid Schema.org for Google Search & AI Crawlers)
function generateSchema(title, description, urlPath, isApp = true) {
    const fullUrl = urlPath === '/' ? BASE_URL : `${BASE_URL}${urlPath}`;
    
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "Health Hub",
                "url": BASE_URL,
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.calculatorfree.in/wp-content/uploads/2025/07/cropped-calculatorfree.png"
                }
            },
            {
                "@type": "WebSite",
                "name": "Health Hub",
                "url": BASE_URL,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${BASE_URL}/?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    if (isApp) {
        schema["@graph"].push({
            "@type": "SoftwareApplication",
            "name": title,
            "url": fullUrl,
            "operatingSystem": "Any",
            "applicationCategory": "HealthApplication",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "description": description
        });
        
        schema["@graph"].push({
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": BASE_URL
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": title,
                    "item": fullUrl
                }
            ]
        });
    }

    return JSON.stringify(schema);
}

// Home Route
app.get('/', (req, res) => {
    const calcList = Object.keys(masterCalculators).map(key => ({
        id: key,
        name: masterCalculators[key].title,
        url: `/${key}`,
        category: masterCalculators[key].category,
        categoryName: categoryMeta[masterCalculators[key].category]?.name || 'Health',
        icon: masterCalculators[key].icon || '🏥',
        description: masterCalculators[key].description,
        tags: masterCalculators[key].tags || []
    }));

    const categoryCounts = {};
    calcList.forEach(c => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const title = 'Health Hub - 500+ Free Online Health, Fitness & Medical Calculators';
    const desc = `Free collection of ${calcList.length}+ online health, fitness, diet, and clinical calculators. Calculate BMI, BMR, TDEE, Calories, Macros, Body Fat, Sleep, Due Date, and Vitals instantly.`;

    const homeFaqs = [
        { q: 'Are all 500+ health calculators on Health Hub free?', a: 'Yes, 100% free! Every calculator on Health Hub is accessible to everyone with zero subscriptions, paywalls, or accounts needed.' },
        { q: 'Are the health formulas scientifically validated?', a: 'All calculations utilize globally recognized medical and physiological standards, including Mifflin-St Jeor (BMR), Devine & Robinson (Ideal Weight), U.S. Navy Body Fat, FINDRISC (Diabetes), AHA (Blood Pressure), and WHO/CDC pediatric percentiles.' },
        { q: 'Is my health information kept private?', a: 'Yes. All calculations occur locally in your browser. We never save, store, or sell your private personal metrics or body measurements.' }
    ];

    const homeFaqSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": homeFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    });

    res.render('index', {
        title: title,
        description: desc,
        calculators: calcList,
        categories: categoryMeta,
        categoryCounts: categoryCounts,
        canonicalUrl: `${BASE_URL}/`,
        schema: generateSchema(title, desc, '/', false),
        faqSchema: homeFaqSchema
    });
});

// ==========================================================================
// DYNAMIC XML SITEMAP & ROBOTS.TXT & LLMS.TXT (SEO & AI CRAWLERS)
// ==========================================================================
app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    const today = new Date().toISOString().split('T')[0];
    const baseDate = '2026-11-01';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Medical Disclaimer
    xml += `  <url>\n    <loc>${BASE_URL}/disclaimer</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;

    // 4 Live API Engines
    const liveTools = ['food-nutrition-lookup', 'drug-safety-checker', 'exercise-workout-library', 'uv-index-vitamin-d-calculator'];
    liveTools.forEach(slug => {
        xml += `  <url>\n    <loc>${BASE_URL}/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // All 538+ Health Calculators
    Object.keys(masterCalculators).forEach(slug => {
        if (!liveTools.includes(slug)) {
            xml += `  <url>\n    <loc>${BASE_URL}/${slug}</loc>\n    <lastmod>${baseDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
    });

    xml += `</urlset>`;
    res.send(xml);
});

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/llms.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'public', 'llms.txt'));
});

// ==========================================================================
// FREE PUBLIC HEALTH APIS PROXY ENDPOINTS (Robust with fallback)
// ==========================================================================

// Built-in verified nutrient database for instant fallback when external API is slow or down
const COMMON_FOODS = [
    { name: 'Fresh Banana (Medium)', brand: 'Fresh Fruit', serving: '100 g', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2, sodium: 1, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200' },
    { name: 'Red Apple (Medium)', brand: 'Fresh Fruit', serving: '100 g', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, sugar: 10.4, sodium: 1, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
    { name: 'Chicken Breast (Cooked, Skinless)', brand: 'Lean Poultry', serving: '100 g', calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, image: null },
    { name: 'Boiled Whole Egg', brand: 'Dairy & Poultry', serving: '100 g (2 Eggs)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0, sugar: 0.4, sodium: 142, image: null },
    { name: 'White Rice (Cooked)', brand: 'Grains & Staple', serving: '100 g', calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, image: null },
    { name: 'Brown Rice (Cooked)', brand: 'Whole Grain', serving: '100 g', calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9, fiber: 1.8, sugar: 0.4, sodium: 5, image: null },
    { name: 'Rolled Oats (Dry)', brand: 'Whole Grain / Cereal', serving: '100 g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, sugar: 0, sodium: 2, image: null },
    { name: 'Whole Cow Milk', brand: 'Dairy', serving: '100 ml', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5.1, sodium: 43, image: null },
    { name: 'Greek Yogurt (Plain, Low Fat)', brand: 'Dairy', serving: '100 g', calories: 73, protein: 10.0, carbs: 3.9, fat: 1.9, fiber: 0, sugar: 3.6, sodium: 36, image: null },
    { name: 'Almonds (Raw)', brand: 'Nuts & Seeds', serving: '100 g', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, sugar: 4.4, sodium: 1, image: null },
    { name: 'Fresh Hass Avocado', brand: 'Fresh Produce', serving: '100 g', calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7, sodium: 7, image: null },
    { name: 'Atlantic Salmon (Cooked)', brand: 'Seafood', serving: '100 g', calories: 206, protein: 22.1, carbs: 0, fat: 12.3, fiber: 0, sugar: 0, sodium: 61, image: null },
    { name: 'Fresh Steamed Broccoli', brand: 'Vegetables', serving: '100 g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3, sugar: 1.4, sodium: 41, image: null },
    { name: 'Boiled Potato', brand: 'Tubers', serving: '100 g', calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1, fiber: 1.8, sugar: 0.9, sodium: 4, image: null },
    { name: 'Fresh Orange', brand: 'Citrus Fruit', serving: '100 g', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, sugar: 9.4, sodium: 0, image: null }
];

// 1. Food Nutrition & Calorie API (Open Food Facts v2 + Guaranteed Fallback)
app.get('/api/food-search', async (req, res) => {
    const query = (req.query.q || 'apple').trim().toLowerCase();
    
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        
        const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(query)}&fields=product_name,generic_name,brands,serving_size,nutriments,image_front_small_url&page_size=8`;
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'HealthHub - Free Health App - contact@calculatorfree.in' }
        });
        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            const products = (data.products || []).map(p => {
                const nutriments = p.nutriments || {};
                return {
                    name: p.product_name || p.generic_name || query,
                    brand: p.brands || 'Natural / Generic',
                    serving: p.serving_size || '100 g',
                    calories: Math.round(nutriments['energy-kcal_100g'] || (nutriments['energy-kcal'] || 0)),
                    protein: parseFloat((nutriments['proteins_100g'] || 0).toFixed(1)),
                    carbs: parseFloat((nutriments['carbohydrates_100g'] || 0).toFixed(1)),
                    fat: parseFloat((nutriments['fat_100g'] || 0).toFixed(1)),
                    fiber: parseFloat((nutriments['fiber_100g'] || 0).toFixed(1)),
                    sugar: parseFloat((nutriments['sugars_100g'] || 0).toFixed(1)),
                    sodium: parseFloat(((nutriments['sodium_100g'] || 0) * 1000).toFixed(0)),
                    image: p.image_front_small_url || null
                };
            }).filter(p => p.name && p.calories > 0);

            if (products.length > 0) {
                return res.json({ success: true, count: products.length, results: products });
            }
        }
    } catch (err) {
        // Fallback to local verified database on timeout or external 503
    }

    // Local instant fallback
    const matched = COMMON_FOODS.filter(f => f.name.toLowerCase().includes(query) || f.brand.toLowerCase().includes(query));
    const results = matched.length > 0 ? matched : COMMON_FOODS.slice(0, 5);
    res.json({ success: true, count: results.length, results: results, note: 'Showing clinical reference values' });
});

// 2. OpenFDA Drug Safety & Clinical Labeling API (openFDA)
app.get('/api/drug-search', async (req, res) => {
    try {
        const query = req.query.q || 'ibuprofen';
        const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"+openfda.generic_name:"${encodeURIComponent(query)}"&limit=3`;
        const response = await fetch(url);
        if (!response.ok) {
            // Fallback general search
            const fallbackUrl = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=3`;
            const fbRes = await fetch(fallbackUrl);
            if (!fbRes.ok) throw new Error('Drug label not found in FDA database');
            const fbData = await fbRes.json();
            return formatFdaResults(fbData, res);
        }
        const data = await response.json();
        return formatFdaResults(data, res);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

function formatFdaResults(data, res) {
    const results = (data.results || []).map(r => {
        const openfda = r.openfda || {};
        return {
            brandName: (openfda.brand_name && openfda.brand_name[0]) || 'Generic Medicine',
            genericName: (openfda.generic_name && openfda.generic_name[0]) || 'Active Ingredient',
            substanceName: (openfda.substance_name && openfda.substance_name[0]) || '',
            route: (openfda.route && openfda.route[0]) || 'Oral',
            purpose: (r.purpose && r.purpose[0]) || (r.indications_and_usage && r.indications_and_usage[0]) || 'Clinical Medication',
            warnings: (r.warnings && r.warnings[0]) || (r.do_not_use && r.do_not_use[0]) || 'Consult your prescribing doctor before administration.',
            dosage: (r.dosage_and_administration && r.dosage_and_administration[0]) || 'Follow physician advice.',
            adverseReactions: (r.adverse_reactions && r.adverse_reactions[0]) || 'Report any severe symptoms to a doctor.'
        };
    });
    res.json({ success: true, results });
}

// 3. Live Workout & Exercise Library API
app.get('/api/exercises', async (req, res) => {
    try {
        const category = req.query.category || 'all';
        const exercises = [
            { name: 'Barbell Bench Press', muscle: 'Chest', secondary: 'Triceps, Shoulders', equipment: 'Barbell, Bench', met: 6.0, caloriesPerMinPerKg: 0.10, tip: 'Keep shoulder blades retracted and feet planted firmly on the floor.' },
            { name: 'Incline Dumbbell Press', muscle: 'Chest', secondary: 'Front Deltoids', equipment: 'Dumbbells, Incline Bench', met: 5.5, caloriesPerMinPerKg: 0.09, tip: 'Set bench to 30-45 degrees to target the clavicular upper chest head.' },
            { name: 'Push-Ups (Standard)', muscle: 'Chest', secondary: 'Core, Triceps', equipment: 'Bodyweight', met: 4.5, caloriesPerMinPerKg: 0.08, tip: 'Maintain a straight plank posture from crown of head to heels.' },
            { name: 'Barbell Back Squat', muscle: 'Legs', secondary: 'Glutes, Lower Back', equipment: 'Barbell, Squat Rack', met: 7.5, caloriesPerMinPerKg: 0.13, tip: 'Descend to parallel depth ensuring knees track in line with toes.' },
            { name: 'Romanian Deadlift (RDL)', muscle: 'Legs', secondary: 'Hamstrings, Glutes', equipment: 'Barbell / Dumbbells', met: 6.5, caloriesPerMinPerKg: 0.11, tip: 'Hinge hips backwards while keeping slight bend in knees and neutral spine.' },
            { name: 'Bulgarian Split Squat', muscle: 'Legs', secondary: 'Quadriceps, Glutes', equipment: 'Dumbbells, Bench', met: 6.0, caloriesPerMinPerKg: 0.10, tip: 'Keep majority of weight on front foot heel to target quads and glutes.' },
            { name: 'Barbell Deadlift (Conventional)', muscle: 'Back', secondary: 'Hamstrings, Traps, Grip', equipment: 'Barbell', met: 8.0, caloriesPerMinPerKg: 0.14, tip: 'Engage lats and drive the floor away with your legs to break off ground.' },
            { name: 'Pull-Ups / Chin-Ups', muscle: 'Back', secondary: 'Biceps, Forearms', equipment: 'Pull-Up Bar', met: 7.0, caloriesPerMinPerKg: 0.12, tip: 'Full range of motion: initiate pull by depressing shoulder blades.' },
            { name: 'Seated Cable Row', muscle: 'Back', secondary: 'Rhomboids, Biceps', equipment: 'Cable Machine', met: 5.0, caloriesPerMinPerKg: 0.09, tip: 'Drive elbows back while maintaining an upright chest posture.' },
            { name: 'Overhead Shoulder Press (OHP)', muscle: 'Shoulders', secondary: 'Triceps, Upper Chest', equipment: 'Barbell / Dumbbells', met: 5.5, caloriesPerMinPerKg: 0.09, tip: 'Squeeze glutes and brace core to protect lumbar spine during press.' },
            { name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', secondary: 'Traps', equipment: 'Dumbbells', met: 4.0, caloriesPerMinPerKg: 0.07, tip: 'Lead with elbows and avoid swinging torso momentum.' },
            { name: 'Barbell Bicep Curl', muscle: 'Arms', secondary: 'Forearms', equipment: 'Barbell / EZ Bar', met: 4.5, caloriesPerMinPerKg: 0.08, tip: 'Pin elbows to your sides and avoid hip rocking.' },
            { name: 'Tricep Dips (Parallel Bars)', muscle: 'Arms', secondary: 'Chest, Shoulders', equipment: 'Dip Bars', met: 6.0, caloriesPerMinPerKg: 0.10, tip: 'Lower until elbows reach 90-degree angle, then press up powerfully.' },
            { name: 'Hanging Leg Raise', muscle: 'Core', secondary: 'Hip Flexors', equipment: 'Pull-Up Bar', met: 5.0, caloriesPerMinPerKg: 0.08, tip: 'Flex spine and raise pelvis to actively engage rectus abdominis.' },
            { name: 'Plank Hold (Isometric)', muscle: 'Core', secondary: 'Shoulders, Glutes', equipment: 'Bodyweight', met: 3.8, caloriesPerMinPerKg: 0.06, tip: 'Brace abdominal wall as if preparing for a punch.' },
            { name: 'Jump Rope (Speed/HIIT)', muscle: 'Cardio', secondary: 'Calves, Shoulders', equipment: 'Jump Rope', met: 10.0, caloriesPerMinPerKg: 0.17, tip: 'Jump on balls of feet with minimal knee bend using wrist rotation.' },
            { name: 'Rowing Ergometer (500m Splits)', muscle: 'Cardio', secondary: 'Back, Legs, Core', equipment: 'Rowing Machine', met: 9.0, caloriesPerMinPerKg: 0.15, tip: 'Drive with legs (60%), swing with hips (20%), and pull with arms (20%).' }
        ];

        let filtered = exercises;
        if (category !== 'all') {
            filtered = exercises.filter(e => e.muscle.toLowerCase() === category.toLowerCase());
        }

        res.json({ success: true, count: filtered.length, exercises: filtered });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. Live UV Index & Solar Vitamin D API (Open-Meteo)
app.get('/api/uv-index', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat) || 22.5726; // Default Kolkata / International
        const lon = parseFloat(req.query.lon) || 88.3639;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index,temperature_2m,weather_code&hourly=uv_index&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Open-Meteo UV data unavailable');
        const data = await response.json();
        
        const currentUv = data.current?.uv_index || 0;
        const temp = data.current?.temperature_2m || 25;
        const hourlyUv = (data.hourly?.uv_index || []).slice(6, 20); // 6 AM to 8 PM
        const hourlyTimes = (data.hourly?.time || []).slice(6, 20).map(t => t.split('T')[1]);

        res.json({
            success: true,
            currentUv,
            temperature: temp,
            hourly: { times: hourlyTimes, uv: hourlyUv }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Disclaimer Page Route
app.get('/disclaimer', (req, res) => {
    const title = 'Medical Disclaimer | Health Hub';
    const desc = 'Please read the medical disclaimer for Health Hub. Our health tools and calculators are for informational and educational tracking only.';
    res.render('disclaimer', {
        title: title,
        description: desc,
        canonicalUrl: `${BASE_URL}/disclaimer`,
        schema: generateSchema(title, desc, '/disclaimer', false)
    });
});

// Dynamic Route for all 540+ Health Calculators
app.get('/:calculator', (req, res, next) => {
    const calculatorSlug = req.params.calculator;
    const calcData = masterCalculators[calculatorSlug];

    if (!calcData) {
        return res.status(404).render('404', {
            title: '404 - Calculator Not Found | Health Hub',
            description: 'The requested health calculator does not exist.',
            is404: true,
            canonicalUrl: null,
            schema: null
        });
    }

    const viewName = calculatorSlug.replace(/-/g, '_');
    const dedicatedViewPath = path.join(__dirname, 'views', `${viewName}.ejs`);
    const categoryInfo = categoryMeta[calcData.category] || { name: 'Health', icon: '🏥' };

    const faqs = [
        { q: `What is the ${calcData.title}?`, a: `The ${calcData.title} is an evidence-based health estimation tool designed to calculate personalized wellness and fitness metrics based on clinical and physiological formulas.` },
        { q: `How do I use this calculator?`, a: `Enter your parameters (age, gender, height, weight, activity or measurements) above. Results, healthy ranges, and visual breakdowns will update automatically in real-time.` },
        { q: `Does this replace professional medical advice?`, a: `No. All calculators on Health Hub are designed for personal tracking and educational purposes. Always consult a qualified physician or healthcare provider for medical diagnosis and treatment.` }
    ];

    const faqSchema = JSON.stringify({
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

    const viewPayload = {
        title: `${calcData.title} - Free Online Health Calculator | Health Hub`,
        calculatorName: calcData.title,
        description: calcData.description,
        category: calcData.category,
        categoryName: categoryInfo.name,
        icon: calcData.icon || categoryInfo.icon,
        inputs: calcData.inputs || [],
        formulaName: calcData.formulaName || '',
        faqs: faqs,
        calcLogicData: { slug: calculatorSlug, ...calcData },
        canonicalUrl: `${BASE_URL}/${calculatorSlug}`,
        schema: generateSchema(calcData.title, calcData.description, `/${calculatorSlug}`, true),
        faqSchema: faqSchema
    };

    // If dedicated existing EJS view exists in views/, render it; otherwise render universal health calculator template
    if (fs.existsSync(dedicatedViewPath)) {
        res.render(viewName, viewPayload);
    } else {
        res.render('universal_calculator', viewPayload);
    }
});

// Global 404 Catch-All Handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found | Health Hub',
        description: 'The requested page does not exist on Health Hub.',
        is404: true,
        canonicalUrl: null,
        schema: null
    });
});

// Start Server
app.listen(port, '0.0.0.0', () => {
    console.log(`Health Hub server is running with ${Object.keys(masterCalculators).length} calculators at http://localhost:${port} (Base: ${BASE_URL})`);
});
