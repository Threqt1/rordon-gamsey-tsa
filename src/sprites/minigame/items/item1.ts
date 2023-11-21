import { Input } from "phaser";
import { Controllable, Keybinds } from "../../../extensions";
import { ItemsTexture } from "../../../textures/minigame/items";
import { BaseInput, BaseSprite } from "../../base";
import { ItemInformation, MinigameItem } from "./base";
import { KeyboardTexture } from "../../../textures/keyboard";

enum Interaction {
    SliceUp,
    SliceDown
}

export class MinigameApple extends BaseInput implements MinigameItem, Controllable {
    private static pattern = [Interaction.SliceUp, Interaction.SliceDown]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Items.Apple + "_1", ItemsTexture.Items.Apple + "_1"],
        [ItemsTexture.Items.Apple + "_2", ItemsTexture.Items.Apple + "_3"],
        [ItemsTexture.Items.Apple + "_4", ItemsTexture.Items.Apple + "_5"]
    ]

    private _scene: Phaser.Scene;
    private _mainBody: BaseSprite
    private _tweens: Phaser.Tweens.Tween[]
    private _currentPatternLocation: number;
    private _controllable: boolean
    private _interactionPrompt: Phaser.GameObjects.Sprite
    private _eventEmitter: Phaser.Events.EventEmitter
    private _sprites: BaseSprite[]
    private _colorMatrix: Phaser.FX.ColorMatrix

    protected getKeybinds(): Keybinds {
        return {
            [Interaction.SliceUp]:
                Phaser.Input.Keyboard.KeyCodes.W,
            [Interaction.SliceDown]:
                Phaser.Input.Keyboard.KeyCodes.S
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene)
        this._scene = scene
        this._mainBody = new BaseSprite(scene, x, y, ItemsTexture.TextureKey, ItemsTexture.Items.Apple + "_1").setDepth(info.depth).setVisible(false)
        this._colorMatrix = this._mainBody.postFX!.addColorMatrix()

        this._eventEmitter = new Phaser.Events.EventEmitter()

        this._interactionPrompt = scene.add.sprite(x, y, KeyboardTexture.TextureKey)
        this._interactionPrompt.setDepth(100).setScale(0.3).setY(this._interactionPrompt.y + this._interactionPrompt.displayHeight + 5).setVisible(false)

        this._sprites = [this._mainBody]

        let movementTween = scene.tweens.add({
            targets: [this._mainBody, this._interactionPrompt],
            x: info.targetX,
            duration: info.duration,
            onComplete: () => {
                this._eventEmitter.emit("itemFailed")
                this.deactivate()
            },
            paused: true
        })
        let rotationTween = scene.tweens.add({
            targets: this._sprites,
            rotation: Phaser.Math.DegToRad(360),
            loop: -1,
            duration: 1000,
            paused: true
        })

        this._tweens = [movementTween, rotationTween]

        this._currentPatternLocation = 0;
        this._controllable = false;
    }

    public isControllable(): boolean {
        return this._controllable
    }

    public setControllable(controllable: boolean) {
        this._controllable = controllable
    }

    private progressPattern() {
        this._interactionPrompt.setFrame(KeyboardTexture.KeyPictures[this.getKeybinds()[MinigameApple.pattern[this._currentPatternLocation]]])
        let newTextures = MinigameApple.patternTextures[this._currentPatternLocation]
        this._mainBody.setFrame(newTextures[1])
        if (this._currentPatternLocation > 0) {
            let newChunk = new BaseSprite(this._scene, this._mainBody.x, this._mainBody.y, ItemsTexture.TextureKey, newTextures[0]).setDepth(this._mainBody.depth)
            newChunk.postFX!.addColorMatrix().grayscale(0.6)
            this._sprites.push(newChunk)
            let vector = new Phaser.Math.Vector2(0, 0)
            Phaser.Math.RandomXY(vector, 30)
            newChunk.setVelocity(vector.x, vector.y)
        }
    }

    public getTweens() {
        return this._tweens
    }

    public getEventEmitter() {
        return this._eventEmitter
    }

    public getColorMatrix() {
        return this._colorMatrix
    }

    public start() {
        this._mainBody.setVisible(true)
        for (let tween of this._tweens) tween.resume()
    }

    public activate() {
        this.progressPattern()
        this._interactionPrompt.setVisible(true)
        this.setControllable(true)
        this._scene.sprites.addControllables(this)
    }

    public deactivate() {
        this._interactionPrompt.setVisible(false)
        this.setControllable(false)
        this._scene.tweens.add({
            targets: this._sprites,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                for (let sprite of this._sprites) sprite.destroy()
                for (let tween of this._tweens) {
                    if (tween != null) tween.destroy()
                }
                this._interactionPrompt.destroy()
                this._scene.sprites.removeControllables(this)
            }
        })
    }

    private slice(input: Phaser.Input.Keyboard.KeyboardPlugin) {
        if (this.checkDown(input, this.getKeybinds()[MinigameApple.pattern[this._currentPatternLocation]])) {
            this._currentPatternLocation++;
            this.progressPattern()
            if (this._currentPatternLocation >= MinigameApple.pattern.length) {
                this._eventEmitter.emit("itemComplete")
                this.deactivate()
            }
        }
    }

    public control(input: Input.InputPlugin): void {
        if (!this._controllable) return
        this.slice(input.keyboard!)
    }
}