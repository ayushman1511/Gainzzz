/* --- CORE APP STATE --- */
const state = {
    screen: 'screen-splash',
    theme: 'dark',
    level: 1,
    xp: 0,
    maxXp: 1000,
    streak: 1,
    calories: 0,
    water: 0.0,
    stats: { str: 10, agi: 8, stm: 12, int: 6 },
    character: 'Shadow Monarch',
    rank: 'S',
    rankTitle: 'S-Rank Shadow Assassin',
    favAnime: 'Solo Leveling',
    favCharacter: 'Sung Jin-Woo',
    motivationType: 'intense',
    experienceTier: 'new',
    bodyGoal: 'lean',
    fightingStyle: 'shadow',
    unlockedAchievements: 0,
    missions: [],
    achievementsList: [
        { id: 'first_directive', title: 'System Boot', desc: 'Sync your neural link for the first time.', icon: 'sync', unlocked: false },
        { id: 'hydration_max', title: 'Elixir Drinker', desc: 'Consume 2.0L of water in a single sync loop.', icon: 'water_drop', unlocked: false },
        { id: 'streak_five', title: 'Iron Mindset', desc: 'Maintain a 5-day active workout sync.', icon: 'bolt', unlocked: false },
        { id: 'all_missions', title: 'Monarch Clear', desc: 'Complete all daily fitness directives.', icon: 'checklist', unlocked: false },
        { id: 'limit_break_one', title: 'Limit Shattered', desc: 'Engage evolution transformation protocol.', icon: 'rocket_launch', unlocked: false },
        { id: 's_rank_clear', title: 'National Level', desc: 'Ascend to Level 10 protagonist scale.', icon: 'workspace_premium', unlocked: false }
    ],
    // Tailored motivators
    quotes: {
        'Sung Jin-Woo': [
            { text: "Your strength doesn't come from doing nothing. Wake up, push the weights. Stop staying weak.", author: "Sung Jin-Woo" },
            { text: "System Warning: If you miss today's training, the penalty quest will engage. Choose movement.", author: "System Protocol" }
        ],
        'Goku': [
            { text: "I want to see how strong I can get in real life! Let's train harder than yesterday!", author: "Goku" },
            { text: "Every pushup, every squat makes you ready to fight the strongest adversaries. Go beyond!", author: "Goku" }
        ],
        'Levi Ackerman': [
            { text: "Clean your mind, discipline your body. The only thing we are allowed to do is make choices we won't regret.", author: "Levi Ackerman" },
            { text: "No excuses. Your lack of stamina is a liability in the scout regiment. Finish your run.", author: "Levi Ackerman" }
        ],
        'Isagi Yoichi': [
            { text: "Metavision engaged. I can see the path to my evolution. Completing these squats is the only key.", author: "Isagi Yoichi" },
            { text: "If you don't fight for your own evolution, you'll remain a side character forever. Devour your limits!", author: "Isagi Yoichi" }
        ],
        'generic': [
            { text: "Today you write your own training arc. Complete the missions or remain behind.", author: "System Guide" },
            { text: "Pain is temporary. Your level up is permanent. Ascend your limits now.", author: "Protagonist Will" }
        ]
    }
};

/* --- WEB AUDIO SYNTHESIZER --- */
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 1. Cyber Tick Click
function playClickSound() {
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitched A5
        osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) { console.warn("Audio failure:", e); }
}

// 2. Screen Transition Whoosh
function playWhooshSound() {
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.35);
        
        filter.type = 'lowpass';
        filter.Q.value = 5;
        filter.frequency.setValueAtTime(200, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.35);
        
        gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
    } catch(e) {}
}

// 3. Cyber Tick XP Addition
function playXPTickSound() {
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.setValueAtTime(1500, audioCtx.currentTime + 0.03);
        
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
    } catch(e) {}
}

// 4. Heroic Chord Ascent Level Up
function playLevelUpSound() {
    try {
        initAudio();
        const now = audioCtx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
        
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0.0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + (idx * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.6);
            
            // Subtle filter
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1200;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now + (idx * 0.08));
            osc.stop(now + (idx * 0.08) + 0.6);
        });
    } catch(e) {}
}

// 5. Limit Break Sub Sweep & Noise Rumble
function playLimitBreakSound() {
    try {
        initAudio();
        const now = audioCtx.currentTime;
        
        // Deep sub oscillator
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(60, now);
        subOsc.frequency.exponentialRampToValueAtTime(25, now + 1.2);
        
        subGain.gain.setValueAtTime(0.0, now);
        subGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        subOsc.connect(subGain);
        subGain.connect(audioCtx.destination);
        
        subOsc.start(now);
        subOsc.stop(now + 1.2);
        
        // Lead cyber sweep
        const leadOsc = audioCtx.createOscillator();
        const leadGain = audioCtx.createGain();
        const leadFilter = audioCtx.createBiquadFilter();
        
        leadOsc.type = 'sawtooth';
        leadOsc.frequency.setValueAtTime(110, now);
        leadOsc.frequency.linearRampToValueAtTime(880, now + 1.0);
        
        leadFilter.type = 'lowpass';
        leadFilter.Q.value = 8;
        leadFilter.frequency.setValueAtTime(100, now);
        leadFilter.frequency.exponentialRampToValueAtTime(4000, now + 1.0);
        
        leadGain.gain.setValueAtTime(0.0, now);
        leadGain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
        
        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(audioCtx.destination);
        
        leadOsc.start(now);
        leadOsc.stop(now + 1.1);
    } catch(e) {}
}

/* --- HTML5 CANVAS PARTICLE SYSTEM --- */
let canvas, ctx, animationId;
let particles = [];
let maxParticles = 60;
let particleIntensity = 1.0; // Dynamic scaling

class Particle {
    constructor() {
        this.reset(true);
    }
    
    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? (Math.random() * canvas.height) : (canvas.height + 10);
        this.size = Math.random() * 3 + 1.2;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -(Math.random() * 2.5 + 1.0) * particleIntensity;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.decay = Math.random() * 0.015 + 0.005;
        
        // Match active theme accent glow color
        const glowColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-glow').trim() || '#8b5cf6';
        this.color = glowColor;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        
        if (this.alpha <= 0 || this.y < -10) {
            this.reset(false);
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initCanvas() {
    canvas = document.getElementById('aura-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    animateParticles();
}

function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    animationId = requestAnimationFrame(animateParticles);
}

function burstParticles() {
    particleIntensity = 4.0;
    maxParticles = 120;
    
    // Add temporary energetic particles
    for (let i = 0; i < 40; i++) {
        const p = new Particle();
        p.y = canvas.height / 2 + (Math.random() - 0.5) * 150;
        p.x = canvas.width / 2 + (Math.random() - 0.5) * 150;
        p.vx = (Math.random() - 0.5) * 8;
        p.vy = (Math.random() - 0.5) * 8;
        p.decay = 0.02;
        particles.push(p);
    }
    
    setTimeout(() => {
        particleIntensity = 1.0;
        maxParticles = 60;
        particles = particles.slice(0, maxParticles);
    }, 1500);
}


/* --- THEME TOGGLER --- */
function toggleTheme(targetTheme) {
    if (targetTheme) {
        state.theme = targetTheme;
    } else {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', state.theme);
    
    // Refresh particle colors to match new theme
    particles.forEach(p => p.reset(true));
    
    logToConsole(`[SYSTEM] Swapped visual protocol to ${state.theme.toUpperCase()} theme.`);
}


/* --- ONBOARDING & ARCHETYPE SCORING ALGORITHM --- */
let activeOnboardingStep = 1;
const totalOnboardingSteps = 7;

function setAnimePreset(preset) {
    document.getElementById('input-fav-anime').value = preset;
    playClickSound();
}

function setCharacterPreset(preset) {
    document.getElementById('input-fav-character').value = preset;
    playClickSound();
}

function nextOnboardingStep() {
    if (activeOnboardingStep < totalOnboardingSteps) {
        document.querySelector(`.onboarding-step-card[data-step="${activeOnboardingStep}"]`).classList.add('hidden');
        activeOnboardingStep++;
        document.querySelector(`.onboarding-step-card[data-step="${activeOnboardingStep}"]`).classList.remove('hidden');
        
        // Update headers
        document.getElementById('onboarding-step-num').innerText = `${activeOnboardingStep}/${totalOnboardingSteps}`;
        document.getElementById('onboarding-progress').style.width = `${(activeOnboardingStep / totalOnboardingSteps) * 100}%`;
        
        document.getElementById('btn-onboarding-back').disabled = false;
        playWhooshSound();
    } else {
        // Complete Onboarding - Run scoring archetype classifier
        calculateArchetypeAssignment();
        switchMobileScreen('screen-assignment');
    }
}

function backOnboardingStep() {
    if (activeOnboardingStep > 1) {
        document.querySelector(`.onboarding-step-card[data-step="${activeOnboardingStep}"]`).classList.add('hidden');
        activeOnboardingStep--;
        document.querySelector(`.onboarding-step-card[data-step="${activeOnboardingStep}"]`).classList.remove('hidden');
        
        document.getElementById('onboarding-step-num').innerText = `${activeOnboardingStep}/${totalOnboardingSteps}`;
        document.getElementById('onboarding-progress').style.width = `${(activeOnboardingStep / totalOnboardingSteps) * 100}%`;
        
        if (activeOnboardingStep === 1) {
            document.getElementById('btn-onboarding-back').disabled = true;
        }
        playWhooshSound();
    }
}

function calculateArchetypeAssignment() {
    // Read Form Values
    const fitLevel = document.querySelector('input[name="fit-level"]:checked').value;
    const bodyGoal = document.querySelector('input[name="body-goal"]:checked').value;
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const anime = document.getElementById('input-fav-anime').value.trim() || 'Solo Leveling';
    const character = document.getElementById('input-fav-character').value.trim() || 'Sung Jin-Woo';
    const style = document.querySelector('input[name="fighting-style"]:checked').value;
    const motivation = document.querySelector('input[name="motivation"]:checked').value;
    
    // Save to State
    state.fitLevel = fitLevel;
    state.bodyGoal = bodyGoal;
    state.experienceTier = experience;
    state.favAnime = anime;
    state.favCharacter = character;
    state.fightingStyle = style;
    state.motivationType = motivation;
    
    // Archetype matching core logic
    let assignedClass = 'Aura Striker';
    let assignedRank = 'E';
    let stats = { str: 10, agi: 8, stm: 12, int: 6 };
    let desc = "";
    
    // 1. Calculate Class archetype
    const lowerChar = character.toLowerCase();
    
    if (style === 'shadow' || lowerChar.includes('jin-woo') || lowerChar.includes('jinwoo') || lowerChar.includes('shadow')) {
        if (bodyGoal === 'lean') {
            assignedClass = 'Shadow Monarch';
            stats = { str: 15, agi: 22, stm: 14, int: 18 };
            desc = `Decoded: Shadow Monarch class. Inspired by ${character}. Focused on ruthless assassin agility, anaerobic bursts, stealth speed streaks, and shadow speed-work.`;
        } else {
            assignedClass = 'Agile Assassin';
            stats = { str: 12, agi: 20, stm: 16, int: 12 };
            desc = `Decoded: Agile Assassin class. Inspired by ${character}. Ideal for high-tempo running, calisthenics, and evasive pace-training.`;
        }
    } else if (style === 'brawler' || lowerChar.includes('goku') || lowerChar.includes('vegeta') || lowerChar.includes('strength')) {
        if (bodyGoal === 'bulking') {
            assignedClass = 'Flame Warrior';
            stats = { str: 24, agi: 10, stm: 18, int: 8 };
            desc = `Decoded: Flame Warrior class. Inspired by ${character}. Built for raw muscular strength, heavy resistance overloading, and brawler endurance.`;
        } else {
            assignedClass = 'Beast Tank';
            stats = { str: 20, agi: 8, stm: 22, int: 5 };
            desc = `Decoded: Beast Tank class. Inspired by ${character}. Geared towards extreme physical resilience, compound lifts, and core structural load-bearing.`;
        }
    } else if (style === 'tactician' || lowerChar.includes('levi') || lowerChar.includes('isagi')) {
        if (bodyGoal === 'endurance') {
            assignedClass = 'Celestial Runner';
            stats = { str: 11, agi: 18, stm: 25, int: 16 };
            desc = `Decoded: Celestial Runner class. Inspired by ${character}. Designed for infinite cardiovascular capacity, metavision strategic pacing, and daily hydration compliance.`;
        } else {
            assignedClass = 'Iron Guardian';
            stats = { str: 16, agi: 14, stm: 20, int: 15 };
            desc = `Decoded: Iron Guardian class. Inspired by ${character}. Focused on tactical bodyweight control, core stability, and disciplined pacing.`;
        }
    } else {
        // Fallback preset
        assignedClass = 'Aura Striker';
        desc = `Decoded: Aura Striker class. Combined your fitness goal with ${character}'s mindset to shape an all-round hybrid evolution loop.`;
    }
    
    // 2. Calculate initial rank based on fitness history
    if (fitLevel === 'beginner') {
        assignedRank = 'E';
    } else if (fitLevel === 'intermediate') {
        assignedRank = 'C';
    } else {
        assignedRank = 'A';
    }
    
    if (experience === 'veteran' && assignedRank !== 'S') {
        // Veteran gets a rank boost!
        assignedRank = assignedRank === 'A' ? 'S' : (assignedRank === 'C' ? 'B' : 'D');
    }
    
    // Save generated tags
    state.character = assignedClass;
    state.rank = assignedRank;
    state.rankTitle = `${assignedRank}-Rank ${assignedClass}`;
    state.stats = stats;
    
    // Play dramatic chord reveal
    setTimeout(() => {
        playLevelUpSound();
    }, 400);
    
    // Update Reveal Page
    document.getElementById('assignment-rank-badge').innerText = assignedRank;
    document.getElementById('assignment-class-title').innerText = assignedClass.toUpperCase();
    document.getElementById('assignment-rank-text').innerText = `${assignedRank}-RANK ADAPTIVE HUNTER`;
    document.getElementById('assignment-description').innerText = desc;
    
    // Change accent color dynamically based on archetype!
    let activeGlow = '#8b5cf6'; // default shadow purple
    if (assignedClass === 'Flame Warrior' || assignedClass === 'Beast Tank') {
        activeGlow = '#ff003c'; // crimson red
    } else if (assignedClass === 'Celestial Runner') {
        activeGlow = '#00ff66'; // neon green
    } else if (assignedClass === 'Agile Assassin' || assignedClass === 'Iron Guardian') {
        activeGlow = '#00e5ff'; // electric blue
    }
    document.documentElement.style.setProperty('--accent-glow', activeGlow);
    // Convert hex to rgb for opacity styles
    const rgb = hexToRgb(activeGlow);
    document.documentElement.style.setProperty('--accent-glow-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    logToConsole(`[NEURAL] Pattern recognized. Assigned Archetype: ${assignedClass.toUpperCase()} (Rank-${assignedRank}).`);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 139, g: 92, b: 246 };
}


/* --- MISSION SYSTEM GENERATOR --- */
function generateDailyMissions() {
    const rank = state.rank;
    let multiplier = 1.0;
    
    if (rank === 'E') multiplier = 0.5;
    if (rank === 'D') multiplier = 0.8;
    if (rank === 'C') multiplier = 1.2;
    if (rank === 'B') multiplier = 1.5;
    if (rank === 'A') multiplier = 2.0;
    if (rank === 'S') multiplier = 3.5;
    
    state.missions = [
        { 
            id: 'run_directive', 
            title: `Navigational Run`, 
            desc: `Navigate sector parameters. Distance: ${Math.round(2 * multiplier * 10) / 10} KM.`, 
            target: Math.round(2 * multiplier * 10) / 10,
            unit: 'KM',
            progress: 0,
            xp: Math.round(200 * multiplier), 
            difficulty: `${rank}-Rank`,
            completed: false 
        },
        { 
            id: 'pushup_directive', 
            title: `Resistance Pushups`, 
            desc: `Complete ${Math.round(20 * multiplier)} pushup synchronization cycles.`, 
            target: Math.round(20 * multiplier),
            unit: 'Pushups',
            progress: 0,
            xp: Math.round(150 * multiplier), 
            difficulty: `${rank}-Rank`,
            completed: false 
        },
        { 
            id: 'squat_directive', 
            title: `Load-bearing Squats`, 
            desc: `Complete ${Math.round(40 * multiplier)} gravity squats to expand lower core load capacity.`, 
            target: Math.round(40 * multiplier),
            unit: 'Squats',
            progress: 0,
            xp: Math.round(150 * multiplier), 
            difficulty: `${rank}-Rank`,
            completed: false 
        },
        { 
            id: 'water_directive', 
            title: `System Hydration`, 
            desc: `Consume 2.0 Liters of water to balance electrolyte core.`, 
            target: 2.0,
            unit: 'L',
            progress: 0,
            xp: 100, 
            difficulty: `E-Rank`,
            completed: false 
        }
    ];
}


/* --- WORKOUT COMPLETION & XP ENGINE --- */
function logFitnessActivity(type, amount) {
    if (state.screen === 'screen-splash' || state.screen === 'screen-onboarding' || state.screen === 'screen-assignment') {
        logToConsole("[WARNING] Complete synchronization setup before logging workouts!");
        return;
    }
    
    logToConsole(`[SYNC] Fitness event registered: ${type} (+${amount})`);
    
    // Find corresponding mission
    let mission = null;
    if (type === 'run') mission = state.missions.find(m => m.id === 'run_directive');
    if (type === 'pushup') mission = state.missions.find(m => m.id === 'pushup_directive');
    if (type === 'squat') mission = state.missions.find(m => m.id === 'squat_directive');
    if (type === 'water') mission = state.missions.find(m => m.id === 'water_directive');
    
    if (mission && !mission.completed) {
        mission.progress = Math.min(mission.target, mission.progress + amount);
        
        // Hydration logic update
        if (type === 'water') {
            state.water = Math.min(2.0, state.water + amount);
            if (state.water >= 2.0) {
                unlockAchievement('hydration_max');
            }
        }
        
        // Calories calculations
        let cals = 0;
        if (type === 'run') cals = Math.round(amount * 75);
        if (type === 'pushup') cals = Math.round(amount * 0.6);
        if (type === 'squat') cals = Math.round(amount * 0.8);
        state.calories += cals;
        
        if (mission.progress >= mission.target && !mission.completed) {
            mission.completed = true;
            addXP(mission.xp);
            logToConsole(`[COMPLETED] ${mission.title} fulfilled! +${mission.xp} XP rewarded.`);
            playSuccessSound();
            
            // Increment corresponding stat slightly
            if (type === 'run') state.stats.stm += 1;
            if (type === 'pushup') state.stats.str += 1;
            if (type === 'squat') state.stats.str += 1;
            if (type === 'water') state.stats.int += 1;
            
            // Check if all daily missions completed
            const allDone = state.missions.every(m => m.completed);
            if (allDone) {
                unlockAchievement('all_missions');
            }
        } else {
            playXPTickSound();
        }
    } else {
        // Just add generic raw parameters if mission is already finished
        if (type === 'water') state.water = Math.min(2.0, state.water + amount);
        let cals = 0;
        if (type === 'run') cals = Math.round(amount * 75);
        if (type === 'pushup') cals = Math.round(amount * 0.6);
        if (type === 'squat') cals = Math.round(amount * 0.8);
        state.calories += cals;
        playXPTickSound();
    }
    
    // Repaint Screens
    renderDashboard();
    renderMissions();
    renderStats();
    
    // Sync telemetry to parent shell (index.html)
    syncTelemetryToParent();
}

function addXP(amount) {
    state.xp += amount;
    burstParticles();
    
    if (state.xp >= state.maxXp) {
        // Level Up!
        state.xp = state.xp - state.maxXp;
        state.level += 1;
        state.maxXp = Math.round(state.maxXp * 1.3);
        
        logToConsole(`[LEVEL UP] Protagonist reached Level ${state.level}! Core capacity expanded.`);
        playLevelUpSound();
        
        // Add random stat points
        state.stats.str += 2;
        state.stats.agi += 2;
        state.stats.stm += 2;
        state.stats.int += 1;
        
        if (state.level >= 10) {
            unlockAchievement('s_rank_clear');
        }
        
        // Trigger red pulse flash animation in mobile shell
        const bezel = document.querySelector('.phone-container');
        if (bezel) {
            bezel.classList.add('flash-alert');
            setTimeout(() => bezel.classList.remove('flash-alert'), 1000);
        }
    }
}


/* --- CHARACTER EVOLUTION PROTOCOL (LIMIT BREAK) --- */
function executeCharacterEvolution() {
    playLimitBreakSound();
    burstParticles();
    
    // Trigger intense particles animation in canvas
    particleIntensity = 12.0;
    maxParticles = 200;
    
    // Visual flash in mobile frame
    document.body.classList.add('flash-alert');
    setTimeout(() => document.body.classList.remove('flash-alert'), 800);
    
    // Double all stats dramatically
    state.stats.str += 45;
    state.stats.agi += 32;
    state.stats.stm += 40;
    state.stats.int += 25;
    
    // Animate stats reveal values on Evolution Screen
    document.getElementById('evo-str-boost').innerText = "+45 STR";
    document.getElementById('evo-agi-boost').innerText = "+32 AGI";
    document.getElementById('evo-stm-boost').innerText = "+40 STM";
    document.getElementById('evo-int-boost').innerText = "+25 INT";
    
    logToConsole(`[EVOLUTION] Limit break protocol successfully engaged! DNA code rewritten.`);
    unlockAchievement('limit_break_one');
    
    // Update badge details
    document.getElementById('evo-stage-badge').innerText = `Lvl ${state.level} (Ascended)`;
    document.getElementById('evo-stage-next').innerText = `Infinite Ascension Loop Unlocked`;
    
    // Change image filter to signify transformation (remove grayscale)
    document.getElementById('evo-character-img').classList.remove('grayscale');
    document.getElementById('evo-character-img').classList.add('saturate-150');
    
    // Repaint structures
    renderStats();
    syncTelemetryToParent();
    
    setTimeout(() => {
        particleIntensity = 1.0;
        maxParticles = 60;
    }, 2500);
}


/* --- ACHIEVEMENTS MANAGEMENT --- */
function unlockAchievement(id) {
    const ach = state.achievementsList.find(a => a.id === id);
    if (ach && !ach.unlocked) {
        ach.unlocked = true;
        state.unlockedAchievements++;
        logToConsole(`[ACHIEVEMENT UNLOCKED] "${ach.title.toUpperCase()}" badge bound to profile.`);
        
        // Show floating temporary alert in the mobile screen if active
        showAchievementToast(ach);
        
        // Refresh Achievement screen
        renderAchievements();
        syncTelemetryToParent();
    }
}

function showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'glass-card p-3 flex items-center gap-3 border-2 border-accent-glow animate-[fadeIn_0.3s_ease-out] z-50';
    toast.style.cssText = 'position: absolute; top: 80px; left: 16px; right: 16px; border-radius: var(--radius-md);';
    toast.innerHTML = `
        <span class="material-symbols-outlined text-accent-glow">workspace_premium</span>
        <div class="text-left">
            <h4 class="font-technical text-xs font-bold uppercase text-accent-glow">Badge Bound!</h4>
            <p class="text-[9px] text-text-primary uppercase leading-tight">${ach.title}</p>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


/* --- DYNAMIC DOM RENDERING ENGINE --- */
function switchMobileScreen(targetScreenId) {
    if (targetScreenId === 'screen-dashboard' && state.screen === 'screen-assignment') {
        // Unlock first achievements
        unlockAchievement('first_directive');
    }
    
    // Hide current screen
    const activeScreen = document.querySelector('.screen-container.active');
    if (activeScreen) {
        activeScreen.classList.remove('active');
    }
    
    // Show new screen
    const targetScreen = document.getElementById(targetScreenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.screen = targetScreenId;
    }
    
    // Bottom Nav view toggling logic (hidden on boot stages)
    const navBar = document.getElementById('app-bottom-nav');
    if (targetScreenId === 'screen-splash' || targetScreenId === 'screen-onboarding' || targetScreenId === 'screen-assignment') {
        navBar.style.display = 'none';
    } else {
        navBar.style.display = 'flex';
    }
    
    // Highlight Active nav button
    const navButtons = {
        'screen-dashboard': 'nav-btn-home',
        'screen-missions': 'nav-btn-missions',
        'screen-evolution': 'nav-btn-evolution',
        'screen-stats': 'nav-btn-stats',
        'screen-achievements': 'nav-btn-achievements'
    };
    
    document.querySelectorAll('#app-bottom-nav button').forEach(btn => {
        btn.classList.remove('text-accent-glow', 'animate-pulse');
        btn.classList.add('text-text-secondary', 'opacity-70');
    });
    
    const activeBtnId = navButtons[targetScreenId];
    if (activeBtnId) {
        const activeBtn = document.getElementById(activeBtnId);
        if (activeBtn) {
            activeBtn.classList.remove('text-text-secondary', 'opacity-70');
            activeBtn.classList.add('text-accent-glow', 'animate-pulse');
        }
    }
    
    playWhooshSound();
}

function renderDashboard() {
    // Top headers
    document.getElementById('dash-level').innerText = `Lvl ${state.level}`;
    document.getElementById('dash-class-badge').innerText = state.character.toUpperCase();
    document.getElementById('dash-rank-badge').innerText = `[${state.rank}-Rank]`;
    
    // XP
    document.getElementById('dash-xp-text').innerText = `${state.xp} / ${state.maxXp} XP`;
    document.getElementById('dash-xp-fill').style.width = `${(state.xp / state.maxXp) * 100}%`;
    
    // Statistics
    document.getElementById('dash-calories').innerText = state.calories;
    document.getElementById('dash-water').innerText = state.water.toFixed(1);
    document.getElementById('dash-streak').innerText = state.streak;
    
    // Customized Anime Quotes
    let characterQuotes = state.quotes[state.favCharacter] || state.quotes['generic'];
    // pick quote based on day streak or level
    const quoteIndex = (state.level + state.streak) % characterQuotes.length;
    const activeQuote = characterQuotes[quoteIndex];
    
    document.getElementById('dash-quote').innerText = `"${activeQuote.text}"`;
    document.getElementById('dash-quote-author').innerText = `— ${activeQuote.author}`;
    
    // Character Avatar and Body image styling
    const customImgs = {
        'Shadow Monarch': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQzZBzO5ElLPh1Z1dwji2X-DTm-FDvImVVkw4bYIy9VpljKt1EEk6J1UB5N996ldL9VHyQ_KJ7eayh6BmNsfHYl1TtYeIihbuf9BVxqF16o172QpwhISHhvt9ay4TE3KjOxhpdfaA79FTwjIcY5JMbur_yqwDbn1jNwJYq7WXKdtK15wjqivZ454H5ffum-bdhrW-OtkHAWcv-v8Cc5r_Im8-_6EVCQmIBYOIuSestDkQXBV4jVmlXJk_FGpy2mcjUA7H5sY4ZPc_U',
        'Flame Warrior': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtvCtgikuvssDi4oz-1Idt6vixgQXn9BYkJmKW0bzIXcJ-GDJLe61Qv300THyCJ7xwrSSCDdb1DPcN8dcRe6TLavuoelZKc3nOlC9-1jgDEKts4cr6lwL_wqe5-cImok0T5pk9WN-TG5IGklE4HA7RJNgrCyIzP2b0QImWM13GMKXxoke2AhpKdu1suXgGH2REEFRxiCXI8g6aILtXYATaNfWoI1ogpHuehbZTXDxz3_t_irJQi2qs7VhEKUab-J1J_IlrgaRADC9N',
        'Celestial Runner': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR3lfKDV9lCBxKdan6y0IGeomFCEKrIep0mrvCW3aTWRT50pcDNHFXdk0vGf1miWAbYeFYsaZHevYQUYnOBKezRHM0cy3foCIpM_FY9UD_zy3ZDZTIjFd7R71AVFO10SxmToL-GtJWYk6M-NtuVOshP5BAI3CxQa9IARahfJmNn55CUC3Te5erFGt6_Dq-Pla2iPowy1vsiUEqZ3oB1DvCpaE-G13PJkVkK0ReSspr2DOKNj_gtYehFHH2a6NvUxvzHNgskwu0P0IN'
    };
    
    const activeImg = customImgs[state.character] || customImgs['Shadow Monarch'];
    document.getElementById('dash-avatar').src = activeImg;
    document.getElementById('dash-character-img').src = activeImg;
    document.getElementById('evo-character-img').src = activeImg;
    
    // Render brief daily mission items inside dashboard
    const mList = document.getElementById('dash-mission-list');
    mList.innerHTML = '';
    
    state.missions.forEach(m => {
        const item = document.createElement('div');
        item.className = `glass-card p-3 flex items-center justify-between ${m.completed ? 'opacity-50' : ''}`;
        item.style.borderRadius = 'var(--radius-md)';
        item.innerHTML = `
            <div class="text-left">
                <h4 class="font-technical text-xs font-bold ${m.completed ? 'line-through text-text-secondary' : 'text-text-primary'}">${m.title}</h4>
                <p class="text-[9px] text-text-secondary">${m.progress} / ${m.target} ${m.unit} (+${m.xp} XP)</p>
            </div>
            <span class="material-symbols-outlined text-sm ${m.completed ? 'text-accent-glow' : 'text-text-muted'}">
                ${m.completed ? 'check_box' : 'check_box_outline_blank'}
            </span>
        `;
        mList.appendChild(item);
    });
}

function renderMissions() {
    document.getElementById('missions-rank-tag').innerText = `${state.rank}-Rank Directives`;
    
    const container = document.getElementById('missions-card-list');
    container.innerHTML = '';
    
    state.missions.forEach(m => {
        const card = document.createElement('div');
        card.className = `glass-card p-4 relative overflow-hidden flex flex-col justify-between h-36 ${m.completed ? 'border-accent-green/30' : ''}`;
        
        let icon = 'directions_run';
        if (m.id.includes('pushup')) icon = 'fitness_center';
        if (m.id.includes('squat')) icon = 'sports_mma';
        if (m.id.includes('water')) icon = 'water_drop';
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="text-left">
                    <span class="font-technical text-[9px] uppercase tracking-widest text-accent-glow" style="border: 1px solid var(--glass-border); padding: 2px 6px; border-radius: var(--radius-sm)">
                        ${m.difficulty}
                    </span>
                    <h3 class="font-display text-lg text-text-primary uppercase mt-2">${m.title}</h3>
                </div>
                <span class="material-symbols-outlined text-accent-glow" style="font-size: 24px;">${icon}</span>
            </div>
            
            <p class="text-[10px] text-text-secondary text-left font-technical">${m.desc}</p>
            
            <div class="flex items-center justify-between border-t border-glass-border pt-2 mt-2">
                <span class="font-technical text-[10px] text-text-secondary">${m.progress}/${m.target} ${m.unit} completed</span>
                
                <button class="btn-cyber text-[9px] py-1 px-3 ${m.completed ? 'primary' : ''}" onclick="logFitnessActivity('${m.id.split('_')[0]}', ${m.id.includes('run') ? 1.0 : (m.id.includes('water') ? 0.25 : 10)})" ${m.completed ? 'disabled' : ''}>
                    <span>${m.completed ? 'SYNCED' : 'LOG ACTIVITY'}</span>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderStats() {
    // Stat numbers
    document.getElementById('stat-val-str').innerText = state.stats.str;
    document.getElementById('stat-val-agi').innerText = state.stats.agi;
    document.getElementById('stat-val-stm').innerText = state.stats.stm;
    document.getElementById('stat-val-int').innerText = state.stats.int;
    
    // Stat fill widths
    const maxVal = 100;
    document.getElementById('stat-bar-str').style.width = `${(state.stats.str / maxVal) * 100}%`;
    document.getElementById('stat-bar-agi').style.width = `${(state.stats.agi / maxVal) * 100}%`;
    document.getElementById('stat-bar-stm').style.width = `${(state.stats.stm / maxVal) * 100}%`;
    document.getElementById('stat-bar-int').style.width = `${(state.stats.int / maxVal) * 100}%`;
    
    // Character Evolution reveal booster statistics
    document.getElementById('evo-class-title').innerText = state.character.toUpperCase();
}

function renderAchievements() {
    document.getElementById('achieve-unlock-count').innerText = `${state.unlockedAchievements} / ${state.achievementsList.length} Unlocked`;
    
    const container = document.getElementById('achievements-grid');
    container.innerHTML = '';
    
    state.achievementsList.forEach(a => {
        const item = document.createElement('div');
        item.className = `achievement-badge ${a.unlocked ? 'unlocked' : ''}`;
        
        item.innerHTML = `
            <span class="material-symbols-outlined text-3xl mb-2 block ${a.unlocked ? 'text-accent-glow animate-pulse' : 'text-text-muted opacity-40'}">
                ${a.icon}
            </span>
            <h4 class="font-technical text-xs font-bold text-text-primary uppercase mt-1 leading-tight">${a.title}</h4>
            <p class="text-[9px] text-text-secondary mt-1 font-technical leading-tight">${a.desc}</p>
        `;
        container.appendChild(item);
    });
}

function buildStatsHeatmap() {
    const grid = document.getElementById('stats-heatmap');
    if (!grid) return;
    grid.innerHTML = '';
    
    // Create 35 days (5 weeks) grid
    for (let i = 0; i < 35; i++) {
        const day = document.createElement('div');
        day.className = 'heatmap-day';
        
        // Randomly simulate previous consistency mapping
        if (i < 20) {
            const act = Math.floor(Math.random() * 4); // 0, 1, 2, 3
            if (act > 0) {
                day.classList.add(`active-${act}`);
            }
        } else if (i === 24 || i === 31 || i === 34) {
            // Mock active today and recent streaks
            day.classList.add('active-4');
        }
        grid.appendChild(day);
    }
}


/* --- REAL-TIME TELEMETRY BRIDGE LOGGING --- */
function logToConsole(message) {
    console.log(message);
    
    // Dispatch message to parent shell logs if embedded
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'LOG_TRANSACTION',
            message: message,
            timestamp: new Date().toLocaleTimeString()
        }, '*');
    }
}

function syncTelemetryToParent() {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'SYNC_TELEMETRY',
            state: {
                level: state.level,
                xp: state.xp,
                maxXp: state.maxXp,
                calories: state.calories,
                water: state.water,
                streak: state.streak,
                stats: state.stats,
                character: state.character,
                rank: state.rank,
                rankTitle: state.rankTitle,
                favCharacter: state.favCharacter,
                unlockedAchievements: state.unlockedAchievements
            }
        }, '*');
    }
}


/* --- INITIALIZATION & BRIDGE LISTENER --- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise core HTML canvas animations
    initCanvas();
    
    // 2. Button clicks mapping
    const bootBtn = document.getElementById('btn-boot-system');
    if (bootBtn) {
        bootBtn.addEventListener('click', () => {
            initAudio();
            playLevelUpSound();
            switchMobileScreen('screen-onboarding');
            logToConsole("[NEURAL] Link active. Ready to sync physical parameters.");
        });
    }
    
    // Onboarding navigation bindings
    document.getElementById('btn-onboarding-next').addEventListener('click', nextOnboardingStep);
    document.getElementById('btn-onboarding-back').addEventListener('click', backOnboardingStep);
    
    // Reveal Archetype sync confirmation
    document.getElementById('btn-assignment-confirm').addEventListener('click', () => {
        generateDailyMissions();
        switchMobileScreen('screen-dashboard');
        
        // Repaint initial renders
        renderDashboard();
        renderMissions();
        renderStats();
        buildStatsHeatmap();
        renderAchievements();
        
        // Force initial telemetry sync
        syncTelemetryToParent();
    });
    
    // Trigger evolution button mapping
    document.getElementById('btn-trigger-evolution').addEventListener('click', executeCharacterEvolution);
    
    // Parent commands listener for event controllers (allowing desktop panel workouts)
    window.addEventListener('message', (e) => {
        const data = e.data;
        if (!data) return;
        
        if (data.type === 'COMMAND_LOG_WORKOUT') {
            logFitnessActivity(data.activity, data.amount);
        }
        
        if (data.type === 'COMMAND_TRIGGER_EVO') {
            executeCharacterEvolution();
        }
        
        if (data.type === 'COMMAND_THEME_SWAP') {
            toggleTheme(data.theme);
        }
    });
});
