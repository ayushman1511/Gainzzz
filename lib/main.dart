import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:math' as math;
import 'dart:io';
import 'dart:convert';
import 'api_config.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);
  runApp(const GainsApp());
}

/* --- THEME DEFINITIONS --- */
class AppColors {
  // Dark Mode - Zenith Training Protocol
  static const Color darkBg = Color(0xFF131313);
  static const Color darkSurface = Color(0xFF1C1B1B);
  static const Color darkSurfaceCard = Color(0xFF201F1F);
  static const Color darkText = Color(0xFFE5E2E1);
  static const Color darkTextMuted = Color(0xFFC4C9AC);
  static const Color darkOutline = Color(0xFF8E9379);
  
  // Neon Accents
  static const Color neonVolt = Color(0xFFC3F400);
  static const Color neonCyan = Color(0xFF00EEFC);
  static const Color neonPurple = Color(0xFFBD00FF);
  static const Color neonRed = Color(0xFFFFB4AB);

  // Light Mode - Crimson Monolith Theme
  static const Color lightBg = Color(0xFFFFF8F3);
  static const Color lightSurface = Color(0xFFF5ECE4);
  static const Color lightSurfaceCard = Color(0xFFEAE1D9);
  static const Color lightText = Color(0xFF1F1B16);
  static const Color lightTextMuted = Color(0xFF5B403C);
  static const Color lightOutline = Color(0xFF8F706B);
  static const Color monolithRed = Color(0xFF9A0002);
}

class GainsApp extends StatefulWidget {
  const GainsApp({super.key});

  @override
  State<GainsApp> createState() => _GainsAppState();
}

class _GainsAppState extends State<GainsApp> {
  bool _isDark = true;

  void toggleTheme() {
    setState(() {
      _isDark = !_isDark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gainzzz',
      debugShowCheckedModeBanner: false,
      themeMode: _isDark ? ThemeMode.dark : ThemeMode.light,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.darkBg,
        primaryColor: AppColors.neonVolt,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.neonVolt,
          secondary: AppColors.neonCyan,
          tertiary: AppColors.neonPurple,
          surface: AppColors.darkSurface,
          error: AppColors.neonRed,
        ),
        textTheme: const TextTheme(
          displayLarge: TextStyle(fontFamily: 'Anton', fontSize: 44, color: AppColors.darkText, height: 1.0, letterSpacing: 0.02),
          headlineLarge: TextStyle(fontFamily: 'Anton', fontSize: 24, color: AppColors.darkText, letterSpacing: 0.04),
          titleMedium: TextStyle(fontFamily: 'Geist', fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.darkText),
          bodyMedium: TextStyle(fontFamily: 'Geist', fontSize: 14, color: AppColors.darkTextMuted),
        ),
      ),
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: AppColors.lightBg,
        primaryColor: AppColors.monolithRed,
        colorScheme: const ColorScheme.light(
          primary: AppColors.monolithRed,
          secondary: Color(0xFF0016A7),
          tertiary: Color(0xFF0022E6),
          surface: AppColors.lightSurface,
          error: Color(0xFFBA1A1A),
        ),
        textTheme: const TextTheme(
          displayLarge: TextStyle(fontFamily: 'Anton', fontSize: 44, color: AppColors.lightText, height: 1.0, letterSpacing: 0.02),
          headlineLarge: TextStyle(fontFamily: 'Anton', fontSize: 24, color: AppColors.lightText, letterSpacing: 0.04),
          titleMedium: TextStyle(fontFamily: 'Geist', fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.lightText),
          bodyMedium: TextStyle(fontFamily: 'Geist', fontSize: 14, color: AppColors.lightTextMuted),
        ),
      ),
      home: AppLayoutShell(isDark: _isDark, onThemeToggle: toggleTheme),
    );
  }
}

/* --- MAIN SHELL CONTROLLER --- */
class AppLayoutShell extends StatefulWidget {
  final bool isDark;
  final VoidCallback onThemeToggle;

  const AppLayoutShell({
    super.key,
    required this.isDark,
    required this.onThemeToggle,
  });

  @override
  State<AppLayoutShell> createState() => _AppLayoutShellState();
}

class _AppLayoutShellState extends State<AppLayoutShell> {
  // Navigation State
  String _activeScreen = 'splash';
  int _activeNavIndex = 0;

  // Synchronization profile state
  int _level = 1;
  double _xp = 250;
  double _maxXp = 1000;
  int _streak = 1;
  int _calories = 0;
  double _water = 0.0;
  Map<String, int> _stats = {'STR': 20, 'AGI': 15, 'STM': 25, 'INT': 12};

  // Questionnaire responses
  String _fitLevel = 'beginner';
  String _bodyGoal = 'lean';
  String _experience = 'new';
  String _favAnime = 'Solo Leveling';
  String _favCharacter = 'Sung Jin-Woo';
  String _fightingStyle = 'shadow';
  String _motivation = 'intense';
  
  String _assignedClass = 'Shadow Monarch';
  String _assignedRank = 'S';
  String _assignedDesc = '';
  Color _themeAccentColor = AppColors.neonVolt;
  
  // Directives
  List<Map<String, dynamic>> _missions = [];
  int _unlockedAchievements = 0;
  List<String> _selectedMuscleSectors = [];
  bool _isLoadingAiMissions = false;
  bool _adaptiveQuestMode = true;
  final Set<String> _expandedMissions = {};

  final List<Achievement> _achievementsList = const [
    Achievement(
      id: 'first_directive',
      title: 'First Directive',
      desc: 'Log standard workout loops to initialize synchro.',
    ),
    Achievement(
      id: 'hydration_max',
      title: 'Hydration Max',
      desc: 'Consume 2.0L water to satisfy biological system requirements.',
    ),
    Achievement(
      id: 'limit_break_one',
      title: 'System Ascendant',
      desc: 'Break the level threshold and upgrade profile Rank.',
    ),
    Achievement(
      id: 'shadow_monarch_ascent',
      title: 'Apex Evolution',
      desc: 'Achieve high-tier synchronization output.',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _assignedAccentColor();
    _generateMissions();
  }

  void _assignedAccentColor() {
    if (!widget.isDark) {
      _themeAccentColor = AppColors.monolithRed;
      return;
    }
    
    if (_assignedClass == 'Shadow Monarch') {
      _themeAccentColor = AppColors.neonPurple;
    } else if (_assignedClass == 'Flame Warrior' || _assignedClass == 'Beast Tank') {
      _themeAccentColor = AppColors.neonVolt;
    } else if (_assignedClass == 'Celestial Runner') {
      _themeAccentColor = AppColors.neonCyan;
    } else {
      _themeAccentColor = AppColors.neonCyan;
    }
  }

  void _generateMissions() {
    if (geminiApiKey.isNotEmpty) {
      _fetchAiMissions();
    } else {
      _generateLocalCuratedMissions();
    }
  }

  Future<void> _fetchAiMissions() async {
    setState(() {
      _isLoadingAiMissions = true;
    });

    try {
      final client = HttpClient();
      final url = Uri.parse(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$geminiApiKey',
      );
      
      final request = await client.postUrl(url);
      request.headers.contentType = ContentType.json;
      
      double mult = 1.0;
      if (_assignedRank == 'D') mult = 0.5;
      if (_assignedRank == 'C') mult = 1.2;
      if (_assignedRank == 'B') mult = 2.0;
      if (_assignedRank == 'A') mult = 3.0;
      if (_assignedRank == 'S') mult = 4.0;

      final prompt = """
You are the Abyssal Protocol AI. Generate a premium, gamified, high-tech fitness training routine for a protagonist.
Here are the user details:
- Current Rank: $_assignedRank-Rank
- Specialty Class: $_assignedClass
- Target Muscle sectors to train: ${_selectedMuscleSectors.isEmpty ? "General Conditioning" : _selectedMuscleSectors.join(', ')}
- Favorite anime hero preset: $_favCharacter

Generate exactly 2-3 custom, highly immersive, game-like fitness exercises specifically curating movements for the target muscle sectors.
Return your output STRICTLY as a raw JSON array of objects. Do not wrap in markdown or any other tags.
Each object must have exactly these keys:
- "id": a unique string key (e.g., "ai_chest_press", "ai_back_rows")
- "title": a dramatic, epic sci-fi or anime workout title (e.g. "Abyssal Gravity Pullups", "Absolute Core Overload")
- "desc": a technical, immersive 1-sentence description detailing the story-driven purpose of this exercise
- "target": a number (representing reps or seconds) between 8 and 30 (scaled appropriately for $_assignedRank-Rank)
- "unit": a string ("Reps" or "Sec")
- "xp": an integer XP reward (ranging from 100 to 300)
""";

      final body = {
        'contents': [
          {
            'parts': [
              {'text': prompt}
            ]
          }
        ],
        'generationConfig': {
          'responseMimeType': 'application/json'
        }
      };

      request.write(jsonEncode(body));
      final response = await request.close();
      
      if (response.statusCode == 200) {
        final responseBody = await response.transform(utf8.decoder).join();
        final jsonDecoded = jsonDecode(responseBody);
        final String textResponse = jsonDecoded['candidates'][0]['content']['parts'][0]['text'];
        
        final List<dynamic> parsedMissions = jsonDecode(textResponse.trim());
        
        // Generate core 3
        double baseRun = _adaptiveQuestMode ? (3.0 + 0.5 * (_level - 1)) : 10.0;
        double basePush = _adaptiveQuestMode ? (30 + 5 * (_level - 1)) : 100.0;
        double baseSquat = _adaptiveQuestMode ? (30 + 5 * (_level - 1)) : 100.0;

        double runTarget = double.parse((baseRun * mult).toStringAsFixed(1));
        double pushTarget = (basePush * mult).roundToDouble();
        double squatTarget = (baseSquat * mult).roundToDouble();

        final List<Map<String, dynamic>> coreMissions = [
          {
            'id': 'run',
            'title': 'Navigational Run',
            'desc': 'Navigate sector parameters. Target: $runTarget KM.',
            'target': runTarget,
            'unit': 'KM',
            'progress': 0.0,
            'xp': (200 * mult).round(),
            'rank': '$_assignedRank-Rank',
            'icon': Icons.directions_run,
            'completed': false
          },
          {
            'id': 'pushup',
            'title': 'Gravity Pushups',
            'desc': 'Log ${pushTarget.round()} cycles inside high resistance field.',
            'target': pushTarget,
            'unit': 'Reps',
            'progress': 0.0,
            'xp': (150 * mult).round(),
            'rank': '$_assignedRank-Rank',
            'icon': Icons.fitness_center,
            'completed': false
          },
          {
            'id': 'squat',
            'title': 'Shadow Squats',
            'desc': 'Complete ${squatTarget.round()} compound reps to expand core density.',
            'target': squatTarget,
            'unit': 'Reps',
            'progress': 0.0,
            'xp': (150 * mult).round(),
            'rank': '$_assignedRank-Rank',
            'icon': Icons.sports_mma,
            'completed': false
          },
        ];

        final List<Map<String, dynamic>> customMissions = parsedMissions.map((m) {
          IconData icon = Icons.fitness_center;
          String mid = m['id'].toString().toLowerCase();
          String munit = m['unit'].toString().toLowerCase();
          if (mid.contains('run') || munit == 'km') icon = Icons.directions_run;
          if (mid.contains('core') || mid.contains('abs') || mid.contains('crunches')) icon = Icons.grid_3x3;
          if (mid.contains('pull') || mid.contains('back') || mid.contains('row')) icon = Icons.align_vertical_bottom;
          if (mid.contains('shoulder') || mid.contains('press') || mid.contains('raise')) icon = Icons.upgrade;
          
          return {
            'id': m['id'].toString(),
            'title': m['title'].toString(),
            'desc': m['desc'].toString(),
            'target': double.tryParse(m['target'].toString()) ?? 10.0,
            'unit': m['unit'].toString(),
            'progress': 0.0,
            'xp': int.tryParse(m['xp'].toString()) ?? 150,
            'rank': '$_assignedRank-Rank',
            'icon': icon,
            'completed': false
          };
        }).toList();

        setState(() {
          _missions = [...coreMissions, ...customMissions];
          
          // Also append tactical hydration
          _missions.add({
            'id': 'water',
            'title': 'Tactical Hydration',
            'desc': 'Consume 2.0 Liters to balance core values.',
            'target': 2.0,
            'unit': 'L',
            'progress': 0.0,
            'xp': 100,
            'rank': 'E-Rank',
            'icon': Icons.local_drink,
            'completed': false
          });
        });
      } else {
        _generateLocalCuratedMissions();
      }
    } catch (e) {
      _generateLocalCuratedMissions();
    } finally {
      setState(() {
        _isLoadingAiMissions = false;
      });
    }
  }

  void _generateLocalCuratedMissions() {
    double mult = 1.0;
    if (_assignedRank == 'D') mult = 0.5;
    if (_assignedRank == 'C') mult = 1.2;
    if (_assignedRank == 'B') mult = 2.0;
    if (_assignedRank == 'A') mult = 3.0;
    if (_assignedRank == 'S') mult = 4.0;

    _missions = [];

    // 1. Mandatory Core Tasks
    double baseRun = _adaptiveQuestMode ? (3.0 + 0.5 * (_level - 1)) : 10.0;
    double basePush = _adaptiveQuestMode ? (30 + 5 * (_level - 1)) : 100.0;
    double baseSquat = _adaptiveQuestMode ? (30 + 5 * (_level - 1)) : 100.0;

    double runTarget = double.parse((baseRun * mult).toStringAsFixed(1));
    double pushTarget = (basePush * mult).roundToDouble();
    double squatTarget = (baseSquat * mult).roundToDouble();

    _missions.addAll([
      {
        'id': 'run',
        'title': 'Navigational Run',
        'desc': 'Navigate sector parameters. Target: $runTarget KM.',
        'target': runTarget,
        'unit': 'KM',
        'progress': 0.0,
        'xp': (200 * mult).round(),
        'rank': '$_assignedRank-Rank',
        'icon': Icons.directions_run,
        'completed': false
      },
      {
        'id': 'pushup',
        'title': 'Gravity Pushups',
        'desc': 'Log ${pushTarget.round()} cycles inside high resistance field.',
        'target': pushTarget,
        'unit': 'Reps',
        'progress': 0.0,
        'xp': (150 * mult).round(),
        'rank': '$_assignedRank-Rank',
        'icon': Icons.fitness_center,
        'completed': false
      },
      {
        'id': 'squat',
        'title': 'Shadow Squats',
        'desc': 'Complete ${squatTarget.round()} compound reps to expand core density.',
        'target': squatTarget,
        'unit': 'Reps',
        'progress': 0.0,
        'xp': (150 * mult).round(),
        'rank': '$_assignedRank-Rank',
        'icon': Icons.sports_mma,
        'completed': false
      },
    ]);

    // 2. Curated Exercises based on selected muscle sectors
    List<String> sectors = _selectedMuscleSectors.isNotEmpty ? _selectedMuscleSectors : ['Back', 'Core'];
    for (String sector in sectors) {
      if (sector == 'Chest') {
        _missions.add({
          'id': 'chest',
          'title': 'Quantum Chest Press',
          'desc': 'Utilize chest force fields to push beyond normal physical constraints.',
          'target': (15 * mult).roundToDouble(),
          'unit': 'Reps',
          'progress': 0.0,
          'xp': (120 * mult).round(),
          'rank': '$_assignedRank-Rank',
          'icon': Icons.accessibility_new,
          'completed': false
        });
      } else if (sector == 'Back') {
        String title = 'Assisted Pullups';
        double target = 5;
        if (_assignedRank == 'C') { title = 'Abyssal Pullups'; target = 8; }
        else if (_assignedRank == 'B') { title = 'Weighted Sync Pullups'; target = 12; }
        else if (_assignedRank == 'A' || _assignedRank == 'S') { title = 'One-Arm L-Sit Pullups'; target = 15; }
        
        _missions.add({
          'id': 'back',
          'title': title,
          'desc': 'Back lat-wings expansion protocol. Log compound pulling reps to maximize pull power.',
          'target': (target * mult).roundToDouble(),
          'unit': 'Reps',
          'progress': 0.0,
          'xp': (120 * mult).round(),
          'rank': '$_assignedRank-Rank',
          'icon': Icons.align_vertical_bottom,
          'completed': false
        });
      } else if (sector == 'Shoulders') {
        String title = 'Light Shoulder Presses';
        double target = 10;
        if (_assignedRank == 'C') { title = 'Overhead Power Presses'; target = 15; }
        else if (_assignedRank == 'B') { title = 'Handstand Wall Handsprings'; target = 8; }
        else if (_assignedRank == 'A' || _assignedRank == 'S') { title = 'Hypergravity Handstand Pushups'; target = 12; }

        _missions.add({
          'id': 'shoulders',
          'title': title,
          'desc': 'Anterior deltoid stabilization: log presses inside high-gravity field.',
          'target': (target * mult).roundToDouble(),
          'unit': 'Reps',
          'progress': 0.0,
          'xp': (110 * mult).round(),
          'rank': '$_assignedRank-Rank',
          'icon': Icons.upgrade,
          'completed': false
        });
      } else if (sector == 'Legs') {
        _missions.add({
          'id': 'legs',
          'title': 'Shadow Step Lunges',
          'desc': 'Fortify single-leg stabilizers for teleportation-like speed output.',
          'target': (16 * mult).roundToDouble(),
          'unit': 'Reps',
          'progress': 0.0,
          'xp': (110 * mult).round(),
          'rank': '$_assignedRank-Rank',
          'icon': Icons.nordic_walking,
          'completed': false
        });
      } else if (sector == 'Arms') {
        String title = 'Standard Bench Dips';
        double target = 12;
        if (_assignedRank == 'C') { title = 'Synaptic Bar Dips'; target = 18; }
        else if (_assignedRank == 'B') { title = 'Weighted Tricep Extenders'; target = 15; }
        else if (_assignedRank == 'A' || _assignedRank == 'S') { title = 'Muscle-Up Arm Triggers'; target = 8; }

        _missions.add({
          'id': 'arms',
          'title': title,
          'desc': 'Tricep and bicep synaptic fibers activation loops.',
          'target': (target * mult).roundToDouble(),
          'unit': 'Reps',
          'progress': 0.0,
          'xp': (100 * mult).round(),
          'rank': '$_assignedRank-Rank',
          'icon': Icons.sports_gymnastics,
          'completed': false
        });
      } else if (sector == 'Core') {
        String title = 'Floor Ab Crunches';
        double target = 15;
        if (_assignedRank == 'C') { title = 'Core Overload Crunches'; target = 25; }
        else if (_assignedRank == 'B') { title = 'Hanging Leg Raises'; target = 15; }
        else if (_assignedRank == 'A' || _assignedRank == 'S') { title = 'L-Sit Hold Intervals'; target = 30; }

        _missions.add({
          'id': 'core',
          'title': title,
          'desc': 'Abdominal spinal core shield fortification cycle.',
          'target': (target * mult).roundToDouble(),
          'unit': target == 30 && (_assignedRank == 'A' || _assignedRank == 'S') ? 'Sec' : 'Reps',
          'progress': 0.0,
          'xp': (100 * mult).round(),
          'rank': '$_assignedRank-Rank',
          'icon': Icons.grid_3x3,
          'completed': false
        });
      }
    }

    // Always append hydration
    _missions.add({
      'id': 'water',
      'title': 'Tactical Hydration',
      'desc': 'Consume 2.0 Liters to balance core values.',
      'target': 2.0,
      'unit': 'L',
      'progress': 0.0,
      'xp': 100,
      'rank': 'E-Rank',
      'icon': Icons.local_drink,
      'completed': false
    });
  }

  void _toggleMuscleSector(String muscle) {
    HapticFeedback.lightImpact();
    setState(() {
      if (_selectedMuscleSectors.contains(muscle)) {
        _selectedMuscleSectors.remove(muscle);
      } else {
        _selectedMuscleSectors.add(muscle);
      }
    });
  }

  Widget _buildMuscleSectorCard(String name, IconData icon, Color accent, Color surface, Color textPrimary, Color textMuted) {
    bool isSelected = _selectedMuscleSectors.contains(name);
    return GestureDetector(
      onTap: () => _toggleMuscleSector(name),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? accent.withOpacity(0.08) : surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? accent : Colors.white10,
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? accent : textMuted,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                name.toUpperCase(),
                style: TextStyle(
                  fontFamily: 'Geist',
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: isSelected ? textPrimary : textMuted,
                ),
              ),
            ),
            if (isSelected)
              Icon(
                Icons.close, // Brutalist "X" check state
                color: accent,
                size: 16,
              ),
          ],
        ),
      ),
    );
  }

  void _logFitness(String type, double amount) {
    HapticFeedback.lightImpact();
    
    setState(() {
      int index = _missions.indexWhere((m) => m['id'] == type);
      if (index != -1 && !_missions[index]['completed']) {
        var m = _missions[index];
        m['progress'] = math.min(m['target'], m['progress'] + amount);
        
        if (type == 'water') {
          _water = math.min(2.0, _water + amount);
        }
        
        int cals = 0;
        if (type == 'run') cals = (amount * 75).round();
        if (type == 'pushup') cals = (amount * 0.6).round();
        if (type == 'squat') cals = (amount * 0.8).round();
        _calories += cals;

        if (m['progress'] >= m['target']) {
          m['completed'] = true;
          _addXp(m['xp']);
          
          if (type == 'run') _stats['STM'] = _stats['STM']! + 2;
          if (type == 'pushup') _stats['STR'] = _stats['STR']! + 2;
          if (type == 'squat') _stats['STR'] = _stats['STR']! + 2;
          if (type == 'water') _stats['INT'] = _stats['INT']! + 1;
        }
      } else {
        // Generic fallback values
        if (type == 'water') _water = math.min(2.0, _water + amount);
        int cals = 0;
        if (type == 'run') cals = (amount * 75).round();
        if (type == 'pushup') cals = (amount * 0.6).round();
        if (type == 'squat') cals = (amount * 0.8).round();
        _calories += cals;
      }
    });
  }

  void _addXp(int amount) {
    setState(() {
      _xp += amount;
      if (_xp >= _maxXp) {
        _xp = _xp - _maxXp;
        _level += 1;
        _maxXp = (_maxXp * 1.35).roundToDouble();
        
        // Boost stats
        _stats['STR'] = _stats['STR']! + 3;
        _stats['AGI'] = _stats['AGI']! + 3;
        _stats['STM'] = _stats['STM']! + 3;
        _stats['INT'] = _stats['INT']! + 1;
        
        // Scale Squire baseline targets automatically by +5 Reps / +0.5 KM
        if (_adaptiveQuestMode) {
          double mult = 1.0;
          if (_assignedRank == 'D') mult = 0.5;
          if (_assignedRank == 'C') mult = 1.2;
          if (_assignedRank == 'B') mult = 2.0;
          if (_assignedRank == 'A') mult = 3.0;
          if (_assignedRank == 'S') mult = 4.0;
          
          for (var m in _missions) {
            if (m['id'] == 'run') {
              m['target'] = double.parse((m['target'] + 0.5 * mult).toStringAsFixed(1));
              m['completed'] = m['progress'] >= m['target'];
            }
            if (m['id'] == 'pushup') {
              m['target'] = (m['target'] + (5 * mult)).roundToDouble();
              m['completed'] = m['progress'] >= m['target'];
            }
            if (m['id'] == 'squat') {
              m['target'] = (m['target'] + (5 * mult)).roundToDouble();
              m['completed'] = m['progress'] >= m['target'];
            }
          }
        }

        HapticFeedback.vibrate();
      }
    });
  }

  void _executeLimitBreak() {
    HapticFeedback.heavyImpact();
    setState(() {
      _stats['STR'] = _stats['STR']! + 45;
      _stats['AGI'] = _stats['AGI']! + 32;
      _stats['STM'] = _stats['STM']! + 40;
      _level += 1;
      _addXp(500);
    });
  }

  void _calculateArchetype() {
    setState(() {
      String lowerChar = _favCharacter.toLowerCase();
      if (_fightingStyle == 'shadow' || lowerChar.contains('jin-woo') || lowerChar.contains('jinwoo')) {
        _assignedClass = _bodyGoal == 'lean' ? 'Shadow Monarch' : 'Agile Assassin';
        _assignedDesc = 'Decoded: Shadow Monarch class. Focused on ruthless agility, speed-work, and anaerobic shadow conditioning.';
      } else if (_fightingStyle == 'brawler' || lowerChar.contains('goku')) {
        _assignedClass = _bodyGoal == 'bulking' ? 'Flame Warrior' : 'Beast Tank';
        _assignedDesc = 'Decoded: Flame Warrior class. Designed for raw muscular hypertrophy, heavy compound resistance, and explosive conditioning.';
      } else {
        _assignedClass = 'Celestial Runner';
        _assignedDesc = 'Decoded: Celestial Runner. Built for limitless cardio pacing and tactical metavision energy regulation.';
      }

      if (_fitLevel == 'beginner') {
        _assignedRank = 'D';
      } else if (_fitLevel == 'intermediate') {
        _assignedRank = 'C';
      } else if (_fitLevel == 'expert') {
        _assignedRank = 'B';
      } else {
        _assignedRank = 'A';
      }

      _assignedAccentColor();
      _generateMissions();
    });
  }

  @override
  Widget build(BuildContext context) {
    Color currentAccent = widget.isDark ? _themeAccentColor : AppColors.monolithRed;
    Color surfaceColor = widget.isDark ? AppColors.darkSurface : AppColors.lightSurface;
    Color surfaceCardColor = widget.isDark ? AppColors.darkSurfaceCard : AppColors.lightSurfaceCard;
    Color textPrimaryColor = widget.isDark ? AppColors.darkText : AppColors.lightText;
    Color textMutedColor = widget.isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundImage: const NetworkImage(
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCQzZBzO5ElLPh1Z1dwji2X-DTm-FDvImVVkw4bYIy9VpljKt1EEk6J1UB5N996ldL9VHyQ_KJ7eayh6BmNsfHYl1TtYeIihbuf9BVxqF16o172QpwhISHhvt9ay4TE3KjOxhpdfaA79FTwjIcY5JMbur_yqwDbn1jNwJYq7WXKdtK15wjqivZ454H5ffum-bdhrW-OtkHAWcv-v8Cc5r_Im8-_6EVCQmIBYOIuSestDkQXBV4jVmlXJk_FGpy2mcjUA7H5sY4ZPc_U',
              ),
              backgroundColor: Colors.grey[800],
            ),
            const SizedBox(width: 12),
            Text(
              'ABYSSAL PROTOCOL',
              style: TextStyle(
                fontFamily: 'Anton',
                fontSize: 14,
                color: currentAccent,
                letterSpacing: 2.0,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              widget.isDark ? Icons.light_mode : Icons.dark_mode,
              color: textPrimaryColor,
            ),
            onPressed: widget.onThemeToggle,
          ),
        ],
      ),
      body: Stack(
        children: [
          // Background Canvas Emitter (Vector-styled background rings)
          Positioned(
            top: 100,
            left: 50,
            child: Opacity(
              opacity: widget.isDark ? 0.08 : 0.02,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [currentAccent, Colors.transparent],
                  ),
                ),
              ),
            ),
          ),
          
          // Main Router Content View
          SafeArea(
            child: _buildActiveScreen(
              currentAccent,
              surfaceColor,
              surfaceCardColor,
              textPrimaryColor,
              textMutedColor,
            ),
          ),
          
          if (_isLoadingAiMissions)
            Container(
              color: Colors.black87,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(
                      color: currentAccent,
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'SYNCING NEURAL DIRECTIVES...',
                      style: TextStyle(
                        fontFamily: 'Anton',
                        fontSize: 18,
                        color: currentAccent,
                        letterSpacing: 2.0,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'ESTABLISHING LINK TO GEMINI CORE',
                      style: TextStyle(
                        fontFamily: 'Geist',
                        fontSize: 10,
                        color: Colors.white60,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavDock(currentAccent, surfaceColor, textMutedColor),
    );
  }

  Widget _buildActiveScreen(
    Color accent,
    Color surface,
    Color surfaceCard,
    Color textPrimary,
    Color textMuted,
  ) {
    if (_activeScreen == 'splash') {
      return _buildSplashScreen(accent, textMuted);
    } else if (_activeScreen == 'onboarding') {
      return _buildOnboardingFlow(accent, surface, textPrimary, textMuted);
    } else if (_activeScreen == 'assignment') {
      return _buildAssignmentReveal(accent, textPrimary, textMuted);
    }

    // Secondary screen tab swaps
    switch (_activeNavIndex) {
      case 0:
        return _buildDashboardScreen(accent, surface, surfaceCard, textPrimary, textMuted);
      case 1:
        return _buildMissionsScreen(accent, surface, textPrimary, textMuted);
      case 2:
        return _buildEvolutionScreen(accent, surface, textPrimary, textMuted);
      case 3:
        return _buildStatsScreen(accent, surface, textPrimary, textMuted);
      default:
        return _buildAchievementsScreen(accent, surface, textPrimary, textMuted);
    }
  }

  /* --- SCREEN 1: SPLASH SCREEN --- */
  Widget _buildSplashScreen(Color accent, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const SizedBox(),
          Column(
            children: [
              // Logo core
              Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black26,
                  border: Border.all(color: accent.withOpacity(0.3), width: 2),
                ),
                child: Center(
                  child: Icon(
                    Icons.bolt,
                    size: 80,
                    color: accent,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'NEURAL SYNC',
                style: TextStyle(
                  fontFamily: 'Anton',
                  fontSize: 36,
                  letterSpacing: 4.0,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'GAMIFIED PROTAGONIST EVOLUTION',
                style: TextStyle(
                  fontFamily: 'Geist',
                  fontSize: 10,
                  color: textMuted,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: accent,
              foregroundColor: widget.isDark ? Colors.black : Colors.white,
              minimumSize: const Size(double.infinity, 56),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 4,
            ),
            onPressed: () {
              HapticFeedback.mediumImpact();
              setState(() {
                _activeScreen = 'onboarding';
              });
            },
            child: const Text(
              'INITIALIZE LINK',
              style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2.0),
            ),
          ),
        ],
      ),
    );
  }

  /* --- SCREEN 2: ONBOARDING FLOW --- */
  int _onboardingStep = 1;

  Widget _buildOnboardingFlow(Color accent, Color surface, Color textPrimary, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step bar
          Row(
            children: [
              Text(
                'SYNC SETUP',
                style: TextStyle(fontFamily: 'Geist', fontSize: 12, color: textMuted),
              ),
              const Spacer(),
              Text(
                '$_onboardingStep/5',
                style: TextStyle(fontFamily: 'Geist', fontSize: 12, color: accent, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: _onboardingStep / 5.0,
            backgroundColor: surface,
            color: accent,
            minHeight: 6,
          ),
          const SizedBox(height: 32),
          
          Expanded(
            child: SingleChildScrollView(
              child: _buildOnboardingStepCard(accent, surface, textPrimary, textMuted),
            ),
          ),
          
          Row(
            children: [
              if (_onboardingStep > 1)
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: textPrimary,
                      side: BorderSide(color: textMuted.withOpacity(0.3)),
                      minimumSize: const Size(0, 50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      setState(() {
                        _onboardingStep--;
                      });
                    },
                    child: const Text('BACK'),
                  ),
                ),
              if (_onboardingStep > 1) const SizedBox(width: 16),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: accent,
                    foregroundColor: widget.isDark ? Colors.black : Colors.white,
                    minimumSize: const Size(0, 50),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    if (_onboardingStep < 5) {
                      setState(() {
                        _onboardingStep++;
                      });
                    } else {
                      _calculateArchetype();
                      setState(() {
                        _activeScreen = 'assignment';
                      });
                    }
                  },
                  child: Text(_onboardingStep == 5 ? 'SYNC NEURAL CORE' : 'NEXT STEP'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOnboardingStepCard(Color accent, Color surface, Color textPrimary, Color textMuted) {
    switch (_onboardingStep) {
      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('CURRENT FITNESS TIER', style: TextStyle(fontFamily: 'Anton', fontSize: 24, letterSpacing: 1.0)),
            const SizedBox(height: 8),
            Text('Be brutally honest. The system adapts mission scopes to your core capability.', style: TextStyle(color: textMuted, fontSize: 13)),
            const SizedBox(height: 24),
            _buildRadioCard('fit-level', 'beginner', 'Rank D (Beginner)', 'Just starting the training arc. Hard to do 10 pushups.', fitLevel: _fitLevel),
            const SizedBox(height: 12),
            _buildRadioCard('fit-level', 'intermediate', 'Rank C (Adept)', 'Workout occasionally. Can run 2-3km without stopping.', fitLevel: _fitLevel),
            const SizedBox(height: 12),
            _buildRadioCard('fit-level', 'expert', 'Rank B (Expert)', 'Works out regularly. Can do pushups and other exercises easily up to 30 reps.', fitLevel: _fitLevel),
            const SizedBox(height: 12),
            _buildRadioCard('fit-level', 'advanced', 'Rank A (Elite)', 'Active athlete. Ready for extreme evolution cycles.', fitLevel: _fitLevel),
            const SizedBox(height: 24),
            const Text('SYSTEM QUEST INTENSITY', style: TextStyle(fontFamily: 'Anton', fontSize: 18, letterSpacing: 1.0)),
            const SizedBox(height: 8),
            Text('Choose the starting difficulty model for the core 3 Solo Leveling daily tasks.', style: TextStyle(color: textMuted, fontSize: 12)),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: () {
                HapticFeedback.lightImpact();
                setState(() {
                  _adaptiveQuestMode = true;
                });
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _adaptiveQuestMode ? accent.withOpacity(0.08) : surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: _adaptiveQuestMode ? accent : Colors.white10,
                    width: 1.5,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(Icons.trending_up, color: _adaptiveQuestMode ? accent : textMuted, size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Squire Sync (Adaptive Progression)', style: TextStyle(fontFamily: 'Geist', fontWeight: FontWeight.bold, fontSize: 13, color: _adaptiveQuestMode ? textPrimary : textMuted)),
                          const SizedBox(height: 4),
                          const Text('Start easy (30 Reps / 3KM) and auto-increase by +5 Reps/+0.5KM every single Level Up!', style: TextStyle(fontSize: 10, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: () {
                HapticFeedback.lightImpact();
                setState(() {
                  _adaptiveQuestMode = false;
                });
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: !_adaptiveQuestMode ? accent.withOpacity(0.08) : surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: !_adaptiveQuestMode ? accent : Colors.white10,
                    width: 1.5,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(Icons.workspace_premium, color: !_adaptiveQuestMode ? accent : textMuted, size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Monarch Intensity (Legendary Core)', style: TextStyle(fontFamily: 'Geist', fontWeight: FontWeight.bold, fontSize: 13, color: !_adaptiveQuestMode ? textPrimary : textMuted)),
                          const SizedBox(height: 4),
                          const Text('Start immediately with full legendary base (100 Reps / 10KM) scaled by Rank.', style: TextStyle(fontSize: 10, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      case 2:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('TARGET ASCENSION GOAL', style: TextStyle(fontFamily: 'Anton', fontSize: 24, letterSpacing: 1.0)),
            const SizedBox(height: 8),
            Text('What core attributes are you training to unlock?', style: TextStyle(color: textMuted, fontSize: 13)),
            const SizedBox(height: 24),
            _buildRadioCard('body-goal', 'lean', 'Lean Speed & Agility', 'Focus on calorie deficit, cardiovascular capacity, and speed.', fitLevel: _bodyGoal),
            const SizedBox(height: 12),
            _buildRadioCard('body-goal', 'bulking', 'Protagonist Power & Mass', 'Focus on compound resistance lifts, hypertrophy, and raw power.', fitLevel: _bodyGoal),
            const SizedBox(height: 12),
            _buildRadioCard('body-goal', 'endurance', 'Infinite Stamina Core', 'High intensity pacing, daily hydration benchmarks, and streaks.', fitLevel: _bodyGoal),
          ],
        );
      case 3:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('COMBAT SPECIALTY', style: TextStyle(fontFamily: 'Anton', fontSize: 24, letterSpacing: 1.0)),
            const SizedBox(height: 8),
            Text('How do you plan to dominate the fitness arena?', style: TextStyle(color: textMuted, fontSize: 13)),
            const SizedBox(height: 24),
            _buildRadioCard('specialty', 'shadow', 'Stealth & Agility (Assassin)', 'Evasive speed, agility, high tempo cardiovascular sprints.', fitLevel: _fightingStyle),
            const SizedBox(height: 12),
            _buildRadioCard('specialty', 'brawler', 'Brawler Power (Warrior)', 'Raw explosive compound lift capacities.', fitLevel: _fightingStyle),
            const SizedBox(height: 12),
            _buildRadioCard('specialty', 'tactician', 'Strategic Metavision (Stamina)', 'High pacing, dynamic intervals, and endless cardiovascular endurance.', fitLevel: _fightingStyle),
          ],
        );
      case 4:
        String muscleHeader = 'TARGET MUSCLE SECTORS';
        String muscleSub = 'Select the physical zones to initialize synchronization directives.';
        if (_fightingStyle == 'shadow') {
          muscleSub = 'Select muscle sectors to fortify for high-speed evasion and stealth precision (Assassin focus).';
        } else if (_fightingStyle == 'brawler') {
          muscleSub = 'Select heavy muscle zones to break through raw structural power boundaries (Warrior hypertrophy).';
        } else if (_fightingStyle == 'tactician') {
          muscleSub = 'Select core pacing sectors for infinite cardiovascular synchro (Stamina intervals).';
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(muscleHeader, style: const TextStyle(fontFamily: 'Anton', fontSize: 24, letterSpacing: 1.0)),
            const SizedBox(height: 8),
            Text(muscleSub, style: TextStyle(color: textMuted, fontSize: 13)),
            const SizedBox(height: 24),
            _buildMuscleSectorCard('Chest', Icons.accessibility_new, accent, surface, textPrimary, textMuted),
            const SizedBox(height: 12),
            _buildMuscleSectorCard('Back', Icons.align_vertical_bottom, accent, surface, textPrimary, textMuted),
            const SizedBox(height: 12),
            _buildMuscleSectorCard('Shoulders', Icons.upgrade, accent, surface, textPrimary, textMuted),
            const SizedBox(height: 12),
            _buildMuscleSectorCard('Legs', Icons.nordic_walking, accent, surface, textPrimary, textMuted),
            const SizedBox(height: 12),
            _buildMuscleSectorCard('Arms', Icons.sports_gymnastics, accent, surface, textPrimary, textMuted),
            const SizedBox(height: 12),
            _buildMuscleSectorCard('Core', Icons.grid_3x3, accent, surface, textPrimary, textMuted),
            const SizedBox(height: 20),
            Text(
              'CURATED SECTORS: ${_selectedMuscleSectors.isEmpty ? "None Selected (All Standard)" : _selectedMuscleSectors.join(", ").toUpperCase()}',
              style: TextStyle(fontFamily: 'Geist', fontSize: 11, color: accent, fontWeight: FontWeight.bold, letterSpacing: 1.0),
            ),
          ],
        );
      default:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('PROTAGONIST PERSONA', style: TextStyle(fontFamily: 'Anton', fontSize: 24, letterSpacing: 1.0)),
            const SizedBox(height: 8),
            Text('Whose training ethic and universe fuels your spirit?', style: TextStyle(color: textMuted, fontSize: 13)),
            const SizedBox(height: 24),
            TextField(
              decoration: InputDecoration(
                labelText: 'FAVORITE ANIME CHARACTER',
                labelStyle: TextStyle(color: accent, fontSize: 12, fontFamily: 'Geist'),
                border: OutlineInputBorder(borderSide: BorderSide(color: accent)),
                focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: accent, width: 2)),
              ),
              controller: TextEditingController(text: _favCharacter),
              onChanged: (v) => _favCharacter = v,
            ),
            const SizedBox(height: 16),
            const Text('QUICK CHOOSE PRESETS:', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ActionChip(
                  label: const Text('Sung Jin-Woo'),
                  onPressed: () => setState(() => _favCharacter = 'Sung Jin-Woo'),
                ),
                ActionChip(
                  label: const Text('Goku'),
                  onPressed: () => setState(() => _favCharacter = 'Goku'),
                ),
                ActionChip(
                  label: const Text('Levi Ackerman'),
                  onPressed: () => setState(() => _favCharacter = 'Levi Ackerman'),
                ),
                ActionChip(
                  label: const Text('Isagi Yoichi'),
                  onPressed: () => setState(() => _favCharacter = 'Isagi Yoichi'),
                ),
              ],
            ),
          ],
        );
    }
  }

  Widget _buildRadioCard(String type, String value, String title, String desc, {required String fitLevel}) {
    bool isSelected = fitLevel == value;
    Color activeColor = widget.isDark ? _themeAccentColor : AppColors.monolithRed;

    return GestureDetector(
      onTap: () {
        setState(() {
          if (type == 'fit-level') _fitLevel = value;
          if (type == 'body-goal') _bodyGoal = value;
          if (type == 'specialty') _fightingStyle = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? activeColor.withOpacity(0.08) : Colors.black12,
          border: Border.all(
            color: isSelected ? activeColor : Colors.white10,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected ? activeColor : Colors.grey,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 4),
                  Text(desc, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /* --- SCREEN 3: CHARACTER REVEAL --- */
  Widget _buildAssignmentReveal(Color accent, Color textPrimary, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const SizedBox(),
          Column(
            children: [
              // Glowing Rank Badge
              Container(
                width: 140,
                height: 140,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black26,
                  border: Border.all(color: accent, width: 2),
                  boxShadow: [
                    BoxShadow(color: accent.withOpacity(0.2), blurRadius: 20, spreadRadius: 5),
                  ],
                ),
                child: Center(
                  child: Text(
                    _assignedRank,
                    style: TextStyle(
                      fontFamily: 'Anton',
                      fontSize: 64,
                      color: accent,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'ARCHETYPE DECODED',
                style: TextStyle(fontFamily: 'Geist', fontSize: 12, letterSpacing: 3.0),
              ),
              const SizedBox(height: 8),
              Text(
                _assignedClass.toUpperCase(),
                style: const TextStyle(fontFamily: 'Anton', fontSize: 36, letterSpacing: 2.0),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  border: Border.all(color: accent.withOpacity(0.5)),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  '${_assignedRank}-RANK ADAPTIVE HUNTER',
                  style: TextStyle(fontFamily: 'Geist', fontSize: 10, color: accent, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                ),
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  _assignedDesc,
                  textAlign: TextAlign.center,
                  style: TextStyle(color: textMuted, fontSize: 13),
                ),
              ),
            ],
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: accent,
              foregroundColor: widget.isDark ? Colors.black : Colors.white,
              minimumSize: const Size(double.infinity, 56),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              HapticFeedback.vibrate();
              setState(() {
                _activeScreen = 'main';
                _activeNavIndex = 0;
              });
            },
            child: const Text('SYNC NEURAL CORE', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2.0)),
          ),
        ],
      ),
    );
  }

  /* --- SCREEN 4: HOME DASHBOARD --- */
  Widget _buildDashboardScreen(Color accent, Color surface, Color surfaceCard, Color textPrimary, Color textMuted) {
    double xpProgress = _xp / _maxXp;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Dynamic Sync circle profile bento
          Center(
            child: Column(
              children: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 140,
                      height: 140,
                      child: CircularProgressIndicator(
                        value: xpProgress,
                        strokeWidth: 6,
                        backgroundColor: Colors.white10,
                        valueColor: AlwaysStoppedAnimation<Color>(accent),
                      ),
                    ),
                    CircleAvatar(
                      radius: 58,
                      backgroundImage: const NetworkImage(
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuCQzZBzO5ElLPh1Z1dwji2X-DTm-FDvImVVkw4bYIy9VpljKt1EEk6J1UB5N996ldL9VHyQ_KJ7eayh6BmNsfHYl1TtYeIihbuf9BVxqF16o172QpwhISHhvt9ay4TE3KjOxhpdfaA79FTwjIcY5JMbur_yqwDbn1jNwJYq7WXKdtK15wjqivZ454H5ffum-bdhrW-OtkHAWcv-v8Cc5r_Im8-_6EVCQmIBYOIuSestDkQXBV4jVmlXJk_FGpy2mcjUA7H5sY4ZPc_U',
                      ),
                      backgroundColor: surface,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  _assignedClass.toUpperCase(),
                  style: const TextStyle(fontFamily: 'Anton', fontSize: 24, letterSpacing: 1.0),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  decoration: BoxDecoration(
                    border: Border.all(color: accent.withOpacity(0.5)),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    '${(xpProgress * 100).round()}% SYNC DETECTED',
                    style: TextStyle(fontFamily: 'Geist', fontSize: 9, color: accent, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Experience block progress bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Level Scale: Lvl $_level', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text('${_xp.round()}/${_maxXp.round()} XP', style: TextStyle(color: accent, fontWeight: FontWeight.bold, fontSize: 13)),
                  ],
                ),
                const SizedBox(height: 12),
                LinearProgressIndicator(
                  value: xpProgress,
                  minHeight: 8,
                  backgroundColor: Colors.black26,
                  color: accent,
                  borderRadius: BorderRadius.circular(4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Calories burned and days bento cards
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  height: 100,
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('ENERGY EXPENDED', style: TextStyle(fontSize: 10, color: textMuted, fontWeight: FontWeight.bold)),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text('$_calories', style: const TextStyle(fontFamily: 'Anton', fontSize: 24)),
                          const SizedBox(width: 4),
                          Text('KCAL', style: TextStyle(fontSize: 8, color: textMuted)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  height: 100,
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('ACTIVE STREAK', style: TextStyle(fontSize: 10, color: textMuted, fontWeight: FontWeight.bold)),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text('$_streak', style: const TextStyle(fontFamily: 'Anton', fontSize: 24)),
                          const SizedBox(width: 4),
                          Text('DAYS', style: TextStyle(fontSize: 8, color: textMuted)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Active directive card
          if (_missions.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              width: double.infinity,
              decoration: BoxDecoration(
                color: surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: accent.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border.all(color: textPrimary),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text('ACTIVE DIRECTIVE', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _missions[0]['title'].toString().toUpperCase(),
                    style: TextStyle(fontFamily: 'Anton', fontSize: 18, color: accent),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _missions[0]['desc'],
                    style: TextStyle(color: textMuted, fontSize: 11),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Progress: ${_missions[0]['progress']} / ${_missions[0]['target']} ${_missions[0]['unit']}',
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: accent,
                          foregroundColor: widget.isDark ? Colors.black : Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () {
                          setState(() {
                            _activeNavIndex = 1;
                          });
                        },
                        child: const Text('GO TO DIRECTIVES', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  /* --- SCREEN 5: MISSIONS SCREEN --- */
  Widget _buildMissionsScreen(Color accent, Color surface, Color textPrimary, Color textMuted) {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _missions.length,
      itemBuilder: (context, index) {
        var m = _missions[index];
        bool isDone = m['completed'];
        double progressRatio = m['progress'] / m['target'];

        bool isExpanded = _expandedMissions.contains(m['id']);

        return GestureDetector(
          onTap: () {
            setState(() {
              if (isExpanded) {
                _expandedMissions.remove(m['id']);
              } else {
                _expandedMissions.add(m['id']);
              }
            });
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isExpanded
                    ? accent.withOpacity(0.5)
                    : (isDone ? Colors.green.withOpacity(0.3) : Colors.white10),
                width: isExpanded ? 1.5 : 1.0,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        GestureDetector(
                          onTap: () {
                            if (!isDone) {
                              double inc = m['target'] - m['progress'];
                              _logFitness(m['id'], inc);
                            }
                          },
                          child: Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: isDone ? Colors.green : accent.withOpacity(0.5),
                                width: 1.5,
                              ),
                              borderRadius: BorderRadius.circular(4),
                              color: isDone ? (widget.isDark ? accent.withOpacity(0.1) : Colors.green.withOpacity(0.1)) : Colors.transparent,
                            ),
                            child: isDone
                                ? Center(
                                    child: Icon(
                                      Icons.close, // Brutalist "X" check state
                                      size: 14,
                                      color: isDone ? (widget.isDark ? accent : Colors.green) : accent,
                                    ),
                                  )
                                : null,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Icon(m['icon'], color: accent, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          m['title'].toString().toUpperCase(),
                          style: TextStyle(fontFamily: 'Anton', fontSize: 16, color: accent),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isDone ? Colors.green.withOpacity(0.2) : accent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        isDone ? 'COMPLETE' : 'IN PROGRESS',
                        style: TextStyle(fontSize: 9, color: isDone ? Colors.green : accent, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(m['desc'], style: TextStyle(color: textMuted, fontSize: 12)),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Progress: ${m['progress'].toStringAsFixed(1)} / ${m['target'].toStringAsFixed(1)} ${m['unit']}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                    Text('${(progressRatio * 100).round()}%', style: TextStyle(color: accent, fontWeight: FontWeight.bold, fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: progressRatio,
                  minHeight: 4,
                  backgroundColor: Colors.black26,
                  color: isDone ? Colors.green : accent,
                  borderRadius: BorderRadius.circular(2),
                ),
                if (!isDone) ...[
                  const SizedBox(height: 16),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: accent,
                        foregroundColor: widget.isDark ? Colors.black : Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () {
                        double inc = m['id'] == 'run' ? 0.5 : (m['id'] == 'water' ? 0.25 : 5.0);
                        _logFitness(m['id'], inc);
                      },
                      child: const Text('LOG INCREMENT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
                if (isExpanded) ...[
                  const SizedBox(height: 16),
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 8),
                  Center(
                    child: Container(
                      height: 110,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.black26,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: accent.withOpacity(0.15)),
                      ),
                      padding: const EdgeInsets.all(8),
                      child: ExerciseAnimator(animationType: m['id']),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Center(
                    child: Text(
                      'VEO-3 NEURAL KINETIC RESOLVER v3.2',
                      style: TextStyle(
                        fontFamily: 'Geist',
                        fontSize: 9,
                        color: Colors.white54,
                        letterSpacing: 1.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  /* --- SCREEN 6: CHARACTER EVOLUTION (LIMIT BREAK) --- */
  Widget _buildEvolutionScreen(Color accent, Color surface, Color textPrimary, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            children: [
              Text(
                'LIMIT BREAK',
                style: TextStyle(fontFamily: 'Anton', fontSize: 32, color: accent, letterSpacing: 2.0),
              ),
              const SizedBox(height: 8),
              Text(
                'EVOLUTION PROTOCOL ACTIVE',
                style: TextStyle(fontFamily: 'Geist', fontSize: 10, color: textMuted, letterSpacing: 1.5),
              ),
            ],
          ),
          
          // Spinner element
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: accent.withOpacity(0.2), width: 4),
                ),
              ),
              Container(
                width: 190,
                height: 190,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: accent.withOpacity(0.5), width: 2),
                ),
              ),
              CircleAvatar(
                radius: 80,
                backgroundImage: const NetworkImage(
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCQzZBzO5ElLPh1Z1dwji2X-DTm-FDvImVVkw4bYIy9VpljKt1EEk6J1UB5N996ldL9VHyQ_KJ7eayh6BmNsfHYl1TtYeIihbuf9BVxqF16o172QpwhISHhvt9ay4TE3KjOxhpdfaA79FTwjIcY5JMbur_yqwDbn1jNwJYq7WXKdtK15wjqivZ454H5ffum-bdhrW-OtkHAWcv-v8Cc5r_Im8-_6EVCQmIBYOIuSestDkQXBV4jVmlXJk_FGpy2mcjUA7H5sY4ZPc_U',
                ),
              ),
            ],
          ),
          
          Column(
            children: [
              Text(
                _assignedClass.toUpperCase(),
                style: const TextStyle(fontFamily: 'Anton', fontSize: 24, letterSpacing: 1.0),
              ),
              const SizedBox(height: 8),
              Text(
                'Lvl $_level Protagonist Rank',
                style: TextStyle(fontFamily: 'Geist', fontSize: 12, color: accent),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: accent,
                  foregroundColor: widget.isDark ? Colors.black : Colors.white,
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _executeLimitBreak,
                child: const Text('OVERLOAD ASCENSION', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2.0)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /* --- SCREEN 7: STATS & PROFILE --- */
  Widget _buildStatsScreen(Color accent, Color surface, Color textPrimary, Color textMuted) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Custom Header
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _assignedClass.split(' ').join('\n').toUpperCase(),
                    style: const TextStyle(fontFamily: 'Anton', fontSize: 32, height: 1.0, letterSpacing: 1.0),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(width: 8, height: 8, color: accent),
                      const SizedBox(width: 6),
                      const Text('STATUS: ACTIVE / AUTHORIZED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),

          // EXP Sync Bento
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Experience', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          Text('${((_xp/_maxXp)*100).round()}%', style: TextStyle(fontSize: 11, color: accent, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(value: _xp/_maxXp, minHeight: 3, backgroundColor: Colors.white10, color: accent),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Sync Rate', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          const Text('92%', style: TextStyle(fontSize: 11, color: Colors.green, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const LinearProgressIndicator(value: 0.92, minHeight: 3, backgroundColor: Colors.white10, color: Colors.green),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Combat matrix progress bars
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('COMBAT MATRIX', style: TextStyle(fontFamily: 'Anton', fontSize: 16, letterSpacing: 1.0)),
                const SizedBox(height: 16),
                _buildStatMatrixRow('STR', _stats['STR']!, accent),
                const SizedBox(height: 12),
                _buildStatMatrixRow('AGI', _stats['AGI']!, accent),
                const SizedBox(height: 12),
                _buildStatMatrixRow('STM', _stats['STM']!, accent),
                const SizedBox(height: 12),
                _buildStatMatrixRow('INT', _stats['INT']!, accent),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Consistency heatmaps
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('CONSISTENCY HEATMAP', style: TextStyle(fontFamily: 'Anton', fontSize: 16, letterSpacing: 1.0)),
                const SizedBox(height: 16),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7,
                    crossAxisSpacing: 6,
                    mainAxisSpacing: 6,
                  ),
                  itemCount: 28,
                  itemBuilder: (context, index) {
                    // Simulating highlights
                    bool isActive = index % 3 == 0;
                    return Container(
                      decoration: BoxDecoration(
                        color: isActive ? accent.withOpacity(0.6) : Colors.black26,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: Colors.white10),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatMatrixRow(String label, int val, Color accent) {
    double barRatio = math.min(100.0, val.toDouble()) / 100.0;
    return Row(
      children: [
        SizedBox(
          width: 36,
          child: Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          ),
        ),
        Expanded(
          child: LinearProgressIndicator(
            value: barRatio,
            minHeight: 6,
            backgroundColor: Colors.black26,
            color: accent,
            borderRadius: BorderRadius.circular(3),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          '$val',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: accent),
        ),
      ],
    );
  }

  /* --- SCREEN 8: ACHIEVEMENTS MEDALS --- */
  Widget _buildAchievementsScreen(Color accent, Color surface, Color textPrimary, Color textMuted) {
    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.85,
      ),
      itemCount: _achievementsList.length,
      itemBuilder: (context, index) {
        var a = _achievementsList[index];
        // Mock unlock achievements based on water and level
        bool isUnlocked = false;
        if (a.id == 'first_directive') isUnlocked = true;
        if (a.id == 'hydration_max' && _water >= 2.0) isUnlocked = true;
        if (a.id == 'limit_break_one' && _level > 1) isUnlocked = true;
        
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isUnlocked ? accent.withOpacity(0.08) : surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isUnlocked ? accent : Colors.white10),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                isUnlocked ? Icons.workspace_premium : Icons.lock,
                size: 40,
                color: isUnlocked ? accent : Colors.grey[700],
              ),
              const SizedBox(height: 12),
              Text(
                a.title.toUpperCase(),
                textAlign: TextAlign.center,
                style: TextStyle(fontFamily: 'Anton', fontSize: 13, color: isUnlocked ? textPrimary : Colors.grey),
              ),
              const SizedBox(height: 4),
              Text(
                a.desc,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 9, color: Colors.grey),
              ),
            ],
          ),
        );
      },
    );
  }

  /* --- NAVIGATION BAR --- */
  Widget _buildBottomNavDock(Color accent, Color surface, Color textMuted) {
    if (_activeScreen == 'splash' || _activeScreen == 'onboarding' || _activeScreen == 'assignment') {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      height: 72,
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: accent.withOpacity(0.15)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, Icons.home, accent, textMuted),
          _buildNavItem(1, Icons.fitness_center, accent, textMuted),
          _buildNavItem(2, Icons.rocket_launch, accent, textMuted),
          _buildNavItem(3, Icons.insights, accent, textMuted),
          _buildNavItem(4, Icons.workspace_premium, accent, textMuted),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, Color accent, Color textMuted) {
    bool isActive = _activeNavIndex == index;
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        setState(() {
          _activeNavIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isActive ? accent : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: accent.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Icon(
          icon,
          color: isActive ? (widget.isDark ? Colors.black : Colors.white) : textMuted.withOpacity(0.6),
          size: 24,
        ),
      ),
    );
  }
}

class Achievement {
  final String id;
  final String title;
  final String desc;
  const Achievement({
    required this.id,
    required this.title,
    required this.desc,
  });
}

class ExerciseAnimator extends StatefulWidget {
  final String animationType;
  const ExerciseAnimator({super.key, required this.animationType});

  @override
  State<ExerciseAnimator> createState() => _ExerciseAnimatorState();
}

class _ExerciseAnimatorState extends State<ExerciseAnimator> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: const Size(200, 100),
          painter: StickFigurePainter(
            progress: _controller.value,
            type: widget.animationType,
            isDark: Theme.of(context).brightness == Brightness.dark,
          ),
        );
      },
    );
  }
}

class StickFigurePainter extends CustomPainter {
  final double progress;
  final String type;
  final bool isDark;

  StickFigurePainter({
    required this.progress,
    required this.type,
    required this.isDark,
  });

  void drawText(Canvas canvas, String text, Offset offset, Color color, double fontSize) {
    final textSpan = TextSpan(
      text: text,
      style: TextStyle(
        color: color,
        fontSize: fontSize,
        fontFamily: 'monospace',
        fontWeight: FontWeight.bold,
        letterSpacing: 0.5,
      ),
    );
    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, offset);
  }

  void _drawCrosshair(Canvas canvas, Offset center, Color color) {
    final Paint cp = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.8;
    canvas.drawCircle(center, 4.0, cp);
    canvas.drawLine(Offset(center.dx - 6, center.dy), Offset(center.dx + 6, center.dy), cp);
    canvas.drawLine(Offset(center.dx, center.dy - 6), Offset(center.dx, center.dy + 6), cp);
  }

  double getRealisticPhase(double progress, String type) {
    final String key = type.toLowerCase();
    if (key.contains('pushup') || key.contains('chest') || key.contains('squat') || key.contains('leg') || key.contains('lunge') || key.contains('pull') || key.contains('back') || key.contains('row')) {
      // Eased human concentric/eccentric physics curve: Slow controlled descent, bottom hold, explosive Concentric rise
      if (progress < 0.45) {
        // Slow eccentric lowering
        double t = progress / 0.45;
        return 1.0 - (t * t * (3 - 2 * t)); // Smooth quadratic ease
      } else if (progress < 0.55) {
        // Tension bottom pause
        return 0.0;
      } else if (progress < 0.90) {
        // Explosive concentric press/stand
        double t = (progress - 0.55) / 0.35;
        return 1.0 - math.pow(1.0 - t, 4); // Explosive easeOutQuart
      } else {
        // Top lock-out isometric hold
        return 1.0;
      }
    } else if (key.contains('water') || key.contains('drink') || key.contains('hydration')) {
      if (progress < 0.25) {
        double t = progress / 0.25;
        return t * t;
      } else if (progress < 0.75) {
        double swallow = 0.02 * math.sin(progress * 2 * math.pi * 10);
        return 1.0 + swallow;
      } else {
        double t = (progress - 0.75) / 0.25;
        return 1.0 - t * t;
      }
    }
    return (math.sin(progress * 2 * math.pi) + 1.0) / 2.0; // Fallback
  }

  void drawFigureAtProgress(
    Canvas canvas,
    Size size,
    double localProgress,
    double opacity,
    bool isGlowPass,
    Color mainColor,
    Color limbColor,
  ) {
    final double w = size.width;
    final double h = size.height;
    
    // Choose neon accent colors
    final Color farColor = limbColor.withOpacity(opacity * 0.32);
    final Color nearColor = limbColor.withOpacity(opacity);
    final Color bodyColor = mainColor.withOpacity(opacity);
    
    final Paint farPaint = Paint()
      ..color = farColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;
      
    final Paint nearPaint = Paint()
      ..color = nearColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5
      ..strokeCap = StrokeCap.round;

    final Paint farGlow = Paint()
      ..color = farColor.withOpacity(0.25 * opacity)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);

    final Paint nearGlow = Paint()
      ..color = nearColor.withOpacity(0.4 * opacity)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 7.0
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);

    final Paint spinePaint = Paint()
      ..color = bodyColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round;

    final Paint spineGlow = Paint()
      ..color = bodyColor.withOpacity(0.4 * opacity)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8.0
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);
      
    final Paint fillPaint = Paint()
      ..color = (isDark ? Colors.black : Colors.white).withOpacity(opacity)
      ..style = PaintingStyle.fill;

    final Paint floorPaint = Paint()
      ..color = (isDark ? Colors.white12 : Colors.black12).withOpacity(opacity)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final String key = type.toLowerCase();
    
    // Draw Floor
    if (!key.contains('pull') && !key.contains('water')) {
      canvas.drawLine(Offset(20, h - 15), Offset(w - 20, h - 15), floorPaint);
    }

    // Dynamic realistic phase curve
    double phase = getRealisticPhase(localProgress, type);

    if (key.contains('pushup') || key.contains('chest')) {
      double feetX = 40.0;
      double feetY = h - 20.0;
      double hipX = 80.0;
      double hipY = h - 25.0 - 15.0 * phase;
      double shoulderX = 130.0;
      double shoulderY = h - 30.0 - 25.0 * phase;
      double headX = 145.0;
      double headY = shoulderY - 8.0;
      
      // Hands placed on floor
      double handX = 125.0;
      double handY = h - 20.0;
      
      // Breathing chest expansion factor
      double breath = 2.0 * math.sin(localProgress * 2 * math.pi);

      // --- FAR ARM (Layer 1, Behind) ---
      double farElbowX = 107.0 + 15.0 * phase;
      double farElbowY = h - 28.0 - 13.0 * phase;
      double farHandX = handX - 5.0;
      double farHandY = handY - 2.0;
      if (isGlowPass) {
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(farElbowX, farElbowY), farGlow);
        canvas.drawLine(Offset(farElbowX, farElbowY), Offset(farHandX, farHandY), farGlow);
      } else {
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(farElbowX, farElbowY), farPaint);
        canvas.drawLine(Offset(farElbowX, farElbowY), Offset(farHandX, farHandY), farPaint);
      }

      // --- BODY SPINE (Layer 2, Middle) ---
      if (isGlowPass) {
        canvas.drawLine(Offset(feetX, feetY), Offset(hipX, hipY), spineGlow);
        canvas.drawLine(Offset(hipX, hipY), Offset(shoulderX, shoulderY), spineGlow);
        canvas.drawCircle(Offset(headX, headY), 8.0, spineGlow);
      } else {
        canvas.drawLine(Offset(feetX, feetY), Offset(hipX, hipY), spinePaint);
        canvas.drawLine(Offset(hipX, hipY), Offset(shoulderX, shoulderY), spinePaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, fillPaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, spinePaint);
        
        // Chest expansion lines (Breathing ribs)
        canvas.drawCircle(Offset(shoulderX - 15.0, shoulderY + 8.0), 6.0 + breath, Paint()
          ..color = bodyColor.withOpacity(0.15)
          ..style = PaintingStyle.fill);
        
        // High-tech gaze vector line
        double gazeEndX = headX + 25.0;
        double gazeEndY = headY + 12.0;
        canvas.drawLine(Offset(headX + 4.0, headY + 2.0), Offset(gazeEndX, gazeEndY), Paint()
          ..color = mainColor.withOpacity(0.3 * opacity)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0);
        canvas.drawCircle(Offset(gazeEndX, gazeEndY), 1.5, Paint()..color = mainColor.withOpacity(0.5 * opacity)..style = PaintingStyle.fill);
      }

      // --- NEAR ARM (Layer 3, Front) ---
      double nearElbowX = 110.0 + 15.0 * phase;
      double nearElbowY = h - 24.0 - 13.0 * phase;
      if (isGlowPass) {
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(nearElbowX, nearElbowY), nearGlow);
        canvas.drawLine(Offset(nearElbowX, nearElbowY), Offset(handX, handY), nearGlow);
      } else {
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(nearElbowX, nearElbowY), nearPaint);
        canvas.drawLine(Offset(nearElbowX, nearElbowY), Offset(handX, handY), nearPaint);
        
        _drawCrosshair(canvas, Offset(shoulderX, shoulderY), mainColor.withOpacity(opacity));
        _drawCrosshair(canvas, Offset(hipX, hipY), limbColor.withOpacity(opacity));
      }

      // --- POWER COMPRESSION SHOCKWAVE ---
      if (!isGlowPass && localProgress > 0.40 && localProgress < 0.60) {
        double rip = ((localProgress - 0.40) / 0.20); // 0.0 to 1.0
        canvas.drawCircle(Offset(handX, handY), rip * 20.0, Paint()
          ..color = mainColor.withOpacity(0.4 * (1.0 - rip) * opacity)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0);
      }

    } else if (key.contains('squat') || key.contains('leg') || key.contains('lunge')) {
      double feetX1 = w / 2 - 12.0;
      double feetY1 = h - 20.0;
      double feetX2 = w / 2 + 12.0;
      double feetY2 = h - 20.0;
      
      double hipX = w / 2 - 8.0 + 8.0 * phase;
      double hipY = h - 30.0 - 20.0 * phase;
      
      double kneeX1 = w / 2 + 6.0 - 6.0 * phase;
      double kneeY1 = h - 30.0 - 4.0 * phase;
      double kneeX2 = w / 2 - 16.0 + 16.0 * phase;
      double kneeY2 = h - 30.0 - 4.0 * phase;
      
      double shoulderX = w / 2 - 6.0 + 6.0 * phase;
      double shoulderY = hipY - 18.0 - 7.0 * phase;
      double headX = shoulderX + 2.0 - 2.0 * phase;
      double headY = shoulderY - 10.0;
      
      double handX = w / 2 + 20.0;
      double handY = shoulderY;

      // --- FAR LEG (Layer 1, Behind) ---
      if (isGlowPass) {
        canvas.drawLine(Offset(hipX - 2.0, hipY - 2.0), Offset(kneeX2, kneeY2), farGlow);
        canvas.drawLine(Offset(kneeX2, kneeY2), Offset(feetX2, feetY2), farGlow);
      } else {
        canvas.drawLine(Offset(hipX - 2.0, hipY - 2.0), Offset(kneeX2, kneeY2), farPaint);
        canvas.drawLine(Offset(kneeX2, kneeY2), Offset(feetX2, feetY2), farPaint);
      }

      // --- SPINE CORE (Layer 2, Middle) ---
      if (isGlowPass) {
        canvas.drawLine(Offset(hipX, hipY), Offset(shoulderX, shoulderY), spineGlow);
        canvas.drawCircle(Offset(headX, headY), 8.0, spineGlow);
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(handX, handY), nearGlow);
      } else {
        canvas.drawLine(Offset(hipX, hipY), Offset(shoulderX, shoulderY), spinePaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, fillPaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, spinePaint);
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(handX, handY), nearPaint);
        
        // Gaze Vector
        double gazeEndX = headX + 22.0;
        double gazeEndY = headY;
        canvas.drawLine(Offset(headX + 5.0, headY), Offset(gazeEndX, gazeEndY), Paint()
          ..color = mainColor.withOpacity(0.35 * opacity)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0);
        canvas.drawCircle(Offset(gazeEndX, gazeEndY), 1.5, Paint()..color = mainColor.withOpacity(0.5 * opacity)..style = PaintingStyle.fill);
      }

      // --- NEAR LEG (Layer 3, Front) ---
      if (isGlowPass) {
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX1, kneeY1), nearGlow);
        canvas.drawLine(Offset(kneeX1, kneeY1), Offset(feetX1, feetY1), nearGlow);
      } else {
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX1, kneeY1), nearPaint);
        canvas.drawLine(Offset(kneeX1, kneeY1), Offset(feetX1, feetY1), nearPaint);
        
        _drawCrosshair(canvas, Offset(hipX, hipY), mainColor.withOpacity(opacity));
        _drawCrosshair(canvas, Offset(shoulderX, shoulderY), limbColor.withOpacity(opacity));
      }

      // --- SOLID FLOOR COMPRESSION RIPPLES AT BOTTOM ---
      if (!isGlowPass && localProgress > 0.42 && localProgress < 0.58) {
        double rip = ((localProgress - 0.42) / 0.16);
        canvas.drawLine(Offset(feetX1 - 10.0 - 15.0 * rip, feetY1), Offset(feetX2 + 10.0 + 15.0 * rip, feetY2), Paint()
          ..color = mainColor.withOpacity(0.5 * (1.0 - rip) * opacity)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2);
      }

    } else if (key.contains('run') || key.contains('walk') || key.contains('cardio')) {
      double bounce = math.sin(localProgress * 2 * math.pi * 2) * 3.0;
      double legAngle1 = localProgress * 2 * math.pi;
      double legAngle2 = legAngle1 + math.pi;
      
      double hipX = w / 2;
      double hipY = h - 45.0 + bounce;
      double shoulderX = w / 2 + 3.0;
      double shoulderY = hipY - 20.0;
      double headX = shoulderX + 2.0;
      double headY = shoulderY - 10.0;
      
      // Leg 1 (Near)
      double kneeX1 = hipX + math.sin(legAngle1) * 12.0 + 2.0;
      double kneeY1 = hipY + math.cos(legAngle1) * 8.0 + 12.0;
      double footX1 = kneeX1 + math.sin(legAngle1 - 0.5) * 12.0 - 2.0;
      double footY1 = kneeY1 + math.cos(legAngle1 - 0.5) * 8.0 + 12.0;
      
      // Leg 2 (Far, Opposite phase)
      double kneeX2 = hipX + math.sin(legAngle2) * 12.0 + 2.0;
      double kneeY2 = hipY + math.cos(legAngle2) * 8.0 + 12.0;
      double footX2 = kneeX2 + math.sin(legAngle2 - 0.5) * 12.0 - 2.0;
      double footY2 = kneeY2 + math.cos(legAngle2 - 0.5) * 8.0 + 12.0;

      // Arm 1 (Near, swings with Leg 2)
      double elbowX1 = shoulderX + math.sin(legAngle2) * 8.0 - 4.0;
      double elbowY1 = shoulderY + math.cos(legAngle2) * 6.0 + 10.0;
      double handX1 = elbowX1 + math.sin(legAngle2 + 0.8) * 8.0 + 4.0;
      double handY1 = elbowY1 + math.cos(legAngle2 + 0.8) * 4.0;
      
      // Arm 2 (Far, swings with Leg 1)
      double elbowX2 = shoulderX + math.sin(legAngle1) * 8.0 - 4.0;
      double elbowY2 = shoulderY + math.cos(legAngle1) * 6.0 + 10.0;
      double handX2 = elbowX2 + math.sin(legAngle1 + 0.8) * 8.0 + 4.0;
      double handY2 = elbowY2 + math.cos(legAngle1 + 0.8) * 4.0;

      // --- FAR SIDE (Layer 1, Opposite Limbs) ---
      if (isGlowPass) {
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX2, kneeY2), farGlow);
        canvas.drawLine(Offset(kneeX2, kneeY2), Offset(footX2, footY2), farGlow);
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(elbowX2, elbowY2), farGlow);
        canvas.drawLine(Offset(elbowX2, elbowY2), Offset(handX2, handY2), farGlow);
      } else {
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX2, kneeY2), farPaint);
        canvas.drawLine(Offset(kneeX2, kneeY2), Offset(footX2, footY2), farPaint);
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(elbowX2, elbowY2), farPaint);
        canvas.drawLine(Offset(elbowX2, elbowY2), Offset(handX2, handY2), farPaint);
      }

      // --- CORE BODY SPINE ---
      if (isGlowPass) {
        canvas.drawLine(Offset(hipX, hipY), Offset(shoulderX, shoulderY), spineGlow);
        canvas.drawCircle(Offset(headX, headY), 8.0, spineGlow);
      } else {
        canvas.drawLine(Offset(hipX, hipY), Offset(shoulderX, shoulderY), spinePaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, fillPaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, spinePaint);
        
        // Gaze Vector
        double gazeEndX = headX + 22.0;
        double gazeEndY = headY + 2.0;
        canvas.drawLine(Offset(headX + 5.0, headY), Offset(gazeEndX, gazeEndY), Paint()
          ..color = mainColor.withOpacity(0.35 * opacity)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0);
        canvas.drawCircle(Offset(gazeEndX, gazeEndY), 1.5, Paint()..color = mainColor.withOpacity(0.5 * opacity)..style = PaintingStyle.fill);
      }

      // --- NEAR SIDE (Layer 3, Primary Limbs) ---
      if (isGlowPass) {
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX1, kneeY1), nearGlow);
        canvas.drawLine(Offset(kneeX1, kneeY1), Offset(footX1, footY1), nearGlow);
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(elbowX1, elbowY1), nearGlow);
        canvas.drawLine(Offset(elbowX1, elbowY1), Offset(handX1, handY1), nearGlow);
      } else {
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX1, kneeY1), nearPaint);
        canvas.drawLine(Offset(kneeX1, kneeY1), Offset(footX1, footY1), nearPaint);
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(elbowX1, elbowY1), nearPaint);
        canvas.drawLine(Offset(elbowX1, elbowY1), Offset(handX1, handY1), nearPaint);
        
        _drawCrosshair(canvas, Offset(shoulderX, shoulderY), mainColor.withOpacity(opacity));
      }

      // --- POWER FOOTPRINT SHOCKWAVES ---
      if (!isGlowPass) {
        double footCycle1 = (localProgress * 2) % 1.0;
        if (footY1 > h - 22.0) {
          canvas.drawCircle(Offset(footX1, h - 15.0), footCycle1 * 18.0, Paint()
            ..color = mainColor.withOpacity(0.4 * (1.0 - footCycle1) * opacity)
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.0);
        }
        double footCycle2 = ((localProgress + 0.5) * 2) % 1.0;
        if (footY2 > h - 22.0) {
          canvas.drawCircle(Offset(footX2, h - 15.0), footCycle2 * 18.0, Paint()
            ..color = limbColor.withOpacity(0.4 * (1.0 - footCycle2) * opacity)
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.0);
        }
      }

    } else if (key.contains('pull') || key.contains('back') || key.contains('row')) {
      final Paint barPaint = Paint()
        ..color = (isDark ? Colors.white38 : Colors.black38).withOpacity(opacity)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3.5;
      if (!isGlowPass) {
        canvas.drawLine(Offset(60, 20), Offset(w - 60, 20), barPaint);
      }

      double handY = 20.0;
      double shoulderX = w / 2;
      double shoulderY = 48.0 - 26.0 * phase;
      double headX = w / 2;
      double headY = shoulderY - 10.0;
      double hipX = w / 2;
      double hipY = 72.0 - 26.0 * phase;
      double kneeX = w / 2 - 2.0 * phase;
      double kneeY = 88.0 - 26.0 * phase;
      double feetX = w / 2 - 3.0 * phase;
      double feetY = 96.0 - 26.0 * phase;

      // Hand anchors on the bar
      double handX1 = w / 2 - 14.0;
      double handX2 = w / 2 + 14.0;

      // Elbow points bending symmetrically
      double elbowX1 = handX1 - 8.0 * (1.0 - phase);
      double elbowY1 = 20.0 + 26.0 * (1.0 - phase) + 12.0 * phase;
      double elbowX2 = handX2 + 8.0 * (1.0 - phase);
      double elbowY2 = 20.0 + 26.0 * (1.0 - phase) + 12.0 * phase;

      // --- SPINE CORE ---
      if (isGlowPass) {
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(hipX, hipY), spineGlow);
        canvas.drawCircle(Offset(headX, headY), 8.0, spineGlow);
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX, kneeY), spineGlow);
        canvas.drawLine(Offset(kneeX, kneeY), Offset(feetX, feetY), spineGlow);
      } else {
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(hipX, hipY), spinePaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, fillPaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, spinePaint);
        canvas.drawLine(Offset(hipX, hipY), Offset(kneeX, kneeY), spinePaint);
        canvas.drawLine(Offset(kneeX, kneeY), Offset(feetX, feetY), spinePaint);
        
        // Gaze Lock (gaze faces upwards towards the bar!)
        double gazeEndX = headX;
        double gazeEndY = headY - 18.0;
        canvas.drawLine(Offset(headX, headY - 4.0), Offset(gazeEndX, gazeEndY), Paint()
          ..color = mainColor.withOpacity(0.35 * opacity)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0);
        canvas.drawCircle(Offset(gazeEndX, gazeEndY), 1.5, Paint()..color = mainColor.withOpacity(0.5 * opacity)..style = PaintingStyle.fill);
      }

      // --- DUAL ARMS (Symmetrical) ---
      if (isGlowPass) {
        canvas.drawLine(Offset(handX1, handY), Offset(elbowX1, elbowY1), nearGlow);
        canvas.drawLine(Offset(elbowX1, elbowY1), Offset(shoulderX, shoulderY), nearGlow);
        canvas.drawLine(Offset(handX2, handY), Offset(elbowX2, elbowY2), nearGlow);
        canvas.drawLine(Offset(elbowX2, elbowY2), Offset(shoulderX, shoulderY), nearGlow);
      } else {
        canvas.drawLine(Offset(handX1, handY), Offset(elbowX1, elbowY1), nearPaint);
        canvas.drawLine(Offset(elbowX1, elbowY1), Offset(shoulderX, shoulderY), nearPaint);
        canvas.drawLine(Offset(handX2, handY), Offset(elbowX2, elbowY2), nearPaint);
        canvas.drawLine(Offset(elbowX2, elbowY2), Offset(shoulderX, shoulderY), nearPaint);
        
        _drawCrosshair(canvas, Offset(shoulderX, shoulderY), mainColor.withOpacity(opacity));
      }

      // --- PULLUP LIMIT BREAK SHOCKWAVE AT THE TOP ---
      if (!isGlowPass && localProgress > 0.44 && localProgress < 0.56) {
        double rip = ((localProgress - 0.44) / 0.12);
        canvas.drawCircle(Offset(shoulderX, shoulderY), rip * 22.0, Paint()
          ..color = mainColor.withOpacity(0.5 * (1.0 - rip) * opacity)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0);
      }

    } else if (key.contains('water') || key.contains('drink') || key.contains('hydration')) {
      double hipX = w / 2 - 10.0;
      double hipY = h - 20.0;
      double torsoX = w / 2 - 10.0;
      double torsoY = h - 48.0;
      double headX = w / 2 - 10.0 + 3.0 * phase;
      double headY = torsoY - 10.0;
      
      double armLeftX = w / 2 - 20.0;
      double armLeftY = torsoY + 12.0;
      double handLeftX = w / 2 - 10.0;
      double handLeftY = h - 20.0;
      
      double elbowRightX = w / 2 + 2.0 * phase;
      double elbowRightY = torsoY + 8.0 - 10.0 * phase;
      double handRightX = w / 2 - 5.0 + 10.0 * phase;
      double handRightY = torsoY - 5.0 * phase;

      if (isGlowPass) {
        canvas.drawLine(Offset(torsoX, torsoY), Offset(hipX, hipY), spineGlow);
        canvas.drawCircle(Offset(headX, headY), 8.0, spineGlow);
        canvas.drawLine(Offset(torsoX, torsoY), Offset(armLeftX, armLeftY), nearGlow);
        canvas.drawLine(Offset(armLeftX, armLeftY), Offset(handLeftX, handLeftY), nearGlow);
        canvas.drawLine(Offset(torsoX, torsoY), Offset(elbowRightX, elbowRightY), nearGlow);
        canvas.drawLine(Offset(elbowRightX, elbowRightY), Offset(handRightX, handRightY), nearGlow);
      } else {
        canvas.drawLine(Offset(torsoX, torsoY), Offset(hipX, hipY), spinePaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, fillPaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, spinePaint);
        canvas.drawLine(Offset(torsoX, torsoY), Offset(armLeftX, armLeftY), nearPaint);
        canvas.drawLine(Offset(armLeftX, armLeftY), Offset(handLeftX, handLeftY), nearPaint);
        canvas.drawLine(Offset(torsoX, torsoY), Offset(elbowRightX, elbowRightY), nearPaint);
        canvas.drawLine(Offset(elbowRightX, elbowRightY), Offset(handRightX, handRightY), nearPaint);

        // Drinking droplets physics
        if (phase > 0.4) {
          double dropProgress = (phase - 0.4) / 0.6;
          double dropX = handRightX + (headX - handRightX) * dropProgress;
          double dropY = handRightY + (headY - handRightY) * dropProgress;
          double throatShake = 1.0 * math.sin(localProgress * 2 * math.pi * 8);
          canvas.drawCircle(Offset(dropX + throatShake, dropY), 2.0, Paint()..color = limbColor.withOpacity(opacity)..style = PaintingStyle.fill);
        }
        
        canvas.drawRect(Rect.fromLTWH(w - 60, h - 55, 16, 24), floorPaint);
        canvas.drawRect(
          Rect.fromLTRB(w - 58, h - 31 - 20.0 * (1.0 - phase * 0.8), w - 46, h - 33),
          Paint()..color = limbColor.withOpacity(opacity)..style = PaintingStyle.fill,
        );
      }
    } else {
      double phase = (math.sin(localProgress * 2 * math.pi) + 1.0) / 2.0;
      double hipX = w / 2 - 10.0;
      double hipY = h - 20.0;
      double torsoX = w / 2 - 10.0;
      double torsoY = h - 48.0;
      double headX = w / 2 - 10.0;
      double headY = torsoY - 10.0;
      double elbowX = w / 2 + 5.0;
      double elbowY = torsoY + 12.0 - 5.0 * phase;
      double handX = w / 2 + 15.0 + 10.0 * phase;
      double handY = torsoY - 10.0 * phase;

      if (isGlowPass) {
        canvas.drawLine(Offset(torsoX, torsoY), Offset(hipX, hipY), spineGlow);
        canvas.drawCircle(Offset(headX, headY), 8.0, spineGlow);
        canvas.drawLine(Offset(torsoX, torsoY), Offset(elbowX, elbowY), nearGlow);
        canvas.drawLine(Offset(elbowX, elbowY), Offset(handX, handY), nearGlow);
      } else {
        canvas.drawLine(Offset(torsoX, torsoY), Offset(hipX, hipY), spinePaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, fillPaint);
        canvas.drawCircle(Offset(headX, headY), 8.0, spinePaint);
        canvas.drawLine(Offset(torsoX, torsoY), Offset(elbowX, elbowY), nearPaint);
        canvas.drawLine(Offset(elbowX, elbowY), Offset(handX, handY), nearPaint);
      }
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    
    // Choose neon accent color based on theme
    final Color mainColor = isDark ? const Color(0xFFC3F400) : const Color(0xFF9A0002);
    final Color limbColor = isDark ? const Color(0xFF00EEFC) : const Color(0xFF0016A7);

    // 1. Draw Futuristic Cybernetic Scan Grid
    final Paint gridPaint = Paint()
      ..color = isDark ? Colors.white.withOpacity(0.035) : Colors.black.withOpacity(0.035)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.8;
    for (double x = 10; x < w; x += 20) {
      canvas.drawLine(Offset(x, 0), Offset(x, h), gridPaint);
    }
    for (double y = 10; y < h; y += 20) {
      canvas.drawLine(Offset(0, y), Offset(w, y), gridPaint);
    }

    // 2. Draw Motion Trails (Faded previous frame calculations for high-tech kinetic ghost trail)
    // Trail 2 (Oldest, very faint)
    drawFigureAtProgress(canvas, size, (progress - 0.16) % 1.0, 0.12, true, mainColor, limbColor);
    drawFigureAtProgress(canvas, size, (progress - 0.16) % 1.0, 0.12, false, mainColor, limbColor);

    // Trail 1 (Medium faint)
    drawFigureAtProgress(canvas, size, (progress - 0.08) % 1.0, 0.28, true, mainColor, limbColor);
    drawFigureAtProgress(canvas, size, (progress - 0.08) % 1.0, 0.28, false, mainColor, limbColor);

    // 3. Draw Active Figure (Full intensity, glow + core path passes)
    drawFigureAtProgress(canvas, size, progress, 1.0, true, mainColor, limbColor);
    drawFigureAtProgress(canvas, size, progress, 1.0, false, mainColor, limbColor);

    // 4. Draw Animated Lasers Sweeper
    double scanY = (progress * h);
    final Paint scanPaint = Paint()
      ..color = mainColor.withOpacity(0.12)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;
    canvas.drawLine(Offset(0, scanY), Offset(w, scanY), scanPaint);

    // 5. Draw Holographic Monospace Telemetry HUD labels (Veo3 Motion Resolution)
    drawText(canvas, 'VEO-3 // MOTION RENDER', const Offset(8, 6), mainColor.withOpacity(0.75), 6.5);
    drawText(canvas, 'KINETIC RESOLVER v3.2', const Offset(8, 14), limbColor.withOpacity(0.75), 5.5);

    double currentVel = 1.2 + 0.3 * math.sin(progress * 2 * math.pi);
    double forceIdx = 80.0 + 15.0 * math.cos(progress * 2 * math.pi);
    drawText(canvas, 'VELOCITY: ${currentVel.toStringAsFixed(2)} m/s', Offset(8, h - 30), (isDark ? Colors.white54 : Colors.black54), 6.0);
    drawText(canvas, 'FORCE INDEX: ${forceIdx.toStringAsFixed(0)}%', Offset(8, h - 22), (isDark ? Colors.white54 : Colors.black54), 6.0);

    drawText(canvas, 'TRACKING: ENGAGED', Offset(w - 75, 6), mainColor.withOpacity(0.75), 6.0);
    drawText(canvas, 'FPS: 120.0', Offset(w - 75, 14), limbColor.withOpacity(0.75), 5.0);
  }

  @override
  bool shouldRepaint(covariant StickFigurePainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.type != type || oldDelegate.isDark != isDark;
  }
}
