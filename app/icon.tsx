import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        {/* Disco de vinilo */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2a2520 0%, #1a1510 50%, #0d0a08 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#c9a227',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #8b6912',
            }}
          >
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: '#14100c',
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
