import * as PIXI from 'pixi.js'
import { responsive } from './utils'

export async function sceneInit(app: PIXI.Application, moving: PIXI.Container) {
  const g = app.stage.addChild(new PIXI.Graphics()).circle(0, 260, 200).fill('white')
  const g2 = moving.addChild(new PIXI.Graphics()).circle(0, 1000, 100).fill('white')

  responsive(app, (w, h) => g.position.set(w / 2, 0))
}
