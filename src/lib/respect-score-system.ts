// ⭐ RESPECT SCORE SYSTEM - Backend Implementation
// Community accountability through reputation scoring!

/**
 * 🎯 USER SCORE INTERFACE
 */
export interface UserScore {
  userId: string;
  currentScore: number; // 0-100
  history: ScoreChange[];
  totalCalls: number;
  completedCalls: number;
  skippedCalls: number;
  reportsReceived: number;
  reportsConfirmed: number;
  complimentsReceived: number;
  averageCallDuration: number; // seconds
  accountAge: number; // days
  verified: boolean;
  badges: string[];
  tier: 'banned' | 'warning' | 'good' | 'great' | 'perfect';
}

export interface ScoreChange {
  timestamp: number;
  change: number;
  reason: string;
  details?: string;
  fromUserId?: string; // Who caused the change
}

export interface RatingSubmission {
  fromUserId: string;
  toUserId: string;
  sessionId: string;
  rating: 'respectful' | 'neutral' | 'inappropriate';
  callDuration: number;
  timestamp: number;
  comment?: string;
}

/**
 * ⭐ RESPECT SCORE ENGINE
 */
export class RespectScoreEngine {
  
  /**
   * 📊 SCORE RULES
   */
  private static readonly SCORE_RULES = {
    // Positive actions
    CALL_COMPLETED: 2,
    RATED_RESPECTFUL: 5,
    VERIFIED_GOOD_BEHAVIOR: 3,
    LONG_CALL_BONUS: 1, // 15+ minutes
    CONTACTS_EXCHANGED: 2,
    FIRST_WEEK_BONUS: 5, // Bonus for new users
    STREAK_BONUS: 1, // Per day of good behavior
    
    // Negative actions
    CALL_SKIPPED_EARLY: -5, // <30 seconds
    RATED_INAPPROPRIATE: -20,
    SCREENSHOT_ATTEMPT: -10,
    REPORT_FILED: -30,
    REPORT_CONFIRMED: -50,
    AI_VIOLATION: -40,
    MODESTY_VIOLATION: -20,
    MULTIPLE_VIOLATIONS: -15, // Per violation after 3
    
    // Thresholds
    MIN_SCORE: 0,
    MAX_SCORE: 100,
    STARTING_SCORE: 100,
    MATCHING_THRESHOLD: 85, // Only match with 85+
    WARNING_THRESHOLD: 70,
    BAN_THRESHOLD: 50
  };

  /**
   * 🎯 CALCULATE NEW SCORE
   */
  static calculateScore(
    currentScore: number,
    action: keyof typeof RespectScoreEngine.SCORE_RULES,
    multiplier: number = 1
  ): number {
    const change = this.SCORE_RULES[action] * multiplier;
    const newScore = currentScore + change;
    
    // Clamp between min and max
    return Math.max(
      this.SCORE_RULES.MIN_SCORE,
      Math.min(this.SCORE_RULES.MAX_SCORE, newScore)
    );
  }

  /**
   * 🏆 GET TIER FROM SCORE
   */
  static getTier(score: number): UserScore['tier'] {
    if (score >= 95) return 'perfect';
    if (score >= 85) return 'great';
    if (score >= 70) return 'good';
    if (score >= 50) return 'warning';
    return 'banned';
  }

  /**
   * ⭐ GET STARS FROM SCORE
   */
  static getStars(score: number): number {
    if (score >= 95) return 5;
    if (score >= 85) return 4;
    if (score >= 70) return 3;
    if (score >= 50) return 2;
    return 1;
  }

  /**
   * 📈 PROCESS CALL COMPLETION
   */
  static processCallCompletion(
    user: UserScore,
    callDuration: number,
    partnerRating?: 'respectful' | 'neutral' | 'inappropriate'
  ): UserScore {
    const changes: ScoreChange[] = [];
    let newScore = user.currentScore;

    // Base completion bonus
    newScore = this.calculateScore(newScore, 'CALL_COMPLETED');
    changes.push({
      timestamp: Date.now(),
      change: this.SCORE_RULES.CALL_COMPLETED,
      reason: 'Call completed'
    });

    // Long call bonus (15+ minutes)
    if (callDuration >= 900) {
      newScore = this.calculateScore(newScore, 'LONG_CALL_BONUS');
      changes.push({
        timestamp: Date.now(),
        change: this.SCORE_RULES.LONG_CALL_BONUS,
        reason: 'Long call bonus (15+ minutes)'
      });
    }

    // Partner rating
    if (partnerRating === 'respectful') {
      newScore = this.calculateScore(newScore, 'RATED_RESPECTFUL');
      changes.push({
        timestamp: Date.now(),
        change: this.SCORE_RULES.RATED_RESPECTFUL,
        reason: 'Rated respectful by partner'
      });
    } else if (partnerRating === 'inappropriate') {
      newScore = this.calculateScore(newScore, 'RATED_INAPPROPRIATE');
      changes.push({
        timestamp: Date.now(),
        change: this.SCORE_RULES.RATED_INAPPROPRIATE,
        reason: 'Rated inappropriate by partner'
      });
    }

    // Calculate new average call duration
    const totalDuration = (user.averageCallDuration * user.completedCalls) + callDuration;
    const avgDuration = totalDuration / (user.completedCalls + 1);

    return {
      ...user,
      currentScore: newScore,
      history: [...user.history, ...changes],
      totalCalls: user.totalCalls + 1,
      completedCalls: user.completedCalls + 1,
      averageCallDuration: avgDuration,
      tier: this.getTier(newScore)
    };
  }

  /**
   * 🚫 PROCESS CALL SKIP
   */
  static processCallSkip(
    user: UserScore,
    callDuration: number
  ): UserScore {
    let newScore = user.currentScore;
    const changes: ScoreChange[] = [];

    // Penalty for early skip (<30 seconds)
    if (callDuration < 30) {
      newScore = this.calculateScore(newScore, 'CALL_SKIPPED_EARLY');
      changes.push({
        timestamp: Date.now(),
        change: this.SCORE_RULES.CALL_SKIPPED_EARLY,
        reason: 'Call skipped early (<30 seconds)'
      });
    }

    return {
      ...user,
      currentScore: newScore,
      history: [...user.history, ...changes],
      totalCalls: user.totalCalls + 1,
      skippedCalls: user.skippedCalls + 1,
      tier: this.getTier(newScore)
    };
  }

  /**
   * 🚨 PROCESS REPORT
   */
  static processReport(
    user: UserScore,
    confirmed: boolean = false
  ): UserScore {
    let newScore = user.currentScore;
    const changes: ScoreChange[] = [];

    if (confirmed) {
      newScore = this.calculateScore(newScore, 'REPORT_CONFIRMED');
      changes.push({
        timestamp: Date.now(),
        change: this.SCORE_RULES.REPORT_CONFIRMED,
        reason: 'Report confirmed by moderators'
      });
    } else {
      newScore = this.calculateScore(newScore, 'REPORT_FILED');
      changes.push({
        timestamp: Date.now(),
        change: this.SCORE_RULES.REPORT_FILED,
        reason: 'Report filed (pending review)'
      });
    }

    return {
      ...user,
      currentScore: newScore,
      history: [...user.history, ...changes],
      reportsReceived: user.reportsReceived + 1,
      reportsConfirmed: confirmed ? user.reportsConfirmed + 1 : user.reportsConfirmed,
      tier: this.getTier(newScore)
    };
  }

  /**
   * 🤖 PROCESS AI VIOLATION
   */
  static processAIViolation(
    user: UserScore,
    violationType: 'nudity' | 'weapon' | 'modesty' | 'other',
    severity: 'low' | 'medium' | 'high' | 'critical'
  ): UserScore {
    let newScore = user.currentScore;
    const changes: ScoreChange[] = [];

    // Base violation penalty
    newScore = this.calculateScore(newScore, 'AI_VIOLATION');
    
    // Additional penalty based on severity
    const severityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 1.5,
      critical: 2
    };
    
    const totalChange = this.SCORE_RULES.AI_VIOLATION * severityMultiplier[severity];
    
    changes.push({
      timestamp: Date.now(),
      change: totalChange,
      reason: `AI violation detected: ${violationType} (${severity})`,
      details: `Automatic penalty for ${severity} ${violationType} violation`
    });

    return {
      ...user,
      currentScore: newScore,
      history: [...user.history, ...changes],
      tier: this.getTier(newScore)
    };
  }

  /**
   * 📸 PROCESS SCREENSHOT ATTEMPT
   */
  static processScreenshotAttempt(
    user: UserScore,
    attemptNumber: number
  ): UserScore {
    let newScore = user.currentScore;
    const changes: ScoreChange[] = [];

    // Increasing penalty for multiple attempts
    const multiplier = Math.min(attemptNumber, 5);
    newScore = this.calculateScore(newScore, 'SCREENSHOT_ATTEMPT', multiplier);
    
    changes.push({
      timestamp: Date.now(),
      change: this.SCORE_RULES.SCREENSHOT_ATTEMPT * multiplier,
      reason: `Screenshot attempt #${attemptNumber}`,
      details: 'Screenshots without consent are prohibited'
    });

    return {
      ...user,
      currentScore: newScore,
      history: [...user.history, ...changes],
      tier: this.getTier(newScore)
    };
  }

  /**
   * 🏅 PROCESS GOOD BEHAVIOR STREAK
   */
  static processStreak(
    user: UserScore,
    streakDays: number
  ): UserScore {
    const bonus = this.SCORE_RULES.STREAK_BONUS * streakDays;
    const newScore = Math.min(this.SCORE_RULES.MAX_SCORE, user.currentScore + bonus);
    
    return {
      ...user,
      currentScore: newScore,
      history: [...user.history, {
        timestamp: Date.now(),
        change: bonus,
        reason: `${streakDays} day streak bonus`,
        details: 'Reward for consistent good behavior'
      }],
      tier: this.getTier(newScore)
    };
  }

  /**
   * 🎖️ AWARD BADGE
   */
  static awardBadge(
    user: UserScore,
    badge: string,
    reason: string
  ): UserScore {
    if (user.badges.includes(badge)) {
      return user; // Already has badge
    }

    return {
      ...user,
      badges: [...user.badges, badge],
      history: [...user.history, {
        timestamp: Date.now(),
        change: 0,
        reason: `Badge earned: ${badge}`,
        details: reason
      }]
    };
  }

  /**
   * 🔍 CAN MATCH WITH?
   */
  static canMatchWith(
    userScore: number,
    partnerScore: number
  ): boolean {
    // Both must be above matching threshold
    return (
      userScore >= this.SCORE_RULES.MATCHING_THRESHOLD &&
      partnerScore >= this.SCORE_RULES.MATCHING_THRESHOLD
    );
  }

  /**
   * 📊 GET SCORE DISPLAY
   */
  static getScoreDisplay(score: number): {
    score: number;
    stars: number;
    tier: string;
    color: string;
    emoji: string;
  } {
    const tier = this.getTier(score);
    const stars = this.getStars(score);
    
    const display = {
      perfect: { color: 'text-green-400', emoji: '🌟' },
      great: { color: 'text-blue-400', emoji: '⭐' },
      good: { color: 'text-yellow-400', emoji: '⚡' },
      warning: { color: 'text-orange-400', emoji: '⚠️' },
      banned: { color: 'text-red-400', emoji: '🚫' }
    };

    return {
      score,
      stars,
      tier,
      ...display[tier]
    };
  }

  /**
   * 📈 GET STATISTICS
   */
  static getStatistics(user: UserScore): {
    completionRate: number;
    averageRating: number;
    reportRate: number;
    daysActive: number;
    callsPerDay: number;
  } {
    const completionRate = user.totalCalls > 0
      ? (user.completedCalls / user.totalCalls) * 100
      : 0;

    const reportRate = user.completedCalls > 0
      ? (user.reportsReceived / user.completedCalls) * 100
      : 0;

    const callsPerDay = user.accountAge > 0
      ? user.totalCalls / user.accountAge
      : 0;

    return {
      completionRate,
      averageRating: user.currentScore,
      reportRate,
      daysActive: user.accountAge,
      callsPerDay
    };
  }
}

/**
 * 📊 MONGODB SCHEMA (for reference)
 */
/*
const UserScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  currentScore: { type: Number, default: 100, min: 0, max: 100 },
  history: [{
    timestamp: Number,
    change: Number,
    reason: String,
    details: String,
    fromUserId: String
  }],
  totalCalls: { type: Number, default: 0 },
  completedCalls: { type: Number, default: 0 },
  skippedCalls: { type: Number, default: 0 },
  reportsReceived: { type: Number, default: 0 },
  reportsConfirmed: { type: Number, default: 0 },
  complimentsReceived: { type: Number, default: 0 },
  averageCallDuration: { type: Number, default: 0 },
  accountAge: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  badges: [String],
  tier: { 
    type: String, 
    enum: ['banned', 'warning', 'good', 'great', 'perfect'],
    default: 'perfect'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
*/

/**
 * 🎯 USAGE EXAMPLES
 */
/*
// 1. Process completed call
let userScore = await getUserScore(userId);
userScore = RespectScoreEngine.processCallCompletion(
  userScore,
  900, // 15 minutes
  'respectful' // Partner rated respectful
);
await saveUserScore(userScore);

// 2. Process AI violation
userScore = RespectScoreEngine.processAIViolation(
  userScore,
  'nudity',
  'high'
);
await saveUserScore(userScore);

// 3. Check if users can match
const canMatch = RespectScoreEngine.canMatchWith(
  user1.currentScore,
  user2.currentScore
);

// 4. Display score
const display = RespectScoreEngine.getScoreDisplay(userScore.currentScore);
console.log(`${display.emoji} ${display.score}/100 ${'⭐'.repeat(display.stars)}`);
*/

export default RespectScoreEngine;
