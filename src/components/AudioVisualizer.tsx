import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  audioLevel: number;
  isActive: boolean;
  className?: string;
  barCount?: number;
}

export function AudioVisualizer({ 
  audioLevel, 
  isActive, 
  className,
  barCount = 32 
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      if (!isActive && audioLevel === 0) {
        // Draw idle state bars
        const barWidth = width / barCount;
        for (let i = 0; i < barCount; i++) {
          const x = i * barWidth;
          const barHeight = 4;
          const y = (height - barHeight) / 2;
          
          ctx.fillStyle = 'hsl(var(--audio-inactive))';
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }
        return;
      }

      // Draw active visualization
      const barWidth = width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        
        // Generate pseudo-random heights based on audio level and bar position
        const normalizedLevel = Math.min(audioLevel, 1);
        const baseHeight = height * 0.1;
        const maxHeight = height * 0.8;
        
        // Create wave-like pattern
        const waveOffset = Math.sin((i / barCount) * Math.PI * 2 + Date.now() * 0.005) * 0.3;
        const randomFactor = (Math.sin(i * 1.5 + Date.now() * 0.01) + 1) / 2;
        
        let barHeight = baseHeight + (maxHeight - baseHeight) * normalizedLevel * (0.7 + randomFactor * 0.3 + waveOffset);
        barHeight = Math.max(4, Math.min(barHeight, maxHeight));
        
        const y = (height - barHeight) / 2;
        
        // Color based on height (frequency simulation)
        let color;
        const intensity = barHeight / maxHeight;
        
        if (intensity > 0.8) {
          color = 'hsl(var(--audio-peak))'; // Red for peaks
        } else if (intensity > 0.4) {
          color = 'hsl(var(--audio-active))'; // Green for active
        } else {
          color = 'hsl(var(--primary))'; // Blue for low levels
        }
        
        // Add glow effect for high intensity
        if (intensity > 0.6) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioLevel, isActive, barCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    });

    resizeObserver.observe(canvas);
    
    // Initial size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn('relative w-full bg-muted/10 rounded-lg overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        
        {/* Activity indicator */}
        {isActive && audioLevel > 0.1 && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-success font-medium">LIVE</span>
            </div>
          </div>
        )}
        
        {/* Level indicator */}
        {isActive && (
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground font-mono">
            {Math.round(audioLevel * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}