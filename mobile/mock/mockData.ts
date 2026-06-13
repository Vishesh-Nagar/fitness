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

// ─── Dummy AI recommendations ─────────────────────────────────────────────────
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
      'Overall: Excellent 50-minute ride covering 18.4 km with 312 m of elevation gain.\n\nPace: 22 km/h average on a hilly route is commendable.\n\nHeart Rate: Not recorded this session — consider using a heart rate monitor on hilly rides.\n\nCalories: 510 kcal is high and accurate given the elevation demand.',
    improvements: [
      'Cadence: Target 80–100 RPM on flat sections.',
      'Nutrition: For rides over 45 min with elevation, consume 30–40g of carbs mid-ride.',
      'Position: Check saddle height — knee should have a slight 25–35° bend at the bottom.',
    ],
    suggestions: [
      'Flat Endurance Ride: 60–70 min flat ride at 75% effort to build base.',
      'Hill Repeats: 5× short 2-minute climbs at maximum effort to build leg strength.',
    ],
    safety: [
      'Always wear a helmet, even on solo rides.',
      'Check tyre pressure before every ride.',
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
      'Overall: A strong 60-minute chest, shoulders, and triceps session with 18 sets and 144 total reps.\n\nPace: Rest periods appear adequate given the rep count.\n\nHeart Rate: Weight training typically keeps HR at 60–70% max.\n\nCalories: 420 kcal for a 60-min weight session is above average.',
    improvements: [
      'Progressive Overload: Track your weights and aim to add 2.5 kg every 2 weeks.',
      'Mind-Muscle Connection: Slow down the eccentric phase to 3–4 seconds.',
      'Balance: Add a pulling movement to counterbalance the push-heavy session.',
    ],
    suggestions: [
      'Back & Biceps: Follow this push session with a pull day tomorrow.',
      'Active Recovery: Light stretching or 20 min of walking the day after.',
    ],
    safety: [
      'Never skip a warm-up set — start with 50% of working weight for 12–15 reps.',
      'Use a spotter or safety bars when benching near your maximum.',
      'Stop immediately if you feel sharp joint pain.',
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-004',
    activityId: 'act-004',
    userId: 'user-001',
    activityType: 'SWIMMING',
    recommendation:
      'Overall: 32 freestyle laps in a 25m pool over 40 minutes equals 800m total.\n\nPace: An average of ~1:15 per 50m is a good recreational pace.\n\nHeart Rate: Swimming keeps HR 10–15 bpm lower than equivalent land exercise.\n\nCalories: 350 kcal is accurate for 800m freestyle.',
    improvements: [
      'Breathing Pattern: Practice bilateral breathing (every 3 strokes).',
      'Flip Turns: Add proper flip turns at the wall.',
      'Distance: Gradually increase to 1000m then 1500m over the next 4–6 weeks.',
    ],
    suggestions: [
      'Drill Day: Dedicate one swim session per week to drills.',
      'Mixed Stroke: Try alternating freestyle and backstroke laps.',
    ],
    safety: [
      'Never swim alone in open water without a buddy or safety buoy.',
      'Shower before entering the pool.',
      'If you feel dizzy underwater, stop and rest at the wall immediately.',
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-005',
    activityId: 'act-005',
    userId: 'user-001',
    activityType: 'YOGA',
    recommendation:
      'Overall: A 45-minute self-guided Vinyasa session with 24 poses.\n\nPace: 24 poses in 45 minutes is a moderate flow pace.\n\nHeart Rate: Vinyasa can elevate HR to 50–60% max.\n\nCalories: 180 kcal is appropriate for this style.',
    improvements: [
      'Breath Awareness: Focus on ujjayi breathing throughout.',
      'Core Engagement: Actively draw navel to spine in standing poses.',
      'Consistency: Aim for 3–4 sessions per week.',
    ],
    suggestions: [
      'Yin Yoga: Add one 30-minute yin session per week.',
      'Morning Flow: A 10-minute sun salutation sequence after waking.',
    ],
    safety: [
      'Never force your body into a pose.',
      'Use props (blocks, straps) freely.',
      'Stay hydrated before and after yoga.',
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-006',
    activityId: 'act-006',
    userId: 'user-001',
    activityType: 'HIIT',
    recommendation:
      'Overall: 25-minute HIIT — 5 rounds with 30-second rest periods and a peak heart rate of 182 bpm.\n\nPace: 5 rounds in 25 minutes with minimal rest is aggressive.\n\nHeart Rate: 182 bpm is extremely high — ensure this is your ceiling for effort.\n\nCalories: 310 kcal in 25 minutes is outstanding.',
    improvements: [
      'Recovery Time: Extend rest to 45 seconds between rounds.',
      'Movement Variety: Rotate exercises weekly to prevent adaptation.',
      'Frequency Cap: Limit true HIIT sessions to 2–3 per week maximum.',
    ],
    suggestions: [
      'Moderate Cardio: Follow this session with a 30-min steady-state run 48 hours later.',
      'Strength Superset: Try combining HIIT with bodyweight strength.',
    ],
    safety: [
      'Given the 182 bpm peak, consult a doctor if you experience chest tightness.',
      'Always cool down for 5+ minutes after HIIT.',
      'HIIT is not appropriate if you are ill or sleep-deprived.',
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-007',
    activityId: 'act-007',
    userId: 'user-001',
    activityType: 'WALKING',
    recommendation:
      'Overall: A 55-minute park trail walk covering 5.5 km with 7,200 steps.\n\nPace: Your average pace of ~10 min/km is a comfortable recreational walk.\n\nHeart Rate: Not recorded.\n\nCalories: 210 kcal across 5.5 km is accurate.',
    improvements: [
      'Pace: Try power walking intervals.',
      'Distance: Add 500m per week to build to a 7–8 km comfortable walk.',
      'Posture: Keep shoulders relaxed and gaze forward.',
    ],
    suggestions: [
      'Weighted Walk: Try a 20–30 min walk with a light backpack.',
      'Nature Immersion: Walk in a natural setting 3–4 times per week.',
    ],
    safety: [
      'Wear appropriate trail footwear with ankle support.',
      'Carry water on walks over 40 minutes.',
      'Inform someone of your trail route when walking alone.',
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-008',
    activityId: 'act-008',
    userId: 'user-001',
    activityType: 'CARDIO',
    recommendation:
      'Overall: 30 minutes on the elliptical at resistance Level 6 with an average heart rate of 145 bpm.\n\nPace: Level 6 is a moderate challenge.\n\nHeart Rate: 145 bpm sits at approximately 75% of estimated max.\n\nCalories: 290 kcal for 30 minutes on the elliptical at this resistance is strong.',
    improvements: [
      'Interval Mode: Use the elliptical\'s interval program.',
      'Arm Engagement: Push and pull the handles actively.',
      'Duration: Progress toward 40–45 minute sessions over the next 3–4 weeks.',
    ],
    suggestions: [
      'Cross-Train: Swap one elliptical session per week for rowing.',
      'Outdoor Cardio: Complement machine cardio with outdoor cycling.',
    ],
    safety: [
      'Do not hold onto the stationary handrails.',
      'Ensure the foot pedals are properly secured before starting.',
      'If you feel knee pain, reduce resistance and check your stride length.',
    ],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
];
