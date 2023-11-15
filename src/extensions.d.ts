import MainCharacter from "./sprites/characters/mainCharacter/sprite"

declare module "phaser" {
    export interface Scene {
        debug: DebugScenePlugin
    }

    export namespace GameObjects {
        export interface GameObjectFactory {
            mainCharacter(x: number, y: number): Phaser.Types.Physics.Arcade.SpriteWithStaticBody
        }
    }
}

interface Interactable {
    isInteractable(): boolean
    setInteractableButton(visible: boolean): void
    interact(): void
}