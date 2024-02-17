import { GrillSpot } from "."
import { FruitsTexture } from "../../../elf/textures"
import { OrcMinigameScene } from "../../scenes"

const FOOD_DEPTH = 999
const BURN_OFFSET = 3 * 1000

export enum Item {
    APPLE,
    PUMPKIN
}

export enum State {
    NORMAL,
    FLIPPED,
    BURNT,
    FINISHED
}

type Texture = {
    texture: string,
    normal: string,
    flipped: string,
    burnt: string
}

const Textures: {
    [key: number]: Texture
} = {
    [Item.APPLE]: {
        texture: FruitsTexture.TextureKey,
        normal: FruitsTexture.Frames.Apple.Base,
        flipped: FruitsTexture.Frames.Apple.Core1,
        burnt: FruitsTexture.Frames.Apple.Chunk1
    },
    [Item.PUMPKIN]: {
        texture: FruitsTexture.TextureKey,
        normal: FruitsTexture.Frames.Pumpkin.Base,
        flipped: FruitsTexture.Frames.Pumpkin.Core1,
        burnt: FruitsTexture.Frames.Pumpkin.Chunk1
    }
}

export class Sprite {
    scene: OrcMinigameScene
    item: Item
    spot?: GrillSpot
    sprite: Phaser.GameObjects.Sprite
    state: State
    canInteract: boolean
    shine?: Phaser.FX.Shine

    constructor(scene: OrcMinigameScene, spot: GrillSpot, item: Item) {
        this.scene = scene
        this.item = item
        this.spot = spot
        this.sprite = scene.add.sprite(spot.sizeInfo.x + spot.sizeInfo.width / 2, spot.sizeInfo.y + spot.sizeInfo.height / 2, Textures[item].texture, Textures[item].normal)
            .setDepth(FOOD_DEPTH)
            .setScale(2)
        this.state = State.NORMAL
        this.canInteract = true
        this.addShine()

        this.startBurnTimeout(this.state)
    }

    addShine(): void {
        this.removeShine()
        this.shine = this.sprite.postFX!.addShine(1)
    }

    removeShine(): void {
        if (this.shine) this.sprite.postFX!.remove(this.shine)
    }

    interact(): void {
        if (!this.canInteract) return
        if (this.state === State.NORMAL) {
            this.flip()
        } else if (this.state === State.FLIPPED) {
            this.finish()
        }
    }

    startBurnTimeout(currentState: State): void {
        this.scene.time.delayedCall(this.scene.currentStageInformation.interactionTimeout + BURN_OFFSET, () => {
            if (this.state == currentState) this.burn()
        })
    }

    flip(): void {
        this.state = State.FLIPPED
        this.sprite.setFrame(Textures[this.item].flipped)

        this.canInteract = false
        this.removeShine()
        this.scene.time.delayedCall(this.scene.currentStageInformation.interactionTimeout, () => {
            this.canInteract = true
            this.addShine()

            this.startBurnTimeout(this.state)
        })
        /** ONCE FLIP ANIMATION, ADD TIMEOUT THAT RESETS CONTROLLABLE HERE*/
    }

    burn(): void {
        this.canInteract = false
        this.removeShine()
        this.sprite.postFX!.addColorMatrix().contrast(-100, false)
        this.state = State.BURNT
        this.sprite.setFrame(Textures[this.item].burnt)

        this.scene.time.delayedCall(1 * 1000, () => {
            this.finish()
        })
    }

    finish(): void {
        this.state = State.FINISHED
        this.removeShine()
        this.sprite.setVisible(false)
        this.cleanup()
        /** ONCE FLIP ANIMATION, ADD TIMEOUT THAT RESETS CONTROLLABLE HERE*/
    }

    cleanup(): void {
        this.spot!.item = undefined
        this.spot = undefined
        this.sprite.destroy()
    }
}