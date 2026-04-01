import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RJ Slime Factory - Handcrafted Slime from Bend, Oregon';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 50%, #1A1A2E 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255, 107, 157, 0.15)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(6, 214, 160, 0.12)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 100,
            right: 200,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 60px',
            position: 'relative',
          }}
        >
          {/* Slime blob icon */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: 'linear-gradient(135deg, #FF6B9D, #8B5CF6, #06D6A0)',
              marginBottom: 20,
              display: 'flex',
            }}
          />

          {/* Brand name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: '-1px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(90deg, #FF6B9D, #8B5CF6, #06D6A0)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              RJ Slime Factory
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.8)',
              marginTop: 16,
              fontWeight: 500,
              display: 'flex',
            }}
          >
            Premium Handcrafted Slime
          </div>

          {/* Location */}
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 12,
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>Bend, Oregon</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>rjslime.xyz</span>
          </div>

          {/* Product types bar */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 32,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Cloud', 'Butter', 'Clear', 'Crunchy', 'Fluffy', 'Glitter'].map(
              (type) => (
                <div
                  key={type}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 50,
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 16,
                    fontWeight: 500,
                    display: 'flex',
                  }}
                >
                  {type}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
