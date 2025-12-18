/**
 * Platform detection utilities for the real-time audio translation system
 */

/**
 * Detects the current platform and determines device capabilities
 */
export function detectPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // OS detection
  let os = 'unknown';
  if (userAgent.includes('windows')) os = 'windows';
  else if (userAgent.includes('mac')) os = 'macos';
  else if (userAgent.includes('linux')) os = 'linux';
  else if (userAgent.includes('android')) os = 'android';
  else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) os = 'ios';

  // Platform type detection
  let type = 'desktop';
  if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
    type = 'mobile';
  } else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
    type = 'tablet';
  }

  // Determine capabilities based on platform
  const capabilities = type === 'desktop' ? 'host-client' : 'client-only';

  // Feature detection
  const supportsWebRTC = !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection);
  const supportsMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  return {
    type,
    capabilities,
    os,
    isTouchDevice,
    supportsWebRTC,
    supportsMediaDevices,
  };
}

/**
 * Check if the current device can act as a host
 */
export function canActAsHost(platform) {
  return platform.capabilities === 'host-client' && 
         platform.supportsWebRTC && 
         platform.supportsMediaDevices;
}

/**
 * Get recommended audio settings based on platform
 */
export function getAudioSettings(platform) {
  if (platform.type === 'mobile') {
    return {
      sampleRate: 16000,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };
  }
  
  return {
    sampleRate: 44100,
    channelCount: 2,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: false,
  };
}
