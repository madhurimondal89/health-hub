// ==========================================================================
// HEALTH HUB - MASTER HEALTH, FITNESS, MEDICAL & NUTRITION CATALOG (320+)
// ==========================================================================

const categoryMeta = {
    'live-engines': { name: 'Live API Engines & Essentials', icon: '⚡', color: '#10b981' },
    'body-composition': { name: 'Body Composition & Weight', icon: '⚖️', color: '#059669' },
    'diet-nutrition': { name: 'Diet, Calories & Macros', icon: '🥗', color: '#10b981' },
    'fitness-workouts': { name: 'Fitness, Workouts & Strength', icon: '🏋️‍♂️', color: '#0284c7' },
    'medical-clinical': { name: 'Medical, Heart & Clinical Tests', icon: '🩺', color: '#e11d48' },
    'pregnancy-pediatrics': { name: 'Pregnancy, Fertility & Kids', icon: '👶', color: '#8b5cf6' },
    'sleep-wellness': { name: 'Sleep, Longevity & Habits', icon: '😴', color: '#6366f1' },
    'hydration-lifestyle': { name: 'Hydration, Steps & Vitals', icon: '💧', color: '#14b8a6' },
    'pet-health': { name: 'Pet Health & Vet Care', icon: '🐾', color: '#d97706' }
};

const calculators = {
    // --------------------------------------------------------------------------
    // 0. LIVE HEALTH & PUBLIC API TOOLS (NEW)
    // --------------------------------------------------------------------------
    'food-nutrition-lookup': {
        title: 'Live Food Nutrition & Calorie Lookup',
        category: 'live-engines',
        icon: '🍎',
        description: 'Instant lookup for 100,000+ foods, fruits & ingredients with live calorie, protein, carbs, fat, and micronutrient breakdown.',
        tags: ['Food Search', 'Nutrition Facts', 'Calories', 'Open Food Facts', 'Fruityvice'],
        hasCustomView: true
    },
    'drug-safety-checker': {
        title: 'OpenFDA Drug Safety & Clinical Warnings Checker',
        category: 'live-engines',
        icon: '💊',
        description: 'Search official FDA clinical drug labels, indications, contraindications, dosage guidelines, and adverse side effects.',
        tags: ['FDA Drug', 'Medicine Safety', 'Side Effects', 'openFDA', 'Pharmacology'],
        hasCustomView: true
    },
    'exercise-workout-library': {
        title: 'Live Workout & Muscle Exercise Explorer',
        category: 'live-engines',
        icon: '🏋️‍♂️',
        description: 'Search 800+ exercises by target muscle group (Chest, Back, Arms, Legs, Core) with execution guides and live calorie burn rates.',
        tags: ['Workout Library', 'Exercise Guide', 'wger API', 'Muscle Groups', 'Gym'],
        hasCustomView: true
    },
    'uv-index-vitamin-d-calculator': {
        title: 'Live UV Index & Vitamin D Sun Exposure Calculator',
        category: 'live-engines',
        icon: '☀️',
        description: 'Real-time solar UV index calculator estimating safe sun exposure time needed for optimal Vitamin D synthesis based on skin type.',
        tags: ['UV Index', 'Vitamin D', 'Sun Exposure', 'Open-Meteo', 'Skin Health'],
        hasCustomView: true
    },

    // --------------------------------------------------------------------------
    // 1. BODY COMPOSITION & WEIGHT (Existing + Advanced Clinical)
    // --------------------------------------------------------------------------
    'bmi-calculator': {
        title: 'BMI Calculator',
        category: 'body-composition',
        icon: '⚖️',
        description: 'Calculate Body Mass Index (BMI) and discover whether you are underweight, normal weight, overweight, or obese.',
        tags: ['BMI', 'Body Mass Index', 'Weight', 'Health', 'Obesity'],
        hasCustomView: true
    },
    'bmr-calculator': {
        title: 'BMR Calculator (Basal Metabolic Rate)',
        category: 'body-composition',
        icon: '🔥',
        description: 'Calculate calories burned at complete rest using the clinically proven Mifflin-St Jeor and Harris-Benedict formulas.',
        tags: ['BMR', 'Metabolism', 'Calories', 'Basal Rate'],
        hasCustomView: true
    },
    'tdee-calculator': {
        title: 'TDEE Calculator (Total Daily Energy Expenditure)',
        category: 'body-composition',
        icon: '⚡',
        description: 'Find your exact total daily energy burn based on your lifestyle, workouts, and activity multipliers.',
        tags: ['TDEE', 'Energy Expenditure', 'Maintenance Calories', 'Fitness'],
        hasCustomView: true
    },
    'body-fat-calculator': {
        title: 'Body Fat Calculator (U.S. Navy Method)',
        category: 'body-composition',
        icon: '📐',
        description: 'Estimate body fat percentage using neck, waist, and hip circumference measurements with clinical accuracy.',
        tags: ['Body Fat', 'Navy Formula', 'Fat Percentage', 'Body Composition'],
        hasCustomView: true
    },
    'lean-body-mass-calculator': {
        title: 'Lean Body Mass (LBM) Calculator',
        category: 'body-composition',
        icon: '💪',
        description: 'Calculate your total lean muscle mass and fat-free body weight using Boer, James, and Hume formulas.',
        tags: ['LBM', 'Lean Muscle', 'Muscle Mass', 'Body Composition'],
        hasCustomView: true
    },
    'ideal-weight-calculator': {
        title: 'Ideal Body Weight Calculator',
        category: 'body-composition',
        icon: '🎯',
        description: 'Find your optimal healthy body weight range based on Devine, Robinson, Miller, and Hamwi equations.',
        tags: ['Ideal Weight', 'Healthy Weight', 'Devine Formula', 'Weight Target'],
        hasCustomView: true
    },
    'waist-to-hip-ratio-calculator': {
        title: 'Waist-to-Hip Ratio (WHR) Calculator',
        category: 'body-composition',
        icon: '📐',
        description: 'Assess cardiovascular health risks and visceral fat distribution with waist and hip ratios.',
        tags: ['WHR', 'Waist to Hip', 'Visceral Fat', 'Heart Health'],
        hasCustomView: true
    },
    'waist-to-height-ratio-calculator': {
        title: 'Waist-to-Height Ratio (WHtR) Calculator',
        category: 'body-composition',
        icon: '📏',
        description: 'Evaluate central obesity and metabolic syndrome risk with simple waist-to-height proportion.',
        tags: ['WHtR', 'Waist to Height', 'Abdominal Fat', 'Cardio Risk'],
        hasCustomView: true
    },
    'body-surface-area-calculator': {
        title: 'Body Surface Area (BSA) Calculator',
        category: 'body-composition',
        icon: '📏',
        description: 'Calculate total body surface area in m² using Mosteller, DuBois, Haycock, and Gehan-George formulas.',
        tags: ['BSA', 'Body Surface Area', 'Clinical Dose', 'Medical Math'],
        hasCustomView: true
    },
    'ponderal-index-calculator': {
        title: 'Ponderal Index (Rohrer Index) Calculator',
        category: 'body-composition',
        icon: '📊',
        description: 'Calculate body leanness normalized for height — ideal for very tall, short, or pediatric individuals.',
        tags: ['Ponderal Index', 'Rohrer Index', 'Leanness', 'BMI Alternative'],
        hasCustomView: true
    },
    'body-type-calculator': {
        title: 'Body Type (Somatotype) Calculator',
        category: 'body-composition',
        icon: '🧍',
        description: 'Determine your somatotype (Ectomorph, Mesomorph, or Endomorph) and tailored nutrition strategy.',
        tags: ['Somatotype', 'Body Type', 'Ectomorph', 'Mesomorph', 'Endomorph'],
        hasCustomView: true
    },
    'child-bmi-calculator': {
        title: 'Child & Teen BMI Percentile Calculator',
        category: 'body-composition',
        icon: '🧒',
        description: 'Calculate BMI-for-age growth percentiles for children aged 2 to 19 using official CDC growth charts.',
        tags: ['Child BMI', 'Pediatric Growth', 'Percentile', 'CDC'],
        hasCustomView: true
    },

    // --------------------------------------------------------------------------
    // 2. DIET, CALORIES & NUTRITION (Existing + Preserved)
    // --------------------------------------------------------------------------
    'calorie-calculator': {
        title: 'Daily Calorie Needs Calculator',
        category: 'diet-nutrition',
        icon: '🍎',
        description: 'Calculate exact daily calories needed to lose fat, maintain weight, or build lean muscle mass.',
        tags: ['Calories', 'Daily Needs', 'Nutrition', 'Diet Plan'],
        hasCustomView: true
    },
    'calorie-deficit-calculator': {
        title: 'Calorie Deficit Calculator',
        category: 'diet-nutrition',
        icon: '📉',
        description: 'Determine your daily calorie deficit to safely lose 0.25kg to 1kg per week without losing muscle.',
        tags: ['Calorie Deficit', 'Fat Loss', 'Weight Loss', 'Cutting'],
        hasCustomView: true
    },
    'macro-calculator': {
        title: 'Macro Calculator (Protein, Carbs, Fat)',
        category: 'diet-nutrition',
        icon: '🥑',
        description: 'Calculate daily grams and percentages of protein, carbohydrates, and healthy fats tailored to your goal.',
        tags: ['Macros', 'Macronutrients', 'Protein', 'Carbs', 'Fats'],
        hasCustomView: true
    },
    'keto-calculator': {
        title: 'Keto Diet Macro Calculator',
        category: 'diet-nutrition',
        icon: '🥩',
        description: 'Calculate net carbs (20-30g), healthy fats (70-75%), and protein targets to reach and sustain ketosis.',
        tags: ['Keto', 'Ketosis', 'Low Carb', 'High Fat', 'Ketogenic'],
        hasCustomView: true
    },
    'protein-intake-calculator': {
        title: 'Daily Protein Intake Calculator',
        category: 'diet-nutrition',
        icon: '🍗',
        description: 'Calculate optimal protein requirements in grams per day based on athletic goals and body composition.',
        tags: ['Protein', 'Protein Needs', 'Muscle Growth', 'Diet'],
        hasCustomView: true
    },
    'food-calorie-calculator': {
        title: 'Food Calorie & Nutrition Label Calculator',
        category: 'diet-nutrition',
        icon: '🥗',
        description: 'Calculate total calories and Atwater energy values from grams of carbohydrates, fats, and proteins.',
        tags: ['Food Calories', 'Atwater Factor', 'Nutrition Label', 'Meal Calorie'],
        hasCustomView: true
    },
    'intermittent-fasting-calculator': {
        title: 'Intermittent Fasting (IF) Schedule Calculator',
        category: 'diet-nutrition',
        icon: '⏱️',
        description: 'Plan fasting and eating windows for 16:8, 18:6, 20:4, 5:2, and OMAD fasting protocols.',
        tags: ['Intermittent Fasting', 'Fast Window', '16:8 Fasting', 'Autophagy'],
        hasCustomView: true
    },

    // --------------------------------------------------------------------------
    // 3. FITNESS, WORKOUTS & STRENGTH (Existing + Preserved)
    // --------------------------------------------------------------------------
    'one-rep-max-calculator': {
        title: 'One Rep Max (1RM) Calculator',
        category: 'fitness-workouts',
        icon: '🏋️‍♂️',
        description: 'Estimate maximum lifting capacity (1RM) using Epley, Brzycki, Lombardi, O\'Conner, and Mayhew formulas.',
        tags: ['1RM', 'One Rep Max', 'Strength', 'Bench Press', 'Squat', 'Deadlift'],
        hasCustomView: true
    },
    'running-pace-calculator': {
        title: 'Running Pace, Time & Distance Calculator',
        category: 'fitness-workouts',
        icon: '⏱️',
        description: 'Calculate pace per km/mile, split times, and race finish predictions for 5K, 10K, Half & Full Marathon.',
        tags: ['Running Pace', 'Marathon Time', '5K Split', 'Runner Speed'],
        hasCustomView: true
    },
    'calorie-burn-calculator': {
        title: 'Exercise Calorie Burn Calculator (MET)',
        category: 'fitness-workouts',
        icon: '🚴',
        description: 'Calculate calories burned across 60+ exercises, sports, and gym routines using metabolic equivalents (MET).',
        tags: ['Calorie Burn', 'MET Score', 'Workout Calories', 'Cardio'],
        hasCustomView: true
    },
    'steps-to-calories-calculator': {
        title: 'Steps to Calories Burned Calculator',
        category: 'fitness-workouts',
        icon: '👟',
        description: 'Convert daily step counts (5,000, 10,000, 15,000) into active calories burned and distance walked.',
        tags: ['Steps to Calories', 'Pedometer', 'Walking Calories', 'Daily Steps'],
        hasCustomView: true
    },
    'vo2-max-calculator': {
        title: 'VO2 Max Cardiovascular Fitness Calculator',
        category: 'fitness-workouts',
        icon: '🏃',
        description: 'Estimate aerobic capacity (VO2 Max) using Cooper 12-minute run, Rockport 1-mile walk, or resting heart rate.',
        tags: ['VO2 Max', 'Aerobic Fitness', 'Cooper Test', 'Cardio Endurance'],
        hasCustomView: true
    },
    'heart-rate-zones-calculator': {
        title: 'Target Heart Rate Zones Calculator (Karvonen)',
        category: 'fitness-workouts',
        icon: '💓',
        description: 'Calculate your 5 training zones (Recovery, Fat Burn, Aerobic, Anaerobic, VO2 Peak) based on heart rate reserve.',
        tags: ['Heart Rate Zones', 'Karvonen Formula', 'Fat Burn Zone', 'Cardio HR'],
        hasCustomView: true
    },

    // --------------------------------------------------------------------------
    // 4. MEDICAL, HEART & CLINICAL RISKS (Existing + Preserved)
    // --------------------------------------------------------------------------
    'blood-pressure-calculator': {
        title: 'Blood Pressure Category Calculator',
        category: 'medical-clinical',
        icon: '❤️',
        description: 'Classify systolic and diastolic readings according to AHA guidelines (Normal, Elevated, Stage 1/2, Crisis).',
        tags: ['Blood Pressure', 'Hypertension', 'Systolic', 'Diastolic', 'AHA'],
        hasCustomView: true
    },
    'diabetes-risk-calculator': {
        title: 'Type 2 Diabetes Risk Score Calculator (FINDRISC)',
        category: 'medical-clinical',
        icon: '🩸',
        description: 'Assess 10-year risk of developing Type 2 diabetes using the validated clinical FINDRISC scoring model.',
        tags: ['Diabetes Risk', 'FINDRISC', 'Blood Sugar', 'Prediabetes'],
        hasCustomView: true
    },
    'alcohol-units-calculator': {
        title: 'Alcohol Units & BAC Calculator',
        category: 'medical-clinical',
        icon: '🍷',
        description: 'Calculate standard alcohol units, calorie load, and compare against WHO and NHS low-risk drinking guidelines.',
        tags: ['Alcohol Units', 'Safe Drinking', 'Alcohol Calories', 'NHS Limits'],
        hasCustomView: true
    },

    // --------------------------------------------------------------------------
    // 5. PREGNANCY, FERTILITY & PEDIATRICS (Existing + Preserved)
    // --------------------------------------------------------------------------
    'pregnancy-due-date-calculator': {
        title: 'Pregnancy Due Date & Milestone Calculator',
        category: 'pregnancy-pediatrics',
        icon: '👶',
        description: 'Calculate your baby\'s estimated due date (EDD) using Naegele\'s rule from last menstrual period (LMP).',
        tags: ['Pregnancy Due Date', 'EDD', 'LMP', 'Trimester', 'Baby'],
        hasCustomView: true
    },
    'ovulation-calculator': {
        title: 'Ovulation & Fertile Days Calculator',
        category: 'pregnancy-pediatrics',
        icon: '🌸',
        description: 'Predict exact ovulation day and high-fertility window based on your menstrual cycle length.',
        tags: ['Ovulation', 'Fertile Window', 'Conception', 'Period'],
        hasCustomView: true
    },
    'fertility-window-calculator': {
        title: 'Fertility Window Predictor',
        category: 'pregnancy-pediatrics',
        icon: '🗓️',
        description: 'Identify the 6-day fertile window to optimize chances of natural pregnancy conception.',
        tags: ['Fertility Window', 'Conception Date', 'Baby Planning'],
        hasCustomView: true
    },
    'menstrual-cycle-and-next-period-calculator': {
        title: 'Menstrual Cycle & Next Period Calculator',
        category: 'pregnancy-pediatrics',
        icon: '📅',
        description: 'Track cycle regularity, luteal phase length, and forecast next 6 upcoming period dates.',
        tags: ['Menstrual Cycle', 'Period Tracker', 'Next Period'],
        hasCustomView: true
    },
    'pregnancy-weight-gain-calculator': {
        title: 'Pregnancy Weight Gain Tracker (IOM Guidelines)',
        category: 'pregnancy-pediatrics',
        icon: '🤰',
        description: 'Track healthy week-by-week weight gain targets based on pre-pregnancy BMI (Institute of Medicine).',
        tags: ['Pregnancy Weight Gain', 'IOM Guidelines', 'Maternal Weight'],
        hasCustomView: true
    },

    // --------------------------------------------------------------------------
    // 6. SLEEP, LONGEVITY & WELLNESS (Existing + Preserved)
    // --------------------------------------------------------------------------
    'sleep-calculator': {
        title: 'Sleep Cycle Calculator (90-Minute Cycles)',
        category: 'sleep-wellness',
        icon: '😴',
        description: 'Calculate the ideal bedtime or wake-up time based on natural 90-minute REM and non-REM sleep cycles.',
        tags: ['Sleep Cycles', 'Wake Up Time', 'Circadian Rhythm', 'Sleep Rest'],
        hasCustomView: true
    },
    'age-calculator': {
        title: 'Chronological Age Calculator',
        category: 'sleep-wellness',
        icon: '🎂',
        description: 'Calculate exact age in years, months, days, hours, and minutes with upcoming birthday countdown.',
        tags: ['Age', 'Date of Birth', 'Age in Days'],
        hasCustomView: true
    },
    'water-intake-calculator': {
        title: 'Daily Water Intake & Hydration Calculator',
        category: 'hydration-lifestyle',
        icon: '💧',
        description: 'Calculate daily water requirements customized for body weight, climate, and exercise sweat loss.',
        tags: ['Water Intake', 'Daily Hydration', 'Water Needs', 'Electrolytes'],
        hasCustomView: true
    }
};

// Extended health catalog to ensure 320+ comprehensive health calculators
const masterHealthSlugs = [
    // Clinical, Lab & Biomarkers (60+)
    'mean-arterial-pressure-calculator', 'pulse-pressure-calculator', 'cholesterol-ratio-calculator',
    'hba1c-to-glucose-calculator', 'gfr-kidney-function-calculator', 'creatinine-clearance-calculator',
    'blood-alcohol-bac-calculator', 'smoking-cost-recovery-calculator', 'anion-gap-calculator',
    'corrected-calcium-calculator', 'serum-osmolality-calculator', 'fractional-excretion-sodium-fena-calculator',
    'qtc-interval-calculator', 'wells-score-dvt-calculator', 'curb-65-pneumonia-score-calculator',
    'meld-score-liver-calculator', 'child-pugh-score-calculator', 'glasgow-coma-scale-gcs-calculator',
    'nihss-stroke-score-calculator', 'alvarado-appendicitis-score-calculator', 'apache-ii-score-calculator',
    'sofa-score-calculator', 'qsofa-sepsis-calculator', 'timi-risk-score-calculator',
    'grace-acs-score-calculator', 'has-bled-bleeding-risk-calculator', 'chadsvasc-stroke-risk-calculator',
    'absolute-neutrophil-count-anc-calculator', 'reticulocyte-index-calculator', 'transferrin-saturation-tsat-calculator',
    'iron-deficiency-anemia-calculator', 'uric-acid-gout-risk-calculator', 'thyroid-tsh-ft4-ratio-calculator',
    'cortisol-stress-index-calculator', 'crp-cardiac-inflammation-calculator', 'homo-ir-insulin-resistance-calculator',
    'quicki-insulin-sensitivity-calculator', 'fasting-insulin-glucose-ratio-calculator', 'triglyceride-glucose-tyg-index-calculator',
    'atherogenic-index-of-plasma-aip-calculator', 'ast-alt-de-ritis-ratio-calculator', 'albumin-creatinine-ratio-uacr-calculator',
    'creatinine-urine-output-aki-calculator', 'bun-to-creatinine-ratio-calculator', 'sodium-correction-hyperglycemia-calculator',
    'free-water-deficit-hypernatremia-calculator', 'plasma-volume-loss-calculator', 'framingham-cardiovascular-risk-calculator',
    'ascvd-heart-risk-calculator', 'cardiac-calcium-score-risk-calculator', 'heart-age-calculator',
    'winter-formula-acidosis-calculator', 'delta-gap-acid-base-calculator', 'feurea-renal-calculator',
    'ganzoni-iron-deficit-calculator', 'mentzer-index-thalassemia-calculator', 'nlr-neutrophil-lymphocyte-ratio-calculator',
    'castelli-risk-index-calculator', 'bazett-qtc-formula-calculator',

    // Diets, Nutrition, Vitamins & Micronutrients (50+)
    'carb-cycling-calculator', 'glycemic-load-calculator', 'daily-fiber-intake-calculator',
    'caffeine-intake-calculator', 'sodium-salt-intake-calculator', 'cholesterol-intake-calculator',
    'creatine-dosage-calculator', 'paleo-diet-macro-calculator', 'carnivore-diet-fat-protein-calculator',
    'vegan-plant-protein-calculator', 'mediterranean-diet-score-calculator', 'dash-diet-sodium-potassium-calculator',
    'low-fodmap-diet-tracker', 'anti-inflammatory-diet-score-calculator', 'keto-psmf-calculator',
    'refeed-day-calorie-carb-calculator', 'diet-break-metabolic-reset-calculator', 'reverse-dieting-calorie-progression-calculator',
    'thermic-effect-of-food-tef-calculator', 'neat-non-exercise-thermogenesis-calculator', 'vitamin-d-iu-supplement-calculator',
    'vitamin-c-rda-calculator', 'magnesium-glycinate-elemental-calculator', 'zinc-copper-ratio-calculator',
    'calcium-vitamin-d-ratio-calculator', 'omega-3-epa-dha-daily-dose-calculator', 'potassium-daily-intake-calculator',
    'iodine-thyroid-requirement-calculator', 'folate-folic-acid-pregnancy-calculator', 'vitamin-b12-absorption-calculator',
    'iron-absorption-enhancer-calculator', 'choline-brain-health-calculator', 'antioxidant-orac-value-calculator',
    'daily-meal-prep-portion-scaler', 'glycemic-load-fruit-calculator', 'net-carbs-sugar-alcohol-calculator',
    'dietary-fatty-acid-ratio-calculator', 'bcaa-leucine-ratio-calculator', 'collagen-peptide-dose-calculator',
    'protein-pdcaas-score-calculator', 'glutamine-muscle-recovery-calculator', 'taurine-supplement-calculator',
    'carnitine-fat-burn-calculator', 'fructose-glucose-fruit-ratio-calculator', 'oxalate-gout-kidney-calculator',
    'purine-uric-acid-diet-calculator', 'histamine-intolerance-load-calculator', 'sugar-daily-added-limit-calculator',

    // Fitness, Powerlifting, Workouts & Sports (60+)
    'fat-free-mass-index-ffmi-calculator', 'army-body-fat-calculator', 'skeletal-muscle-mass-calculator',
    'body-frame-size-calculator', 'wilks-score-calculator', 'dots-score-calculator',
    'bench-press-calculator', 'squat-max-calculator', 'deadlift-max-calculator',
    'cycling-power-ftp-calculator', 'swimming-calories-calculator', 'treadmill-pace-incline-calculator',
    'plank-calories-calculator', 'jump-rope-calories-calculator', 'running-vo2-max-daniels-vdot-calculator',
    'running-cadence-stride-length-calculator', 'cooper-12-minute-run-calculator', 'beep-test-shuttle-run-vo2-calculator',
    'rockport-walking-test-calculator', 'queens-college-step-test-calculator', 'maximum-heart-rate-tanaka-formula-calculator',
    'maximum-heart-rate-gellish-formula-calculator', 'heart-rate-recovery-hrr-1min-calculator', 'heart-rate-variability-hrv-baseline-calculator',
    'power-to-weight-ratio-cycling-calculator', 'ftp-critical-power-calculator', 'rowing-split-500m-pace-calculator',
    'rowing-watts-to-pace-calculator', 'ski-erg-calorie-burn-calculator', 'assault-air-bike-calorie-calculator',
    'kettlebell-swing-calorie-calculator', 'burpee-calorie-burn-calculator', 'hiit-interval-work-to-rest-ratio-calculator',
    'tabata-calorie-burn-calculator', 'heavy-bag-boxing-calories-calculator', 'bjj-grappling-calorie-burn-calculator',
    'rock-climbing-calories-calculator', 'hiking-backpack-weight-calorie-calculator', 'standing-desk-calorie-burn-calculator',
    'walking-elevation-grade-calorie-calculator', 'brisk-walking-met-calculator', 'elliptical-resistance-calorie-calculator',
    'stairmaster-steps-calories-calculator', 'crossfit-wod-round-timer-calculator', 'power-snatch-percentage-calculator',
    'clean-and-jerk-max-calculator', 'overhead-press-ohp-max-calculator', 'front-squat-to-back-squat-ratio-calculator',
    'incline-bench-press-max-calculator', 'dumbbell-to-barbell-weight-calculator', 'dip-weighted-1rm-calculator',
    'pull-up-weighted-1rm-calculator', 'grip-strength-dynamometer-percentile-calculator', 'vertical-jump-power-lewis-formula-calculator',
    'broad-jump-lower-body-power-calculator', 'pro-agility-5-10-5-shuttle-calculator', 't-test-agility-score-calculator',
    'sit-and-reach-hamstring-flexibility-calculator', 'shoulder-mobility-reach-test-calculator', 'active-straight-leg-raise-mobility-calculator',
    'rotator-cuff-strength-ratio-calculator', 'glute-ham-developer-calorie-calculator', 'tennis-match-calories-calculator',
    'badminton-calorie-burn-calculator', 'football-soccer-calories-calculator', 'basketball-calorie-burn-calculator',
    'yoga-vinyasa-calorie-calculator', 'pilates-reformer-calories-calculator', 'farmer-walk-load-calculator',

    // Women's Health, Pregnancy & Pediatrics (45+)
    'gestational-age-calculator', 'ivf-due-date-calculator', 'child-height-predictor-calculator',
    'pediatric-dosage-calculator', 'apgar-score-calculator', 'conception-date-from-due-date-calculator',
    'fetal-weight-hadlock-formula-calculator', 'crown-rump-length-crl-gestational-calculator', 'biparietal-diameter-bpd-gestational-calculator',
    'femur-length-fl-fetal-age-calculator', 'amniotic-fluid-index-afi-calculator', 'kick-counter-fetal-movement-timer',
    'contraction-interval-timer-calculator', 'basal-body-temperature-bbt-shift-calculator', 'cervical-mucus-fertility-index-calculator',
    'luteal-phase-defect-calculator', 'postpartum-calorie-needs-breastfeeding-calculator', 'breastmilk-daily-intake-by-baby-weight-calculator',
    'infant-formula-feed-volume-calculator', 'baby-weight-gain-percentile-who-calculator', 'baby-head-circumference-who-percentile-calculator',
    'baby-length-growth-who-percentile-calculator', 'toddler-calorie-macro-needs-calculator', 'child-daily-fluid-maintenance-holliday-segar-calculator',
    'pediatric-paracetamol-acetaminophen-dose-calculator', 'pediatric-ibuprofen-dose-by-weight-calculator', 'pediatric-amoxicillin-dose-calculator',
    'child-dehydration-clinical-score-calculator', 'bishop-score-labor-induction-calculator', 'baby-teething-milestone-calculator',
    'fetal-heart-rate-normal-calculator', 'hcg-doubling-time-pregnancy-calculator', 'gestational-diabetes-risk-calculator',
    'pediatric-weight-for-stature-who-calculator', 'child-immunization-vaccine-schedule-calculator',

    // Sleep, Longevity & Wellness (35+)
    'sleep-debt-calculator', 'biological-age-calculator', 'sweat-rate-hydration-calculator',
    'screen-time-rest-timer-calculator', 'deep-sleep-rem-percentage-calculator', 'sleep-efficiency-index-calculator',
    'circadian-melatonin-onset-calculator', 'morning-cortisol-awakening-response-calculator', 'optimal-nap-power-nap-duration-calculator',
    'blue-light-sleep-delay-calculator', 'sauna-session-calorie-cardio-calculator', 'cold-plunge-ice-bath-duration-calculator',
    'contrast-shower-recovery-calculator', 'mindful-breathing-4-7-8-timer-calculator', 'box-breathing-stress-relief-calculator',
    'daily-water-loss-respiratory-calculator', 'sweat-sodium-electrolyte-concentration-calculator', 'sun-exposure-vitamin-d-uv-index-calculator',
    'sunscreen-spf-reapplication-timer', 'posture-ergonomic-desk-height-calculator', 'standing-desk-ratio-calculator',
    'step-cadence-metabolic-equivalent-calculator', 'daily-caloric-balance-surplus-deficit-calculator', 'weight-loss-plateau-breaker-calculator',
    'body-recomposition-deficit-surplus-calculator', 'intermittent-calorie-restriction-calculator', 'life-expectancy-longevity-calculator',
    'resting-heart-rate-longevity-calculator', 'hrv-recovery-index-calculator',

    // Pet Health & Vet Tools (15+)
    'dog-calorie-calculator', 'cat-calorie-calculator', 'dog-age-calculator', 'cat-age-calculator',
    'horse-weight-calculator', 'puppy-adult-weight-predictor-calculator', 'kitten-growth-milestone-calculator',
    'dog-daily-water-intake-calculator', 'cat-hydration-water-need-calculator', 'pet-chocolate-toxicity-calculator',
    'pet-body-condition-score-bcs-calculator', 'dog-exercise-needs-by-breed-calculator',

    // Advanced Clinical & Body Composition Expansion
    'mifflin-st-jeor-bmr-calculator', 'harris-benedict-bmr-calculator', 'katch-mcardle-bmr-calculator',
    'schofield-bmr-calculator', 'cunningham-bmr-calculator', 'devine-ideal-weight-calculator',
    'robinson-ideal-weight-calculator', 'miller-ideal-weight-calculator', 'hamwi-ideal-weight-calculator',
    'broca-index-calculator', 'jackson-pollock-3-site-body-fat-calculator', 'jackson-pollock-7-site-body-fat-calculator',
    'durnin-womersley-body-fat-calculator', 'ymca-body-fat-calculator', 'boer-lean-body-mass-calculator',
    'james-lean-body-mass-calculator', 'hume-lean-body-mass-calculator', 'mosteller-bsa-calculator',
    'dubois-bsa-calculator', 'haycock-bsa-calculator', 'gehan-george-bsa-calculator', 'boyd-bsa-calculator',
    'asian-population-bmi-calculator', 'visceral-fat-level-calculator', 'relative-fat-mass-rfm-calculator',
    'body-adiposity-index-bai-calculator', 'coronary-heart-disease-risk-calculator', 'reynolds-cardiac-risk-calculator',
    'parkland-burn-fluid-calculator', 'brooke-burn-formula-calculator', 'wallace-rule-of-nines-burn-calculator',
    'centor-strep-throat-score-calculator', 'mcisaac-strep-score-calculator', 'ottawa-ankle-rule-calculator',
    'ottawa-knee-rule-calculator', 'perc-pulmonary-embolism-rule-calculator', 'geneva-score-pe-calculator',
    'ranson-pancreatitis-score-calculator', 'maddrey-discriminant-function-calculator', 'fib4-liver-fibrosis-calculator',
    'nafld-fibrosis-score-calculator', 'apri-liver-score-calculator', 'meld-na-liver-calculator',
    'egfr-mdrd-formula-calculator', 'egfr-ckdepi-2021-calculator', 'refeeding-syndrome-risk-calculator',
    'absolute-eosinophil-count-calculator', 'absolute-lymphocyte-count-calculator', 'platelet-lymphocyte-ratio-plr-calculator',
    'hscrp-cardiac-inflammation-calculator', 'fgir-glucose-insulin-ratio-calculator', 'castelli-risk-index-2-calculator',
    'calcium-phosphate-product-calculator', 'fridericia-qtc-calculator', 'framingham-qtc-calculator',
    'resting-heart-rate-recovery-2min-calculator', 'sdnn-hrv-calculator', 'rmssd-hrv-calculator',
    'fetal-biometry-hadlock-calculator', 'amniotic-fluid-single-deepest-pocket-calculator', 'kick-count-cardiff-count-to-ten-calculator',
    'fetal-circulation-resistance-index-calculator', 'pediatric-blood-pressure-percentile-calculator', 'pediatric-gcs-score-calculator',
    'pediatric-endotracheal-tube-size-calculator', 'pediatric-maintenance-fluids-calculator', 'water-deficit-correction-calculator',
    'burn-resuscitation-hourly-rate-calculator', 'body-recomposition-protein-target-calculator', 'endurance-carb-loading-calculator',
    'intra-workout-electrolyte-calculator', 'pre-workout-hydration-timing-calculator', 'post-workout-glycogen-recovery-calculator',
    'sauna-heat-tolerance-calculator', 'ice-bath-temperature-time-curve-calculator', 'vo2-max-rowing-ergometer-calculator',
    'vo2-max-step-test-calculator', 'treadmill-incline-met-calculator', 'running-power-stryd-calculator',
    // Additional Clinical, Medical & Diagnostics (70+)
    'curb-65-score-calculator', 'alvarado-score-calculator', 'glasgow-coma-scale-calculator',
    'nihss-calculator', 'chads2-score-calculator', 'has-bled-calculator', 'meld-calculator',
    'child-pugh-calculator', 'anion-gap-metabolic-calculator', 'qtc-bazett-calculator',
    'qtc-fridericia-calculator', 'wells-dvt-calculator', 'wells-pe-calculator',
    'perc-rule-calculator', 'geneva-pe-calculator', 'ranson-criteria-calculator',
    'maddrey-score-calculator', 'fib-4-index-calculator', 'nafld-score-calculator',
    'apri-score-calculator', 'ckd-epi-gfr-calculator', 'mdrd-gfr-calculator',
    'cockcroft-gault-calculator', 'fena-calculator', 'feurea-calculator',
    'calcium-correction-calculator', 'sodium-correction-calculator', 'water-deficit-calculator',
    'winter-formula-calculator', 'delta-gap-calculator', 'ganzoni-formula-calculator',
    'mentzer-index-calculator', 'nlr-ratio-calculator', 'plr-ratio-calculator',
    'hscrp-risk-calculator', 'homa-ir-index-calculator', 'quicki-index-calculator',
    'tyg-index-calculator', 'aip-index-calculator', 'castelli-index-calculator',
    'de-ritis-ratio-calculator', 'framingham-risk-score-calculator', 'ascvd-risk-score-calculator',
    'cac-score-calculator', 'heart-age-risk-calculator', 'parkland-formula-calculator',
    'brooke-formula-calculator', 'rule-of-nines-calculator', 'centor-score-calculator',
    'mcisaac-score-calculator', 'ottawa-ankle-calculator', 'ottawa-knee-calculator',
    'bishop-score-calculator', 'apgar-newborn-calculator', 'child-height-tanner-calculator',
    'pediatric-fluid-holliday-calculator', 'pediatric-paracetamol-calculator', 'pediatric-ibuprofen-calculator',
    'pediatric-amoxicillin-calculator', 'gorelick-dehydration-calculator', 'who-infant-weight-calculator',
    'who-infant-length-calculator', 'who-infant-head-circumference-calculator', 'fetal-weight-hadlock-calculator',
    'fetal-biometry-crl-calculator', 'fetal-biometry-bpd-calculator', 'fetal-biometry-fl-calculator',
    'fetal-biometry-ac-calculator', 'amniotic-fluid-afi-calculator', 'amniotic-fluid-sdp-calculator',
    'kick-count-timer-calculator', 'contraction-timer-511-calculator', 'bbt-ovulation-shift-calculator',
    'cervical-mucus-billings-calculator', 'luteal-phase-calculator', 'breastfeeding-calorie-calculator',
    'breastmilk-intake-calculator', 'infant-formula-volume-calculator', 'toddler-nutrition-calculator',

    // Specific Sports, Workouts & Fitness (50+)
    'tennis-calorie-burn-calculator', 'badminton-calorie-calculator', 'soccer-football-calorie-calculator',
    'basketball-calorie-calculator', 'volleyball-calorie-burn-calculator', 'table-tennis-calorie-calculator',
    'squash-calorie-burn-calculator', 'golf-walking-calorie-calculator', 'hiking-trail-calorie-calculator',
    'rock-climbing-bouldering-calculator', 'kayaking-rowing-calorie-calculator', 'paddleboarding-sup-calorie-calculator',
    'surfing-water-calorie-calculator', 'skiing-downhill-calorie-calculator', 'snowboarding-calorie-calculator',
    'ice-skating-calorie-calculator', 'rollerblading-inline-skate-calculator', 'skateboarding-calorie-calculator',
    'martial-arts-taekwondo-karate-calculator', 'boxing-sparring-calorie-calculator', 'kickboxing-hiit-calorie-calculator',
    'judo-grappling-calorie-calculator', 'bjj-jiu-jitsu-calorie-calculator', 'zumba-dance-calorie-calculator',
    'aerobics-step-calorie-calculator', 'pilates-mat-reformer-calculator', 'yoga-hatha-vinyasa-calculator',
    'hot-yoga-bikram-calorie-calculator', 'trampoline-rebounding-calorie-calculator', 'kettlebell-complex-calorie-calculator',
    'battle-ropes-calorie-calculator', 'sled-prowler-push-work-calculator', 'farmer-carry-work-calculator',
    'sandbag-carry-calorie-calculator', 'tire-flip-power-calorie-calculator', 'assault-bike-rpm-watts-calculator',
    'rowing-ergometer-split-calculator', 'ski-erg-pace-calculator', 'stairmaster-floors-climbed-calculator',
    'elliptical-trainer-calories-calculator', 'treadmill-met-speed-grade-calculator', 'crossfit-murph-time-calculator',
    'crossfit-fran-wod-calculator', 'crossfit-cindy-rounds-calculator', 'barbell-hip-thrust-max-calculator',
    'leg-press-1rm-calculator', 'lat-pulldown-max-calculator', 'seated-cable-row-max-calculator',
    'romanian-deadlift-rdl-max-calculator', 'overhead-tricep-extension-max-calculator', 'barbell-bicep-curl-max-calculator',

    // Nutrition, Diets, Longevity & Hydration (40+)
    'glycemic-index-meal-calculator', 'net-carbs-fiber-sugar-calculator', 'protein-biological-value-calculator',
    'pdcaas-protein-quality-calculator', 'collagen-peptides-daily-dose-calculator', 'glutamine-recovery-dose-calculator',
    'bcaa-leucine-threshold-calculator', 'creatine-loading-maintenance-calculator', 'carnitine-supplement-dose-calculator',
    'taurine-energy-dose-calculator', 'vitamin-a-retinol-rda-calculator', 'vitamin-d3-k2-ratio-calculator',
    'vitamin-e-tocopherol-rda-calculator', 'vitamin-k-blood-clotting-calculator', 'vitamin-b-complex-rda-calculator',
    'vitamin-b12-methylcobalamin-calculator', 'folic-acid-pregnancy-dose-calculator', 'elemental-iron-dosage-calculator',
    'elemental-zinc-daily-limit-calculator', 'elemental-magnesium-dose-calculator', 'calcium-elemental-dose-calculator',
    'potassium-to-sodium-ratio-calculator', 'omega-3-index-dha-epa-calculator', 'choline-intake-brain-calculator',
    'iodine-daily-safe-limit-calculator', 'selenium-antioxidant-intake-calculator', 'chromium-picolinate-glucose-calculator',
    'coq10-ubiquinol-daily-dose-calculator', 'berberine-glucose-metabolism-calculator', 'ashwagandha-withanolides-dose-calculator',
    'turmeric-curcumin-piperine-calculator', 'melatonin-sleep-timing-calculator', 'l-theanine-caffeine-synergy-calculator',
    'gaba-relaxation-dose-calculator', 'electrolyte-hydration-solution-who-calculator', 'sweat-electrolyte-loss-hourly-calculator',
    'cold-plunge-recovery-curve-calculator', 'infrared-sauna-longevity-calculator', 'box-breathing-stress-cycle-calculator',
    'pranayama-478-breathing-calculator', 'blue-light-circadian-delay-calculator'
];

masterHealthSlugs.forEach(slug => {
    if (!calculators[slug]) {
        const readable = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            .replace(/Bmi/i, 'BMI').replace(/Bmr/i, 'BMR').replace(/Tdee/i, 'TDEE').replace(/Vo2/i, 'VO2')
            .replace(/Rer/i, 'RER').replace(/Mer/i, 'MER').replace(/1rm/i, '1RM').replace(/Map/i, 'MAP')
            .replace(/Hba1c/i, 'HbA1c').replace(/Ckd/i, 'CKD').replace(/Egfr/i, 'eGFR').replace(/Ldl/i, 'LDL')
            .replace(/Hdl/i, 'HDL').replace(/Ipf/i, 'IPF').replace(/Ffmi/i, 'FFMI').replace(/Met/i, 'MET')
            .replace(/Aha/i, 'AHA').replace(/Who/i, 'WHO').replace(/Rda/i, 'RDA').replace(/Iu/i, 'IU')
            .replace(/Uv/i, 'UV').replace(/Ivf/i, 'IVF').replace(/Spf/i, 'SPF').replace(/Ascvd/i, 'ASCVD')
            .replace(/Meld/i, 'MELD').replace(/Sofa/i, 'SOFA').replace(/Curb/i, 'CURB').replace(/Qsofa/i, 'qSOFA')
            .replace(/Nihss/i, 'NIHSS').replace(/Apgar/i, 'APGAR').replace(/Crp/i, 'CRP').replace(/Hrv/i, 'HRV');

        let cat = 'diet-nutrition';
        let icon = '🥗';

        if (slug.includes('score') || slug.includes('risk') || slug.includes('glucose') || slug.includes('insulin') || slug.includes('blood') || slug.includes('renal') || slug.includes('kidney') || slug.includes('ratio') || slug.includes('anemia') || slug.includes('pressure') || slug.includes('cholesterol') || slug.includes('heart') || slug.includes('iron') || slug.includes('gfr')) {
            cat = 'medical-clinical';
            icon = '🩺';
        } else if (slug.includes('run') || slug.includes('max') || slug.includes('workout') || slug.includes('squat') || slug.includes('bench') || slug.includes('cycling') || slug.includes('jump') || slug.includes('pace') || slug.includes('swim') || slug.includes('power') || slug.includes('agility') || slug.includes('calorie-burn') || slug.includes('wod') || slug.includes('exercise')) {
            cat = 'fitness-workouts';
            icon = '🏋️‍♂️';
        } else if (slug.includes('pregnancy') || slug.includes('baby') || slug.includes('child') || slug.includes('infant') || slug.includes('pediatric') || slug.includes('fetal') || slug.includes('fertility') || slug.includes('due-date') || slug.includes('breastfeeding') || slug.includes('toddler')) {
            cat = 'pregnancy-pediatrics';
            icon = '👶';
        } else if (slug.includes('sleep') || slug.includes('nap') || slug.includes('age') || slug.includes('sauna') || slug.includes('sun') || slug.includes('breathing') || slug.includes('eye') || slug.includes('longevity')) {
            cat = 'sleep-wellness';
            icon = '😴';
        } else if (slug.includes('water') || slug.includes('sweat') || slug.includes('hydration') || slug.includes('fluid') || slug.includes('steps')) {
            cat = 'hydration-lifestyle';
            icon = '💧';
        } else if (slug.includes('dog') || slug.includes('cat') || slug.includes('horse') || slug.includes('pet') || slug.includes('puppy') || slug.includes('kitten')) {
            cat = 'pet-health';
            icon = '🐾';
        } else if (slug.includes('body') || slug.includes('mass') || slug.includes('fat') || slug.includes('weight') || slug.includes('leanness') || slug.includes('frame')) {
            cat = 'body-composition';
            icon = '⚖️';
        }

        calculators[slug] = {
            title: `${readable} Calculator`,
            category: cat,
            icon: icon,
            description: `Calculate and evaluate ${readable} using evidence-based medical and physiological algorithms.`,
            tags: [readable.split(' ')[0], categoryMeta[cat]?.name || 'Health']
        };
    }
});

module.exports = {
    categoryMeta,
    calculators
};
