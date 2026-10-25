// :(
let canvasCaptureListeners: ((dataURL: string) => void)[] | undefined

export function enableCanvasCapture() {
  canvasCaptureListeners ??= []
}

export function hasCanvasCaptureListener() {
  return canvasCaptureListeners != null && canvasCaptureListeners.length > 0
}

export function emitCanvasCapture(dataURL: string) {
  if (!canvasCaptureListeners) return
  for (const l of canvasCaptureListeners) l(dataURL)
  canvasCaptureListeners.length = 0
}

export function requestCanvasCapture(callback: (dataURL: string) => void): boolean {
  if (canvasCaptureListeners == null) return false
  canvasCaptureListeners.push(callback)
  return true
}

export type WaterPositionOverride = 'mainPage' | 'normal' | undefined

let waterPositionOverride: WaterPositionOverride

export function getWaterPositionOverride() {
  return waterPositionOverride
}

export function useMainPageWaterPosition(mainPage: boolean) {
  return waterPositionOverride === 'mainPage'
    ? true
    : waterPositionOverride === 'normal'
      ? false
      : mainPage
}

export function setWaterPositionOverride(override: WaterPositionOverride) {
  waterPositionOverride = override
}
