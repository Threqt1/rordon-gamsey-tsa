import { PlayerTexture } from "../../textures";

export class GoblinNPC {
    sprite: Phaser.GameObjects.PathFollower

    constructor(scene: Phaser.Scene, path: Phaser.Curves.Path, x: number, y: number) {
        this.sprite = scene.add.follower(path, x, y, PlayerTexture.TextureKey);
        scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        (this.sprite.body as Phaser.Physics.Arcade.Body).pushable = false

        this.sprite.play(PlayerTexture.Animations.IdleFront, true);
    }
}