import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#14100c',
          borderRadius: 28,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #2a2520 0%, #1a1510 40%, #0d0a08 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 24px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #d4af37 0%, #c9a227 50%, #8b6912 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #6b5012',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#14100c',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)',
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
