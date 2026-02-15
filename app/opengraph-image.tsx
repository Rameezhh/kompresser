import { ImageResponse } from 'next/og'

export const alt = 'Kompressor - Bulk Image Compressor'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0f0f0f 100%)',
          padding: 48,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 16,
            background: 'rgba(34, 197, 94, 0.15)',
            border: '2px solid #22c55e',
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: '#22c55e',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            K
          </span>
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#fafafa',
            margin: 0,
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Kompressor
        </h1>
        <p
          style={{
            fontSize: 36,
            color: '#22c55e',
            margin: '16px 0 32px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Bulk Image Compressor
        </p>
        <p
          style={{
            fontSize: 24,
            color: '#a3a3a3',
            margin: 0,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Compress multiple images at once in the browser. Free, fast, and private — no images stored on our servers.
        </p>
      </div>
    ),
    { ...size }
  )
}
