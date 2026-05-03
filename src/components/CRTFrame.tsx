import React, { useRef, useEffect, useState } from 'react';

interface CRTFrameProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  curved?: boolean;
  scanlines?: boolean;
  noise?: boolean;
  vignette?: boolean;
  glow?: boolean;
}

export const CRTFrame: React.FC<CRTFrameProps> = ({
  children,
  className = '',
  intensity = 'medium',
  curved = true,
  scanlines = true,
  noise = true,
  vignette = true,
  glow = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!noise || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    let isRendering = false;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 100; // Update noise every 100ms instead of every frame

    // Visibility-based optimization: pause rendering when not visible
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !isRendering) {
        isRendering = true;
        lastUpdateTime = 0;
        animate(performance.now());
      } else if (!isVisible) {
        isRendering = false;
      }
    }, { threshold: 0.1 });

    const animate = (now: number) => {
      if (!isVisible) {
        isRendering = false;
        return;
      }
      isRendering = true;

      // Throttle updates to reduce CPU usage
      if (now - lastUpdateTime < UPDATE_INTERVAL) {
        requestAnimationFrame(animate);
        return;
      }
      lastUpdateTime = now;

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      const noiseIntensity = intensity === 'high' ? 30 : intensity === 'medium' ? 20 : 10;

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * noiseIntensity;
        data[i] = 128 + noise;
        data[i + 1] = 128 + noise;
        data[i + 2] = 128 + noise;
        data[i + 3] = 8;
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(animate);
    };

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    // Explicitly kickstart the render
    isRendering = true;
    lastUpdateTime = 0;
    animate(performance.now());

    return () => {
      observer.disconnect();
    };
  }, [noise, intensity]);

  const intensityClass = {
    low: 'crt-low',
    medium: 'crt-medium',
    high: 'crt-high',
  }[intensity];

  return (
    <div className={`crt-frame-wrapper ${intensityClass} ${className}`}>
      {vignette && <div className="crt-vignette" />}
      {scanlines && <div className="crt-scanlines" />}
      {noise && (
        <canvas
          ref={canvasRef}
          className="crt-noise"
          width={200}
          height={200}
        />
      )}
      {glow && <div className="crt-glow" />}
      <div className="crt-content">{children}</div>
    </div>
  );
};

export const CRTEdgeOverlay: React.FC<{ intensity?: 'low' | 'medium' | 'high' }> = ({
  intensity = 'medium',
}) => {
  return (
    <div className={`crt-edge-overlay crt-${intensity}`}>
      <div className="crt-edge-vignette" />
      <div className="crt-edge-scanlines" />
      <div className="crt-edge-corners" />
      <div className="crt-edge-glow" />
      <div className="crt-edge-curve" />
    </div>
  );
};
