import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  ArrowLeft,
  Languages,
  Activity,
  Settings,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

export function ClientMode({ onBack }) {
  const [serverAddress, setServerAddress] = useState('192.168.1.100:8080');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [volume, setVolume] = useState([80]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    connecting: false,
    error: null,
    serverInfo: null
  });
  const [liveTranscript, setLiveTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  
  const audioRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate receiving live transcript and translation
    const interval = setInterval(() => {
      if (connectionStatus.connected && isPlaying) {
        const mockTranscripts = [
          "Hello everyone, welcome to our international conference.",
          "Today we'll be discussing the future of technology.",
          "I'm excited to share our latest research findings with you.",
          "Let's begin with a brief overview of the current situation."
        ];
        
        const mockTranslations = [
          "Hola a todos, bienvenidos a nuestra conferencia internacional.",
          "Hoy discutiremos el futuro de la tecnología.",
          "Estoy emocionado de compartir nuestros últimos hallazgos de investigación con ustedes.",
          "Comencemos con una breve descripción de la situación actual."
        ];
        
        const randomIndex = Math.floor(Math.random() * mockTranscripts.length);
        setLiveTranscript(mockTranscripts[randomIndex]);
        setTranslation(mockTranslations[randomIndex]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [connectionStatus.connected, isPlaying]);

  const connectToServer = async () => {
    setConnectionStatus(prev => ({ ...prev, connecting: true, error: null }));
    
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful connection
      setConnectionStatus({
        connected: true,
        connecting: false,
        error: null,
        serverInfo: {
          host: serverAddress.split(':')[0],
          port: serverAddress.split(':')[1] || '8080',
          availableLanguages: ['en', 'es', 'fr', 'de', 'it']
        }
      });
      
      toast({
        title: "Connected Successfully",
        description: `Connected to translation server at ${serverAddress}`,
      });
      
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        connecting: false,
        error: 'Failed to connect to server. Please check the address and try again.'
      }));
      
      toast({
        title: "Connection Failed",
        description: "Could not connect to the translation server",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setConnectionStatus({
      connected: false,
      connecting: false,
      error: null,
      serverInfo: null
    });
    setIsPlaying(false);
    setLiveTranscript('');
    setTranslation('');
    
    toast({
      title: "Disconnected",
      description: "Disconnected from translation server",
    });
  };

  const togglePlayback = () => {
    if (!connectionStatus.connected) return;
    
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast({
        title: "Audio Started",
        description: `Now playing ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name} translation`,
      });
    } else {
      toast({
        title: "Audio Paused",
        description: "Translation audio paused",
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getLanguageName = (code) => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;
  };

  const getLanguageFlag = (code) => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code)?.flag || '🌐';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Smartphone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Client Mode
                </h1>
                <p className="text-muted-foreground">Receiving live audio translation</p>
              </div>
            </div>
          </div>
          
          <Badge 
            variant={connectionStatus.connected ? "default" : connectionStatus.connecting ? "secondary" : "outline"}
            className={connectionStatus.connected ? "bg-success text-success-foreground" : ""}
          >
            {connectionStatus.connected ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : connectionStatus.connecting ? (
              <>
                <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Connecting
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Audio Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Panel */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <Wifi className="w-5 h-5" />
                Server Connection
              </h3>

              <div className="space-y-4">
                {!connectionStatus.connected ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Server Address
                      </label>
                      <Input
                        placeholder="192.168.1.100:8080"
                        value={serverAddress}
                        onChange={(e) => setServerAddress(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    
                    {connectionStatus.error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{connectionStatus.error}</p>
                      </div>
                    )}
                    
                    <Button
                      onClick={connectToServer}
                      disabled={connectionStatus.connecting || !serverAddress}
                      className="w-full bg-gradient-primary hover:shadow-glow"
                    >
                      {connectionStatus.connecting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wifi className="w-4 h-4 mr-2" />
                          Connect to Server
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div>
                        <p className="font-medium text-success">Connected to server</p>
                        <p className="text-sm text-muted-foreground font-mono">{serverAddress}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={disconnect}
                        className="hover:bg-destructive/10 hover:border-destructive/20"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Audio Controls */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <Volume2 className="w-5 h-5" />
                Audio Playback
              </h3>

              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Translation Language
                  </label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {connectionStatus.serverInfo?.availableLanguages.map(langCode => {
                        const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                        return lang ? (
                          <SelectItem key={langCode} value={langCode}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              {lang.name}
                            </span>
                          </SelectItem>
                        ) : null;
                      }) || SUPPORTED_LANGUAGES.slice(0, 5).map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            {lang.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={togglePlayback}
                    disabled={!connectionStatus.connected}
                    className={`px-8 py-6 text-lg font-semibold transition-all duration-300 ${
                      isPlaying 
                        ? 'bg-warning hover:bg-warning/90 text-warning-foreground' 
                        : 'bg-gradient-primary hover:shadow-glow'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-6 h-6 mr-3" />
                        Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 mr-3" />
                        Play Audio
                      </>
                    )}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">Volume</label>
                    <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="p-2"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={isMuted}
                    />
                  </div>
                </div>

                {/* Audio Status */}
                <div className="flex items-center justify-center">
                  <Badge 
                    variant={isPlaying ? "default" : "secondary"}
                    className={`${isPlaying ? 'bg-success text-success-foreground animate-pulse' : ''} px-4 py-2`}
                  >
                    {isPlaying ? (
                      <>
                        <Activity className="w-3 h-3 mr-2" />
                        Playing {getLanguageName(selectedLanguage)}
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3 mr-2" />
                        Audio Paused
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Live Transcript */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5" />
                Live Transcript & Translation
              </h3>
              
              <div className="space-y-4">
                {/* Original Text */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      🇺🇸 Original (English)
                    </Badge>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4 min-h-16 font-mono text-sm">
                    {liveTranscript || (
                      <span className="text-muted-foreground italic">
                        {connectionStatus.connected ? 
                          (isPlaying ? 'Listening for speech...' : 'Start playback to see transcript') : 
                          'Connect to server to receive live transcript'
                        }
                      </span>
                    )}
                  </div>
                </div>

                {/* Translation */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getLanguageFlag(selectedLanguage)} Translation ({getLanguageName(selectedLanguage)})
                    </Badge>
                  </div>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 min-h-16 font-mono text-sm">
                    {translation || (
                      <span className="text-muted-foreground italic">
                        Translation will appear here...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connection Info */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" />
                Connection Status
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge 
                    variant={connectionStatus.connected ? "default" : "secondary"}
                    className={connectionStatus.connected ? "bg-success text-success-foreground" : ""}
                  >
                    {connectionStatus.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                {connectionStatus.serverInfo && (
                  <>
                    <div className="flex justify-between">
                      <span>Server:</span>
                      <span className="font-mono text-xs">{connectionStatus.serverInfo.host}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Port:</span>
                      <span className="font-mono">{connectionStatus.serverInfo.port}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages:</span>
                      <span>{connectionStatus.serverInfo.availableLanguages.length}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>WebRTC:</span>
                  <span className="text-success">Supported</span>
                </div>
              </div>
            </Card>

            {/* Audio Settings */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5" />
                Audio Settings
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span>{isMuted ? 'Muted' : `${volume[0]}%`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span>{getLanguageName(selectedLanguage)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="text-success">High (44.1kHz)</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-success">~200ms</span>
                </div>
              </div>
            </Card>

            {/* Available Languages */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5" />
                Available Languages
              </h3>
              
              <div className="space-y-2">
                {(connectionStatus.serverInfo?.availableLanguages || ['en', 'es', 'fr', 'de', 'it']).map(langCode => {
                  const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                  if (!lang) return null;
                  
                  return (
                    <div
                      key={langCode}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        selectedLanguage === langCode ? 'bg-accent/20 border border-accent/30' : 'bg-muted/10'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className={selectedLanguage === langCode ? 'font-medium' : ''}>{lang.name}</span>
                      {selectedLanguage === langCode && (
                        <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
