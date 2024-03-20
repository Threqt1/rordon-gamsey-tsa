import { GrillSpot } from "."
import { OrcMinigameScene } from "../../scenes"
import { GrillFoodTexture } from "../../textures/"

/*
Show E to interact when hovering over a flippable item
*/

const FOOD_DEPTH = 998
const BURN_OFFSET = 3 * 1000
const FINISH_TIMEOUT = 1000
const ROTATION_VELOCITY = 320

export enum Item {
    BURGER
}

export enum State {
    UNFLIPPED,
    FLIPPED,
    BURNT,
    FINISHED
}

type Texture = {
    texture: string,
    unflipped: string,
    flipped: string,
    flipAnimation: string,
    burnt: string
}

const Textures: {
    [key: number]: Texture
} = {
    [Item.BURGER]: {
        texture: GrillFoodTexture.TextureKey,
        unflipped: GrillFoodTexture.Frames.Burger.Unflipped,
        flipped: GrillFoodTexture.Frames.Burger.Flipped,
        flipAnimation: GrillFoodTexture.Frames.Burger.FlipAnimation,
        burnt: GrillFoodTexture.Frames.Burger.Flipped
    }
}

export class Sprite {
    scene: OrcMinigameScene
    item: Item
    spot: GrillSpot
    sprite: Phaser.Physics.Arcade.Sprite
    state: State
    canInteract!: boolean
    glow?: Phaser.FX.Glow
    offTheMapX: number

    constructor(scene: OrcMinigameScene, spot: GrillSpot, item: Item) {
        this.scene = scene
        this.item = item
        this.spot = spot
        this.sprite = scene.physics.add.sprite(spot.sizeInfo.x + spot.sizeInfo.width / 2, spot.sizeInfo.y + spot.sizeInfo.height / 2, Textures[item].texture, Textures[item].unflipped)
            .setDepth(FOOD_DEPTH)
        this.state = State.UNFLIPPED
        this.setInteractability(false)
        this.offTheMapX = this.scene.sprites.map!.widthInPixels + this.sprite.displayWidth
        this.startCookingTimeout()
    }

    addGlow(): void {
        this.removeGlow()
        this.glow = this.sprite.postFX!.addGlow(undefined, 100)
    }

    removeGlow(): void {
        if (this.glow) this.sprite.postFX!.remove(this.glow)
    }

    setInteractability(interactable: boolean) {
        this.canInteract = interactable
        if (interactable) {
            this.spot.moveSelectionPrompt()
        } else {
            this.spot.unmoveSelectionPrompt()
        }
    }

    startCookingTimeout() {
        this.setInteractability(false)
        this.removeGlow()
        this.scene.time.delayedCall(this.scene.currentStageInformation.timeUntilCooked, () => {
            this.setInteractability(true)
            this.addGlow()

            this.startBurnTimeout(this.state)
        })
    }

    interact(): void {
        if (!this.canInteract) return
        if (this.state === State.UNFLIPPED) {
            this.flip()
        } else if (this.state === State.FLIPPED) {
            this.finish()
        }
    }

    startBurnTimeout(currentState: State): void {
        this.scene.time.delayedCall(this.scene.currentStageInformation.timeUntilCooked + BURN_OFFSET, () => {
            if (this.state == currentState) this.burn()
        })
    }

    flip(): void {
        this.state = State.FLIPPED
        this.sprite.setFrame(Textures[this.item].flipped)

        this.startCookingTimeout()
        this.sprite.anims.play(Textures[this.item].flipAnimation, true)
    }

    burn(): void {
        this.setInteractability(false)
        this.removeGlow()
        this.sprite.postFX!.addColorMatrix().contrast(-100, false)
        this.state = State.BURNT
        this.sprite.setFrame(Textures[this.item].burnt)

        this.scene.time.delayedCall(1 * 1000, () => {
            this.finish()
        })
    }

    finish(): void {
        this.setInteractability(false)
        this.state = State.FINISHED
        let endTween = this.scene.tweens.add({
            targets: [this.sprite],
            x: this.offTheMapX,
            duration: FINISH_TIMEOUT
        })
        this.sprite.setAngularVelocity(ROTATION_VELOCITY).setDepth(999)
        endTween.play().on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            this.sprite.setVisible(false)
            this.cleanup()
        })
    }

    cleanup(): void {
        this.spot.item = undefined
        this.sprite.destroy()
    }
}