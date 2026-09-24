import { gsap } from 'gsap'
import { horizontalKeyFrames, verticalKeyFrames, sampleKeyFrames } from './keyframes'

export const BEE_SIZE = 62 // everything is tuned for this size only. It works on desktop and mobile
export const SHADOW_SIZE = BEE_SIZE * 0.92

// Flight path
const OFFSCREEN_MARGIN_TOP = 60 // extra px above the screen where the bee starts
const OFFSCREEN_MARGIN_BOTTOM = 50 // extra px below the screen where the bee ends
const SWAY_REACH_RATIO = 0.4 // max sideways swing, as a fraction of screen width
const MAX_SWAY_REACH = 200 // px, the sway never goes wider than this

// Tilt
const MAX_TILT = 14 // degrees
const TILT_STRENGTH = 120 // how strongly turns become tilt
const TILT_LOOK_AHEAD = 0.02 // how far ahead (in scroll progress) to check the direction

// Shadow
const SHADOW_INSET = (BEE_SIZE - SHADOW_SIZE) / 2 // centers the smaller shadow under the bee
const SHADOW_GROUND_OFFSET_X = BEE_SIZE * 0.16 // shadow's offset from the bee when it's "on the ground"
const SHADOW_GROUND_OFFSET_Y = BEE_SIZE * 0.29
const SHADOW_ALTITUDE_OFFSET_X = BEE_SIZE * 0.32 // extra offset added at full altitude
const SHADOW_ALTITUDE_OFFSET_Y = BEE_SIZE * 0.48
const SHADOW_GROWTH = 0.15 // shadow grows by up to 15% at full altitude
const SHADOW_FLATTEN = 0.5 // squashes the shadow into an oval
const SHADOW_OPACITY = 0.5 // opacity on the ground
const SHADOW_OPACITY_DROP = 0.2 // how much fainter it gets at full altitude

const PATH_SHIFT_RATIO = 0.4 // shift as a fraction of screen width: positive = right, negative = left
const MAX_PATH_SHIFT = 500 // px, the shift never grows past this

export const getFlightPath = () => {
  const pathShift = gsap.utils.clamp(-MAX_PATH_SHIFT, MAX_PATH_SHIFT, window.innerWidth * PATH_SHIFT_RATIO)

  return {
    centerX: (window.innerWidth - BEE_SIZE) / 2 + pathShift,
    swayReach: Math.min(window.innerWidth * SWAY_REACH_RATIO, MAX_SWAY_REACH),
    startY: -BEE_SIZE - OFFSCREEN_MARGIN_TOP,
    endY: window.innerHeight + OFFSCREEN_MARGIN_BOTTOM,
  }
}

export type FlightPath = ReturnType<typeof getFlightPath>

type BeePose = { x: number; y: number; rotation: number }

// Step 1: pure math, where should the bee be at this scroll progress?
const getBeePose = (path: FlightPath, progress: number) => {
  const sway = sampleKeyFrames(horizontalKeyFrames, progress)
  const descent = sampleKeyFrames(verticalKeyFrames, progress)

  // Lean into turns: compare the sway a moment from now with the sway now
  const nextSway = sampleKeyFrames(horizontalKeyFrames, Math.min(1, progress + TILT_LOOK_AHEAD))

  return {
    x: path.centerX + sway * path.swayReach,
    y: path.startY + (path.endY - path.startY) * descent,
    rotation: gsap.utils.clamp(-MAX_TILT, MAX_TILT, (nextSway - sway) * TILT_STRENGTH),
    altitude: Math.sin(descent * Math.PI), // fake height: 0 at the ends, 1 mid-flight
  }
}

// Step 2: pure math, where does the shadow go, given the bee's pose?
const getShadowPose = (bee: BeePose, altitude: number) => {
  const scale = 1 + altitude * SHADOW_GROWTH

  return {
    x: bee.x + SHADOW_INSET + SHADOW_GROUND_OFFSET_X + SHADOW_ALTITUDE_OFFSET_X * altitude,
    y: bee.y + SHADOW_INSET + SHADOW_GROUND_OFFSET_Y + SHADOW_ALTITUDE_OFFSET_Y * altitude,
    rotation: bee.rotation,
    scaleX: scale,
    scaleY: scale * SHADOW_FLATTEN,
    opacity: SHADOW_OPACITY - altitude * SHADOW_OPACITY_DROP,
  }
}

// Step 3: the only function that touches the DOM
export const positionBee = (
  path: FlightPath,
  elements: { bee: HTMLElement; shadow: HTMLElement },
  progress: number,
) => {
  const { altitude, ...beePose } = getBeePose(path, progress)

  gsap.set(elements.bee, beePose)
  gsap.set(elements.shadow, {
    ...getShadowPose(beePose, altitude),
    transformOrigin: '50% 100%',
  })
}
