import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          borderRadius: 64,
        }}
      >
        <div
          style={{
            width: 460,
            height: 460,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #2a2520 0%, #1a1510 40%, #0d0a08 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #d4af37 0%, #c9a227 50%, #8b6912 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #6b5012',
              boxShadow: 'inset 0 4px 12px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#14100c',
                boxShadow: 'inset 0 0 12px rgba(0,0,0,0.9)',
              }}
            />
          </div>
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
