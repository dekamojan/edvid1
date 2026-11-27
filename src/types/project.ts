export interface SFXEvent {
  frame: number;
  type: string;
  volume: number;
}

export interface AudioConfig {
  useOriginalVideoAudio: boolean;
  originalAudioVolume?: number;
  customAudioPath?: string | null;
  customAudioVolume?: number;
  backgroundMusicPath?: string | null;
  bgmVolume?: number;
  sfxEvents: SFXEvent[];
}

export interface LightingConfig {
  problemEndFrame: number;
  flashFrame: number;
  darkVignetteIntensity: number;
  brightContrast: number;
  brightSaturation: number;
  vignetteTint?: string;
  dimBrightness?: number;
  dimContrast?: number;
  dimSaturation?: number;
  flashPeak?: number;
  settleBrightness?: number;
  flashOpacity?: number;
  flashColor?: string;
  flashFrames?: number;
  vignetteAfter?: number;
}

export interface ParallaxCardConfig {
  enabled: boolean;
  startFrame: number;
  endFrame: number;
  stampTextTop: string;
  stampTextBottom: string;
  tiltY?: number;
  tiltX?: number;
  scale?: number;
  radius?: number;
}

export interface KineticPanel {
  startFrame: number;
  endFrame: number;
  type:
    | 'problem_alert'
    | 'warning_tilted'
    | 'danger_pulse'
    | 'bounce_drop'
    | 'glitch_stress'
    | 'solution_double'
    | 'action_press'
    | 'result_neat'
    | 'safe_shield'
    | 'climax_cta';
  tagText?: string;
  line1?: string;
  line2?: string;
  badgeColor?: string;
  textColor?: string;
  icon?: string;
  top?: number;
}

export interface ContextualSticker {
  startFrame: number;
  endFrame: number;
  stickerType:
    | 'heartbeat_ekg'
    | 'bouncing_apple'
    | 'sweat_drops'
    | 'downward_arrows'
    | 'sparkles'
    | 'water_drops'
    | 'emoji_pop'
    | 'custom_svg';
  x?: number;
  y?: number;
  size?: number;
  emoji?: string;
  color?: string;
  position?: string;
  impactFrame?: number;
  svgContent?: string;
}

export interface ChecklistPillItem {
  text: string;
  triggerFrame: number;
  prefix?: string;
  highlight?: boolean;
}

export interface ChecklistPillsConfig {
  startFrame: number;
  endFrame: number;
  header: string;
  items: ChecklistPillItem[];
  top?: number | string;
  left?: number | string;
  style?: 'pills' | 'glass_card';
}

export interface CalloutPin {
  startFrame: number;
  endFrame: number;
  label: string;
  badgeX: number;
  badgeY: number;
  targetX: number;
  targetY: number;
  badgeBg: string;
  badgeColor: string;
  style?: 'pill' | 'clean_card';
  dashed?: boolean;
}

export interface SubtitleWord {
  text: string;
  start: number;
  end: number;
}

export interface SubtitleSegment {
  startFrame: number;
  endFrame: number;
  words: SubtitleWord[];
}

export interface SubtitleConfig {
  bottomOffset?: number;
  fontSize?: number;
  activeBgColor?: string;
  activeTextColor?: string;
  textColor?: string;
  uppercase?: boolean;
}

export interface PolaroidInset {
  startFrame: number;
  endFrame: number;
  label?: string;
  imageSource?: string;
  sourceFrame?: number;
  x?: number;
  y?: number;
  width?: number;
  rotate?: number;
  grayscale?: boolean;
}

export interface LayoutConfig {
  videoFit?: 'cover' | 'contain_blur';
  panelTopOffset?: number;
  showParticles?: boolean;
}

export interface BrandingBarConfig {
  headerText: string;
  footerText: string;
  footerTag: string;
  showProgressBar: boolean;
  headerIcon?: string;
  footerIcon?: string;
  accentColor?: string;
  footerBottomOffset?: number;
  progressBarBottomOffset?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  showWatermarkCover?: boolean;
}

export interface ProjectMetadata {
  title: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
}

export interface VideoClip {
  source: string;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
}

export interface ProjectSpec {
  projectId: string;
  metadata: ProjectMetadata;
  videoSource: string;
  clips?: VideoClip[];
  audioConfig: AudioConfig;
  lighting: LightingConfig;
  parallaxCard: ParallaxCardConfig;
  kineticPanels: KineticPanel[];
  contextualStickers: ContextualSticker[];
  checklistPills: ChecklistPillsConfig;
  interactiveCallouts: CalloutPin[];
  subtitles: SubtitleSegment[];
  subtitleConfig?: SubtitleConfig;
  polaroidInsets?: PolaroidInset[];
  layout?: LayoutConfig;
  brandingBar: BrandingBarConfig;
}
