const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const { categoryMeta, calculators: masterCalculators } = require('./data/calculatorCatalog');

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Folder Setup
app.use(express.static(path.join(__dirname, 'public')));

// Base URL configuration for Health Hub
const BASE_URL = "https://health-hub.calculatorfree.in";

// Helper Function: Generate Schema
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
                    "name": title
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

    res.render('index', {
        title: title,
        description: desc,
        calculators: calcList,
        categories: categoryMeta,
        categoryCounts: categoryCounts,
        schema: generateSchema(title, desc, '/', false)
    });
});

// ==========================================================================
// DYNAMIC XML SITEMAP & ROBOTS.TXT (PROGRAMMATIC SEO FOR GOOGLE & BING)
// ==========================================================================
app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    const today = new Date().toISOString().split('T')[0];

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
            xml += `  <url>\n    <loc>${BASE_URL}/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
    });

    xml += `</urlset>`;
    res.send(xml);
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);
});

// ==========================================================================
// FREE PUBLIC HEALTH APIS PROXY ENDPOINTS (Open Food Facts, openFDA, wger, Open-Meteo)
// ==========================================================================

// 1. Food Nutrition & Calorie API (Open Food Facts & Fruityvice)
app.get('/api/food-search', async (req, res) => {
    try {
        const query = req.query.q || 'apple';
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8`;
        const response = await fetch(url, { headers: { 'User-Agent': 'HealthHub - Free Health App - contact@calculatorfree.in' } });
        if (!response.ok) throw new Error('Failed to fetch from Open Food Facts');
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

        res.json({ success: true, count: products.length, results: products });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
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
        // Open exercise database
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
        schema: generateSchema(title, desc, '/disclaimer', false)
    });
});

// Dynamic Route for all 300+ Health Calculators
app.get('/:calculator', (req, res) => {
    const calculatorSlug = req.params.calculator;
    const calcData = masterCalculators[calculatorSlug];

    if (!calcData) {
        return res.status(404).render('404', {
            title: '404 - Calculator Not Found | Health Hub',
            description: 'The requested health calculator does not exist.',
            schema: generateSchema('404 Not Found', 'Health calculator not found', req.url, false)
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

// Start Server
app.listen(port, '0.0.0.0', () => {
    console.log(`Health Hub server is running with ${Object.keys(masterCalculators).length} calculators at http://localhost:${port} (Base: ${BASE_URL})`);
});