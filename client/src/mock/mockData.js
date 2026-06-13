// ─── Dummy users ──────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  {
    id: 'user-001',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
    password: 'password123',
    token: 'mock-jwt-token-alex-001',
  },
  {
    id: 'user-002',
    firstName: 'Jordan',
    lastName: 'Lee',
    email: 'jordan@example.com',
    password: 'password123',
    token: 'mock-jwt-token-jordan-002',
  },
];

// ─── Dummy activities ─────────────────────────────────────────────────────────
export const MOCK_ACTIVITIES = [
  {
    id: 'act-001',
    userId: 'user-001',
    type: 'RUNNING',
    duration: 35,
    caloriesBurned: 380,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { pace: '5:42 min/km', distance: '6.1 km', heartRate: '158 bpm' },
  },
  {
    id: 'act-002',
    userId: 'user-001',
    type: 'CYCLING',
    duration: 50,
    caloriesBurned: 510,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { distance: '18.4 km', avgSpeed: '22 km/h', elevation: '312 m' },
  },
  {
    id: 'act-003',
    userId: 'user-001',
    type: 'WEIGHT_TRAINING',
    duration: 60,
    caloriesBurned: 420,
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { sets: '18', reps: '144', muscleGroups: 'Chest, Shoulders, Triceps' },
  },
  {
    id: 'act-004',
    userId: 'user-001',
    type: 'SWIMMING',
    duration: 40,
    caloriesBurned: 350,
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { laps: '32', stroke: 'Freestyle', poolLength: '25 m' },
  },
  {
    id: 'act-005',
    userId: 'user-001',
    type: 'YOGA',
    duration: 45,
    caloriesBurned: 180,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { style: 'Vinyasa', poses: '24', instructor: 'Self-guided' },
  },
  {
    id: 'act-006',
    userId: 'user-001',
    type: 'HIIT',
    duration: 25,
    caloriesBurned: 310,
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { rounds: '5', restPeriod: '30 s', maxHeartRate: '182 bpm' },
  },
  {
    id: 'act-007',
    userId: 'user-001',
    type: 'WALKING',
    duration: 55,
    caloriesBurned: 210,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 9 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { steps: '7200', distance: '5.5 km', terrain: 'Park trail' },
  },
  {
    id: 'act-008',
    userId: 'user-001',
    type: 'CARDIO',
    duration: 30,
    caloriesBurned: 290,
    startTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    additionalMetrics: { equipment: 'Elliptical', resistance: 'Level 6', avgHeartRate: '145 bpm' },
  },
];

// ─── Dummy AI recommendations (one per activity) ──────────────────────────────
export const MOCK_RECOMMENDATIONS = [
  {
    id: 'rec-001',
    activityId: 'act-001',
    userId: 'user-001',
    activityType: 'RUNNING',
    recommendation:
      'Overall: Solid 35-minute run at a 5:42 min/km pace — right in your aerobic sweet spot. Your heart rate of 158 bpm indicates a strong cardiovascular effort without crossing into the red zone.\n\nPace: Your pace is consistent with your recent PRs. Maintaining sub-6:00 min/km across 6+ km shows excellent endurance base.\n\nHeart Rate: 158 bpm is 82% of estimated max — ideal for aerobic base building. No signs of overexertion.\n\nCalories: 380 kcal burned is above average for this distance, suggesting good muscle engagement throughout.',
    improvements: [
      'Cadence: Aim for 170–180 steps per minute to reduce ground contact time and lower injury risk.',
      'Warm-up: Add a 5-minute dynamic warm-up with leg swings and high knees before your run.',
      'Progression: Increase your weekly mileage by no more than 10% to safely build endurance.',
    ],
    suggestions: [
      'Recovery Run: Easy 20–25 min jog at conversational pace tomorrow to flush lactic acid.',
      'Interval Training: Try 6×400m repeats at 5:00 min/km pace with 90-second rest to build speed.',
    ],
    safety: [
      'Always warm up for at least 5 minutes before running at pace.',
      'Drink 400–600 ml of water in the hour before your run.',
      'Replace running shoes every 500–800 km to avoid joint stress.',
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-002',
    activityId: 'act-002',
    userId: 'user-001',
    activityType: 'CYCLING',
    recommendation:
      'Overall: Excellent 50-minute ride covering 18.4 km with 312 m of elevation gain — this is a challenging session that goes well beyond flat cycling.\n\nPace: 22 km/h average on a hilly route is commendable. On flat terrain you likely exceeded 27–28 km/h.\n\nHeart Rate: Not recorded this session — consider using a heart rate monitor on hilly rides to avoid overexertion on climbs.\n\nCalories: 510 kcal is high and accurate given the elevation demand — your legs did serious work.',
    improvements: [
      'Cadence: Target 80–100 RPM on flat sections; lower cadence on climbs is fine but monitor knee strain.',
      'Nutrition: For rides over 45 min with elevation, consume 30–40g of carbs mid-ride to sustain output.',
      'Position: Check saddle height — knee should have a slight 25–35° bend at the bottom of the pedal stroke.',
    ],
    suggestions: [
      'Flat Endurance Ride: 60–70 min flat ride at 75% effort to build base without joint stress.',
      'Hill Repeats: 5× short 2-minute climbs at maximum effort to build leg strength specifically for elevation.',
    ],
    safety: [
      'Always wear a helmet, even on solo rides.',
      'Check tyre pressure before every ride — aim for 80–100 PSI for road cycling.',
      'After rides with significant elevation, stretch your hip flexors and quads thoroughly.',
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-003',
    activityId: 'act-003',
    userId: 'user-001',
    activityType: 'WEIGHT_TRAINING',
    recommendation:
      'Overall: A strong 60-minute chest, shoulders, and triceps session with 18 sets and 144 total reps. Volume is high — this is a hypertrophy-focused session.\n\nPace: Rest periods appear adequate given the rep count. Ensure 60–90 seconds between sets for hypertrophy and 2–3 minutes for strength work.\n\nHeart Rate: Weight training typically keeps HR at 60–70% max — your calorie burn of 420 kcal suggests good intensity.\n\nCalories: 420 kcal for a 60-min weight session is above average — compound movements like bench and overhead press are driving this.',
    improvements: [
      'Progressive Overload: Track your weights session-to-session and aim to add 2.5 kg every 2 weeks on key lifts.',
      'Mind-Muscle Connection: Slow down the eccentric (lowering) phase to 3–4 seconds for better muscle fibre recruitment.',
      'Balance: Add a pulling movement (rows, pull-ups) to counterbalance the push-heavy session and protect shoulder health.',
    ],
    suggestions: [
      'Back & Biceps: Follow this push session with a pull day tomorrow — rows, pull-downs, and curls.',
      'Active Recovery: Light stretching or 20 min of walking the day after to reduce delayed onset muscle soreness.',
    ],
    safety: [
      'Never skip a warm-up set — start with 50% of working weight for 12–15 reps.',
      'Use a spotter or safety bars when benching near your maximum.',
      'Stop immediately if you feel sharp joint pain, especially in shoulders or elbows.',
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-004',
    activityId: 'act-004',
    userId: 'user-001',
    activityType: 'SWIMMING',
    recommendation:
      'Overall: 32 freestyle laps in a 25m pool over 40 minutes equals 800m total — a solid aerobic swim session. Freestyle is the most efficient stroke for calorie burn and cardiovascular conditioning.\n\nPace: An average of ~1:15 per 50m is a good recreational pace. Competitive swimmers target sub-1:00 per 50m for reference.\n\nHeart Rate: Swimming keeps HR 10–15 bpm lower than equivalent land exercise due to the horizontal position and water cooling.\n\nCalories: 350 kcal is accurate for 800m freestyle — water resistance dramatically increases energy expenditure.',
    improvements: [
      'Breathing Pattern: Practice bilateral breathing (every 3 strokes) to improve symmetry and oxygen efficiency.',
      'Flip Turns: Add proper flip turns at the wall — they save 2–3 seconds per 50m and build explosive leg power.',
      'Distance: Gradually increase to 1000m then 1500m over the next 4–6 weeks to build endurance.',
    ],
    suggestions: [
      'Drill Day: Dedicate one swim session per week to drills (catch-up, fingertip drag) to refine stroke technique.',
      'Mixed Stroke: Try alternating freestyle and backstroke laps to engage different muscle groups and reduce monotony.',
    ],
    safety: [
      'Never swim alone in open water without a buddy or safety buoy.',
      'Shower before entering the pool to maintain water hygiene for all swimmers.',
      'If you feel dizzy or short of breath underwater, stop and rest at the wall immediately.',
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-005',
    activityId: 'act-005',
    userId: 'user-001',
    activityType: 'YOGA',
    recommendation:
      'Overall: A 45-minute self-guided Vinyasa session with 24 poses is excellent for mobility, mental clarity, and active recovery. Vinyasa is a flow-based practice that links breath with movement.\n\nPace: 24 poses in 45 minutes is a moderate flow pace — roughly 1 pose per 1:45 min including transitions. This leaves adequate time for proper alignment.\n\nHeart Rate: Vinyasa can elevate HR to 50–60% max, making it an ideal active recovery or complement to high-intensity days.\n\nCalories: 180 kcal is appropriate for this style — yoga prioritises flexibility and mindfulness over calorie burn.',
    improvements: [
      'Breath Awareness: Focus on ujjayi (ocean) breathing throughout — audible inhale and exhale through the nose with slight throat constriction.',
      'Core Engagement: Actively draw navel to spine in standing poses to protect your lower back and deepen the practice.',
      'Consistency: Yoga benefits compound — aim for 3–4 sessions per week to see meaningful flexibility improvements within 6–8 weeks.',
    ],
    suggestions: [
      'Yin Yoga: Add one 30-minute yin session per week — holding poses for 3–5 minutes targets deep connective tissue.',
      'Morning Flow: A 10-minute sun salutation sequence after waking improves joint mobility throughout the day.',
    ],
    safety: [
      'Never force your body into a pose — discomfort is okay, sharp pain is a stop signal.',
      'Use props (blocks, straps) freely — they are tools for proper alignment, not signs of weakness.',
      'Stay hydrated before and after yoga even though you may not feel thirsty during practice.',
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-006',
    activityId: 'act-006',
    userId: 'user-001',
    activityType: 'HIIT',
    recommendation:
      'Overall: A brutal and highly effective 25-minute HIIT session — 5 rounds with 30-second rest periods and a peak heart rate of 182 bpm. This is close to your estimated maximum, indicating true high-intensity effort.\n\nPace: 5 rounds in 25 minutes with minimal rest is aggressive. Your work-to-rest ratio appears close to 1:0.5, which is optimal for metabolic conditioning.\n\nHeart Rate: 182 bpm is extremely high — ensure this is your ceiling for effort and avoid exceeding it regularly to reduce cardiac stress.\n\nCalories: 310 kcal in 25 minutes is outstanding — HIIT generates significant post-exercise oxygen consumption (EPOC), meaning you continue burning calories for hours after.',
    improvements: [
      'Recovery Time: Extend rest to 45 seconds between rounds — this allows more complete recovery and lets you maintain higher quality work intervals.',
      'Movement Variety: Rotate exercises weekly (burpees, jump squats, mountain climbers) to prevent adaptation and overuse injuries.',
      'Frequency Cap: Limit true HIIT sessions to 2–3 per week maximum — full recovery requires 48 hours between sessions.',
    ],
    suggestions: [
      'Moderate Cardio: Follow this session with a 30-min steady-state run or cycle at 65% effort 48 hours later.',
      'Strength Superset: Try combining HIIT with bodyweight strength (push-up, squat, plank) for metabolic resistance training.',
    ],
    safety: [
      'Given the 182 bpm peak, consult a doctor before continuing if you experience chest tightness or dizziness.',
      'Always cool down for 5+ minutes after HIIT — abrupt stops can cause blood pooling and lightheadedness.',
      'HIIT is not appropriate if you are ill, sleep-deprived, or have not eaten for 4+ hours.',
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-007',
    activityId: 'act-007',
    userId: 'user-001',
    activityType: 'WALKING',
    recommendation:
      'Overall: A 55-minute park trail walk covering 5.5 km with 7,200 steps is excellent for cardiovascular health, mental well-being, and active recovery. Walking on uneven terrain engages stabiliser muscles more than pavement.\n\nPace: Your average pace of ~10 min/km is a comfortable recreational walk. A brisk walk is 8–9 min/km and burns significantly more calories.\n\nHeart Rate: Not recorded — for weight management benefits, target 50–60% of max heart rate, which you likely achieved on trail terrain.\n\nCalories: 210 kcal across 5.5 km is accurate — trail walking burns ~10–15% more than flat pavement due to variable terrain.',
    improvements: [
      'Pace: Try power walking intervals — alternate 3 minutes brisk (arms pumping) with 2 minutes easy — to elevate HR and calorie burn.',
      'Distance: Add 500m per week to build to a 7–8 km comfortable walk over the next month.',
      'Posture: Keep shoulders relaxed, core slightly engaged, and gaze forward rather than at the ground.',
    ],
    suggestions: [
      'Weighted Walk: Try a 20–30 min walk with a light backpack (5–7 kg) to increase calorie burn without impacting joints.',
      'Nature Immersion: Walk in a natural setting 3–4 times per week — research shows 90 minutes of nature walking reduces stress hormones measurably.',
    ],
    safety: [
      'Wear appropriate trail footwear with ankle support on uneven terrain.',
      'Carry water on walks over 40 minutes, especially in warm weather.',
      'Inform someone of your trail route and expected return time when walking alone.',
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-008',
    activityId: 'act-008',
    userId: 'user-001',
    activityType: 'CARDIO',
    recommendation:
      'Overall: 30 minutes on the elliptical at resistance Level 6 with an average heart rate of 145 bpm is a textbook moderate-intensity cardio session — well within the fat-burning and cardiovascular improvement zones.\n\nPace: Elliptical resistance Level 6 is a moderate challenge — your sustained effort over 30 minutes without breaks suggests good cardiovascular base fitness.\n\nHeart Rate: 145 bpm sits at approximately 75% of estimated max — this is the upper end of the moderate zone, highly effective for cardiovascular adaptation.\n\nCalories: 290 kcal for 30 minutes on the elliptical at this resistance is strong — the dual-action arm handles increase upper body engagement.',
    improvements: [
      'Interval Mode: Use the elliptical\'s interval program — alternate 2 min at Level 8 with 1 min at Level 4 to increase calorie burn by ~20%.',
      'Arm Engagement: Push and pull the handles actively rather than resting your hands — this turns it into a full-body workout.',
      'Duration: Progress toward 40–45 minute sessions over the next 3–4 weeks as your fitness adapts.',
    ],
    suggestions: [
      'Cross-Train: Swap one elliptical session per week for rowing — it demands more core and back engagement.',
      'Outdoor Cardio: Complement machine cardio with outdoor cycling or brisk walking for functional fitness benefits.',
    ],
    safety: [
      'Do not hold onto the stationary handrails — this reduces calorie burn and puts unnatural stress on wrists.',
      'Ensure the foot pedals are properly secured before starting each session.',
      'If you feel knee pain during elliptical use, reduce resistance and check your stride length setting.',
    ],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
];
