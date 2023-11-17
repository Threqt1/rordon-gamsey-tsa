import MainCharacter from "./sprites/players/characters/mainCharacter/sprite"

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
    public isControllable(): boolean
    public setControllable(controllable: boolean): void
    public control(input: Phaser.Input.InputPlugin): void
}

interface Interactable {
    public isInteractable(): boolean
    public setInteractable(interactable: boolean): void
    public setInteractionPrompt(show: boolean): void
    public getInteractableZone(): Phaser.GameObjects.Zone
    public interact(input: Phaser.Input.InputPlugin): void
}