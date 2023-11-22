import { KeyboardTexture } from "../../../textures/keyboard"
import { ItemsTexture } from "../../../textures/minigame/items"
import { BaseInput, BaseSprite, Keybinds } from "../../base"

export interface MinigameItem {
    ready(): void
    start(): void
    getEventEmitter(): MinigameItemEventEmitter
    getTweens(): Phaser.Tweens.Tween[]
    getReady(): boolean
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
    [MinigameItemInteraction.SliceUp]: "W",
    [MinigameItemInteraction.SliceDown]: "S",
    [MinigameItemInteraction.SliceLeft]: "A",
    [MinigameItemInteraction.SliceRight]: "D",
}


const END_FADE_DURATION = 500;
const HIT_COOLDOWN = 100;

const rotationTweenInfo = {
    rotation: Phaser.Math.DegToRad(360),
    loop: -1,
    duration: 1000,
}

export abstract class BaseMinigameItem extends BaseInput implements MinigameItem {
    abstract getPattern(): MinigameItemInteraction[]
    abstract getPatternTextures(): [string, string][]

    protected _currentPatternLocation: number;

    protected _ready: boolean;

    protected _scene: Phaser.Scene;
    protected _controllable: boolean

    protected _sprites: BaseSprite[]
    protected _colorMatrix: Phaser.FX.ColorMatrix
    protected _tweens: Phaser.Tweens.Tween[]

    protected _interactionPrompt: Phaser.GameObjects.Sprite

    protected _eventEmitter: MinigameItemEventEmitter

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene)

        this._scene = scene

        this._controllable = false;
        this._ready = false;

        let mainSprite = new BaseSprite(scene, x, y, ItemsTexture.TextureKey, this.getPatternTextures()[0][0]).setDepth(info.spriteDepth).setVisible(false)
        this._colorMatrix = mainSprite.postFX!.addColorMatrix()
        this._sprites = [mainSprite]

        this._eventEmitter = new MinigameItemEventEmitter()

        this._interactionPrompt = scene.add.sprite(x, y, KeyboardTexture.TextureKey)
        this._interactionPrompt.setDepth(100).setScale(0.3).setY(this._interactionPrompt.y + this._interactionPrompt.displayHeight + 5).setVisible(false)

        this._currentPatternLocation = 0;

        let movementTween = scene.tweens.add({
            targets: [mainSprite, this._interactionPrompt],
            x: info.endX,
            duration: info.duration,
            onComplete: () => this.onItemFail(),
            paused: true
        })
        let rotationTween = scene.tweens.add({
            targets: mainSprite,
            ...rotationTweenInfo,
            paused: true
        })

        this._tweens = [movementTween, rotationTween]
    }

    private onItemFail() {
        this._eventEmitter.emit("fail")
        this.cleanup()
    }

    private onItemSuccess() {
        this._eventEmitter.emit("success")
        this.cleanup()
    }

    private progressPattern() {
        this._interactionPrompt.setFrame(KeyboardTexture.KeyPictures[this.getKeybinds()[this.getPattern()[this._currentPatternLocation]]])

        let mainSprite = this._sprites[0]
        let newTextures = this.getPatternTextures()[this._currentPatternLocation]
        mainSprite.setFrame(newTextures[0])

        if (this._currentPatternLocation > 0) {
            let newChunk = new BaseSprite(this._scene, mainSprite.x, mainSprite.y, ItemsTexture.TextureKey, newTextures[1]).setDepth(mainSprite.depth)
            newChunk.postFX!.addColorMatrix().grayscale(0.6)

            let vector = new Phaser.Math.Vector2(0, 1).rotate(mainSprite.rotation - Phaser.Math.DegToRad(90)).scale(30)
            newChunk.setVelocity(vector.x, vector.y)

            let rotationTween = this._scene.tweens.add({
                targets: newChunk,
                ...rotationTweenInfo
            })
            this._tweens.push(rotationTween)
            this._sprites.push(newChunk)
        }
    }

    public ready() {
        this._sprites[0].setVisible(true)
        for (let tween of this._tweens) tween.resume()
        this._ready = true;
    }

    public start() {
        this.progressPattern()
        this._interactionPrompt.setVisible(true)
        this._scene.sprites.addControllables(this)
        this._scene.input.keyboard!.resetKeys()
        this.setControllable(true)
    }

    private cleanup() {
        this.setControllable(false)
        this._scene.sprites.removeControllables(this)
        this._interactionPrompt.destroy()
        this._scene.tweens.add({
            targets: this._sprites,
            alpha: 0,
            duration: END_FADE_DURATION,
            onComplete: () => {
                for (let sprite of this._sprites) sprite.destroy()
                for (let tween of this._tweens) {
                    if (tween != null) tween.destroy()
                }
            }
        })
    }

    private slice(input: Phaser.Input.Keyboard.KeyboardPlugin) {
        let key = this.getKeyFor(this.getPattern()[this._currentPatternLocation])
        if (!key) return
        if (key.isDown) {
            this._currentPatternLocation++;
            this.progressPattern()
            input.resetKeys()
            if (this._currentPatternLocation >= this.getPattern().length) {
                this.onItemSuccess()
            }
        } else if (Object.values(this._keyCodeKeyBindings).find(r => r != null && r.isDown)) {
            this.setControllable(false)
            this._scene.time.delayedCall(HIT_COOLDOWN, () => {
                this.setControllable(true)
                input.resetKeys()
            })
        }
    }

    public control(input: Phaser.Input.InputPlugin): void {
        if (!this.isControllable()) return
        this.slice(input.keyboard!)
    }

    protected getKeybinds(): Keybinds {
        return MinigameInteractionKeybinds
    }

    public isControllable(): boolean {
        return this._controllable
    }

    public setControllable(controllable: boolean) {
        this._controllable = controllable
    }

    public getTweens() {
        return this._tweens
    }

    public getReady() {
        return this._ready
    }

    public getEventEmitter() {
        return this._eventEmitter
    }

    public getColorMatrix() {
        return this._colorMatrix
    }
}