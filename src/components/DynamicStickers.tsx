import React from 'react';
import { useCurrentFrame, spring } from 'remotion';
import { ContextualSticker } from '../types/project';

interface Props {
  stickers: ContextualSticker[];
  fps?: number;
}

export const DynamicStickers: React.FC<Props> = ({ stickers, fps = 30 }) => {
  const frame = useCurrentFrame();

  if (!stickers || stickers.length === 0) return null;

  const activeStickers = stickers.filter(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  if (activeStickers.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 26,
      }}
    >
      {activeStickers.map((s, idx) => {
        const hasCoords = typeof s.x === 'number' && typeof s.y === 'number';
        const cx = s.x ?? 540;
        const cy = s.y ?? 920;
        const size = s.size ?? 220;

        // 1. Heartbeat EKG
        if (s.stickerType === 'heartbeat_ekg') {
          const beat = Math.sin((frame - s.startFrame) * 0.9);
          const scale = 1 + 0.25 * Math.max(0, beat);
          const baseScale = hasCoords ? Math.max(0.55, Math.min(1.4, size / 220)) : 1;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: hasCoords ? `${cy}px` : '48%',
                left: hasCoords ? `${cx}px` : '50%',
                transform: `translate(-50%, -50%) scale(${baseScale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative', transform: `scale(${scale})` }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    border: '4px solid #FF1744',
                    transform: `translate(-50%, -50%) scale(${
                      1 + ((frame - s.startFrame) % 15) * 0.1
                    })`,
                    opacity: 1 - ((frame - s.startFrame) % 15) / 15,
                  }}
                />
                <svg
                  width="130"
                  height="130"
                  viewBox="0 0 24 24"
                  fill="#FF1744"
                  style={{ filter: 'drop-shadow(0 0 25px rgba(255, 23, 68, 0.8))' }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <svg width="420" height="90" viewBox="0 0 420 90" style={{ marginTop: '20px' }}>
                <path
                  d="M 10 45 L 120 45 L 140 20 L 160 70 L 180 15 L 200 65 L 220 45 L 410 45"
                  fill="none"
                  stroke="#FF5252"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 0 12px #FF1744)' }}
                />
              </svg>
            </div>
          );
        }

        // 2. Bouncing Apple
        if (s.stickerType === 'bouncing_apple') {
          const relFrame = frame - s.startFrame;
          const t = relFrame / 45;
          const x = (hasCoords ? cx - 180 : 240) + t * 500;
          const bounceCycle = (relFrame % 18) / 18;
          const bounceHeight = Math.max(0, 1 - t * 0.4) * 160;
          const y =
            (hasCoords ? cy : 800) +
            Math.sin(bounceCycle * Math.PI) * -bounceHeight +
            t * 400;
          const rot = relFrame * 22;
          return (
            <React.Fragment key={idx}>
              {relFrame > 14 && relFrame < 22 && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${hasCoords ? cx : 520}px`,
                    top: `${(hasCoords ? cy : 800) + 300}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <span style={{ fontSize: '70px', filter: 'drop-shadow(0 0 10px #FF9100)' }}>
                    💥
                  </span>
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
                }}
              >
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="55" r="40" fill="#E53935" />
                  <circle cx="42" cy="52" r="38" fill="#F44336" />
                  <path d="M 50 18 Q 48 2 62 8" fill="none" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 50 18 Q 65 14 62 25 Z" fill="#4CAF50" />
                </svg>
              </div>
            </React.Fragment>
          );
        }

        // 3. Sweat Drops (respects s.x / s.y / s.size when supplied)
        if (s.stickerType === 'sweat_drops') {
          const r = size * 0.48;
          const drops = hasCoords
            ? [
                { x: cx - r * 0.8, y: cy - r * 0.4, delay: 0 },
                { x: cx + r * 0.8, y: cy - r * 0.5, delay: 4 },
                { x: cx - r, y: cy + r * 0.3, delay: 8 },
                { x: cx + r, y: cy + r * 0.2, delay: 12 },
              ]
            : [
                { x: 340, y: 520, delay: 0 },
                { x: 740, y: 480, delay: 4 },
                { x: 280, y: 640, delay: 8 },
                { x: 800, y: 600, delay: 12 },
              ];
          return (
            <React.Fragment key={idx}>
              {drops.map((drop, dIdx) => {
                const dropProgress = ((frame - s.startFrame + drop.delay) % 16) / 16;
                const dropY = drop.y + dropProgress * 90;
                const opacity = 1 - dropProgress;
                return (
                  <div
                    key={dIdx}
                    style={{
                      position: 'absolute',
                      left: `${drop.x}px`,
                      top: `${dropY}px`,
                      opacity,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <svg width="45" height="45" viewBox="0 0 24 24" fill="#00B0FF">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        // 4. Water Drops (animated falling droplets - ideal for sink, wash, skincare, drinks)
        if (s.stickerType === 'water_drops') {
          const spread = hasCoords ? size * 0.9 : 360;
          const originX = hasCoords ? cx : 540;
          const originY = hasCoords ? cy : 840;
          const drops = [
            { dx: -0.45, dy: -0.25, delay: 0, s: 0.9 },
            { dx: -0.2, dy: -0.1, delay: 5, s: 1.1 },
            { dx: 0.05, dy: -0.3, delay: 10, s: 0.85 },
            { dx: 0.3, dy: -0.15, delay: 3, s: 1.05 },
            { dx: 0.48, dy: -0.22, delay: 8, s: 0.95 },
            { dx: -0.32, dy: 0.05, delay: 13, s: 1.0 },
            { dx: 0.18, dy: 0.08, delay: 16, s: 1.15 },
          ];
          return (
            <React.Fragment key={idx}>
              {drops.map((drop, dIdx) => {
                const prog = ((frame - s.startFrame + drop.delay) % 24) / 24;
                const xPos = originX + drop.dx * spread;
                const yPos = originY + drop.dy * spread + prog * 190;
                const opacity = Math.sin(prog * Math.PI);
                return (
                  <div
                    key={dIdx}
                    style={{
                      position: 'absolute',
                      left: `${xPos}px`,
                      top: `${yPos}px`,
                      opacity,
                      transform: `translate(-50%, -50%) scale(${drop.s})`,
                      filter: 'drop-shadow(0 4px 10px rgba(41, 182, 246, 0.65))',
                    }}
                  >
                    <svg width="42" height="52" viewBox="0 0 24 30">
                      <path
                        d="M12 2C12 2 4 12.5 4 18.5C4 23.2 7.58 27 12 27C16.42 27 20 23.2 20 18.5C20 12.5 12 2 12 2Z"
                        fill="#4FC3F7"
                        stroke="#E1F5FE"
                        strokeWidth="1.5"
                      />
                      <ellipse cx="9.5" cy="18.5" rx="1.8" ry="3.5" fill="#E1F5FE" opacity="0.7" />
                    </svg>
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        // 5. Downward Arrows
        if (s.stickerType === 'downward_arrows') {
          const arrowScale = hasCoords ? Math.max(0.6, Math.min(1.4, size / 200)) : 1;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: hasCoords ? `${cy}px` : '400px',
                left: hasCoords ? `${cx}px` : '50%',
                transform: `translate(-50%, -50%) scale(${arrowScale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {[0, 1, 2].map((aIdx) => {
                const cycle = ((frame - s.startFrame + aIdx * 8) % 24) / 24;
                const yOffset = cycle * 40;
                const opacity = 1 - cycle;
                return (
                  <div
                    key={aIdx}
                    style={{
                      transform: `translateY(${yOffset}px)`,
                      opacity,
                      filter: 'drop-shadow(0 0 14px #00E676)',
                    }}
                  >
                    <svg
                      width="70"
                      height="70"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={s.color || '#00E676'}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>
                );
              })}
            </div>
          );
        }

        // 6. Sparkles (uses s.x / s.y / s.size when supplied)
        if (s.stickerType === 'sparkles') {
          const r = size * 0.55;
          const spList = hasCoords
            ? [
                { x: cx - r * 0.7, y: cy - r * 0.6, scale: 1.2, delay: 0 },
                { x: cx + r * 0.75, y: cy - r * 0.5, scale: 1.4, delay: 6 },
                { x: cx, y: cy, scale: 1.5, delay: 11 },
                { x: cx - r * 0.65, y: cy + r * 0.65, scale: 1.1, delay: 16 },
                { x: cx + r * 0.7, y: cy + r * 0.6, scale: 1.3, delay: 22 },
              ]
            : [
                { x: 280, y: 700, scale: 1.3, delay: 0 },
                { x: 800, y: 740, scale: 1.5, delay: 6 },
                { x: 450, y: 1100, scale: 1.1, delay: 12 },
                { x: 680, y: 1150, scale: 1.4, delay: 18 },
                { x: 320, y: 920, scale: 1.2, delay: 24 },
                { x: 760, y: 940, scale: 1.6, delay: 30 },
              ];
          return (
            <React.Fragment key={idx}>
              {spList.map((sp, spIdx) => {
                const rel = ((frame - s.startFrame + sp.delay) % 22) / 22;
                const scale = Math.sin(rel * Math.PI) * sp.scale;
                const rot = (frame - s.startFrame) * 8;
                return (
                  <div
                    key={spIdx}
                    style={{
                      position: 'absolute',
                      left: `${sp.x}px`,
                      top: `${sp.y}px`,
                      transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
                      opacity: Math.sin(rel * Math.PI),
                    }}
                  >
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill={s.color || '#FFD700'}
                      style={{ filter: `drop-shadow(0 0 12px ${s.color || '#FFD700'})` }}
                    >
                      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                    </svg>
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        // 7. Universal Emoji Pop
        if (s.stickerType === 'emoji_pop') {
          const pop = spring({
            frame: Math.max(0, frame - s.startFrame),
            fps,
            config: { damping: 10, mass: 0.5, stiffness: 140 },
          });
          const bob = Math.sin((frame - s.startFrame) * 0.2) * 8;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${cx}px`,
                top: `${cy + bob}px`,
                transform: `translate(-50%, -50%) scale(${pop})`,
                fontSize: `${Math.round(size * 0.65)}px`,
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))',
              }}
            >
              {s.emoji || '✨'}
            </div>
          );
        }

        // 8. Custom SVG
        if (s.stickerType === 'custom_svg' && s.svgContent) {
          const pop = spring({
            frame: Math.max(0, frame - s.startFrame),
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 120 },
          });
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${cx}px`,
                top: `${cy}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: `translate(-50%, -50%) scale(${pop})`,
              }}
              dangerouslySetInnerHTML={{ __html: s.svgContent }}
            />
          );
        }

        return null;
      })}
    </div>
  );
};
