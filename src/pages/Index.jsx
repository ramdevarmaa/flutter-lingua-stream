import { useState } from 'react';
import { PlatformSelector } from '@/components/PlatformSelector';
import { HostMode } from '@/components/HostMode';
import { ClientMode } from '@/components/ClientMode';

const Index = () => {
  const [currentMode, setCurrentMode] = useState('selector');

  const handleModeSelect = (mode) => {
    setCurrentMode(mode);
  };

  const handleBack = () => {
    setCurrentMode('selector');
  };

  return (
    <>
      {currentMode === 'selector' && (
        <PlatformSelector onModeSelect={handleModeSelect} />
      )}
      {currentMode === 'host' && (
        <HostMode onBack={handleBack} />
      )}
      {currentMode === 'client' && (
        <ClientMode onBack={handleBack} />
      )}
    </>
  );
};

export default Index;
