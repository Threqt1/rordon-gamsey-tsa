import { PlayerTexture } from "../../textures/player";
import { BaseSprite } from "../base";

export default class MinigameNPC {
    sprite: BaseSprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = new BaseSprite(scene, x, y, PlayerTexture.TextureKey)

        this.sprite.anims.play(PlayerTexture.Animations.IdleSide, true);
    }
}