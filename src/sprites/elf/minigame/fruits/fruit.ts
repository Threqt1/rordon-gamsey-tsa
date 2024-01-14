import { Controllable } from "../../../../plugins"
import { KeyboardTexture } from "../../../../textures"
import { SlashesTexture, FruitsTexture } from "../../../../textures/elf/minigame"
import { BaseInput, Keybinds } from "../../../input"

export enum Fruits {
    APPLE,
    PUMPKIN,
}

export interface Fruit extends Controllable {
    prepare(): void
    start(): void
}

export type FruitInformation = {
    spriteDepth: number
    endX: number
    lifetime: number
}

export enum FruitEventName {
    SUCCESS = "success",
    FAIL = "fail"
}

export enum FruitInteraction {
    SliceUp,
    SliceDown,
    SliceLeft,
    SliceRight
}

export const FruitInteractionKeybinds: Keybinds = {
    [FruitInteraction.SliceUp]: "W",
    [FruitInteraction.SliceDown]: "S",
    [FruitInteraction.SliceLeft]: "A",
    [FruitInteraction.SliceRight]: "D",
}


const END_FADE_DURATION = 500;
const HIT_COOLDOWN = 100;
const SCREEN_SHAKE_DURATION = 100
const SCREEN_SHAKE_FACTOR = 0.0003
const ROTATION_VELOCITY = 300;
const SLASH_SCALE = 1;

//const SLASH_ANIMATIONS = [SlashesTexture.Animations.Slash1, SlashesTexture.Animations.Slash2, SlashesTexture.Animations.Slash3, SlashesTexture.Animations.Slash4]
//const HIT_ANIMATIONS = [SlashesTexture.Animations.Hit1, SlashesTexture.Animations.Hit2, SlashesTexture.Animations.Hit3]

export abstract class BaseFruit implements Fruit {
    pattern: FruitInteraction[]
    patternTextures: [string, string][]
    slashes: string[]
    currentPatternLocation: number;
    started: boolean;
    finished: boolean;
    scene: Phaser.Scene;
    baseInput: BaseInput
    controllable: boolean
    mainBody: Phaser.Physics.Arcade.Sprite
    slashSprite: Phaser.Physics.Arcade.Sprite
    fruitChunks: Phaser.Physics.Arcade.Sprite[]
    colorMatrix: Phaser.FX.ColorMatrix
    tweens: Phaser.Tweens.Tween[]
    interactionPrompt: Phaser.GameObjects.Sprite
    eventEmitter: Phaser.Events.EventEmitter

    constructor(scene: Phaser.Scene, x: number, y: number, info: FruitInformation, pattern: FruitInteraction[], patternTextures: [string, string][], slashes: string[]) {
        this.pattern = pattern;
        this.patternTextures = patternTextures
        this.slashes = slashes
        this.scene = scene
        this.baseInput = new BaseInput(scene, FruitInteractionKeybinds)
        this.controllable = false;
        this.started = false;
        this.finished = false;
        this.mainBody = scene.physics.add.sprite(x, y, FruitsTexture.TextureKey, this.patternTextures[0][0]).setDepth(info.spriteDepth).setVisible(false)
        this.colorMatrix = this.mainBody.postFX!.addColorMatrix()
        this.fruitChunks = []
        this.slashSprite = scene.physics.add.sprite(x, y, SlashesTexture.TextureKey, SlashesTexture.Frames.Empty).setDepth(info.spriteDepth).setScale(SLASH_SCALE)
        this.eventEmitter = new Phaser.Events.EventEmitter()
        this.interactionPrompt = scene.add.sprite(x, y, KeyboardTexture.TextureKey)
        this.interactionPrompt.setDepth(100).setScale(0.3).setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight + 5).setVisible(false)
        this.currentPatternLocation = 0;

        let movementTween = scene.tweens.add({
            targets: [this.mainBody, this.slashSprite, this.interactionPrompt],
            x: info.endX,
            duration: info.lifetime,
            onComplete: () => {
                if (this.started && !this.finished || !this.started) this.onItemFail()
            },
            paused: true,
        })
        this.mainBody.setAngularVelocity(ROTATION_VELOCITY)

        this.slashSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.slashSprite.setFrame(SlashesTexture.Frames.Empty)
        })

        this.tweens = [movementTween]
    }

    setControllable(controllable: boolean): void {
        this.controllable = controllable
    }

    onItemFail() {
        this.eventEmitter.emit(FruitEventName.FAIL)
        this.cleanup()
    }

    onItemSuccess() {
        this.finished = true
        this.eventEmitter.emit(FruitEventName.SUCCESS)
        this.cleanup()
    }

    createNewFruitChunk() {
        let newTextures = this.patternTextures[this.currentPatternLocation]
        let newChunk = this.scene.physics.add.sprite(this.mainBody.x, this.mainBody.y, FruitsTexture.TextureKey, newTextures[1]).setDepth(this.mainBody.depth)
        newChunk.postFX!.addColorMatrix().grayscale(0.6)

        let vector = new Phaser.Math.Vector2(0, 1).rotate(this.mainBody.rotation - Phaser.Math.DegToRad(90)).scale(30)
        newChunk.setVelocity(vector.x, vector.y)
        newChunk.setAngularVelocity(ROTATION_VELOCITY)

        this.fruitChunks.push(newChunk)
    }

    progressPattern() {
        this.interactionPrompt.setFrame(KeyboardTexture.KeyPictures[FruitInteractionKeybinds[this.pattern[this.currentPatternLocation]]])

        let newTextures = this.patternTextures[this.currentPatternLocation]
        this.mainBody.setFrame(newTextures[0])

        if (this.currentPatternLocation > 0) this.createNewFruitChunk()

        this.scene.input.keyboard!.resetKeys()
    }

    // playSliceAnimation() {
    //     let randomSlash = Phaser.Math.RND.integerInRange(0, SLASH_ANIMATIONS.length - 1)
    //     this.slashSprite.anims.play(SLASH_ANIMATIONS[randomSlash], true)
    // }

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
        this.scene.sprites.addGameControllables(this)
        this.controllable = true
        this.started = true;
        this.interactionPrompt.setVisible(true)
    }

    cleanup() {
        this.controllable = false
        this.scene.sprites.removeGameControllables(this)
        this.interactionPrompt.destroy()

        const finalCompleteCleanup = () => {
            this.mainBody.destroy()
            this.slashSprite.destroy()
            for (let sprite of this.fruitChunks) sprite.destroy()
            for (let tween of this.tweens) {
                if (tween != null) tween.destroy()
            }
        }

        this.scene.tweens.add({
            targets: [...this.fruitChunks, this.mainBody],
            alpha: 0,
            duration: END_FADE_DURATION,
            onComplete: finalCompleteCleanup
        })
    }

    slice() {
        if (this.baseInput.checkIfKeyDown(this.pattern[this.currentPatternLocation])) {
            this.scene.cameras.main.shake(SCREEN_SHAKE_DURATION, SCREEN_SHAKE_FACTOR)
            this.currentPatternLocation++;
            this.progressPattern()
            this.slashSprite.anims.play(this.slashes[this.currentPatternLocation - 1], true)
            //this.playSliceAnimation()
            this.baseInput.input.resetKeys()
            if (this.currentPatternLocation >= this.pattern.length) {
                this.onItemSuccess()
            }
        } else if (Object.values(this.baseInput.keyMap).find(r => r != null && r.isDown)) {
            this.controllable = false
            this.scene.time.delayedCall(HIT_COOLDOWN, () => {
                this.controllable = true
                this.baseInput.input.resetKeys()
            })
        }
    }

    control(): void {
        if (!this.controllable) return
        this.slice()
    }
}
