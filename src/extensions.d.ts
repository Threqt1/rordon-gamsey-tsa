import MainCharacter from "./sprites/characters/mainCharacter/sprite"

declare module "phaser" {
    export interface Scene {
        debug: DebugScenePlugin
    }
}

type Keybind = {
    keyCode: number,
    repeat: boolean
}

type Keybinds = {
    [key: number]: Keybind
}

interface Controllable {
    public isCurrentlyControllable(): boolean
    public control(input: Phaser.Input.InputPlugin): void
}