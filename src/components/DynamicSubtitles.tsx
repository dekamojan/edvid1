import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SubtitleConfig, SubtitleSegment } from '../types/project';

interface Props {
  subtitles: SubtitleSegment[];
  bottomOffset?: number;
  config?: SubtitleConfig;
}

export const DynamicSubtitles: React.FC<Props> = ({
  subtitles,
  bottomOffset = 520, // Raised default (above footer & TikTok/Shopee Safe Zone)
  config,
}) => {
  const frame = useCurrentFrame();

  if (!subtitles || subtitles.length === 0) return null;

  const currentSegment = subtitles.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  if (!currentSegment) return null;

  const resolvedBottom = config?.bottomOffset ?? bottomOffset;
  const baseFont = config?.fontSize ?? 42;
  const activeFont = Math.round(baseFont * 1.05);
  const inactiveFont = Math.round(baseFont * 0.95);
  const activeBgColor = config?.activeBgColor || '#FFD700';
  const activeTextColor = config?.activeTextColor || '#111111';
  const textColor = config?.textColor || '#FFFFFF';
  const textTransform = config?.uppercase === false ? 'none' : 'uppercase';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: `${resolvedBottom}px`,
        left: '50px',
        right: '50px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px 14px',
        zIndex: 28,
        fontFamily:
          "'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      {currentSegment.words.map((w, idx) => {
        const isCurrent = frame >= w.start && frame < w.end;

        if (isCurrent) {
          return (
            <div
              key={idx}
              style={{
                backgroundColor: activeBgColor,
                padding: '8px 18px',
                borderRadius: '8px',
                boxShadow: `0 8px 24px ${activeBgColor}99`,
                border: '3px solid #111111',
                transform: 'scale(1.12)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: `${activeFont}px`,
                  fontWeight: 900,
                  color: activeTextColor,
                  letterSpacing: '1.5px',
                  lineHeight: 1,
                  textTransform,
                }}
              >
                {w.text}
              </span>
            </div>
          );
        }

        return (
          <span
            key={idx}
            style={{
              fontSize: `${inactiveFont}px`,
              fontWeight: 900,
              color: textColor,
              letterSpacing: '1.5px',
              textTransform,
              textShadow:
                '0 4px 14px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
              padding: '4px 6px',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
