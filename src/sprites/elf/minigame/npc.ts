import { ElvesTexture } from "../../../textures/elf/minigame/elves";

export class NPC {
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.add.sprite(x, y, ElvesTexture.TextureKey)

        this.sprite.anims.play(ElvesTexture.Animations.Idle, true);
    }
}