import { Controllable } from "../../../../plugins"
import { ElfMinigameScene } from "../../../../scenes/elf"
import { KeyboardTexture } from "../../../../textures"
import { SlashesTexture, FruitsTexture } from "../../../../textures/elf"
import { BaseInput, Keybinds } from "../../../input"

/**
 * Represents all possible types of fruit
 */
export enum ElfMinigameFruitType {
    APPLE,
    PUMPKIN,
}

export interface ElfMinigameFruit extends Controllable {
    /**
     * Initialize the fruit, displaying it and setting it up.
     * Not able to be interacted with though.
     */
    initialize(): void
    /**
     * Enable the fruit for interaction
     */
    enable(): void
}

/**
 * Represents information necessary for fruit initialization
 */
export type ElfMinigameFruitInformation = {
    spriteDepth: number
    endX: number
    lifetime: number
}

/**
 * Represents all possible fruit event emiiter events
 */
export enum ElfMinigameFruitEvents {
    SUCCESS = "success",
    FAIL = "fail"
}

/**
 * Represents all possible fruit interactions
 */
export enum ElfMinigameFruitInteraction {
    SliceUp,
    SliceDown,
    SliceLeft,
    SliceRight
}

/**
 * Bind interactions to keybinds
 */
export const ElfMinigameFruitInteractionKeybinds: Keybinds = {
    [ElfMinigameFruitInteraction.SliceUp]: "W",
    [ElfMinigameFruitInteraction.SliceDown]: "S",
    [ElfMinigameFruitInteraction.SliceLeft]: "A",
    [ElfMinigameFruitInteraction.SliceRight]: "D",
}

/**
 * The time it takes for the fruit to fade out once completed
 */
const END_FADE_DURATION = 500;
/**
 * Cooldown between failed hits
 */
const HIT_COOLDOWN = 100;
const SCREEN_SHAKE_DURATION = 100
const SCREEN_SHAKE_FACTOR = 0.0003
const ROTATION_VELOCITY = 300;
const CHUNK_SPEED = 30
/**
 * Size of the slash
 */
const SLASH_SCALE = 1;

/**
 * An abstract fruit class, handles all logic behind the individual fruits
 */
export abstract class ElfMinigameBaseFruit implements ElfMinigameFruit {
    slicePattern: ElfMinigameFruitInteraction[]
    sliceTextures: [string, string][]
    slashPattern: string[]
    currentPatternLocation: number;

    started: boolean;
    finished: boolean;

    scene: Phaser.Scene;
    baseInput: BaseInput
    controllable: boolean

    mainBodySprites: Phaser.Physics.Arcade.Sprite
    slashSprite: Phaser.Physics.Arcade.Sprite
    fruitChunkSprites: Phaser.Physics.Arcade.Sprite[]

    //colorMatrix: Phaser.FX.ColorMatrix
    tweens: Phaser.Tweens.Tween[]

    interactionPrompt: Phaser.GameObjects.Sprite
    fruitEvents: Phaser.Events.EventEmitter

    constructor(scene: ElfMinigameScene, x: number, y: number, info: ElfMinigameFruitInformation, slicePattern: ElfMinigameFruitInteraction[], sliceTextures: [string, string][], slashPattern: string[]) {
        this.slicePattern = slicePattern;
        this.sliceTextures = sliceTextures
        this.slashPattern = slashPattern
        this.scene = scene
        this.baseInput = new BaseInput(scene, ElfMinigameFruitInteractionKeybinds)
        this.controllable = false;
        this.started = false;
        this.finished = false;
        this.mainBodySprites = scene.physics.add.sprite(x, y, FruitsTexture.TextureKey, this.sliceTextures[0][0]).setDepth(info.spriteDepth).setVisible(false)
        //this.colorMatrix = this.mainBodySprites.postFX!.addColorMatrix()
        this.fruitChunkSprites = []
        this.slashSprite = scene.physics.add.sprite(x, y, SlashesTexture.TextureKey, SlashesTexture.Frames.Empty).setDepth(info.spriteDepth).setScale(SLASH_SCALE)
        this.fruitEvents = new Phaser.Events.EventEmitter()
        this.interactionPrompt = scene.add.sprite(x, y, KeyboardTexture.TextureKey)
        this.interactionPrompt.setDepth(100).setScale(0.3).setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight + 5).setVisible(false)
        this.currentPatternLocation = 0;

        // Tween for moving the fruit
        let movementTween = scene.tweens.add({
            targets: [this.mainBodySprites, this.slashSprite, this.interactionPrompt],
            x: info.endX,
            duration: info.lifetime,
            onComplete: () => {
                // If the tween ends, the iterm has failed
                // Make sure the item has either started and not finished or not started
                if (this.started && !this.finished || !this.started) this.onItemFail()
            },
            paused: true,
        })
        this.mainBodySprites.setAngularVelocity(ROTATION_VELOCITY)

        // Once slash sprite is done animating, reset to invisible frame
        this.slashSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.slashSprite.setFrame(SlashesTexture.Frames.Empty)
        })

        this.tweens = [movementTween]
    }

    initialize(): void {
        this.mainBodySprites.setVisible(true)
        for (let tween of this.tweens) tween.resume()
    }

    enable(): void {
        this.progressSlicePattern()
        this.scene.sprites.controllables.push(this)
        this.controllable = true
        this.started = true;
        this.interactionPrompt.setVisible(true)
    }

    /**
     * Continue to the next position in the current slice pattern
     */
    progressSlicePattern(): void {
        // Update to appropriate key picture
        this.interactionPrompt.setFrame(KeyboardTexture.KeyPictures[ElfMinigameFruitInteractionKeybinds[this.slicePattern[this.currentPatternLocation]]])

        // Set new textures
        let newTextures = this.sliceTextures[this.currentPatternLocation]
        this.mainBodySprites.setFrame(newTextures[0])

        if (this.currentPatternLocation > 0) this.createNewFruitChunk()

        this.scene.input.keyboard!.resetKeys()
    }

    /**
     * Create a new fruit chunk from the main body
     */
    createNewFruitChunk(): void {
        // Get the current textures, creatte the sprite, and update its post FX
        let newTextures = this.sliceTextures[this.currentPatternLocation]
        let newChunk = this.scene.physics.add.sprite(this.mainBodySprites.x, this.mainBodySprites.y, FruitsTexture.TextureKey, newTextures[1]).setDepth(this.mainBodySprites.depth)
        //newChunk.postFX!.addColorMatrix().grayscale(0.6)

        // Launch the chunk perpendicular to the main body at the same rotational velocity
        let vector = new Phaser.Math.Vector2(0, 1).rotate(this.mainBodySprites.rotation - Phaser.Math.DegToRad(90)).scale(CHUNK_SPEED)
        newChunk.setVelocity(vector.x, vector.y)
        newChunk.setAngularVelocity(ROTATION_VELOCITY)

        this.fruitChunkSprites.push(newChunk)
    }

    control(): void {
        if (!this.controllable) return
        this.handlePlayerInput()
    }

    /**
     * Handle player input and update interactions accordingly
     */
    handlePlayerInput(): void {
        if (this.baseInput.checkIfKeyDown(this.slicePattern[this.currentPatternLocation])) {
            this.scene.cameras.main.shake(SCREEN_SHAKE_DURATION, SCREEN_SHAKE_FACTOR)
            this.currentPatternLocation++;
            this.progressSlicePattern()
            // Play the appropriate slash animation
            this.slashSprite.anims.play(this.slashPattern[this.currentPatternLocation - 1], true)
            this.baseInput.input.resetKeys()
            // If pattern is finished, the item was completed successfully
            if (this.currentPatternLocation >= this.slicePattern.length) {
                this.onItemSuccess()
            }
        } else if (Object.values(this.baseInput.keyMap).find(r => r != null && r.isDown)) {
            // If any other registered key was down, wrong key input, player should be penalized
            // with hit cooldown
            this.controllable = false
            this.scene.time.delayedCall(HIT_COOLDOWN, () => {
                this.controllable = true
                this.baseInput.input.resetKeys()
            })
        }
    }

    /**
     * Emit the successful event and cleanup
     */
    onItemSuccess() {
        this.finished = true
        this.fruitEvents.emit(ElfMinigameFruitEvents.SUCCESS)
        this.cleanup()
    }

    /**
     * Emit the fail event and cleanup
     */
    onItemFail() {
        this.finished = true
        this.fruitEvents.emit(ElfMinigameFruitEvents.FAIL)
        this.cleanup()
    }

    /**
     * CLeanup the fruit
     */
    cleanup() {
        this.controllable = false
        this.scene.sprites.controllables.filter(r => r != this)
        this.interactionPrompt.destroy()

        /**
         * CLeanup to do after the fade out tween
         */
        const cleanupAfterTween = () => {
            this.mainBodySprites.destroy()
            this.slashSprite.destroy()
            for (let sprite of this.fruitChunkSprites) sprite.destroy()
            for (let tween of this.tweens) {
                if (tween != null) tween.destroy()
            }
        }

        // Fade out tween
        this.scene.tweens.add({
            targets: [...this.fruitChunkSprites, this.mainBodySprites],
            alpha: 0,
            duration: END_FADE_DURATION,
            onComplete: cleanupAfterTween
        })
    }

    setControllable(controllable: boolean): void {
        this.controllable = controllable
    }

}
