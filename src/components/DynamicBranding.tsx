import React from 'react';
import { useCurrentFrame } from 'remotion';
import { BrandingBarConfig } from '../types/project';

interface Props {
  branding: BrandingBarConfig;
  totalFrames: number;
}

export const DynamicBranding: React.FC<Props> = ({ branding, totalFrames }) => {
  const frame = useCurrentFrame();

  if (!branding) return null;

  const progressPercent = Math.min(100, (frame / (totalFrames || 567)) * 100);
  const accentColor = branding.accentColor || '#FFD700';
  const headerIcon =
    branding.headerIcon !== undefined ? branding.headerIcon : '⚡';
  const footerIcon = branding.footerIcon || '';
  const showHeader = branding.showHeader !== false && Boolean(branding.headerText);
  const showFooter = branding.showFooter !== false && Boolean(branding.footerText);
  const showWatermarkCover = branding.showWatermarkCover !== false;
  const footerBottom = branding.footerBottomOffset ?? 360;
  const progressBottom = branding.progressBarBottomOffset ?? 335;

  return (
    <>
      {/* 1. Top Header Bar (Safe Zone: y: 55px, below top icons) */}
      {showHeader && (
        <div
          style={{
            position: 'absolute',
            top: '55px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 35,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(12, 14, 20, 0.92)',
            padding: '10px 32px',
            borderRadius: '30px',
            border: `1.5px solid ${accentColor}66`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            maxWidth: '940px',
            fontFamily:
              "'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif",
          }}
        >
          {headerIcon && <span style={{ fontSize: '24px' }}>{headerIcon}</span>}
          <span
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: accentColor,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {branding.headerText}
          </span>
          {headerIcon && <span style={{ fontSize: '24px' }}>{headerIcon}</span>}
        </div>
      )}

      {/* 2. TikTok / Shopee Safe Zone Branding Tag (above caption & shopping bag) */}
      {showFooter && (
        <div
          style={{
            position: 'absolute',
            bottom: `${footerBottom}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 27,
            backgroundColor: 'rgba(12, 14, 20, 0.88)',
            padding: '8px 26px',
            borderRadius: '25px',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(10px)',
            maxWidth: '940px',
            fontFamily:
              "'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif",
            whiteSpace: 'nowrap',
          }}
        >
          {footerIcon && <span style={{ fontSize: '22px' }}>{footerIcon}</span>}
          <span
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {branding.footerText}
          </span>
          {branding.footerTag && (
            <span
              style={{
                backgroundColor: accentColor,
                color: '#111111',
                fontSize: '18px',
                fontWeight: 900,
                padding: '3px 12px',
                borderRadius: '12px',
                marginLeft: '6px',
              }}
            >
              {branding.footerTag}
            </span>
          )}
        </div>
      )}

      {/* 3. Sleek Video Progress Bar */}
      {branding.showProgressBar && (
        <div
          style={{
            position: 'absolute',
            bottom: `${progressBottom}px`,
            left: '70px',
            right: '70px',
            height: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            overflow: 'hidden',
            zIndex: 27,
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${accentColor}, #FF2442, #00E676)`,
              borderRadius: '3px',
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        </div>
      )}

      {/* 4. Bottom Watermark Cover */}
      {showWatermarkCover && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '140px',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      )}
    </>
  );
};
