import { Keybinds } from "../../../extensions"

export interface MinigameItem {
    ready(): void
    start(): void
    getEventEmitter(): MinigameItemEventEmitter
    getTweens(): Phaser.Tweens.Tween[]
    getColorMatrix(): Phaser.FX.ColorMatrix
}

export type ItemInformation = {
    spriteDepth: number
    endX: number
    duration: number
}

type MinigameItemEvents = {
    "success": []
    "fail": []
}

export class MinigameItemEventEmitter extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    public override emit<K extends keyof MinigameItemEvents>(
        eventName: K,
        ...args: MinigameItemEvents[K]
    ): boolean {
        return super.emit(eventName, ...args)
    }

    public override once<K extends keyof MinigameItemEvents>(
        eventName: K,
        listener: (...args: MinigameItemEvents[K]) => void
    ): this {
        return super.once(eventName, listener)
    }
}

export enum MinigameItemInteraction {
    SliceUp,
    SliceDown,
    SliceLeft,
    SliceRight
}

export const MinigameInteractionKeybinds: Keybinds = {
    [MinigameItemInteraction.SliceUp]: Phaser.Input.Keyboard.KeyCodes.W,
    [MinigameItemInteraction.SliceDown]: Phaser.Input.Keyboard.KeyCodes.S,
    [MinigameItemInteraction.SliceLeft]: Phaser.Input.Keyboard.KeyCodes.A,
    [MinigameItemInteraction.SliceRight]: Phaser.Input.Keyboard.KeyCodes.D,
}