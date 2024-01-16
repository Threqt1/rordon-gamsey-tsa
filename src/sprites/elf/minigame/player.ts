import { PlayerTexture } from "../../../textures/player";

export class ElfMinigamePlayer {
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.add.sprite(x, y, PlayerTexture.TextureKey)

        this.sprite.setFlipX(true);

        this.sprite.anims.play(PlayerTexture.Animations.IdleSide, true);
    }
}