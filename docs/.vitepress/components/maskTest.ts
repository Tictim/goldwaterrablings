export function maskTest(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const result = maskTestOnCanvas(img)
        if (result != null) {
          resolve(result)
          return
        }
      } catch (_) {}

      try {
        resolve(!checkForIOS())
      } catch (ex) {
        reject(ex)
      }
    }
    img.onerror = () => {
      try {
        resolve(!checkForIOS())
      } catch (ex) {
        reject(ex)
      }
    }
    img.src = '/maskTest.svg'
  })
}

// approach 1: directly test mask-mode functionality with an svg mask
// if the resulting image on canvas comes out black it should be working as intended
// white indicates the mask being used on alpha mode, which should mean safari
function maskTestOnCanvas(img: HTMLImageElement): boolean | undefined {
  // use multiple samples to account for canvas noise thing
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  ctx.drawImage(img, 0, 0, 2, 2)
  ctx.fillStyle = 'gray'
  ctx.fillRect(2, 0, 2, 2)

  const filtered = sample(ctx, 0, 0, 2, 2)
  const compare = sample(ctx, 2, 0, 2, 2)

  return filtered < compare
}

function sample(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const data = ctx.getImageData(x, y, w, h).data

  var samples = 0,
    sum = 0

  for (var i = 0; i < data.length; i++) {
    if (i % 4 == 3) continue
    samples++
    sum += data[i]
  }

  sum /= samples
  return sum
}

const PLATFORMS = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod']

// just have this as fallback too i guess
// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
function checkForIOS(): boolean {
  return (
    PLATFORMS.includes(navigator.platform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}
