import { DebugPlugin, SpritesPlugin } from "./plugins"
import PhaserRaycaster from "phaser-raycaster"

declare module "phaser" {
    export interface Scene {
        sprites: SpritesPlugin
        raycaster: PhaserRaycaster
    }
}