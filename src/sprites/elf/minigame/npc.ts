import { ElvesTexture } from "../../../textures/elf";

export class ElfMinigameNPC {
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.add.sprite(x, y, ElvesTexture.TextureKey)

        this.sprite.anims.play(ElvesTexture.Animations.Idle, true);
    }
}