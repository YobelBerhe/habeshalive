// 🤖 AI MODERATION SYSTEM - COMPLETE IMPLEMENTATION
// This is the BRAIN of HabeshLive's safety features!

import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as nsfwjs from 'nsfwjs';

// 🎯 TYPES & INTERFACES
interface ModerationResult {
  safe: boolean;
  violations: Violation[];
  confidence: number;
  blurLevel: number;
  action: 'allow' | 'warn' | 'blur' | 'disconnect';
  evidence?: string; // Base64 screenshot
}

interface Violation {
  type: 'nudity' | 'weapon' | 'gesture' | 'modesty' | 'object';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  details: string;
  timestamp: number;
}

interface ModestyCheck {
  shoulderCoverage: number;
  chestCoverage: number;
  kneeCoverage: number;
  overall: 'modest' | 'borderline' | 'immodest';
  culturalCompliance: boolean;
}

// 🛡️ AI MODERATION ENGINE
export class AIContentModeration {
  private bodyPixModel: bodyPix.BodyPix | null = null;
  private cocoModel: cocossd.ObjectDetection | null = null;
  private nsfwModel: any = null;
  private isInitialized = false;
  private violationHistory: Violation[] = [];
  private frameCount = 0;
  
  // Configuration - tuned for real-world use
  private config = {
    checkInterval: 200, // Check every 200ms (5 FPS)
    nudityThreshold: 0.85, // Increased from 0.7 to reduce false positives
    objectThreshold: 0.7, // Increased from 0.6
    nsfwThreshold: 0.75, // Higher threshold for NSFW
    maxViolations: 5, // Increased from 3 to be more forgiving
    evidenceBufferSeconds: 30,
    culturalMode: 'western' as 'habesha' | 'western' | 'conservative', // Default to western for less strict modesty
    skipModestyCheck: true // Skip modesty checks - they cause too many false positives
  };

  // Evidence buffer (last 30 seconds)
  private evidenceBuffer: string[] = [];
  private maxBufferSize = 150; // 30 seconds at 5 FPS

  /**
   * 🚀 INITIALIZE ALL AI MODELS
   */
  async initialize(): Promise<void> {
    console.log('🤖 Loading AI models...');
    
    try {
      // 1. Load BodyPix for body part segmentation
      console.log('Loading BodyPix model...');
      this.bodyPixModel = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      });
      console.log('✅ BodyPix loaded!');

      // 2. Load COCO-SSD for object detection
      console.log('Loading COCO-SSD model...');
      this.cocoModel = await cocossd.load({
        base: 'mobilenet_v2'
      });
      console.log('✅ COCO-SSD loaded!');

      // 3. Load NSFW.js for explicit content detection
      console.log('Loading NSFW model...');
      this.nsfwModel = await nsfwjs.load();
      console.log('✅ NSFW model loaded!');

      this.isInitialized = true;
      console.log('🎉 All AI models loaded successfully!');
    } catch (error) {
      console.error('❌ Error loading AI models:', error);
      throw error;
    }
  }

  /**
   * ⚡ MAIN ANALYSIS FUNCTION - Analyzes a video frame
   */
  async analyzeFrame(videoElement: HTMLVideoElement): Promise<ModerationResult> {
    if (!this.isInitialized) {
      throw new Error('AI models not initialized. Call initialize() first.');
    }

    this.frameCount++;
    const violations: Violation[] = [];
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      // Create canvas for processing
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(videoElement, 0, 0);

      // 🔍 RUN ALL CHECKS IN PARALLEL (skip modesty if configured)
      const [
        nudityResult,
        objectResult,
        modestyResult,
        nsfwResult
      ] = await Promise.all([
        this.checkNudity(videoElement),
        this.checkDangerousObjects(videoElement),
        this.config.skipModestyCheck ? Promise.resolve(null) : this.checkModesty(videoElement),
        this.checkNSFW(canvas)
      ]);

      // Combine results
      if (nudityResult) violations.push(nudityResult);
      if (objectResult) violations.push(objectResult);
      if (modestyResult) violations.push(modestyResult);
      if (nsfwResult) violations.push(nsfwResult);

      // Determine max severity
      violations.forEach(v => {
        if (v.severity === 'critical') maxSeverity = 'critical';
        else if (v.severity === 'high' && maxSeverity !== 'critical') maxSeverity = 'high';
        else if (v.severity === 'medium' && maxSeverity === 'low') maxSeverity = 'medium';
      });

      // Store in violation history
      this.violationHistory.push(...violations);
      if (this.violationHistory.length > 20) {
        this.violationHistory = this.violationHistory.slice(-20);
      }

      // Save frame to evidence buffer
      if (violations.length > 0) {
        this.evidenceBuffer.push(canvas.toDataURL('image/jpeg', 0.7));
        if (this.evidenceBuffer.length > this.maxBufferSize) {
          this.evidenceBuffer.shift();
        }
      }

      // Determine action
      const action = this.determineAction(violations, maxSeverity);
      const blurLevel = this.calculateBlurLevel(violations, maxSeverity);

      return {
        safe: violations.length === 0,
        violations,
        confidence: this.calculateOverallConfidence(violations),
        blurLevel,
        action,
        evidence: violations.length > 0 ? canvas.toDataURL('image/jpeg', 0.7) : undefined
      };

    } catch (error) {
      console.error('Error analyzing frame:', error);
      return {
        safe: true,
        violations: [],
        confidence: 0,
        blurLevel: 0,
        action: 'allow'
      };
    }
  }

  /**
   * 🔞 CHECK FOR NUDITY using BodyPix
   */
  private async checkNudity(video: HTMLVideoElement): Promise<Violation | null> {
    if (!this.bodyPixModel) return null;

    try {
      // Segment person in video
      const segmentation = await this.bodyPixModel.segmentPerson(video, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
      });

      // Analyze body parts
      const partSegmentation = await this.bodyPixModel.segmentPersonParts(video, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
      });

      // Check for exposed body parts
      const exposedParts = this.analyzeExposedParts(partSegmentation);
      
      if (exposedParts.exposureLevel > this.config.nudityThreshold) {
        return {
          type: 'nudity',
          severity: exposedParts.exposureLevel > 0.9 ? 'critical' : 'high',
          confidence: exposedParts.confidence,
          details: `Exposed body parts detected: ${exposedParts.parts.join(', ')}`,
          timestamp: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Error in nudity check:', error);
      return null;
    }
  }

  /**
   * 🔫 CHECK FOR DANGEROUS OBJECTS using COCO-SSD
   */
  private async checkDangerousObjects(video: HTMLVideoElement): Promise<Violation | null> {
    if (!this.cocoModel) return null;

    try {
      const predictions = await this.cocoModel.detect(video);
      
      // List of dangerous objects
      const dangerousObjects = [
        'knife', 'scissors', 'bottle', 'wine glass', 
        'syringe', 'baseball bat', 'umbrella'
      ];

      const detectedDanger = predictions.find(pred => 
        dangerousObjects.includes(pred.class) && pred.score > this.config.objectThreshold
      );

      if (detectedDanger) {
        return {
          type: 'weapon',
          severity: this.getDangerSeverity(detectedDanger.class),
          confidence: detectedDanger.score,
          details: `Potentially dangerous object detected: ${detectedDanger.class}`,
          timestamp: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Error in object detection:', error);
      return null;
    }
  }

  /**
   * 👔 CHECK MODESTY using custom logic
   */
  private async checkModesty(video: HTMLVideoElement): Promise<Violation | null> {
    if (!this.bodyPixModel) return null;

    try {
      const partSegmentation = await this.bodyPixModel.segmentPersonParts(video, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
      });

      const modestyCheck = this.analyzeModesty(partSegmentation);

      // Apply cultural standards
      const culturalCompliance = this.checkCulturalStandards(modestyCheck);

      if (!culturalCompliance) {
        return {
          type: 'modesty',
          severity: modestyCheck.overall === 'immodest' ? 'high' : 'medium',
          confidence: 0.85,
          details: `Clothing does not meet ${this.config.culturalMode} modesty standards`,
          timestamp: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Error in modesty check:', error);
      return null;
    }
  }

  /**
   * 🔞 CHECK NSFW CONTENT using NSFW.js
   */
  private async checkNSFW(canvas: HTMLCanvasElement): Promise<Violation | null> {
    if (!this.nsfwModel) return null;

    try {
      const predictions = await this.nsfwModel.classify(canvas);
      
      // Check for explicit content - use higher threshold to reduce false positives
      const explicit = predictions.find((p: any) => 
        (p.className === 'Porn' || p.className === 'Hentai') && p.probability > this.config.nsfwThreshold
      );

      if (explicit) {
        return {
          type: 'nudity',
          severity: 'critical',
          confidence: explicit.probability,
          details: `Explicit content detected: ${explicit.className}`,
          timestamp: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Error in NSFW check:', error);
      return null;
    }
  }

  /**
   * 📊 ANALYZE EXPOSED BODY PARTS
   */
  private analyzeExposedParts(segmentation: any): {
    exposureLevel: number;
    parts: string[];
    confidence: number;
  } {
    const data = segmentation.data;
    const width = segmentation.width;
    const height = segmentation.height;

    // Body part indices from BodyPix
    const BODY_PARTS = {
      torsoFront: 12,
      torsoBack: 13,
      leftUpperLeg: 14,
      rightUpperLeg: 15,
      leftLowerLeg: 16,
      rightLowerLeg: 17
    };

    let exposedPixels = 0;
    let totalBodyPixels = 0;
    const exposedParts: string[] = [];

    // Analyze each pixel
    for (let i = 0; i < data.length; i++) {
      const partId = data[i];
      
      if (partId >= 0) {
        totalBodyPixels++;
        
        // Check if sensitive body part is exposed
        if (
          partId === BODY_PARTS.torsoFront ||
          partId === BODY_PARTS.torsoBack ||
          partId === BODY_PARTS.leftUpperLeg ||
          partId === BODY_PARTS.rightUpperLeg
        ) {
          exposedPixels++;
          
          // Add part name if not already added
          const partName = Object.keys(BODY_PARTS).find(
            key => BODY_PARTS[key as keyof typeof BODY_PARTS] === partId
          );
          if (partName && !exposedParts.includes(partName)) {
            exposedParts.push(partName);
          }
        }
      }
    }

    const exposureLevel = totalBodyPixels > 0 ? exposedPixels / totalBodyPixels : 0;

    return {
      exposureLevel,
      parts: exposedParts,
      confidence: 0.9
    };
  }

  /**
   * 👗 ANALYZE MODESTY LEVELS
   */
  private analyzeModesty(segmentation: any): ModestyCheck {
    const data = segmentation.data;
    const width = segmentation.width;
    const height = segmentation.height;

    // Divide frame into regions
    const regions = {
      shoulder: { start: 0, end: height * 0.25 },
      chest: { start: height * 0.25, end: height * 0.5 },
      knee: { start: height * 0.6, end: height * 0.8 }
    };

    // Calculate coverage
    let shoulderCovered = 0;
    let shoulderTotal = 0;
    let chestCovered = 0;
    let chestTotal = 0;
    let kneeCovered = 0;
    let kneeTotal = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const partId = data[i];

        if (partId >= 0) {
          // Shoulder region
          if (y >= regions.shoulder.start && y < regions.shoulder.end) {
            shoulderTotal++;
            if (this.isPartCovered(partId)) shoulderCovered++;
          }
          
          // Chest region
          if (y >= regions.chest.start && y < regions.chest.end) {
            chestTotal++;
            if (this.isPartCovered(partId)) chestCovered++;
          }
          
          // Knee region
          if (y >= regions.knee.start && y < regions.knee.end) {
            kneeTotal++;
            if (this.isPartCovered(partId)) kneeCovered++;
          }
        }
      }
    }

    const shoulderCoverage = shoulderTotal > 0 ? (shoulderCovered / shoulderTotal) * 100 : 100;
    const chestCoverage = chestTotal > 0 ? (chestCovered / chestTotal) * 100 : 100;
    const kneeCoverage = kneeTotal > 0 ? (kneeCovered / kneeTotal) * 100 : 100;

    // Determine overall modesty
    let overall: 'modest' | 'borderline' | 'immodest';
    if (shoulderCoverage < 70 || chestCoverage < 80) {
      overall = 'immodest';
    } else if (shoulderCoverage < 85 || chestCoverage < 90) {
      overall = 'borderline';
    } else {
      overall = 'modest';
    }

    return {
      shoulderCoverage,
      chestCoverage,
      kneeCoverage,
      overall,
      culturalCompliance: this.checkCulturalStandards({
        shoulderCoverage,
        chestCoverage,
        kneeCoverage,
        overall,
        culturalCompliance: true
      })
    };
  }

  /**
   * 🌍 CHECK CULTURAL STANDARDS
   */
  private checkCulturalStandards(modestyCheck: ModestyCheck): boolean {
    const standards = {
      habesha: {
        shoulderMin: 90,
        chestMin: 95,
        kneeMin: 80
      },
      conservative: {
        shoulderMin: 95,
        chestMin: 98,
        kneeMin: 90
      },
      western: {
        shoulderMin: 70,
        chestMin: 80,
        kneeMin: 60
      }
    };

    const standard = standards[this.config.culturalMode];

    return (
      modestyCheck.shoulderCoverage >= standard.shoulderMin &&
      modestyCheck.chestCoverage >= standard.chestMin &&
      modestyCheck.kneeCoverage >= standard.kneeMin
    );
  }

  /**
   * 🎯 DETERMINE ACTION BASED ON VIOLATIONS
   */
  private determineAction(
    violations: Violation[],
    maxSeverity: 'low' | 'medium' | 'high' | 'critical'
  ): 'allow' | 'warn' | 'blur' | 'disconnect' {
    if (violations.length === 0) return 'allow';

    // Critical violations = instant disconnect
    if (maxSeverity === 'critical') return 'disconnect';

    // Count recent violations
    const recentViolations = this.violationHistory.filter(
      v => Date.now() - v.timestamp < 10000 // Last 10 seconds
    );

    // Too many violations = disconnect
    if (recentViolations.length >= this.config.maxViolations) {
      return 'disconnect';
    }

    // High severity = blur
    if (maxSeverity === 'high') return 'blur';

    // Medium severity = warn first time, blur second time
    if (maxSeverity === 'medium') {
      return recentViolations.length > 0 ? 'blur' : 'warn';
    }

    // Low severity = warn
    return 'warn';
  }

  /**
   * 🔢 CALCULATE BLUR LEVEL
   */
  private calculateBlurLevel(
    violations: Violation[],
    maxSeverity: 'low' | 'medium' | 'high' | 'critical'
  ): number {
    if (violations.length === 0) return 0;

    const severityBlur = {
      low: 20,
      medium: 40,
      high: 60,
      critical: 80
    };

    return severityBlur[maxSeverity];
  }

  /**
   * 📊 CALCULATE OVERALL CONFIDENCE
   */
  private calculateOverallConfidence(violations: Violation[]): number {
    if (violations.length === 0) return 1.0;

    const avgConfidence = violations.reduce((sum, v) => sum + v.confidence, 0) / violations.length;
    return avgConfidence;
  }

  /**
   * 🔍 HELPER: Check if body part is covered
   */
  private isPartCovered(partId: number): boolean {
    // Parts that should be covered (clothing)
    const coveredParts = [0, 1]; // Head and face are always "covered"
    return coveredParts.includes(partId) || partId === -1;
  }

  /**
   * ⚠️ GET DANGER SEVERITY for objects
   */
  private getDangerSeverity(objectClass: string): 'low' | 'medium' | 'high' | 'critical' {
    const highDanger = ['knife', 'scissors'];
    const mediumDanger = ['bottle', 'baseball bat'];
    
    if (highDanger.includes(objectClass)) return 'high';
    if (mediumDanger.includes(objectClass)) return 'medium';
    return 'low';
  }

  /**
   * 📸 GET EVIDENCE (Last 30 seconds)
   */
  getEvidence(): string[] {
    return [...this.evidenceBuffer];
  }

  /**
   * 🧹 CLEAR EVIDENCE BUFFER
   */
  clearEvidence(): void {
    this.evidenceBuffer = [];
  }

  /**
   * 📊 GET VIOLATION HISTORY
   */
  getViolationHistory(): Violation[] {
    return [...this.violationHistory];
  }

  /**
   * 🔄 RESET SYSTEM
   */
  reset(): void {
    this.violationHistory = [];
    this.evidenceBuffer = [];
    this.frameCount = 0;
  }

  /**
   * ⚙️ UPDATE CONFIGURATION
   */
  updateConfig(config: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 📊 GET STATISTICS
   */
  getStatistics(): {
    totalFramesAnalyzed: number;
    totalViolations: number;
    violationsByType: Record<string, number>;
    averageConfidence: number;
  } {
    const violationsByType: Record<string, number> = {};
    
    this.violationHistory.forEach(v => {
      violationsByType[v.type] = (violationsByType[v.type] || 0) + 1;
    });

    const avgConfidence = this.violationHistory.length > 0
      ? this.violationHistory.reduce((sum, v) => sum + v.confidence, 0) / this.violationHistory.length
      : 0;

    return {
      totalFramesAnalyzed: this.frameCount,
      totalViolations: this.violationHistory.length,
      violationsByType,
      averageConfidence: avgConfidence
    };
  }
}

// 🎯 EXPORT SINGLETON INSTANCE
export const aiModeration = new AIContentModeration();

// 🚀 USAGE EXAMPLE
/*
// Initialize once at app start
await aiModeration.initialize();

// In your video call component
const analyzeVideoFrame = async () => {
  const videoElement = document.querySelector('video');
  const result = await aiModeration.analyzeFrame(videoElement);
  
  if (!result.safe) {
    console.log('⚠️ Violations detected:', result.violations);
    
    // Apply blur
    if (result.action === 'blur') {
      videoElement.style.filter = `blur(${result.blurLevel}px)`;
    }
    
    // Disconnect
    if (result.action === 'disconnect') {
      alert('Connection ended due to safety violation');
      endCall();
    }
    
    // Show warning
    if (result.action === 'warn') {
      showWarning(result.violations[0].details);
    }
  }
};

// Check every 200ms (5 FPS)
setInterval(analyzeVideoFrame, 200);
*/
