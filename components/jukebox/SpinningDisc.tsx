'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';

interface SpinningDiscProps {
  thumbnail: string | null;
  isPlaying: boolean;
  size?: number;
}

export function SpinningDisc({ thumbnail, isPlaying, size = 220 }: SpinningDiscProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      controls.start({
        rotate: 360,
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        },
      });
    } else {
      controls.stop();
    }
  }, [isPlaying, controls]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Sombra exterior del disco */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: isPlaying
            ? '0 0 40px oklch(0.71 0.145 85 / 0.35), 0 8px 32px rgba(0,0,0,0.6)'
            : '0 8px 32px rgba(0,0,0,0.6)',
          transition: 'box-shadow 0.5s ease',
        }}
      />

      {/* Disco vinilo giratorio */}
      <motion.div
        animate={controls}
        className="vinyl-disc rounded-full w-full h-full overflow-hidden relative"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Imagen del artwork en el centro del disco */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ borderRadius: '50%' }}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{ width: size * 0.46, height: size * 0.46 }}
          >
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt="Album artwork"
                width={size * 0.46}
                height={size * 0.46}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: 'oklch(0.18 0.03 42)' }}
              >
                <svg
                  width={size * 0.2}
                  height={size * 0.2}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.71 0.145 85)"
                  strokeWidth="1.5"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Anillo central del vinilo */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, transparent 44%, oklch(0.08 0 0 / 0.8) 46%, transparent 48%)',
          }}
        />
      </motion.div>

      {/* Punto central (eje) */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.05,
          height: size * 0.05,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'oklch(0.75 0.012 220)',
          boxShadow: '0 0 4px rgba(0,0,0,0.8)',
          zIndex: 10,
        }}
      />
    </div>
  );
}
