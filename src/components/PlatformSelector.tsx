import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Users, Smartphone, Monitor, Tablet, Wifi } from 'lucide-react';
import { detectPlatform, canActAsHost, type PlatformInfo } from '@/utils/platform';

interface PlatformSelectorProps {
  onModeSelect: (mode: 'host' | 'client') => void;
}

export function PlatformSelector({ onModeSelect }: PlatformSelectorProps) {
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);
  const [selectedMode, setSelectedMode] = useState<'host' | 'client' | null>(null);

  useEffect(() => {
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);
    
    // Auto-select client mode for mobile devices
    if (detectedPlatform.type === 'mobile' || detectedPlatform.type === 'tablet') {
      setSelectedMode('client');
    }
  }, []);

  const handleModeSelect = (mode: 'host' | 'client') => {
    setSelectedMode(mode);
    onModeSelect(mode);
  };

  const getPlatformIcon = () => {
    if (!platform) return <Monitor className="w-8 h-8" />;
    
    switch (platform.type) {
      case 'mobile': return <Smartphone className="w-8 h-8" />;
      case 'tablet': return <Tablet className="w-8 h-8" />;
      default: return <Monitor className="w-8 h-8" />;
    }
  };

  const getPlatformColor = () => {
    if (!platform) return 'bg-muted';
    return platform.capabilities === 'host-client' ? 'bg-gradient-primary' : 'bg-accent';
  };

  if (!platform) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4"></div>
          <div className="text-center text-muted-foreground">Detecting platform...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${getPlatformColor()} shadow-glow`}>
            {getPlatformIcon()}
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Real-Time Audio Translation
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Cross-platform multilingual communication
            </p>
          </div>
        </div>

        {/* Platform Info */}
        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Detected Platform</h3>
            <Badge variant={platform.capabilities === 'host-client' ? 'default' : 'secondary'}>
              {platform.os.toUpperCase()} • {platform.type.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Wifi className={`w-4 h-4 ${platform.supportsWebRTC ? 'text-success' : 'text-destructive'}`} />
              <span className={platform.supportsWebRTC ? 'text-success' : 'text-destructive'}>
                WebRTC {platform.supportsWebRTC ? 'Supported' : 'Not Supported'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className={`w-4 h-4 ${platform.supportsMediaDevices ? 'text-success' : 'text-destructive'}`} />
              <span className={platform.supportsMediaDevices ? 'text-success' : 'text-destructive'}>
                Audio {platform.supportsMediaDevices ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </Card>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Host Mode */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-300 border-2 ${
              canActAsHost(platform) 
                ? selectedMode === 'host' 
                  ? 'border-primary bg-gradient-card shadow-glow' 
                  : 'border-border/50 bg-gradient-card hover:border-primary/50 hover:shadow-card'
                : 'border-border/20 bg-card/50 opacity-50 cursor-not-allowed'
            }`}
            onClick={() => canActAsHost(platform) && handleModeSelect('host')}
          >
            <div className="text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${
                canActAsHost(platform) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Mic className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Host Mode</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Capture and translate audio for multiple clients
                </p>
              </div>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Live audio capture & processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Multi-language translation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Stream to multiple clients</span>
                </div>
              </div>
              {!canActAsHost(platform) && (
                <Badge variant="destructive" className="mt-4">
                  Desktop Only
                </Badge>
              )}
            </div>
          </Card>

          {/* Client Mode */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-300 border-2 ${
              selectedMode === 'client' 
                ? 'border-accent bg-gradient-card shadow-glow' 
                : 'border-border/50 bg-gradient-card hover:border-accent/50 hover:shadow-card'
            }`}
            onClick={() => handleModeSelect('client')}
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent text-accent-foreground">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Client Mode</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Listen to translated audio streams
                </p>
              </div>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Connect to host device</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Select preferred language</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Real-time audio & transcripts</span>
                </div>
              </div>
              <Badge variant="secondary" className="mt-4">
                All Platforms
              </Badge>
            </div>
          </Card>
        </div>

        {/* Action Button */}
        {selectedMode && (
          <div className="text-center">
            <Button 
              size="lg" 
              className="px-12 py-6 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => handleModeSelect(selectedMode)}
            >
              Launch {selectedMode === 'host' ? 'Host' : 'Client'} Mode
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}