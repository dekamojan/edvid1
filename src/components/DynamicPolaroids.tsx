import React from 'react';
import { OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from 'remotion';
import { PolaroidInset, VideoClip } from '../types/project';

const resolveMediaSource = (src: string) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const cleaned = src.replace(/^\/?(public\/)?/, '');
  return staticFile(cleaned);
};

interface Props {
  polaroids: PolaroidInset[];
  videoSource?: string;
  clips?: VideoClip[];
  fps?: number;
}

export const DynamicPolaroids: React.FC<Props> = ({
  polaroids,
  videoSource,
  clips = [],
  fps = 30,
}) => {
  const frame = useCurrentFrame();

  if (!polaroids || polaroids.length === 0) return null;

  const active = polaroids.filter(
    (p) => frame >= p.startFrame && frame < p.endFrame
  );

  if (active.length === 0) return null;

  const pickVideoForFrame = (sourceFrame: number) => {
    if (clips && clips.length > 0) {
      const found = clips.find(
        (c) => sourceFrame >= c.startFrame && sourceFrame < c.endFrame
      );
      const chosen = found || clips[0];
      return {
        src: chosen.source,
        offset: Math.max(0, sourceFrame - chosen.startFrame),
      };
    }
    return {
      src: videoSource || '',
      offset: Math.max(0, sourceFrame),
    };
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 26,
        fontFamily:
          "'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      {active.map((p, idx) => {
        const pop = spring({
          frame: Math.max(0, frame - p.startFrame),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 120 },
        });
        const cardW = p.width ?? 420;
        const imgH = Math.round(cardW * 1.05);
        const x = p.x ?? 275;
        const y = p.y ?? 540;
        const rot = p.rotate ?? -6;
        const grayFilter = p.grayscale !== false ? 'grayscale(100%) contrast(1.08)' : 'none';
        const vidInfo = pickVideoForFrame(p.sourceFrame ?? 0);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: `${cardW}px`,
              backgroundColor: '#FFFFFF',
              padding: '18px 18px 26px 18px',
              borderRadius: '6px',
              boxShadow: '0 22px 55px rgba(0,0,0,0.72)',
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${pop})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: `${imgH}px`,
                backgroundColor: '#111111',
                overflow: 'hidden',
              }}
            >
              {p.imageSource ? (
                <img
                  src={resolveMediaSource(p.imageSource)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: grayFilter,
                  }}
                />
              ) : vidInfo.src ? (
                <Sequence
                  from={p.startFrame}
                  durationInFrames={Math.max(1, p.endFrame - p.startFrame)}
                >
                  <OffthreadVideo
                    src={resolveMediaSource(vidInfo.src)}
                    startFrom={vidInfo.offset}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: grayFilter,
                    }}
                    muted
                  />
                </Sequence>
              ) : null}
            </div>

            {p.label && (
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '30px',
                  fontWeight: 900,
                  color: '#111111',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {p.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
