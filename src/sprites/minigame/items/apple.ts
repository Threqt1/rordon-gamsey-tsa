import { ItemsTexture } from "../../../textures/minigame/items";
import { BaseInput, BaseSprite, Keybinds } from "../../base";
import { ItemInformation, MinigameInteractionKeybinds, MinigameItem, MinigameItemEventEmitter, MinigameItemInteraction } from "./base";
import { KeyboardTexture } from "../../../textures/keyboard";
import { Controllable } from "../../../plugins/sprites";

const END_FADE_DURATION = 500;
const HIT_COOLDOWN = 10;

const rotationTweenInfo = {
    rotation: Phaser.Math.DegToRad(360),
    loop: -1,
    duration: 1000,
}

export class MinigameApple extends BaseInput implements MinigameItem, Controllable {
    private static pattern = [MinigameItemInteraction.SliceUp, MinigameItemInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Items.Apple + "_1", ItemsTexture.Items.Apple + "_1"],
        [ItemsTexture.Items.Apple + "_3", ItemsTexture.Items.Apple + "_2"],
        [ItemsTexture.Items.Apple + "_5", ItemsTexture.Items.Apple + "_4"]
    ]
    private _currentPatternLocation: number;

    private _ready: boolean;

    private _scene: Phaser.Scene;
    private _controllable: boolean

    private _sprites: BaseSprite[]
    private _colorMatrix: Phaser.FX.ColorMatrix
    private _tweens: Phaser.Tweens.Tween[]

    private _interactionPrompt: Phaser.GameObjects.Sprite
    private _startInputTimestamp: number

    private _eventEmitter: MinigameItemEventEmitter

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene)
        this._scene = scene

        this._controllable = false;
        this._ready = false;

        let mainSprite = new BaseSprite(scene, x, y, ItemsTexture.TextureKey, ItemsTexture.Items.Apple + "_1").setDepth(info.spriteDepth).setVisible(false)
        this._colorMatrix = mainSprite.postFX!.addColorMatrix()
        this._sprites = [mainSprite]

        this._eventEmitter = new MinigameItemEventEmitter()

        this._interactionPrompt = scene.add.sprite(x, y, KeyboardTexture.TextureKey)
        this._interactionPrompt.setDepth(100).setScale(0.3).setY(this._interactionPrompt.y + this._interactionPrompt.displayHeight + 5).setVisible(false)

        this._currentPatternLocation = 0;
        this._startInputTimestamp = 0;

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
        this._interactionPrompt.setFrame(KeyboardTexture.KeyPictures[this.getKeybinds()[MinigameApple.pattern[this._currentPatternLocation]]])

        let mainSprite = this._sprites[0]
        let newTextures = MinigameApple.patternTextures[this._currentPatternLocation]
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
        this._startInputTimestamp = this._scene.time.now
        this._scene.sprites.addControllables(this)
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

    private slice() {
        let key = this.getKeyFor(MinigameApple.pattern[this._currentPatternLocation])
        if (key.isDown && key.timeDown > this._startInputTimestamp) {
            this.setControllable(false)
            this._currentPatternLocation++;
            this.progressPattern()
            if (this._currentPatternLocation >= MinigameApple.pattern.length) {
                this.onItemSuccess()
            } else {
                this._scene.time.delayedCall(HIT_COOLDOWN, () => {
                    this.setControllable(true)
                    this._startInputTimestamp = this._scene.time.now
                })
            }
        }
    }

    public control(): void {
        if (!this.isControllable()) return
        this.slice()
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