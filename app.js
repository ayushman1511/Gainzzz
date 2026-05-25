/* --- CORE APP STATE --- */
const state = {
    screen: 'screen-splash',
    theme: 'dark',
    level: 1,
    xp: 250,
    maxXp: 1000,
    streak: 1,
    calories: 0,
    water: 0.0,
    stats: { str: 20, agi: 15, stm: 25, int: 12 },
    character: 'Shadow Monarch',
    rank: 'S',
    rankTitle: 'S-Rank Shadow Monarch',
    favAnime: 'Solo Leveling',
    favCharacter: 'Sung Jin-Woo',
    motivationType: 'intense',
    experienceTier: 'new',
    bodyGoal: 'lean',
    fightingStyle: 'shadow',
    unlockedAchievements: 0,
    missions: [],
    adaptiveQuestMode: true,
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

// 2. Screen Whoosh
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
let maxParticles = 50;
let particleIntensity = 1.0;

class Particle {
    constructor() {
        this.reset(true);
    }
    
    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? (Math.random() * canvas.height) : (canvas.height + 10);
        this.size = Math.random() * 2.5 + 1.0;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = -(Math.random() * 2.0 + 0.8) * particleIntensity;
        this.alpha = Math.random() * 0.4 + 0.15;
        this.decay = Math.random() * 0.01 + 0.004;
        
        const glowColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#9a0002';
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
    maxParticles = 90;
    
    for (let i = 0; i < 30; i++) {
        const p = new Particle();
        p.y = canvas.height / 2 + (Math.random() - 0.5) * 120;
        p.x = canvas.width / 2 + (Math.random() - 0.5) * 120;
        p.vx = (Math.random() - 0.5) * 6;
        p.vy = (Math.random() - 0.5) * 6;
        p.decay = 0.015;
        particles.push(p);
    }
    
    setTimeout(() => {
        particleIntensity = 1.0;
        maxParticles = 50;
        particles = particles.slice(0, maxParticles);
    }, 1200);
}


/* --- THEME SWAPPER --- */
function toggleTheme(targetTheme) {
    if (targetTheme) {
        state.theme = targetTheme;
    } else {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', state.theme);
    
    // Swap html tag light/dark classes for Tailwind
    if (state.theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }
    
    // Refresh particle colors to match new theme
    particles.forEach(p => p.reset(true));
    
    logToConsole(`[SYSTEM] Swapped visual protocol to ${state.theme.toUpperCase()} theme.`);
}


/* --- ONBOARDING & ARCHETYPE SCORING --- */
let activeOnboardingStep = 1;
const totalOnboardingSteps = 8;

function selectWebQuestMode(mode) {
    playClickSound();
    const squireInput = document.querySelector('input[name="quest-mode"][value="squire"]');
    const monarchInput = document.querySelector('input[name="quest-mode"][value="monarch"]');
    const squireCard = document.getElementById('quest-mode-squire-card');
    const monarchCard = document.getElementById('quest-mode-monarch-card');
    
    if (mode === 'squire') {
        squireInput.checked = true;
        squireCard.style.borderColor = 'var(--primary)';
        squireCard.style.background = 'rgba(var(--accent-glow-rgb, 195, 244, 0), 0.08)';
        squireCard.querySelector('span.material-symbols-outlined').style.color = 'var(--primary)';
        
        monarchInput.checked = false;
        monarchCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        monarchCard.style.background = 'var(--glass-bg)';
        monarchCard.querySelector('span.material-symbols-outlined').style.color = 'var(--text-muted)';
        state.adaptiveQuestMode = true;
    } else {
        monarchInput.checked = true;
        monarchCard.style.borderColor = 'var(--primary)';
        monarchCard.style.background = 'rgba(var(--accent-glow-rgb, 195, 244, 0), 0.08)';
        monarchCard.querySelector('span.material-symbols-outlined').style.color = 'var(--primary)';
        
        squireInput.checked = false;
        squireCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        squireCard.style.background = 'var(--glass-bg)';
        squireCard.querySelector('span.material-symbols-outlined').style.color = 'var(--text-muted)';
        state.adaptiveQuestMode = false;
    }
}

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
        
        if (activeOnboardingStep === 7) {
            updateWebMuscleCurationText();
        }
        
        document.getElementById('onboarding-step-num').innerText = `${activeOnboardingStep}/${totalOnboardingSteps}`;
        document.getElementById('onboarding-progress').style.width = `${(activeOnboardingStep / totalOnboardingSteps) * 100}%`;
        
        document.getElementById('btn-onboarding-back').disabled = false;
        playWhooshSound();
    } else {
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

/* --- MUSCLE WIKI TARGETER & GEMINI AI CORE --- */
let selectedWebMuscleSectors = [];
let geminiApiKey = "";

async function loadApiKey() {
    try {
        const response = await fetch('.env');
        if (response.ok) {
            const text = await response.text();
            const match = text.match(/GEMINI_API_KEY\s*=\s*([^\s#]+)/);
            if (match && match[1]) {
                geminiApiKey = match[1].trim();
                logToConsole("[NEURAL] Gemini core sync active. Key decrypted successfully.");
            }
        }
    } catch (e) {
        // Safe fallback
    }
}

function toggleWebMuscleSector(muscle) {
    playClickSound();
    const index = selectedWebMuscleSectors.indexOf(muscle);
    const cardEl = event.currentTarget;
    const inputEl = cardEl.querySelector('input');
    const badgeEl = cardEl.querySelector('.select-x-icon');
    
    if (index === -1) {
        selectedWebMuscleSectors.push(muscle);
        inputEl.checked = true;
        cardEl.style.borderColor = 'var(--primary)';
        cardEl.style.background = 'rgba(var(--primary-rgb, 195, 244, 0), 0.08)';
        if (badgeEl) badgeEl.classList.remove('hidden');
    } else {
        selectedWebMuscleSectors.splice(index, 1);
        inputEl.checked = false;
        cardEl.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        cardEl.style.background = 'var(--glass-bg)';
        if (badgeEl) badgeEl.classList.add('hidden');
    }
}

function updateWebMuscleCurationText() {
    const styleEl = document.querySelector('input[name="fighting-style"]:checked');
    const style = styleEl ? styleEl.value : 'shadow';
    const subEl = document.getElementById('onboarding-muscle-sub');
    if (!subEl) return;
    
    if (style === 'shadow') {
        subEl.innerText = "Select muscle sectors to fortify for high-speed evasion and stealth precision (Assassin focus).";
    } else if (style === 'brawler') {
        subEl.innerText = "Select heavy muscle zones to break through raw structural power boundaries (Warrior hypertrophy).";
    } else if (style === 'tactician') {
        subEl.innerText = "Select core pacing sectors for infinite cardiovascular synchro (Stamina intervals).";
    }
}

async function fetchAiMissionsWeb() {
    if (!geminiApiKey) {
        generateLocalCuratedMissionsWeb();
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'ai-loading-overlay';
    overlay.className = 'fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center p-8';
    overlay.innerHTML = `
        <div class="space-y-6 flex flex-col items-center">
            <div class="relative w-24 h-24 flex items-center justify-center glass-card rounded-full border border-primary animate-spin" style="border-radius:50%">
                <span class="material-symbols-outlined text-4xl text-custom">sync</span>
            </div>
            <h2 class="font-display text-2xl tracking-[0.2em] text-custom uppercase">Syncing Neural Directives...</h2>
            <p class="font-technical text-xs tracking-widest text-text-secondary uppercase">Establishing Link to Gemini Core</p>
        </div>
    `;
    document.body.appendChild(overlay);

    try {
        const rank = state.rank;
        let multiplier = 1.0;
        if (rank === 'D') multiplier = 0.5;
        if (rank === 'C') multiplier = 1.2;
        if (rank === 'B') multiplier = 2.0;
        if (rank === 'A') multiplier = 3.0;
        if (rank === 'S') multiplier = 4.0;

        const prompt = `
You are the Abyssal Protocol AI. Generate a premium, gamified, high-tech fitness training routine for a protagonist.
Here are the user details:
- Current Rank: ${rank}-Rank
- Specialty Class: ${state.character}
- Target Muscle sectors to train: ${selectedWebMuscleSectors.join(', ') || 'General Conditioning'}
- Favorite anime hero preset: ${state.favCharacter}

Generate exactly 2-3 custom, highly immersive, game-like fitness exercises specifically curating movements for the target muscle sectors.
Return your output STRICTLY as a raw JSON array of objects. Do not wrap in markdown or any other tags.
Each object must have exactly these keys:
- "id": a unique string key (e.g., "ai_chest_press", "ai_back_rows")
- "title": a dramatic, epic sci-fi or anime workout title (e.g. "Abyssal Gravity Pullups", "Absolute Core Overload")
- "desc": a technical, immersive 1-sentence description detailing the story-driven purpose of this exercise
- "target": a number (representing reps or seconds) between 8 and 30 (scaled appropriately for ${rank}-Rank)
- "unit": a string ("Reps" or "Sec")
- "xp": an integer XP reward (ranging from 100 to 300)
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: 'application/json'
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;
            const parsedMissions = JSON.parse(textResponse.trim());
            
            // Generate core 3
            let baseRun = state.adaptiveQuestMode ? (3.0 + 0.5 * (state.level - 1)) : 10.0;
            let basePush = state.adaptiveQuestMode ? (30 + 5 * (state.level - 1)) : 100;
            let baseSquat = state.adaptiveQuestMode ? (30 + 5 * (state.level - 1)) : 100;

            let runTarget = Math.round(baseRun * multiplier * 10) / 10;
            let pushTarget = Math.round(basePush * multiplier);
            let squatTarget = Math.round(baseSquat * multiplier);

            const coreMissions = [
                { 
                    id: 'run_directive', 
                    title: 'Navigational Run', 
                    desc: `Navigate sector limits. Target: ${runTarget} KM.`, 
                    target: runTarget,
                    unit: 'KM',
                    progress: 0,
                    xp: Math.round(200 * multiplier), 
                    difficulty: `${rank}-Rank`,
                    icon: 'directions_run',
                    completed: false 
                },
                { 
                    id: 'pushup_directive', 
                    title: 'Gravity Pushups', 
                    desc: `Complete ${pushTarget} pushup cycles inside resistance field.`, 
                    target: pushTarget,
                    unit: 'Pushups',
                    progress: 0,
                    xp: Math.round(150 * multiplier), 
                    difficulty: `${rank}-Rank`,
                    icon: 'fitness_center',
                    completed: false 
                },
                { 
                    id: 'squat_directive', 
                    title: 'Shadow Squats', 
                    desc: `Log ${squatTarget} compound squats to elevate protagonist mass.`, 
                    target: squatTarget,
                    unit: 'Squats',
                    progress: 0,
                    xp: Math.round(150 * multiplier), 
                    difficulty: `${rank}-Rank`,
                    icon: 'sports_mma',
                    completed: false 
                }
            ];

            const customMissions = parsedMissions.map(m => {
                let icon = 'fitness_center';
                const mid = m.id.toLowerCase();
                const munit = m.unit.toLowerCase();
                if (mid.includes('run') || munit === 'km') icon = 'directions_run';
                if (mid.includes('core') || mid.includes('abs') || mid.includes('crunches')) icon = 'grid_3x3';
                if (mid.includes('pull') || mid.includes('back') || mid.includes('row')) icon = 'align_vertical_bottom';
                if (mid.includes('shoulder') || mid.includes('press') || mid.includes('raise')) icon = 'upgrade';
                
                return {
                    id: m.id,
                    title: m.title,
                    desc: m.desc,
                    target: parseFloat(m.target) || 10,
                    unit: m.unit,
                    progress: 0,
                    xp: parseInt(m.xp) || 150,
                    difficulty: `${rank}-Rank`,
                    icon: icon,
                    completed: false
                };
            });

            state.missions = [...coreMissions, ...customMissions];
            
            state.missions.push({
                id: 'water_directive',
                title: 'Tactical Recovery',
                desc: 'Consume 2.0 Liters of water to balance electrolyte core values.',
                target: 2.0,
                unit: 'L',
                progress: 0,
                xp: 100,
                difficulty: 'E-Rank',
                icon: 'local_drink',
                completed: false
            });
            
            renderMissions();
            playNotificationSound();
        } else {
            generateLocalCuratedMissionsWeb();
        }
    } catch (e) {
        generateLocalCuratedMissionsWeb();
    } finally {
        const overlayEl = document.getElementById('ai-loading-overlay');
        if (overlayEl) overlayEl.remove();
    }
}

function generateLocalCuratedMissionsWeb() {
    const rank = state.rank;
    let multiplier = 1.0;
    if (rank === 'D') multiplier = 0.5;
    if (rank === 'C') multiplier = 1.2;
    if (rank === 'B') multiplier = 2.0;
    if (rank === 'A') multiplier = 3.0;
    if (rank === 'S') multiplier = 4.0;

    state.missions = [];

    // 1. Mandatory Solo Leveling Core Tasks
    let baseRun = state.adaptiveQuestMode ? (3.0 + 0.5 * (state.level - 1)) : 10.0;
    let basePush = state.adaptiveQuestMode ? (30 + 5 * (state.level - 1)) : 100;
    let baseSquat = state.adaptiveQuestMode ? (30 + 5 * (state.level - 1)) : 100;

    let runTarget = Math.round(baseRun * multiplier * 10) / 10;
    let pushTarget = Math.round(basePush * multiplier);
    let squatTarget = Math.round(baseSquat * multiplier);

    state.missions.push({ 
        id: 'run_directive', 
        title: 'Navigational Run', 
        desc: `Navigate sector limits. Target: ${runTarget} KM.`, 
        target: runTarget,
        unit: 'KM',
        progress: 0,
        xp: Math.round(200 * multiplier), 
        difficulty: `${rank}-Rank`,
        icon: 'directions_run',
        completed: false 
    });

    state.missions.push({ 
        id: 'pushup_directive', 
        title: 'Gravity Pushups', 
        desc: `Complete ${pushTarget} pushup cycles inside resistance field.`, 
        target: pushTarget,
        unit: 'Pushups',
        progress: 0,
        xp: Math.round(150 * multiplier), 
        difficulty: `${rank}-Rank`,
        icon: 'fitness_center',
        completed: false 
    });

    state.missions.push({ 
        id: 'squat_directive', 
        title: 'Shadow Squats', 
        desc: `Log ${squatTarget} compound squats to elevate protagonist mass.`, 
        target: squatTarget,
        unit: 'Squats',
        progress: 0,
        xp: Math.round(150 * multiplier), 
        difficulty: `${rank}-Rank`,
        icon: 'sports_mma',
        completed: false 
    });

    // 2. Custom Muscle Sector Exercises
    let sectorsToTrain = selectedWebMuscleSectors.length > 0 ? selectedWebMuscleSectors : ['Back', 'Core'];
    sectorsToTrain.forEach(sector => {
        if (sector === 'Chest') {
            state.missions.push({
                id: 'chest_directive',
                title: 'Quantum Chest Press',
                desc: 'Utilize chest force fields to push beyond normal physical constraints.',
                target: Math.round(15 * multiplier),
                unit: 'Reps',
                progress: 0,
                xp: Math.round(120 * multiplier),
                difficulty: `${rank}-Rank`,
                icon: 'accessibility_new',
                completed: false
            });
        } else if (sector === 'Back') {
            let title = 'Assisted Pullups';
            let target = 5;
            if (rank === 'C') { title = 'Abyssal Pullups'; target = 8; }
            else if (rank === 'B') { title = 'Weighted Sync Pullups'; target = 12; }
            else if (rank === 'A' || rank === 'S') { title = 'One-Arm L-Sit Pullups'; target = 15; }
            
            state.missions.push({
                id: 'back_directive',
                title: title,
                desc: 'Back lat-wings expansion protocol. Log compound pulling reps to maximize pull power.',
                target: Math.round(target * multiplier),
                unit: 'Reps',
                progress: 0,
                xp: Math.round(120 * multiplier),
                difficulty: `${rank}-Rank`,
                icon: 'align_vertical_bottom',
                completed: false
            });
        } else if (sector === 'Shoulders') {
            let title = 'Light Shoulder Presses';
            let target = 10;
            if (rank === 'C') { title = 'Overhead Power Presses'; target = 15; }
            else if (rank === 'B') { title = 'Handstand Wall Handsprings'; target = 8; }
            else if (rank === 'A' || rank === 'S') { title = 'Hypergravity Handstand Pushups'; target = 12; }
            
            state.missions.push({
                id: 'shoulders_directive',
                title: title,
                desc: 'Anterior deltoid stabilization: log presses inside high-gravity field.',
                target: Math.round(target * multiplier),
                unit: 'Reps',
                progress: 0,
                xp: Math.round(110 * multiplier),
                difficulty: `${rank}-Rank`,
                icon: 'upgrade',
                completed: false
            });
        } else if (sector === 'Legs') {
            state.missions.push({
                id: 'legs_directive',
                title: 'Shadow Step Lunges',
                desc: 'Fortify single-leg stabilizers for teleportation-like speed output.',
                target: Math.round(16 * multiplier),
                unit: 'Reps',
                progress: 0,
                xp: Math.round(110 * multiplier),
                difficulty: `${rank}-Rank`,
                icon: 'nordic_walking',
                completed: false
            });
        } else if (sector === 'Arms') {
            let title = 'Standard Bench Dips';
            let target = 12;
            if (rank === 'C') { title = 'Synaptic Bar Dips'; target = 18; }
            else if (rank === 'B') { title = 'Weighted Tricep Extenders'; target = 15; }
            else if (rank === 'A' || rank === 'S') { title = 'Muscle-Up Arm Triggers'; target = 8; }
            
            state.missions.push({
                id: 'arms_directive',
                title: title,
                desc: 'Tricep and bicep synaptic fibers activation loops.',
                target: Math.round(target * multiplier),
                unit: 'Reps',
                progress: 0,
                xp: Math.round(100 * multiplier),
                difficulty: `${rank}-Rank`,
                icon: 'sports_gymnastics',
                completed: false
            });
        } else if (sector === 'Core') {
            let title = 'Floor Ab Crunches';
            let target = 15;
            if (rank === 'C') { title = 'Core Overload Crunches'; target = 25; }
            else if (rank === 'B') { title = 'Hanging Leg Raises'; target = 15; }
            else if (rank === 'A' || rank === 'S') { title = 'L-Sit Hold Intervals'; target = 30; }
            
            state.missions.push({
                id: 'core_directive',
                title: title,
                desc: 'Abdominal spinal core shield fortification cycle.',
                target: Math.round(target * multiplier),
                unit: target === 30 && (rank === 'A' || rank === 'S') ? 'Sec' : 'Reps',
                progress: 0,
                xp: Math.round(100 * multiplier),
                difficulty: `${rank}-Rank`,
                icon: 'grid_3x3',
                completed: false
            });
        }
    });

    // 3. Hydration
    state.missions.push({ 
        id: 'water_directive', 
        title: 'Tactical Hydration', 
        desc: 'Consume 2.0 Liters of water to balance electrolyte core values.', 
        target: 2.0,
        unit: 'L',
        progress: 0,
        xp: 100, 
        difficulty: 'E-Rank',
        icon: 'local_drink',
        completed: false 
    });

    renderMissions();
}

function getWebStickFigureAnimation(id) {
    const key = id.toLowerCase();
    
    // Cybernetic scanning grid and sweep laser
    const hudBackground = `
        <path d="M 0 10 L 200 10 M 0 30 L 200 30 M 0 50 L 200 50 M 0 70 L 200 70 M 0 90 L 200 90 M 20 0 L 20 100 M 40 0 L 40 100 M 60 0 L 60 100 M 80 0 L 80 100 M 100 0 L 100 100 M 120 0 L 120 100 M 140 0 L 140 100 M 160 0 L 160 100 M 180 0 L 180 100" stroke="rgba(255,255,255,0.03)" stroke-width="0.8" />
        <line x1="0" y1="0" x2="200" y2="0" class="web-laser" stroke="var(--accent-blue)" stroke-opacity="0.18" stroke-width="1.2" />
        
        <!-- Monospace HUD elements inside SVG -->
        <text x="8" y="10" fill="var(--accent-purple)" font-family="monospace" font-size="5" font-weight="bold" opacity="0.6">VEO-3 // RENDER NODE</text>
        <text x="8" y="16" fill="var(--accent-blue)" font-family="monospace" font-size="4.5" font-weight="bold" opacity="0.6">KINETIC RESOLVER v3.2</text>
        <text x="145" y="10" fill="var(--accent-blue)" font-family="monospace" font-size="4.5" font-weight="bold" opacity="0.6">FPS: 120.0</text>
    `;

    if (key.includes('pushup') || key.includes('chest')) {
        return `
        <svg viewBox="0 0 200 100" class="w-full h-full text-custom" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            ${hudBackground}
            <line x1="20" y1="85" x2="180" y2="85" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
            
            <!-- Trail 2 (Oldest, very faint) -->
            <g class="ghost-figure ghost-figure-2">
                <line x1="40" y1="80" x2="80" y2="72" />
                <line x1="80" y1="72" x2="130" y2="60" />
                <circle cx="142" cy="56" r="8" fill="var(--bg-primary)" />
                <polyline points="120,62 105,73 120,85" class="pushup-arm" stroke="var(--accent-blue)" />
            </g>

            <!-- Trail 1 (Medium faint) -->
            <g class="ghost-figure ghost-figure-1">
                <line x1="40" y1="80" x2="80" y2="72" />
                <line x1="80" y1="72" x2="130" y2="60" />
                <circle cx="142" cy="56" r="8" fill="var(--bg-primary)" />
                <polyline points="120,62 105,73 120,85" class="pushup-arm" stroke="var(--accent-blue)" />
            </g>

            <!-- Active Figure (Full intensity) -->
            <g class="active-figure">
                <line x1="40" y1="80" x2="80" y2="72" />
                <line x1="80" y1="72" x2="130" y2="60" />
                <circle cx="142" cy="56" r="8" fill="var(--bg-primary)" />
                <polyline points="120,62 105,73 120,85" class="pushup-arm" stroke="var(--accent-blue)" />
                <!-- Cybernetic crosshair joints -->
                <circle cx="130" cy="60" r="4" class="web-crosshair" stroke="var(--accent-purple)" stroke-width="0.8" />
                <circle cx="80" cy="72" r="4" class="web-crosshair" stroke="var(--accent-blue)" stroke-width="0.8" />
            </g>
        </svg>`;
    } else if (key.includes('squat') || key.includes('leg') || key.includes('lunge')) {
        return `
        <svg viewBox="0 0 200 100" class="w-full h-full text-custom" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            ${hudBackground}
            <line x1="20" y1="85" x2="180" y2="85" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
            
            <!-- Trail 2 -->
            <g class="ghost-figure ghost-figure-2">
                <g class="squat-body-group">
                    <line x1="100" y1="52" x2="100" y2="30" />
                    <circle cx="100" cy="20" r="8" fill="var(--bg-primary)" />
                    <line x1="100" y1="34" x2="120" y2="34" stroke="var(--accent-blue)" />
                </g>
                <polyline points="100,52 108,68 100,85" class="squat-leg-r" />
                <polyline points="100,52 92,68 100,85" class="squat-leg-l" />
            </g>

            <!-- Trail 1 -->
            <g class="ghost-figure ghost-figure-1">
                <g class="squat-body-group">
                    <line x1="100" y1="52" x2="100" y2="30" />
                    <circle cx="100" cy="20" r="8" fill="var(--bg-primary)" />
                    <line x1="100" y1="34" x2="120" y2="34" stroke="var(--accent-blue)" />
                </g>
                <polyline points="100,52 108,68 100,85" class="squat-leg-r" />
                <polyline points="100,52 92,68 100,85" class="squat-leg-l" />
            </g>

            <!-- Active -->
            <g class="active-figure">
                <g class="squat-body-group">
                    <line x1="100" y1="52" x2="100" y2="30" />
                    <circle cx="100" cy="20" r="8" fill="var(--bg-primary)" />
                    <line x1="100" y1="34" x2="120" y2="34" stroke="var(--accent-blue)" />
                    <!-- Cybernetic crosshair on shoulder -->
                    <circle cx="100" cy="30" r="4" class="web-crosshair" stroke="var(--accent-purple)" stroke-width="0.8" />
                </g>
                <polyline points="100,52 108,68 100,85" class="squat-leg-r" />
                <polyline points="100,52 92,68 100,85" class="squat-leg-l" />
                <!-- Cybernetic crosshair on hip -->
                <circle cx="100" cy="52" r="4" class="web-crosshair" stroke="var(--accent-blue)" stroke-width="0.8" />
            </g>
        </svg>`;
    } else if (key.includes('run') || key.includes('walk') || key.includes('cardio')) {
        return `
        <svg viewBox="0 0 200 100" class="w-full h-full text-custom" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            ${hudBackground}
            <line x1="20" y1="85" x2="180" y2="85" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
            
            <!-- Trail 2 -->
            <g class="ghost-figure ghost-figure-2">
                <g class="run-body-group">
                    <line x1="100" y1="50" x2="104" y2="32" />
                    <circle cx="106" cy="22" r="8" fill="var(--bg-primary)" />
                    <polyline points="104,34 96,44 106,50" class="run-arm-l" stroke="var(--accent-blue)" />
                    <polyline points="104,34 112,44 122,42" class="run-arm-r" stroke="var(--accent-blue)" />
                </g>
                <polyline points="100,50 90,62 80,82" class="run-leg-l" />
                <polyline points="100,50 110,62 120,82" class="run-leg-r" />
            </g>

            <!-- Trail 1 -->
            <g class="ghost-figure ghost-figure-1">
                <g class="run-body-group">
                    <line x1="100" y1="50" x2="104" y2="32" />
                    <circle cx="106" cy="22" r="8" fill="var(--bg-primary)" />
                    <polyline points="104,34 96,44 106,50" class="run-arm-l" stroke="var(--accent-blue)" />
                    <polyline points="104,34 112,44 122,42" class="run-arm-r" stroke="var(--accent-blue)" />
                </g>
                <polyline points="100,50 90,62 80,82" class="run-leg-l" />
                <polyline points="100,50 110,62 120,82" class="run-leg-r" />
            </g>

            <!-- Active -->
            <g class="active-figure">
                <g class="run-body-group">
                    <line x1="100" y1="50" x2="104" y2="32" />
                    <circle cx="106" cy="22" r="8" fill="var(--bg-primary)" />
                    <polyline points="104,34 96,44 106,50" class="run-arm-l" stroke="var(--accent-blue)" />
                    <polyline points="104,34 112,44 122,42" class="run-arm-r" stroke="var(--accent-blue)" />
                    <!-- Cybernetic crosshair on shoulder -->
                    <circle cx="104" cy="32" r="4" class="web-crosshair" stroke="var(--accent-purple)" stroke-width="0.8" />
                </g>
                <polyline points="100,50 90,62 80,82" class="run-leg-l" />
                <polyline points="100,50 110,62 120,82" class="run-leg-r" />
            </g>
        </svg>`;
    } else if (key.includes('pull') || key.includes('back') || key.includes('row')) {
        return `
        <svg viewBox="0 0 200 100" class="w-full h-full text-custom" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            ${hudBackground}
            <line x1="60" y1="20" x2="140" y2="20" stroke="rgba(255,255,255,0.4)" stroke-width="3" />
            
            <!-- Trail 2 -->
            <g class="ghost-figure ghost-figure-2">
                <g class="pullup-body-group">
                    <line x1="100" y1="48" x2="100" y2="72" />
                    <circle cx="100" cy="38" r="8" fill="var(--bg-primary)" />
                    <polyline points="90,20 85,34 100,48" class="pullup-arm-l" stroke="var(--accent-blue)" />
                    <polyline points="110,20 115,34 100,48" class="pullup-arm-r" stroke="var(--accent-blue)" />
                    <line x1="100" y1="72" x2="96" y2="88" />
                    <line x1="100" y1="72" x2="104" y2="88" />
                </g>
            </g>

            <!-- Trail 1 -->
            <g class="ghost-figure ghost-figure-1">
                <g class="pullup-body-group">
                    <line x1="100" y1="48" x2="100" y2="72" />
                    <circle cx="100" cy="38" r="8" fill="var(--bg-primary)" />
                    <polyline points="90,20 85,34 100,48" class="pullup-arm-l" stroke="var(--accent-blue)" />
                    <polyline points="110,20 115,34 100,48" class="pullup-arm-r" stroke="var(--accent-blue)" />
                    <line x1="100" y1="72" x2="96" y2="88" />
                    <line x1="100" y1="72" x2="104" y2="88" />
                </g>
            </g>

            <!-- Active -->
            <g class="active-figure">
                <g class="pullup-body-group">
                    <line x1="100" y1="48" x2="100" y2="72" />
                    <circle cx="100" cy="38" r="8" fill="var(--bg-primary)" />
                    <polyline points="90,20 85,34 100,48" class="pullup-arm-l" stroke="var(--accent-blue)" />
                    <polyline points="110,20 115,34 100,48" class="pullup-arm-r" stroke="var(--accent-blue)" />
                    <line x1="100" y1="72" x2="96" y2="88" />
                    <line x1="100" y1="72" x2="104" y2="88" />
                    <!-- Cybernetic crosshair on shoulder -->
                    <circle cx="100" cy="48" r="4" class="web-crosshair" stroke="var(--accent-purple)" stroke-width="0.8" />
                </g>
            </g>
        </svg>`;
    } else if (key.includes('water') || key.includes('drink') || key.includes('hydration')) {
        return `
        <svg viewBox="0 0 200 100" class="w-full h-full text-custom" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            ${hudBackground}
            
            <!-- Trail 2 -->
            <g class="ghost-figure ghost-figure-2">
                <g class="water-body">
                    <line x1="90" y1="80" x2="90" y2="52" />
                    <circle cx="90" cy="42" r="8" fill="var(--bg-primary)" />
                    <polyline points="90,56 80,68 90,80" />
                    <polyline points="90,56 102,46 95,42" class="water-arm-r" stroke="var(--accent-blue)" />
                </g>
            </g>

            <!-- Trail 1 -->
            <g class="ghost-figure ghost-figure-1">
                <g class="water-body">
                    <line x1="90" y1="80" x2="90" y2="52" />
                    <circle cx="90" cy="42" r="8" fill="var(--bg-primary)" />
                    <polyline points="90,56 80,68 90,80" />
                    <polyline points="90,56 102,46 95,42" class="water-arm-r" stroke="var(--accent-blue)" />
                </g>
            </g>

            <!-- Active -->
            <g class="active-figure">
                <g class="water-body">
                    <line x1="90" y1="80" x2="90" y2="52" />
                    <circle cx="90" cy="42" r="8" fill="var(--bg-primary)" />
                    <polyline points="90,56 80,68 90,80" />
                    <polyline points="90,56 102,46 95,42" class="water-arm-r" stroke="var(--accent-blue)" />
                </g>
                <circle cx="95" cy="35" r="2" class="water-droplet" fill="var(--accent-blue)" stroke="none" />
                <rect x="135" y="45" width="16" height="24" rx="2" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
                <rect x="137" y="47" width="12" height="20" rx="1" class="water-fill" fill="var(--accent-blue)" stroke="none" />
            </g>
        </svg>`;
    } else {
        return `
        <svg viewBox="0 0 200 100" class="w-full h-full text-custom" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            ${hudBackground}
            <line x1="20" y1="85" x2="180" y2="85" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
            <g class="active-figure">
                <g class="pushup-body-group">
                    <line x1="40" y1="80" x2="80" y2="72" />
                    <line x1="80" y1="72" x2="130" y2="60" />
                    <circle cx="142" cy="56" r="8" fill="var(--bg-primary)" />
                    <polyline points="120,62 105,73 120,85" class="pushup-arm" stroke="var(--accent-blue)" />
                </g>
            </g>
        </svg>`;
    }
}

function calculateArchetypeAssignment() {
    const fitLevel = document.querySelector('input[name="fit-level"]:checked').value;
    const bodyGoal = document.querySelector('input[name="body-goal"]:checked').value;
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const anime = document.getElementById('input-fav-anime').value.trim() || 'Solo Leveling';
    const character = document.getElementById('input-fav-character').value.trim() || 'Sung Jin-Woo';
    const style = document.querySelector('input[name="fighting-style"]:checked').value;
    const motivation = document.querySelector('input[name="motivation"]:checked').value;
    const questMode = document.querySelector('input[name="quest-mode"]:checked')?.value || 'squire';
    
    state.fitLevel = fitLevel;
    state.bodyGoal = bodyGoal;
    state.experienceTier = experience;
    state.favAnime = anime;
    state.favCharacter = character;
    state.fightingStyle = style;
    state.motivationType = motivation;
    state.adaptiveQuestMode = (questMode === 'squire');
    
    let assignedClass = 'Aura Striker';
    let assignedRank = 'E';
    let stats = { str: 10, agi: 8, stm: 12, int: 6 };
    let desc = "";
    
    const lowerChar = character.toLowerCase();
    
    if (style === 'shadow' || lowerChar.includes('jin-woo') || lowerChar.includes('jinwoo') || lowerChar.includes('shadow')) {
        if (bodyGoal === 'lean') {
            assignedClass = 'Shadow Monarch';
            stats = { str: 20, agi: 28, stm: 24, int: 16 };
            desc = `Decoded: Shadow Monarch class. Inspired by ${character}. Focused on ruthless assassin agility, anaerobic bursts, stealth speed streaks, and shadow speed-work.`;
        } else {
            assignedClass = 'Agile Assassin';
            stats = { str: 15, agi: 24, stm: 20, int: 10 };
            desc = `Decoded: Agile Assassin class. Inspired by ${character}. Ideal for high-tempo running, calisthenics, and evasive pace-training.`;
        }
    } else if (style === 'brawler' || lowerChar.includes('goku') || lowerChar.includes('vegeta') || lowerChar.includes('strength')) {
        if (bodyGoal === 'bulking') {
            assignedClass = 'Flame Warrior';
            stats = { str: 32, agi: 12, stm: 22, int: 8 };
            desc = `Decoded: Flame Warrior class. Inspired by ${character}. Built for raw muscular strength, heavy resistance overloading, and brawler endurance.`;
        } else {
            assignedClass = 'Beast Tank';
            stats = { str: 28, agi: 10, stm: 28, int: 6 };
            desc = `Decoded: Beast Tank class. Inspired by ${character}. Geared towards extreme physical resilience, compound lifts, and core structural load-bearing.`;
        }
    } else if (style === 'tactician' || lowerChar.includes('levi') || lowerChar.includes('isagi')) {
        if (bodyGoal === 'endurance') {
            assignedClass = 'Celestial Runner';
            stats = { str: 12, agi: 22, stm: 35, int: 15 };
            desc = `Decoded: Celestial Runner class. Inspired by ${character}. Designed for infinite cardiovascular capacity, metavision strategic pacing, and daily hydration compliance.`;
        } else {
            assignedClass = 'Iron Guardian';
            stats = { str: 20, agi: 16, stm: 25, int: 18 };
            desc = `Decoded: Iron Guardian class. Inspired by ${character}. Focused on tactical bodyweight control, core stability, and disciplined pacing.`;
        }
    } else {
        assignedClass = 'Aura Striker';
        desc = `Decoded: Aura Striker class. Combined your fitness goal with ${character}'s mindset to shape an all-round hybrid evolution loop.`;
    }
    
    if (fitLevel === 'beginner') {
        assignedRank = 'E';
    } else if (fitLevel === 'intermediate') {
        assignedRank = 'C';
    } else {
        assignedRank = 'A';
    }
    
    if (experience === 'veteran' && assignedRank !== 'S') {
        assignedRank = assignedRank === 'A' ? 'S' : (assignedRank === 'C' ? 'B' : 'D');
    }
    
    state.character = assignedClass;
    state.rank = assignedRank;
    state.rankTitle = `${assignedRank}-Rank ${assignedClass}`;
    state.stats = stats;
    
    setTimeout(() => {
        playLevelUpSound();
    }, 400);
    
    // Update Reveal Page
    document.getElementById('assignment-rank-badge').innerText = assignedRank;
    document.getElementById('assignment-class-title').innerText = assignedClass.toUpperCase();
    document.getElementById('assignment-rank-text').innerText = `${assignedRank}-RANK ADAPTIVE HUNTER`;
    document.getElementById('assignment-description').innerText = desc;
    
    // Update active primary colors matching Zenith UI design system
    let activeGlow = '#9a0002'; // default light mode Monolith Cherry Red
    if (state.theme === 'dark') {
        if (assignedClass === 'Shadow Monarch') activeGlow = '#bd00ff'; // Zenith Hyper Purple
        else if (assignedClass === 'Flame Warrior' || assignedClass === 'Beast Tank') activeGlow = '#c3f400'; // Zenith Electric Lime
        else if (assignedClass === 'Celestial Runner') activeGlow = '#c3f400'; // Zenith Electric Lime
        else if (assignedClass === 'Agile Assassin' || assignedClass === 'Iron Guardian') activeGlow = '#00eefc'; // Zenith Cyber Cyan
    }
    
    document.documentElement.style.setProperty('--primary', activeGlow);
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
    } : { r: 154, g: 0, b: 2 };
}


/* --- DIRECTIVES BUILD PROTOCOLS --- */
function generateDailyMissions() {
    if (geminiApiKey) {
        fetchAiMissionsWeb();
    } else {
        generateLocalCuratedMissionsWeb();
    }
}


/* --- EVENT TRANSACTIONS --- */
function logFitnessActivity(type, amount) {
    if (state.screen === 'screen-splash' || state.screen === 'screen-onboarding' || state.screen === 'screen-assignment') {
        logToConsole("[WARNING] Complete synchronization setup before logging workouts!");
        return;
    }
    
    logToConsole(`[SYNC] Fitness event registered: ${type} (+${amount})`);
    
    let mission = null;
    if (type === 'run') mission = state.missions.find(m => m.id === 'run_directive');
    if (type === 'pushup') mission = state.missions.find(m => m.id === 'pushup_directive');
    if (type === 'squat') mission = state.missions.find(m => m.id === 'squat_directive');
    if (type === 'water') mission = state.missions.find(m => m.id === 'water_directive');
    
    if (mission && !mission.completed) {
        mission.progress = Math.min(mission.target, mission.progress + amount);
        
        if (type === 'water') {
            state.water = Math.min(2.0, state.water + amount);
            if (state.water >= 2.0) {
                unlockAchievement('hydration_max');
            }
        }
        
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
            
            if (type === 'run') state.stats.stm += 2;
            if (type === 'pushup') state.stats.str += 2;
            if (type === 'squat') state.stats.str += 2;
            if (type === 'water') state.stats.int += 1;
            
            const allDone = state.missions.every(m => m.completed);
            if (allDone) {
                unlockAchievement('all_missions');
            }
        } else {
            playXPTickSound();
        }
    } else {
        if (type === 'water') state.water = Math.min(2.0, state.water + amount);
        let cals = 0;
        if (type === 'run') cals = Math.round(amount * 75);
        if (type === 'pushup') cals = Math.round(amount * 0.6);
        if (type === 'squat') cals = Math.round(amount * 0.8);
        state.calories += cals;
        playXPTickSound();
    }
    
    renderDashboard();
    renderMissions();
    renderStats();
    
    syncTelemetryToParent();
}

function addXP(amount) {
    state.xp += amount;
    burstParticles();
    
    if (state.xp >= state.maxXp) {
        state.xp = state.xp - state.maxXp;
        state.level += 1;
        state.maxXp = Math.round(state.maxXp * 1.35);
        
        logToConsole(`[LEVEL UP] Protagonist reached Level ${state.level}! Core capacity expanded.`);
        playLevelUpSound();
        
        state.stats.str += 3;
        state.stats.agi += 3;
        state.stats.stm += 3;
        state.stats.int += 1;
        
        // Auto-scale Squire mode starting baseline targets by +5 Reps / +0.5 KM per level
        if (state.adaptiveQuestMode) {
            let multiplier = 1.0;
            if (state.rank === 'D') multiplier = 0.5;
            if (state.rank === 'C') multiplier = 1.2;
            if (state.rank === 'B') multiplier = 2.0;
            if (state.rank === 'A') multiplier = 3.0;
            if (state.rank === 'S') multiplier = 4.0;
            
            state.missions.forEach(m => {
                if (m.id === 'run_directive') {
                    m.target = Math.round((m.target + 0.5 * multiplier) * 10) / 10;
                    m.completed = (m.progress >= m.target);
                }
                if (m.id === 'pushup_directive') {
                    m.target = Math.round(m.target + 5 * multiplier);
                    m.completed = (m.progress >= m.target);
                }
                if (m.id === 'squat_directive') {
                    m.target = Math.round(m.target + 5 * multiplier);
                    m.completed = (m.progress >= m.target);
                }
            });
            logToConsole(`[SYSTEM PROTOCOL] Squire Sync expanded Daily Quest targets: +${0.5 * multiplier} KM / +${Math.round(5 * multiplier)} Reps.`);
        }
        
        if (state.level >= 10) {
            unlockAchievement('s_rank_clear');
        }
        
        const bezel = document.querySelector('.phone-container');
        if (bezel) {
            bezel.classList.add('flash-alert');
            setTimeout(() => bezel.classList.remove('flash-alert'), 800);
        }
    }
}


/* --- CHARACTER EVOLUTION PROTOCOL (LIMIT BREAK) --- */
function executeCharacterEvolution() {
    playLimitBreakSound();
    burstParticles();
    
    particleIntensity = 12.0;
    maxParticles = 180;
    
    document.body.classList.add('flash-alert');
    setTimeout(() => document.body.classList.remove('flash-alert'), 800);
    
    state.stats.str += 45;
    state.stats.agi += 32;
    state.stats.stm += 40;
    state.stats.int += 25;
    
    document.getElementById('evo-str-boost').innerText = "+45 STR";
    document.getElementById('evo-agi-boost').innerText = "+32 AGI";
    document.getElementById('evo-stm-boost').innerText = "+40 STM";
    
    logToConsole(`[EVOLUTION] Limit break protocol successfully engaged! DNA code rewritten.`);
    unlockAchievement('limit_break_one');
    
    document.getElementById('evo-stage-badge').innerText = `Lvl ${state.level} (Ascended Form)`;
    document.getElementById('evo-stage-next').innerText = `Ascension Limits Shattered.`;
    
    document.getElementById('evo-character-img').classList.remove('grayscale');
    document.getElementById('evo-character-img').classList.add('saturate-150');
    
    renderStats();
    syncTelemetryToParent();
    
    setTimeout(() => {
        particleIntensity = 1.0;
        maxParticles = 50;
    }, 2000);
}


/* --- ACHIEVEMENTS BOUND PROTOCOLS --- */
function unlockAchievement(id) {
    const ach = state.achievementsList.find(a => a.id === id);
    if (ach && !ach.unlocked) {
        ach.unlocked = true;
        state.unlockedAchievements++;
        logToConsole(`[ACHIEVEMENT UNLOCKED] "${ach.title.toUpperCase()}" badge bound to profile.`);
        
        showAchievementToast(ach);
        renderAchievements();
        syncTelemetryToParent();
    }
}

function showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'glass-card p-3 flex items-center gap-3 border-2 border-primary animate-[fadeIn_0.3s_ease-out] z-50';
    toast.style.cssText = 'position: absolute; top: 80px; left: 16px; right: 16px; border-radius: var(--radius-md);';
    toast.innerHTML = `
        <span class="material-symbols-outlined text-custom">workspace_premium</span>
        <div class="text-left">
            <h4 class="font-technical text-xs font-bold uppercase text-custom">Badge Bound!</h4>
            <p class="text-[9px] text-text-primary uppercase leading-tight">${ach.title}</p>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}


/* --- DYNAMIC RENDER ENGINE --- */
function switchMobileScreen(targetScreenId) {
    if (targetScreenId === 'screen-dashboard' && state.screen === 'screen-assignment') {
        unlockAchievement('first_directive');
    }
    
    const activeScreen = document.querySelector('.screen-container.active');
    if (activeScreen) {
        activeScreen.classList.remove('active');
    }
    
    const targetScreen = document.getElementById(targetScreenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.screen = targetScreenId;
    }
    
    // Bottom navigation bar toggling visibility
    const navBar = document.getElementById('app-bottom-nav');
    if (targetScreenId === 'screen-splash' || targetScreenId === 'screen-onboarding' || targetScreenId === 'screen-assignment') {
        navBar.style.display = 'none';
    } else {
        navBar.style.display = 'flex';
    }
    
    // Format active/inactive styles from designer blueprint
    const navButtons = {
        'screen-dashboard': 'nav-btn-home',
        'screen-missions': 'nav-btn-missions',
        'screen-evolution': 'nav-btn-evolution',
        'screen-stats': 'nav-btn-stats',
        'screen-achievements': 'nav-btn-achievements'
    };
    
    document.querySelectorAll('#app-bottom-nav button').forEach(btn => {
        btn.className = "flex flex-col items-center justify-center w-12 h-12 text-on-surface-variant opacity-60 hover:opacity-100 hover:bg-primary-container/20 transition-all duration-200 active:translate-y-1 rounded-xl";
    });
    
    const activeBtnId = navButtons[targetScreenId];
    if (activeBtnId) {
        const activeBtn = document.getElementById(activeBtnId);
        if (activeBtn) {
            activeBtn.className = "flex flex-col items-center justify-center w-12 h-12 text-on-primary bg-primary rounded-xl p-2 scale-110 transition-all duration-300 active:translate-y-1 shadow-[0_4px_12px_rgba(var(--accent-glow-rgb),0.35)]";
        }
    }
    
    playWhooshSound();
}

function renderDashboard() {
    // Header level scale and rank titles
    document.getElementById('dash-level').innerText = `Level Scale: Lvl ${state.level}`;
    document.getElementById('dash-class-badge').innerText = state.character.toUpperCase();
    
    const syncPercentage = Math.min(100, Math.round((state.xp / state.maxXp) * 100));
    document.getElementById('dash-sync-text').innerText = `${syncPercentage}% SYNC DETECTED`;
    
    // Dynamic circular progress ring stroke-dashoffset (440 represents 100%)
    const circle = document.getElementById('dashboard-sync-circle');
    if (circle) {
        const offset = 440 - (440 * (state.xp / state.maxXp));
        circle.style.strokeDashoffset = offset;
    }
    
    document.getElementById('dash-xp-text').innerText = `${state.xp} / ${state.maxXp} XP`;
    document.getElementById('dash-xp-fill').style.width = `${(state.xp / state.maxXp) * 100}%`;
    
    document.getElementById('dash-calories').innerText = state.calories.toLocaleString();
    document.getElementById('dash-streak').innerText = state.streak;
    
    // Display preview of first run directive on the dashboard card
    const firstMission = state.missions[0];
    if (firstMission) {
        document.getElementById('dash-mission-preview-title').innerText = firstMission.title.toUpperCase();
        document.getElementById('dash-mission-preview-desc').innerText = firstMission.desc;
    }
    
    // Customized Anime Quotes
    let characterQuotes = state.quotes[state.favCharacter] || state.quotes['generic'];
    const quoteIndex = (state.level + state.streak) % characterQuotes.length;
    const activeQuote = characterQuotes[quoteIndex];
    document.getElementById('dash-quote').innerText = `"${activeQuote.text}"`;
    
    // Character asset URL selections
    const customImgs = {
        'Shadow Monarch': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQzZBzO5ElLPh1Z1dwji2X-DTm-FDvImVVkw4bYIy9VpljKt1EEk6J1UB5N996ldL9VHyQ_KJ7eayh6BmNsfHYl1TtYeIihbuf9BVxqF16o172QpwhISHhvt9ay4TE3KjOxhpdfaA79FTwjIcY5JMbur_yqwDbn1jNwJYq7WXKdtK15wjqivZ454H5ffum-bdhrW-OtkHAWcv-v8Cc5r_Im8-_6EVCQmIBYOIuSestDkQXBV4jVmlXJk_FGpy2mcjUA7H5sY4ZPc_U',
        'Flame Warrior': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtvCtgikuvssDi4oz-1Idt6vixgQXn9BYkJmKW0bzIXcJ-GDJLe61Qv300THyCJ7xwrSSCDdb1DPcN8dcRe6TLavuoelZKc3nOlC9-1jgDEKts4cr6lwL_wqe5-cImok0T5pk9WN-TG5IGklE4HA7RJNgrCyIzP2b0QImWM13GMKXxoke2AhpKdu1suXgGH2REEFRxiCXI8g6aILtXYATaNfWoI1ogpHuehbZTXDxz3_t_irJQi2qs7VhEKUab-J1J_IlrgaRADC9N',
        'Celestial Runner': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR3lfKDV9lCBxKdan6y0IGeomFCEKrIep0mrvCW3aTWRT50pcDNHFXdk0vGf1miWAbYeFYsaZHevYQUYnOBKezRHM0cy3foCIpM_FY9UD_zy3ZDZTIjFd7R71AVFO10SxmToL-GtJWYk6M-NtuVOshP5BAI3CxQa9IARahfJmNn55CUC3Te5erFGt6_Dq-Pla2iPowy1vsiUEqZ3oB1DvCpaE-G13PJkVkK0ReSspr2DOKNj_gtYehFHH2a6NvUxvzHNgskwu0P0IN'
    };
    
    const activeImg = customImgs[state.character] || customImgs['Shadow Monarch'];
    document.getElementById('dash-avatar').src = activeImg;
    document.getElementById('bar-avatar').src = activeImg;
    document.getElementById('evo-character-img').src = activeImg;
}

function renderMissions() {
    const container = document.getElementById('missions-card-list');
    container.innerHTML = '';
    
    state.missions.forEach(m => {
        const card = document.createElement('div');
        card.className = `col-span-1 md:col-span-12 glass-card p-6 flex flex-col gap-6 relative overflow-hidden group cursor-pointer ${m.completed ? 'opacity-70 border-primary/20' : ''}`;
        
        const completionRate = Math.min(100, Math.round((m.progress / m.target) * 100));
        
        card.innerHTML = `
            <div class="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
            <div class="flex justify-between items-start">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <span class="material-symbols-outlined text-custom">${m.icon}</span>
                        <h2 class="font-title-md text-sm text-custom uppercase tracking-widest">${m.title}</h2>
                    </div>
                    <p class="font-body-md text-xs text-on-surface-variant">${m.desc}</p>
                </div>
                
                ${m.completed ? `
                    <div class="flex items-center gap-2 text-custom font-label-sm text-[10px] uppercase tracking-widest">
                        <div class="w-5 h-5 border border-primary flex items-center justify-center bg-primary/10 rounded-sm">
                            <span class="material-symbols-outlined text-[10px] text-custom font-bold">close</span>
                        </div>
                        Protocol Complete
                    </div>
                ` : `
                    <div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-[10px] uppercase tracking-widest">
                        <div class="w-5 h-5 border border-on-surface/20 flex items-center justify-center rounded-sm"></div>
                        In Progress
                    </div>
                `}
            </div>
            
            <div class="space-y-2">
                <div class="flex justify-between font-label-sm text-[10px] text-custom uppercase">
                    <span>Directive Sync</span>
                    <span class="text-custom font-bold">${completionRate}%</span>
                </div>
                <div class="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-1000 ease-out" style="width: ${completionRate}%;"></div>
                </div>
            </div>
            
            ${m.completed ? '' : `
                <div class="flex justify-end pt-3 border-t border-on-surface/10">
                    <button class="bg-primary text-on-primary font-label-sm text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors duration-300 active:scale-95" onclick="logFitnessActivity('${m.id.split('_')[0]}', ${m.id.includes('run') ? 1.0 : (m.id.includes('water') ? 0.25 : 10)})">
                        LOG INCREMENT
                    </button>
                </div>
            `}

            <div class="anim-tray hidden pt-4 border-t border-on-surface/10 flex flex-col items-center justify-center gap-2">
                <div class="w-full max-w-[200px] h-[100px] flex items-center justify-center bg-black/20 border border-primary/20 rounded-lg overflow-hidden relative">
                    ${getWebStickFigureAnimation(m.id)}
                </div>
                <span class="font-technical text-[9px] text-text-secondary uppercase tracking-widest">VEO-3 NEURAL KINETIC RESOLVER v3.2</span>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) return;
            const tray = card.querySelector('.anim-tray');
            if (tray) {
                tray.classList.toggle('hidden');
                card.classList.toggle('border-primary/50');
            }
        });

        container.appendChild(card);
    });
}

function renderStats() {
    // Dynamic double-line uppercase character titles
    const parsedClass = state.character.toUpperCase().replace(' ', '<br/>');
    document.getElementById('stats-hero-title').innerHTML = parsedClass;
    
    // Stats exp sync bento calculations
    const xpPercent = Math.min(100, Math.round((state.xp / state.maxXp) * 100));
    document.getElementById('stats-exp-num').innerText = `${xpPercent}%`;
    document.getElementById('stats-exp-bar').style.width = `${xpPercent}%`;
    
    // Mock general sync rate calculated with stats ratios
    const activeMissionsCount = state.missions.filter(m => m.completed).length;
    const mockSyncRate = Math.min(100, Math.round(75 + (activeMissionsCount * 6.25)));
    document.getElementById('stats-sync-num').innerText = `${mockSyncRate}%`;
    document.getElementById('stats-sync-bar').style.width = `${mockSyncRate}%`;
    
    // Sync Ring on dashboard preview
    const dashSyncLabel = document.getElementById('dash-sync-text');
    if (dashSyncLabel) {
        dashSyncLabel.innerText = `${mockSyncRate}% SYNC DETECTED`;
    }
    
    // Combat Matrix Bars (max range 100)
    const maxVal = 100;
    document.getElementById('stats-matrix-str').style.width = `${(state.stats.str / maxVal) * 100}%`;
    document.getElementById('stats-matrix-agi').style.width = `${(state.stats.agi / maxVal) * 100}%`;
    document.getElementById('stats-matrix-stm').style.width = `${(state.stats.stm / maxVal) * 100}%`;
    document.getElementById('stats-matrix-int').style.width = `${(state.stats.int / maxVal) * 100}%`;
    
    // Character Evolution parameters
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
            <span class="material-symbols-outlined text-3xl mb-2 block ${a.unlocked ? 'text-custom animate-pulse' : 'text-text-secondary opacity-40'}">
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
    
    for (let i = 0; i < 35; i++) {
        const day = document.createElement('div');
        day.className = 'heatmap-day';
        
        if (i < 20) {
            const act = Math.floor(Math.random() * 4);
            if (act > 0) {
                day.classList.add(`active-${act}`);
            }
        } else if (i === 24 || i === 31 || i === 34) {
            day.classList.add('active-4');
        }
        grid.appendChild(day);
    }
}


/* --- TELEMETRY PORT BRIDGE WRAPPER --- */
function logToConsole(message) {
    console.log(message);
    
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


/* --- BINDINGS --- */
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    loadApiKey();
    
    const bootBtn = document.getElementById('btn-boot-system');
    if (bootBtn) {
        bootBtn.addEventListener('click', () => {
            initAudio();
            playLevelUpSound();
            switchMobileScreen('screen-onboarding');
            logToConsole("[NEURAL] Link active. Ready to sync physical parameters.");
        });
    }
    
    document.getElementById('btn-onboarding-next').addEventListener('click', nextOnboardingStep);
    document.getElementById('btn-onboarding-back').addEventListener('click', backOnboardingStep);
    
    document.getElementById('btn-assignment-confirm').addEventListener('click', () => {
        generateDailyMissions();
        switchMobileScreen('screen-dashboard');
        
        renderDashboard();
        renderMissions();
        renderStats();
        buildStatsHeatmap();
        renderAchievements();
        
        syncTelemetryToParent();
    });
    
    document.getElementById('btn-trigger-evolution').addEventListener('click', executeCharacterEvolution);
    
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
