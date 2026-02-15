import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

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
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: 36,
          border: '2px solid rgba(34, 197, 94, 0.2)',
        }}
      >
        {/* ImageDown icon - matches header logo */}
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
          <path d="m14 19 3 3v-5.5" />
          <path d="m17 22 3-3" />
          <circle cx="9" cy="9" r="2" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
