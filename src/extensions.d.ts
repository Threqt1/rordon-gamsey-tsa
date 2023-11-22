import SpritesScenePlugin from "./plugins/sprites"
import MainCharacter from "./sprites/players/characters/mainCharacter/sprite"

declare module "phaser" {
    export interface Scene {
        debug: DebugScenePlugin
        sprites: SpritesScenePlugin
    }
}



