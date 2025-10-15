// 🌐 WEBRTC SERVICE - PEER-TO-PEER VIDEO CONNECTION
// Handles WebRTC setup, ICE candidates, and signaling through Supabase Realtime

import { supabase } from '@/integrations/supabase/client';

// STUN servers for NAT traversal
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ]
};

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private sessionId: string | null = null;
  private userId: string | null = null;
  private partnerId: string | null = null;
  private signalingChannel: any = null;
  private isInitiator: boolean = false;
  
  // Callbacks
  private onRemoteStreamCallback?: (stream: MediaStream) => void;
  private onConnectionStateCallback?: (state: string) => void;
  private onErrorCallback?: (error: Error) => void;

  /**
   * 🚀 INITIALIZE WEBRTC
   */
  async initialize(
    sessionId: string,
    userId: string,
    partnerId: string,
    isInitiator: boolean,
    onRemoteStream: (stream: MediaStream) => void,
    onConnectionState: (state: string) => void,
    onError: (error: Error) => void
  ) {
    console.log('🚀 Initializing WebRTC...', { sessionId, userId, partnerId, isInitiator });
    
    this.sessionId = sessionId;
    this.userId = userId;
    this.partnerId = partnerId;
    this.isInitiator = isInitiator;
    this.onRemoteStreamCallback = onRemoteStream;
    this.onConnectionStateCallback = onConnectionState;
    this.onErrorCallback = onError;

    try {
      // Get local media
      await this.getLocalMedia();
      
      // Create peer connection
      this.createPeerConnection();
      
      // Setup signaling
      await this.setupSignaling();
      
      // If initiator, create and send offer
      if (this.isInitiator) {
        await this.createOffer();
      }
      
      console.log('✅ WebRTC initialized successfully');
    } catch (error: any) {
      console.error('❌ WebRTC initialization error:', error);
      this.onErrorCallback?.(error);
      throw error;
    }
  }

  /**
   * 🎥 GET LOCAL MEDIA (Camera + Microphone)
   */
  private async getLocalMedia() {
    try {
      console.log('🎥 Getting local media...');
      
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
      
      console.log('✅ Local media obtained:', this.localStream.getTracks().length, 'tracks');
    } catch (error: any) {
      console.error('❌ Error getting local media:', error);
      throw new Error('Could not access camera/microphone. Please check permissions.');
    }
  }

  /**
   * 🔗 CREATE PEER CONNECTION
   */
  private createPeerConnection() {
    console.log('🔗 Creating peer connection...');
    
    this.peerConnection = new RTCPeerConnection(ICE_SERVERS);
    
    // Add local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log('➕ Adding local track:', track.kind);
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }
    
    // Handle remote tracks
    this.remoteStream = new MediaStream();
    this.peerConnection.ontrack = (event) => {
      console.log('📥 Received remote track:', event.track.kind);
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream!.addTrack(track);
      });
      this.onRemoteStreamCallback?.(this.remoteStream!);
    };
    
    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 New ICE candidate');
        this.sendSignal('ice-candidate', {
          candidate: event.candidate
        });
      }
    };
    
    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState || 'unknown';
      console.log('🔄 Connection state:', state);
      this.onConnectionStateCallback?.(state);
      
      if (state === 'failed' || state === 'disconnected') {
        this.onErrorCallback?.(new Error('Connection failed or disconnected'));
      }
    };
    
    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection?.iceConnectionState || 'unknown';
      console.log('🧊 ICE connection state:', state);
    };
    
    console.log('✅ Peer connection created');
  }

  /**
   * 📡 SETUP SIGNALING (via Supabase Realtime)
   */
  private async setupSignaling() {
    console.log('📡 Setting up signaling channel...');
    
    // Subscribe to session-specific channel
    this.signalingChannel = supabase.channel(`webrtc-${this.sessionId}`);
    
    // Listen for signaling messages
    this.signalingChannel
      .on('broadcast', { event: 'signal' }, (payload: any) => {
        console.log('📥 Received signal:', payload.payload.type);
        this.handleSignal(payload.payload);
      })
      .subscribe((status: string) => {
        console.log('📡 Signaling channel status:', status);
      });
    
    console.log('✅ Signaling setup complete');
  }

  /**
   * 📤 SEND SIGNAL
   */
  private async sendSignal(type: string, data: any) {
    if (!this.signalingChannel) {
      console.error('❌ No signaling channel');
      return;
    }
    
    console.log('📤 Sending signal:', type);
    
    await this.signalingChannel.send({
      type: 'broadcast',
      event: 'signal',
      payload: {
        type,
        from: this.userId,
        to: this.partnerId,
        sessionId: this.sessionId,
        data
      }
    });
  }

  /**
   * 📥 HANDLE SIGNAL
   */
  private async handleSignal(signal: any) {
    // Only process signals meant for us
    if (signal.to !== this.userId) {
      return;
    }
    
    try {
      switch (signal.type) {
        case 'offer':
          console.log('📥 Handling offer');
          await this.handleOffer(signal.data);
          break;
          
        case 'answer':
          console.log('📥 Handling answer');
          await this.handleAnswer(signal.data);
          break;
          
        case 'ice-candidate':
          console.log('📥 Handling ICE candidate');
          await this.handleIceCandidate(signal.data);
          break;
          
        default:
          console.warn('⚠️ Unknown signal type:', signal.type);
      }
    } catch (error) {
      console.error('❌ Error handling signal:', error);
      this.onErrorCallback?.(error as Error);
    }
  }

  /**
   * 📝 CREATE OFFER
   */
  private async createOffer() {
    if (!this.peerConnection) {
      throw new Error('No peer connection');
    }
    
    console.log('📝 Creating offer...');
    
    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    
    await this.peerConnection.setLocalDescription(offer);
    
    console.log('📤 Sending offer');
    await this.sendSignal('offer', {
      sdp: offer.sdp,
      type: offer.type
    });
  }

  /**
   * 📥 HANDLE OFFER
   */
  private async handleOffer(data: any) {
    if (!this.peerConnection) {
      throw new Error('No peer connection');
    }
    
    console.log('📥 Setting remote description (offer)');
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(data)
    );
    
    console.log('📝 Creating answer...');
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    
    console.log('📤 Sending answer');
    await this.sendSignal('answer', {
      sdp: answer.sdp,
      type: answer.type
    });
  }

  /**
   * 📥 HANDLE ANSWER
   */
  private async handleAnswer(data: any) {
    if (!this.peerConnection) {
      throw new Error('No peer connection');
    }
    
    console.log('📥 Setting remote description (answer)');
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(data)
    );
  }

  /**
   * 🧊 HANDLE ICE CANDIDATE
   */
  private async handleIceCandidate(data: any) {
    if (!this.peerConnection) {
      throw new Error('No peer connection');
    }
    
    if (data.candidate) {
      console.log('🧊 Adding ICE candidate');
      await this.peerConnection.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      );
    }
  }

  /**
   * 🎥 GET LOCAL STREAM
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * 📺 GET REMOTE STREAM
   */
  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  /**
   * 🔇 TOGGLE AUDIO
   */
  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      console.log('🎤 Audio:', enabled ? 'ON' : 'OFF');
    }
  }

  /**
   * 📹 TOGGLE VIDEO
   */
  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      console.log('🎥 Video:', enabled ? 'ON' : 'OFF');
    }
  }

  /**
   * 📊 GET CONNECTION STATS
   */
  async getStats() {
    if (!this.peerConnection) {
      return null;
    }
    
    const stats = await this.peerConnection.getStats();
    const result: any = {};
    
    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.kind === 'video') {
        result.videoBytesReceived = report.bytesReceived;
        result.videoPacketsLost = report.packetsLost;
      }
      if (report.type === 'inbound-rtp' && report.kind === 'audio') {
        result.audioBytesReceived = report.bytesReceived;
      }
    });
    
    return result;
  }

  /**
   * 🧹 CLEANUP
   */
  cleanup() {
    console.log('🧹 Cleaning up WebRTC...');
    
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Stop local media
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
    
    // Clear remote stream
    this.remoteStream = null;
    
    // Unsubscribe from signaling
    if (this.signalingChannel) {
      this.signalingChannel.unsubscribe();
      this.signalingChannel = null;
    }
    
    console.log('✅ WebRTC cleanup complete');
  }
}

// Export singleton instance
export const webrtcService = new WebRTCService();
