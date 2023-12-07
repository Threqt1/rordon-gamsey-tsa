import { DebugPlugin, SpritesPlugin } from "./plugins"

declare module "phaser" {
    export interface Scene {
        debug: DebugPlugin
        sprites: SpritesPlugin
    }
}