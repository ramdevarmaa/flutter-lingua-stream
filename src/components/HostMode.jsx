import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Users, 
  Settings, 
  Languages, 
  Wifi,
  WifiOff,
  Volume2,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { AudioVisualizer } from '@/components/AudioVisualizer';
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

export function HostMode({ onBack }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'es']);
  const [connectedClients, setConnectedClients] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [serverPort, setServerPort] = useState('8080');
  
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analyzerRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate some connected clients for demo
    const mockClients = [
      { id: '1', name: 'Mobile Client 1', language: 'es', connected: true, lastSeen: Date.now() },
      { id: '2', name: 'Desktop Client', language: 'fr', connected: true, lastSeen: Date.now() },
    ];
    setConnectedClients(mockClients);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true 
        } 
      });
      
      mediaStreamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyzerRef.current);
      
      setIsRecording(true);
      setIsServerRunning(true);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
      toast({
        title: "Recording Started",
        description: "Microphone is active and ready for translation",
      });
      
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    setIsServerRunning(false);
    setAudioLevel(0);
    
    toast({
      title: "Recording Stopped",
      description: "Microphone deactivated",
    });
  };

  const monitorAudioLevel = () => {
    if (!analyzerRef.current) return;
    
    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyzerRef.current || !isRecording) return;
      
      analyzerRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average / 255);
      
      requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const addLanguage = (langCode) => {
    if (!selectedLanguages.includes(langCode)) {
      setSelectedLanguages([...selectedLanguages, langCode]);
      toast({
        title: "Language Added",
        description: `${SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name} translation enabled`,
      });
    }
  };

  const removeLanguage = (langCode) => {
    if (selectedLanguages.length > 1) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== langCode));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Host Mode
              </h1>
              <p className="text-muted-foreground">Broadcasting live audio translation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={isServerRunning ? "default" : "secondary"}
              className={isServerRunning ? "bg-success text-success-foreground" : ""}
            >
              {isServerRunning ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              Server {isServerRunning ? 'Running' : 'Stopped'}
            </Badge>
            <Badge variant="outline">
              Port: {serverPort}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recording Controls */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Audio Capture
                </h3>
                <Badge 
                  variant={isRecording ? "default" : "secondary"}
                  className={isRecording ? "bg-success text-success-foreground animate-pulse" : ""}
                >
                  {isRecording ? 'Recording' : 'Idle'}
                </Badge>
              </div>

              <div className="space-y-6">
                {/* Audio Visualizer */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <AudioVisualizer 
                    audioLevel={audioLevel} 
                    isActive={isRecording}
                    className="h-24"
                  />
                </div>

                {/* Recording Button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-8 py-6 text-lg font-semibold transition-all duration-300 ${
                      isRecording 
                        ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-active' 
                        : 'bg-gradient-primary hover:shadow-glow'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-6 h-6 mr-3" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-6 h-6 mr-3" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Language Configuration */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <Languages className="w-5 h-5" />
                Translation Languages
              </h3>

              <div className="space-y-4">
                {/* Add Language */}
                <div className="flex gap-3">
                  <Select onValueChange={addLanguage}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add a language..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES
                        .filter(lang => !selectedLanguages.includes(lang.code))
                        .map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              {lang.name}
                            </span>
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Languages */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedLanguages.map(langCode => {
                    const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                    if (!lang) return null;
                    
                    return (
                      <div
                        key={langCode}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30"
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <span>{lang.flag}</span>
                          {lang.name}
                        </span>
                        {selectedLanguages.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLanguage(langCode)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Live Transcript */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" />
                Live Transcript
              </h3>
              <div className="bg-muted/20 rounded-lg p-4 min-h-32 font-mono text-sm">
                {currentTranscript || (
                  <span className="text-muted-foreground italic">
                    {isRecording ? 'Listening for speech...' : 'Start recording to see transcript'}
                  </span>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Server Status */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" />
                Server Status
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge 
                    variant={isServerRunning ? "default" : "secondary"}
                    className={isServerRunning ? "bg-success text-success-foreground" : ""}
                  >
                    {isServerRunning ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Port:</span>
                  <span className="font-mono">{serverPort}</span>
                </div>
                <div className="flex justify-between">
                  <span>WebRTC:</span>
                  <span className="text-success">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Languages:</span>
                  <span>{selectedLanguages.length}</span>
                </div>
              </div>
            </Card>

            {/* Connected Clients */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                Connected Clients
                <Badge variant="secondary" className="ml-auto">
                  {connectedClients.filter(c => c.connected).length}
                </Badge>
              </h3>
              
              <div className="space-y-3">
                {connectedClients.length === 0 ? (
                  <p className="text-muted-foreground text-sm italic">
                    No clients connected
                  </p>
                ) : (
                  connectedClients.map(client => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">{client.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {SUPPORTED_LANGUAGES.find(l => l.code === client.language)?.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          client.connected ? 'bg-success animate-pulse' : 'bg-destructive'
                        }`}></div>
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Network Info */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Connection Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Local IP:</span>
                  <div className="font-mono bg-muted/20 p-2 rounded mt-1">
                    192.168.1.100:{serverPort}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Share this address with clients to connect to your translation stream.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
