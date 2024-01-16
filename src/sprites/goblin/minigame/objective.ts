import { FruitsTexture } from "../../../textures/elf"
import { BaseNPC } from "../.."
import { GoblinMinigameEvents, GoblinMinigameScene } from "../../../scenes/goblin"

export class GoblinMinigameObjective extends BaseNPC {
    scene: GoblinMinigameScene

    constructor(scene: GoblinMinigameScene, x: number, y: number) {
        super(scene, x, y, FruitsTexture.TextureKey, 50, FruitsTexture.Frames.Apple.Base)

        this.scene = scene
    }

    onInteract(): void {
        this.interactable = false
        this.scene.gameEvents.emit(GoblinMinigameEvents.ALERT)
    }
}