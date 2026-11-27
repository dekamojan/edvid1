import React from 'react';
import { useCurrentFrame, spring } from 'remotion';
import { ChecklistPillsConfig } from '../types/project';

interface Props {
  checklist: ChecklistPillsConfig;
  fps?: number;
}

export const DynamicChecklist: React.FC<Props> = ({ checklist, fps = 30 }) => {
  const frame = useCurrentFrame();

  if (
    !checklist ||
    !checklist.items?.length ||
    frame < checklist.startFrame ||
    frame >= checklist.endFrame
  ) {
    return null;
  }

  const headerSpring = spring({
    frame: frame - checklist.startFrame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 130 },
  });

  const topPos =
    checklist.top !== undefined
      ? typeof checklist.top === 'number'
        ? `${checklist.top}px`
        : checklist.top
      : '430px';

  const leftPos =
    checklist.left !== undefined
      ? typeof checklist.left === 'number'
        ? `${checklist.left}px`
        : checklist.left
      : '50px';

  // Mode 1: Dark Glass Card (numbered checklist with right-side green checks)
  if (checklist.style === 'glass_card') {
    const visibleItems = checklist.items.filter(
      (item, idx) => idx === 0 || frame >= item.triggerFrame - Math.round(fps * 0.4)
    );
    return (
      <div
        style={{
          position: 'absolute',
          top: topPos,
          left: leftPos,
          width: '720px',
          maxWidth: '940px',
          backgroundColor: 'rgba(18, 20, 26, 0.86)',
          backdropFilter: 'blur(14px)',
          borderRadius: '22px',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          boxShadow: '0 18px 48px rgba(0, 0, 0, 0.65)',
          padding: '22px 28px',
          zIndex: 26,
          transform: `scale(${headerSpring})`,
          transformOrigin: 'top left',
          fontFamily:
            "'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif",
        }}
      >
        {checklist.header && (
          <div
            style={{
              fontSize: '25px',
              fontWeight: 900,
              color: '#FFD700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            {checklist.header}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(visibleItems.length ? visibleItems : checklist.items.slice(0, 1)).map(
            (p, idx) => {
              const isChecked = frame >= p.triggerFrame;
              const checkSpring = isChecked
                ? spring({
                    frame: Math.max(0, frame - p.triggerFrame),
                    fps,
                    config: { damping: 10, mass: 0.4, stiffness: 180 },
                  })
                : 0;
              const prefix = p.prefix ?? String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    paddingTop: idx > 0 ? '10px' : 0,
                    borderTop:
                      idx > 0 ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        fontSize: '34px',
                        fontWeight: 900,
                        color: '#FFD700',
                        minWidth: '46px',
                      }}
                    >
                      {prefix}
                    </span>
                    <span
                      style={{
                        fontSize: '32px',
                        fontWeight: 900,
                        color: p.highlight ? '#00E676' : '#FFFFFF',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {p.text}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: isChecked ? '#00E676' : 'transparent',
                      border: isChecked
                        ? '2px solid #00E676'
                        : '2.5px solid rgba(255,255,255,0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isChecked
                        ? '0 0 18px rgba(0, 230, 118, 0.55)'
                        : 'none',
                      transform: isChecked ? `scale(${checkSpring})` : 'scale(1)',
                    }}
                  >
                    {isChecked && (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#111111"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  // Mode 2: Default Floating Pills
  return (
    <div
      style={{
        position: 'absolute',
        top: topPos,
        left: leftPos,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 26,
        fontFamily:
          "'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      {/* Top Header Label */}
      {checklist.header && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFD700',
            padding: '10px 28px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
            border: '3px solid #111111',
            width: 'fit-content',
            transform: `scale(${headerSpring})`,
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#111111',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            {checklist.header}
          </span>
        </div>
      )}

      {checklist.items?.map((p, idx) => {
        if (frame < p.triggerFrame) return null;

        const progress = spring({
          frame: frame - p.triggerFrame,
          fps,
          config: { damping: 12, mass: 0.5, stiffness: 140 },
        });

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(10, 12, 16, 0.95)',
              padding: '12px 28px',
              borderRadius: '40px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              border: '2px solid rgba(0, 230, 118, 0.5)',
              transform: `translateX(${(1 - progress) * -80}px) scale(${progress})`,
              opacity: progress,
              width: 'fit-content',
              maxWidth: '940px',
            }}
          >
            {/* Green Checkmark Circle */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#00E676',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                flexShrink: 0,
                boxShadow: '0 0 16px rgba(0, 230, 118, 0.6)',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111111"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Pill Text */}
            <span
              style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {p.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
