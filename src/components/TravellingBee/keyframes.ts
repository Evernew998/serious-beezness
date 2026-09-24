type KeyFrame = {
  progress: number
  offset: number
}

export const horizontalKeyFrames: KeyFrame[] = [
  { progress: 0.0, offset: -0.3 },
  { progress: 0.1, offset: -0.6 },
  { progress: 0.2, offset: -0.15 },
  { progress: 0.28, offset: -0.18 },
  { progress: 0.4, offset: 0.7 },
  { progress: 0.52, offset: 0.3 },
  { progress: 0.58, offset: 0.35 },
  { progress: 0.68, offset: -0.55 },
  { progress: 0.8, offset: -0.8 },
  { progress: 0.9, offset: 0.15 },
  { progress: 1.0, offset: -0.2 },
]

export const verticalKeyFrames: KeyFrame[] = [
  { progress: 0.0, offset: 0.0 },
  { progress: 0.05, offset: 0.16 },
  { progress: 0.3, offset: 0.34 },
  { progress: 0.6, offset: 0.5 },
  { progress: 0.85, offset: 0.66 },
  { progress: 1.0, offset: 1.0 },
]

// Smoothstep: turns a straight 0 → 1 ramp into a gentle ease-in, ease-out
const smoothstep = (t: number) => t * t * (3 - 2 * t)

export const sampleKeyFrames = (keyFrames: KeyFrame[], progress: number) => {
  // The first keyframe that comes after the current progress
  const nextIndex = keyFrames.findIndex((frame) => frame.progress > progress)

  // No keyframe ahead means we're at the end: hold the last value
  if (nextIndex === -1) return keyFrames[keyFrames.length - 1].offset

  // Nothing before it means we're at the start: hold the first value
  if (nextIndex === 0) return keyFrames[0].offset

  const from = keyFrames[nextIndex - 1]
  const to = keyFrames[nextIndex]

  // How far we are between the two keyframes (0 to 1)
  const t = (progress - from.progress) / (to.progress - from.progress)

  return from.offset + (to.offset - from.offset) * smoothstep(t)
}
