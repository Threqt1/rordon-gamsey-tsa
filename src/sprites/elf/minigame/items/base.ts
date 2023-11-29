import { KeyboardTexture } from "../../../../textures/keyboard"
import { ItemsTexture } from "../../../../textures/elf/minigame/items"
import { SlashesTexture } from "../../../../textures/elf/minigame/slashes"
import { BaseInput, BaseSprite, Keybinds } from "../../../base"

export interface MinigameItem {
    prepare(): void
    start(): void
    getEventEmitter(): MinigameItemEventEmitter
    getTweens(): Phaser.Tweens.Tween[]
    getColorMatrix(): Phaser.FX.ColorMatrix
    getSprite(): Phaser.Physics.Arcade.Sprite
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

    override emit<K extends keyof MinigameItemEvents>(
        eventName: K,
        ...args: MinigameItemEvents[K]
    ): boolean {
        return super.emit(eventName, ...args)
    }

    override once<K extends keyof MinigameItemEvents>(
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
const SCREEN_SHAKE_DURATION = 100
const SCREEN_SHAKE_FACTOR = 0.0003
const ROTATION_VELOCITY = 300;

const SLASH_ANIMATIONS = [SlashesTexture.Animations.Slash1, SlashesTexture.Animations.Slash2, SlashesTexture.Animations.Slash3]
const HIT_ANIMATIONS = [SlashesTexture.Animations.Hit1, SlashesTexture.Animations.Hit2, SlashesTexture.Animations.Hit3]

export abstract class BaseMinigameItem implements MinigameItem {
    pattern: MinigameItemInteraction[]
    patternTextures: [string, string][]

    currentPatternLocation: number;

    started: boolean;
    finished: boolean;

    scene: Phaser.Scene;
    baseInput: BaseInput
    controllable: boolean

    mainBody: BaseSprite
    slash: BaseSprite
    hit: BaseSprite
    chunks: BaseSprite[]

    colorMatrix: Phaser.FX.ColorMatrix
    tweens: Phaser.Tweens.Tween[]

    interactionPrompt: Phaser.GameObjects.Sprite

    eventEmitter: MinigameItemEventEmitter

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation, pattern: MinigameItemInteraction[], patternTextures: [string, string][]) {
        this.pattern = pattern;
        this.patternTextures = patternTextures

        this.scene = scene
        this.baseInput = new BaseInput(scene, MinigameInteractionKeybinds)

        this.controllable = false;
        this.started = false;
        this.finished = false;

        this.mainBody = new BaseSprite(scene, x, y, ItemsTexture.TextureKey, this.patternTextures[0][0]).setDepth(info.spriteDepth).setVisible(false)
        this.colorMatrix = this.mainBody.postFX!.addColorMatrix()

        this.chunks = []

        this.slash = new BaseSprite(scene, x, y, SlashesTexture.TextureKey, SlashesTexture.Frames.Empty).setDepth(info.spriteDepth).setScale(0.7)
        this.hit = new BaseSprite(scene, x, y, SlashesTexture.TextureKey, SlashesTexture.Frames.Empty).setDepth(info.spriteDepth).setScale(0.5)

        this.eventEmitter = new MinigameItemEventEmitter()

        this.interactionPrompt = scene.add.sprite(x, y, KeyboardTexture.TextureKey)
        this.interactionPrompt.setDepth(100).setScale(0.3).setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight + 5).setVisible(false)

        this.currentPatternLocation = 0;

        let movementTween = scene.tweens.add({
            targets: [this.mainBody, this.slash, this.hit, this.interactionPrompt],
            x: info.endX,
            duration: info.duration,
            onComplete: () => {
                if (this.started && !this.finished || !this.started) this.onItemFail()
            },
            paused: true,
        })
        this.mainBody.setAngularVelocity(ROTATION_VELOCITY)

        this.tweens = [movementTween]
    }

    onItemFail() {
        this.eventEmitter.emit("fail")
        this.cleanup()
    }

    onItemSuccess() {
        this.finished = true
        this.eventEmitter.emit("success")
        this.cleanup()
    }

    progressPattern() {
        this.interactionPrompt.setFrame(KeyboardTexture.KeyPictures[this.getKeybinds()[this.pattern[this.currentPatternLocation]]])

        let newTextures = this.patternTextures[this.currentPatternLocation]
        this.mainBody.setFrame(newTextures[0])

        if (this.currentPatternLocation > 0) {
            let newChunk = new BaseSprite(this.scene, this.mainBody.x, this.mainBody.y, ItemsTexture.TextureKey, newTextures[1]).setDepth(this.mainBody.depth)
            newChunk.postFX!.addColorMatrix().grayscale(0.6)

            let vector = new Phaser.Math.Vector2(0, 1).rotate(this.mainBody.rotation - Phaser.Math.DegToRad(90)).scale(30)
            newChunk.setVelocity(vector.x, vector.y)
            newChunk.setAngularVelocity(ROTATION_VELOCITY)

            this.chunks.push(newChunk)
        }
    }

    playSliceAnimation() {
        let randomSlash = Phaser.Math.RND.integerInRange(0, SLASH_ANIMATIONS.length - 1)
        let randomHit = Phaser.Math.RND.integerInRange(0, HIT_ANIMATIONS.length - 1)
        this.slash.anims.play(SLASH_ANIMATIONS[randomSlash], true)
        this.hit.anims.play(HIT_ANIMATIONS[randomHit], true)
    }

    prepare() {
        // let emitter = this.scene.add.particles(this.mainBody.x, this.mainBody.y, "purple", {
        //     lifespan: 750,
        //     radial: true,
        //     speed: 20,
        //     quantity: 40,
        // }).setDepth(100).stop()
        // emitter.explode()

        // let temp = () => {
        //     if (emitter.getAliveParticleCount() === 0) this.scene.sys.events.off("update", temp)
        //     emitter.forEachAlive((p) => {
        //         p.alpha = p.lifeCurrent / (emitter.lifespan as number)
        //         p.angle += 5
        //     }, this)
        // }

        //this.scene.sys.events.on("update", temp, this)
        this.mainBody.setVisible(true)
        for (let tween of this.tweens) tween.resume()
    }

    start() {
        this.progressPattern()
        this.interactionPrompt.setVisible(true)
        this.scene.sprites.addControllables(this)
        this.scene.input.keyboard!.resetKeys()
        this.started = true;
        this.setControllable(true)
    }

    cleanup() {
        this.setControllable(false)
        this.scene.sprites.removeControllables(this)
        this.interactionPrompt.destroy()
        this.scene.tweens.add({
            targets: [...this.chunks, this.mainBody],
            alpha: 0,
            duration: END_FADE_DURATION,
            onComplete: () => {
                this.mainBody.destroy()
                this.slash.destroy()
                this.hit.destroy()
                for (let sprite of this.chunks) sprite.destroy()
                for (let tween of this.tweens) {
                    if (tween != null) tween.destroy()
                }
            }
        })
    }

    slice(input: Phaser.Input.Keyboard.KeyboardPlugin) {
        let key = this.baseInput.getKeyFor(this.pattern[this.currentPatternLocation])
        if (!key) return
        if (key.isDown) {
            this.scene.cameras.main.shake(SCREEN_SHAKE_DURATION, SCREEN_SHAKE_FACTOR)
            this.currentPatternLocation++;
            this.progressPattern()
            this.playSliceAnimation()
            input.resetKeys()
            if (this.currentPatternLocation >= this.pattern.length) {
                this.onItemSuccess()
            }
        } else if (Object.values(this.baseInput.keyMap).find(r => r != null && r.isDown)) {
            this.setControllable(false)
            this.scene.time.delayedCall(HIT_COOLDOWN, () => {
                this.setControllable(true)
                input.resetKeys()
            })
        }
    }

    control(input: Phaser.Input.InputPlugin): void {
        if (!this.isControllable()) return
        this.slice(input.keyboard!)
    }

    protected getKeybinds(): Keybinds {
        return MinigameInteractionKeybinds
    }

    isControllable(): boolean {
        return this.controllable
    }

    setControllable(controllable: boolean) {
        this.controllable = controllable
    }

    getTweens() {
        return this.tweens
    }

    getEventEmitter() {
        return this.eventEmitter
    }

    getColorMatrix() {
        return this.colorMatrix
    }

    getSprite() {
        return this.mainBody
    }
}
