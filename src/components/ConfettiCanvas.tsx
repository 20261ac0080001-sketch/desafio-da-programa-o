import { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
  color: string;
  opacity: number;
  shape: 'rect' | 'circle';
}

const COLORS = [
  '#38BDF8', // sky
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#D946EF', // fuchsia
  '#10B981', // emerald
  '#FBBF24', // amber
];

export function ConfettiCanvas({ active }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const totalParticles = 140;

    for (let i = 0; i < totalParticles; i++) {
      const fromLeft = i % 2 === 0;
      const startX = fromLeft ? width * 0.18 : width * 0.82;
      const spreadX = (Math.random() - 0.5) * (width * 0.35);

      particles.push({
        x: startX + spreadX,
        y: height * 0.25 + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 11 + (fromLeft ? 2.2 : -2.2),
        vy: -(Math.random() * 9 + 4),
        size: Math.random() * 7 + 5,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.24,
        color: COLORS[i % COLORS.length],
        opacity: 1,
        shape: i % 4 === 0 ? 'circle' : 'rect',
      });
    }

    let animationId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;
      for (const p of particles) {
        p.vy += 0.22; // gravidade suave
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        if (elapsed > 2400) {
          p.opacity = Math.max(0, p.opacity - 0.015);
        }

        if (p.y < height + 40 && p.opacity > 0.01) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
          }
          ctx.restore();
        }
      }

      if (aliveCount > 0 && elapsed < 5200) {
        animationId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
