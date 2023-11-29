import { ElvesTexture } from "../../../textures/elf/minigame/elves";
import { BaseSprite } from "../../base";

export default class NPC {
    sprite: BaseSprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = new BaseSprite(scene, x, y, ElvesTexture.TextureKey)

        this.sprite.anims.play(ElvesTexture.Animations.Idle, true);
    }
}