import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;        // depth (speed multiplier)
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  hue: number;
  drift: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = w * window.devicePixelRatio;
      canvas!.height = h * window.devicePixelRatio;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      initStars();
      initNebulae();
    }

    function initStars() {
      const count = Math.floor((w * h) / 2500); // density scales with size
      starsRef.current = [];
      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 2.5 + 0.3,
          size: Math.random() * 1.8 + 0.2,
          brightness: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 3 + 1,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    function initNebulae() {
      const size = Math.max(w, h);
      nebulaeRef.current = [
        { x: w * 0.2, y: h * 0.3, radius: size * 0.4, hue: 220, drift: 0.0003 },  // deep blue
        { x: w * 0.7, y: h * 0.6, radius: size * 0.35, hue: 270, drift: -0.0002 }, // purple
        { x: w * 0.5, y: h * 0.8, radius: size * 0.3, hue: 200, drift: 0.0004 },   // cyan
        { x: w * 0.8, y: h * 0.2, radius: size * 0.25, hue: 310, drift: -0.0003 }, // magenta
      ];
    }

    function drawNebulae(time: number) {
      if (!ctx) return;
      nebulaeRef.current.forEach(neb => {
        const pulse = Math.sin(time * neb.drift) * 0.008 + 0.025;
        const grad = ctx.createRadialGradient(
          neb.x + Math.sin(time * 0.0002) * 20,
          neb.y + Math.cos(time * 0.0003) * 15,
          0,
          neb.x, neb.y, neb.radius
        );
        grad.addColorStop(0, `hsla(${neb.hue}, 70%, 50%, ${pulse})`);
        grad.addColorStop(0.3, `hsla(${neb.hue + 20}, 60%, 30%, ${pulse * 0.6})`);
        grad.addColorStop(0.6, `hsla(${neb.hue + 40}, 50%, 20%, ${pulse * 0.2})`);
        grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
    }

    function drawStars(time: number) {
      if (!ctx) return;
      starsRef.current.forEach(star => {
        // Gentle falling motion
        star.y += star.z * 0.12;
        star.x += Math.sin(time * 0.0005 + star.twinkleOffset) * 0.08;

        // Wrap around
        if (star.y > h + 5) { star.y = -5; star.x = Math.random() * w; }
        if (star.x > w + 5) star.x = -5;
        if (star.x < -5) star.x = w + 5;

        // Twinkle
        const twinkle = Math.sin(time * 0.002 * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6;
        const alpha = star.brightness * twinkle;

        // Glow
        if (star.size > 1) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glow.addColorStop(0, `rgba(180, 210, 255, ${alpha * 0.3})`);
          glow.addColorStop(0.5, `rgba(140, 180, 255, ${alpha * 0.1})`);
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core star
        ctx.fillStyle = `rgba(220, 235, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function animate(time: number) {
      if (!ctx) return;
      // Deep space background
      ctx.fillStyle = 'rgba(5, 5, 15, 1)';
      ctx.fillRect(0, 0, w, h);

      drawNebulae(time);
      drawStars(time);

      animFrameRef.current = requestAnimationFrame(animate);
    }

    resize();
    animFrameRef.current = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
