import { PlayerTexture } from "../../textures/player";
import { BaseSprite } from "../base";

export default class MinigamePlayer extends BaseSprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, PlayerTexture.TextureKey)

        this.setFlipX(true);

        this.anims.play(PlayerTexture.Animations.IdleSide, true);
    }
}