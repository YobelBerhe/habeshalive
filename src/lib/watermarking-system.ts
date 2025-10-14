// 🛡️ SCREENSHOT WATERMARKING SYSTEM
// Invisible forensic watermarks for every video frame!

/**
 * 🎯 WATERMARK DATA STRUCTURE
 */
export interface WatermarkData {
  userId: string;
  partnerId: string;
  sessionId: string;
  timestamp: number;
  frameNumber: number;
  ipHash: string;
  deviceFingerprint: string;
}

/**
 * 🔐 STEGANOGRAPHY ENGINE
 * Hides watermark data inside image pixels
 */
export class SteganographyEngine {
  
  /**
   * 🎨 ENCODE: Hide watermark in image
   */
  static encode(canvas: HTMLCanvasElement, watermark: WatermarkData): HTMLCanvasElement {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert watermark to binary string
    const watermarkString = JSON.stringify(watermark);
    const binaryString = this.stringToBinary(watermarkString);
    
    // Add length header (32 bits)
    const lengthBinary = this.numberToBinary(binaryString.length, 32);
    const fullBinary = lengthBinary + binaryString;

    // Encode into LSB (Least Significant Bit) of pixels
    let binaryIndex = 0;
    for (let i = 0; i < data.length && binaryIndex < fullBinary.length; i += 4) {
      // Only modify RGB, not alpha
      for (let j = 0; j < 3 && binaryIndex < fullBinary.length; j++) {
        // Replace LSB with watermark bit
        data[i + j] = (data[i + j] & 0xFE) | parseInt(fullBinary[binaryIndex]);
        binaryIndex++;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * 🔍 DECODE: Extract watermark from image
   */
  static decode(canvas: HTMLCanvasElement): WatermarkData | null {
    try {
      const ctx = canvas.getContext('2d')!;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Extract length header (32 bits)
      let lengthBinary = '';
      for (let i = 0; i < 32 * 4; i += 4) {
        for (let j = 0; j < 3 && lengthBinary.length < 32; j++) {
          lengthBinary += (data[i + j] & 1).toString();
        }
      }

      const length = parseInt(lengthBinary, 2);
      if (length <= 0 || length > 10000) {
        console.error('Invalid watermark length:', length);
        return null;
      }

      // Extract watermark data
      let watermarkBinary = '';
      let binaryIndex = 0;
      for (let i = 32 * 4; i < data.length && watermarkBinary.length < length; i += 4) {
        for (let j = 0; j < 3 && watermarkBinary.length < length; j++) {
          watermarkBinary += (data[i + j] & 1).toString();
          binaryIndex++;
        }
      }

      // Convert binary to string
      const watermarkString = this.binaryToString(watermarkBinary);
      const watermark = JSON.parse(watermarkString);

      return watermark;
    } catch (error) {
      console.error('Error decoding watermark:', error);
      return null;
    }
  }

  /**
   * 🔤 STRING TO BINARY
   */
  private static stringToBinary(str: string): string {
    return str.split('').map(char => {
      const binary = char.charCodeAt(0).toString(2);
      return '0'.repeat(8 - binary.length) + binary;
    }).join('');
  }

  /**
   * 🔤 BINARY TO STRING
   */
  private static binaryToString(binary: string): string {
    const bytes = binary.match(/.{8}/g) || [];
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  }

  /**
   * 🔢 NUMBER TO BINARY
   */
  private static numberToBinary(num: number, bits: number): string {
    const binary = num.toString(2);
    return '0'.repeat(bits - binary.length) + binary;
  }

  /**
   * ✅ VERIFY: Check if watermark is intact
   */
  static verify(canvas: HTMLCanvasElement, expectedWatermark: WatermarkData): boolean {
    const decoded = this.decode(canvas);
    if (!decoded) return false;

    return (
      decoded.userId === expectedWatermark.userId &&
      decoded.sessionId === expectedWatermark.sessionId &&
      Math.abs(decoded.timestamp - expectedWatermark.timestamp) < 5000 // 5 second tolerance
    );
  }
}

/**
 * 🎥 VIDEO WATERMARKING SYSTEM
 */
export class VideoWatermarkingSystem {
  private sessionId: string;
  private userId: string;
  private partnerId: string;
  private frameNumber: number = 0;
  private isActive: boolean = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private watermarkHistory: Map<number, WatermarkData> = new Map();

  constructor(userId: string, partnerId: string, sessionId: string) {
    this.userId = userId;
    this.partnerId = partnerId;
    this.sessionId = sessionId;
    
    // Create canvas for watermarking
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * 🚀 START WATERMARKING
   */
  start(): void {
    this.isActive = true;
    this.frameNumber = 0;
    console.log('🛡️ Watermarking system activated');
  }

  /**
   * 🛑 STOP WATERMARKING
   */
  stop(): void {
    this.isActive = false;
    console.log('🛡️ Watermarking system deactivated');
  }

  /**
   * 🎨 WATERMARK A FRAME
   */
  watermarkFrame(videoElement: HTMLVideoElement): HTMLCanvasElement {
    if (!this.isActive) return this.canvas;

    // Set canvas size to match video
    this.canvas.width = videoElement.videoWidth;
    this.canvas.height = videoElement.videoHeight;

    // Draw video frame to canvas
    this.ctx.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);

    // Create watermark data
    const watermark: WatermarkData = {
      userId: this.userId,
      partnerId: this.partnerId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      frameNumber: this.frameNumber++,
      ipHash: this.getIPHash(),
      deviceFingerprint: this.getDeviceFingerprint()
    };

    // Encode watermark
    SteganographyEngine.encode(this.canvas, watermark);

    // Store in history
    this.watermarkHistory.set(watermark.frameNumber, watermark);
    
    // Keep only last 1000 frames in history
    if (this.watermarkHistory.size > 1000) {
      const oldestFrame = Math.min(...this.watermarkHistory.keys());
      this.watermarkHistory.delete(oldestFrame);
    }

    return this.canvas;
  }

  /**
   * 🔍 VERIFY A SCREENSHOT
   */
  verifyScreenshot(imageData: string): Promise<{
    valid: boolean;
    watermark: WatermarkData | null;
    confidence: number;
  }> {
    try {
      // Load image into canvas
      const img = new Image();
      img.src = imageData;
      
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);

          // Decode watermark
          const watermark = SteganographyEngine.decode(canvas);

          if (watermark) {
            // Check if it's from this session
            const isThisSession = watermark.sessionId === this.sessionId;
            const isRecentFrame = this.watermarkHistory.has(watermark.frameNumber);
            
            resolve({
              valid: true,
              watermark,
              confidence: (isThisSession && isRecentFrame) ? 0.99 : 0.75
            });
          } else {
            resolve({
              valid: false,
              watermark: null,
              confidence: 0
            });
          }
        };

        img.onerror = () => {
          resolve({
            valid: false,
            watermark: null,
            confidence: 0
          });
        };
      });
    } catch (error) {
      console.error('Error verifying screenshot:', error);
      return Promise.resolve({
        valid: false,
        watermark: null,
        confidence: 0
      });
    }
  }

  /**
   * 🆔 GET IP HASH
   */
  private getIPHash(): string {
    // In production, get from backend
    // For now, generate a consistent hash
    return btoa(`${this.userId}-${this.sessionId}`).substring(0, 16);
  }

  /**
   * 📱 GET DEVICE FINGERPRINT
   */
  private getDeviceFingerprint(): string {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset()
    ].join('|');

    return btoa(fingerprint).substring(0, 16);
  }

  /**
   * 📊 GET STATISTICS
   */
  getStatistics(): {
    totalFramesWatermarked: number;
    sessionId: string;
    userId: string;
    partnerId: string;
    isActive: boolean;
  } {
    return {
      totalFramesWatermarked: this.frameNumber,
      sessionId: this.sessionId,
      userId: this.userId,
      partnerId: this.partnerId,
      isActive: this.isActive
    };
  }

  /**
   * 🧹 CLEAR HISTORY
   */
  clearHistory(): void {
    this.watermarkHistory.clear();
  }
}

/**
 * 🚨 SCREENSHOT DETECTION SYSTEM
 */
export class ScreenshotDetectionSystem {
  private userId: string;
  private partnerId: string;
  private sessionId: string;
  private screenshotAttempts: number = 0;
  private lastAttemptTime: number = 0;
  private callbacks: {
    onAttempt: (attempt: ScreenshotAttempt) => void;
    onMultipleAttempts: (count: number) => void;
  };

  constructor(
    userId: string,
    partnerId: string,
    sessionId: string,
    callbacks: {
      onAttempt: (attempt: ScreenshotAttempt) => void;
      onMultipleAttempts: (count: number) => void;
    }
  ) {
    this.userId = userId;
    this.partnerId = partnerId;
    this.sessionId = sessionId;
    this.callbacks = callbacks;
  }

  /**
   * 🎯 START DETECTION
   */
  start(): void {
    // Detect page visibility changes (common screenshot method)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Detect keyboard shortcuts (Print Screen, etc.)
    document.addEventListener('keyup', this.handleKeyPress.bind(this));

    // Detect copy/paste events
    document.addEventListener('copy', this.handleCopy.bind(this));

    console.log('🚨 Screenshot detection active');
  }

  /**
   * 🛑 STOP DETECTION
   */
  stop(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    document.removeEventListener('keyup', this.handleKeyPress.bind(this));
    document.removeEventListener('copy', this.handleCopy.bind(this));
    
    console.log('🚨 Screenshot detection deactivated');
  }

  /**
   * 👁️ HANDLE VISIBILITY CHANGE
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Tab/window was hidden - possible screenshot
      this.recordAttempt('visibility-change');
    }
  }

  /**
   * ⌨️ HANDLE KEY PRESS
   */
  private handleKeyPress(e: KeyboardEvent): void {
    // Detect Print Screen key
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      this.recordAttempt('print-screen');
    }

    // Detect Cmd/Ctrl + Shift + 3/4/5 (macOS screenshot)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
      this.recordAttempt('keyboard-shortcut');
    }
  }

  /**
   * 📋 HANDLE COPY
   */
  private handleCopy(e: ClipboardEvent): void {
    // Someone is copying - possible screenshot sharing
    this.recordAttempt('copy-event');
  }

  /**
   * 📝 RECORD ATTEMPT
   */
  private recordAttempt(method: string): void {
    this.screenshotAttempts++;
    this.lastAttemptTime = Date.now();

    const attempt: ScreenshotAttempt = {
      userId: this.userId,
      partnerId: this.partnerId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      method,
      attemptNumber: this.screenshotAttempts
    };

    console.warn('⚠️ Screenshot attempt detected:', attempt);

    // Trigger callback
    this.callbacks.onAttempt(attempt);

    // If multiple attempts, trigger warning
    if (this.screenshotAttempts >= 3) {
      this.callbacks.onMultipleAttempts(this.screenshotAttempts);
    }

    // Log to backend (in production)
    this.logToBackend(attempt);
  }

  /**
   * 📤 LOG TO BACKEND
   */
  private async logToBackend(attempt: ScreenshotAttempt): Promise<void> {
    try {
      // In production, send to your backend
      await fetch('/api/security/screenshot-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt)
      });
    } catch (error) {
      console.error('Error logging screenshot attempt:', error);
    }
  }

  /**
   * 📊 GET STATISTICS
   */
  getStatistics(): {
    totalAttempts: number;
    lastAttemptTime: number;
    sessionId: string;
  } {
    return {
      totalAttempts: this.screenshotAttempts,
      lastAttemptTime: this.lastAttemptTime,
      sessionId: this.sessionId
    };
  }

  /**
   * 🔄 RESET COUNTER
   */
  reset(): void {
    this.screenshotAttempts = 0;
    this.lastAttemptTime = 0;
  }
}

/**
 * 📊 TYPES
 */
export interface ScreenshotAttempt {
  userId: string;
  partnerId: string;
  sessionId: string;
  timestamp: number;
  method: string;
  attemptNumber: number;
}

/**
 * 🎯 USAGE EXAMPLE
 */
/*
// 1. Initialize watermarking system
const watermarking = new VideoWatermarkingSystem(
  'user-123',
  'partner-456',
  'session-789'
);
watermarking.start();

// 2. Watermark each frame (in render loop)
const videoElement = document.querySelector('video');
const watermarkedCanvas = watermarking.watermarkFrame(videoElement);
// Display watermarkedCanvas instead of raw video

// 3. Initialize screenshot detection
const screenshotDetection = new ScreenshotDetectionSystem(
  'user-123',
  'partner-456',
  'session-789',
  {
    onAttempt: (attempt) => {
      console.warn('Screenshot attempt!', attempt);
      showWarning('Screenshots are not allowed');
      // Temporarily blur video
      videoElement.style.filter = 'blur(50px)';
      setTimeout(() => {
        videoElement.style.filter = 'none';
      }, 3000);
    },
    onMultipleAttempts: (count) => {
      console.error('Multiple screenshot attempts!', count);
      alert('Multiple screenshot attempts detected. Your respect score will be reduced.');
      // Reduce respect score
      reduceRespectScore(10);
    }
  }
);
screenshotDetection.start();

// 4. Verify a reported screenshot
const reportedImage = 'data:image/jpeg;base64,...';
const verification = await watermarking.verifyScreenshot(reportedImage);
if (verification.valid) {
  console.log('Watermark found!', verification.watermark);
  console.log('Offender ID:', verification.watermark.userId);
  // Ban the offender
}
*/
