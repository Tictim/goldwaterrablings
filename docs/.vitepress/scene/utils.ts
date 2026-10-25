import * as PIXI from 'pixi.js'

export interface ResponsiveHandle {
  resize(): void
  unregister(): void
}

export function responsive(
  app: PIXI.Application,
  callback: (w: number, h: number) => void,
  noInitialResize?: boolean
): ResponsiveHandle {
  app.renderer.on('resize', callback)

  let resize = () => callback(app.screen.width, app.screen.height)
  if (!noInitialResize) resize()

  return {
    resize,
    unregister() {
      app.renderer.off('resize', callback)
    },
  }
}
