import { ElfTexture } from "../../../textures/elf";

/**
 * The throwing NPC in the elf minigame
 */
export class ElfMinigameNPC {
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.add.sprite(x, y, ElfTexture.TextureKey)

        this.sprite.anims.play(ElfTexture.Animations.IdleSide, true);
    }
}