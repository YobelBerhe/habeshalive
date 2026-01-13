// 🎭 MOCK WEBRTC SERVICE - For Development/Testing
// This simulates a remote partner video stream until you have real users

export class MockWebRTCService {
  private localStream: MediaStream | null = null;
  private mockRemoteStream: MediaStream | null = null;
  private mockVideoElement: HTMLVideoElement | null = null;
  private animationFrameId: number | null = null;
  
  /**
   * Initialize mock WebRTC with simulated remote stream
   */
  async initialize(
    onRemoteStream: (stream: MediaStream) => void,
    onConnectionState: (state: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      console.log('🎭 Initializing MOCK WebRTC...');
      
      // Get real local media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('✅ Local media obtained');
      onConnectionState('connecting');
      
      // Simulate connection delay (like real WebRTC)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock remote stream
      this.createMockRemoteStream();
      
      if (this.mockRemoteStream) {
        console.log('✅ Mock remote stream created');
        onRemoteStream(this.mockRemoteStream);
        onConnectionState('connected');
      }
      
    } catch (error: any) {
      console.error('❌ Mock WebRTC error:', error);
      onError(error);
      throw error;
    }
  }
  
  /**
   * Create a mock remote video stream
   */
  private createMockRemoteStream(): void {
    // Create a video element to generate mock stream
    this.mockVideoElement = document.createElement('video');
    this.mockVideoElement.style.display = 'none';
    document.body.appendChild(this.mockVideoElement);
    
    // Option 1: Use a color pattern (for quick testing)
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;
    
    // Animated gradient background
    let hue = 0;
    const animate = () => {
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('MOCK PARTNER', canvas.width / 2, canvas.height / 2 - 40);
      ctx.font = '24px Arial';
      ctx.fillText('(Development Mode)', canvas.width / 2, canvas.height / 2 + 20);
      ctx.fillText('Real video coming soon!', canvas.width / 2, canvas.height / 2 + 60);
      
      hue = (hue + 1) % 360;
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    // Capture canvas as stream
    this.mockRemoteStream = canvas.captureStream(30); // 30 FPS
  }
  
  /**
   * Get local stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }
  
  /**
   * Close peer connection (simulated)
   */
  closePeerConnection(): void {
    console.log('🔌 Closing mock peer connection');
    // Don't stop local stream (keep camera active)
    
    // Stop and recreate mock remote stream for "next" functionality
    if (this.mockRemoteStream) {
      this.mockRemoteStream.getTracks().forEach(track => track.stop());
      this.mockRemoteStream = null;
    }
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Reinitialize just the remote stream (for "Next" button)
   */
  async reinitializeRemote(
    onRemoteStream: (stream: MediaStream) => void,
    onConnectionState: (state: string) => void
  ): Promise<void> {
    onConnectionState('connecting');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create new mock remote stream
    this.createMockRemoteStream();
    
    if (this.mockRemoteStream) {
      onRemoteStream(this.mockRemoteStream);
      onConnectionState('connected');
    }
  }
  
  /**
   * Full cleanup
   */
  cleanup(): void {
    console.log('🧹 Cleaning up mock WebRTC');
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.mockRemoteStream) {
      this.mockRemoteStream.getTracks().forEach(track => track.stop());
      this.mockRemoteStream = null;
    }
    
    if (this.mockVideoElement) {
      this.mockVideoElement.remove();
      this.mockVideoElement = null;
    }
  }
}

// Export singleton instance
export const mockWebRTCService = new MockWebRTCService();
