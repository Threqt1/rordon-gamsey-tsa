import { DebugPlugin, SpritesPlugin } from "../plugins"
import PhaserRaycaster from "phaser-raycaster"

interface AnimatedTilesPlugin {
    init(map: Phaser.Tilemaps.Tilemap): void
    setRate(rate: number, map?: Phaser.Tilemaps.Tilemap, gid?: number)
}

declare module "phaser" {
    export interface Scene {
        sprites: SpritesPlugin
        raycaster: PhaserRaycaster
        animatedTiles: AnimatedTilesPlugin
    }
}