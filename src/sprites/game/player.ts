import { Controllable } from "../../plugins/sprites"
import { SceneEnums } from "../../scenes"
import { PlayerTexture } from "../../textures/player"
import { BaseInput, BaseSprite, Keybinds } from "../base"

enum Interaction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const DIAGONAL_BOOST_FACTOR = 1.2

export class Player implements Controllable {
    static keybinds: Keybinds = {
        [Interaction.UP]:
            "W",
        [Interaction.DOWN]:
            "S",
        [Interaction.LEFT]:
            "A",
        [Interaction.RIGHT]:
            "D",
    }

    sprite: BaseSprite
    scene: Phaser.Scene
    input: BaseInput

    controllable: boolean
    speed = 80;
    direction: Interaction

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = new BaseSprite(scene, x, y, PlayerTexture.TextureKey)
        this.scene = scene
        this.input = new BaseInput(scene, Player.keybinds)

        this.scene.sprites.makeCollisionsForBody(SceneEnums.CollisionCategories.CONTROLLABLE, this.sprite.body as Phaser.Physics.Arcade.Body)

        this.controllable = true
        this.direction = Interaction.DOWN
    }

    move() {
        let velocityX = 0
        let velocityY = 0

        if (this.input.checkIfKeyDown(Interaction.UP)) {
            velocityY = -1
            this.direction = Interaction.UP
        } else if (this.input.checkIfKeyDown(Interaction.DOWN)) {
            velocityY = 1
            this.direction = Interaction.DOWN
        }

        if (this.input.checkIfKeyDown(Interaction.RIGHT)) {
            velocityX = 1
            this.direction = Interaction.RIGHT
        } else if (this.input.checkIfKeyDown(Interaction.LEFT)) {
            velocityX = -1
            this.direction = Interaction.LEFT
        }

        let movementVector = new Phaser.Math.Vector2(velocityX, velocityY).normalize()
        if (velocityX != 0 && velocityY != 0) {
            movementVector = movementVector.scale(this.speed * DIAGONAL_BOOST_FACTOR)
        } else {
            movementVector = movementVector.scale(this.speed)
        }

        this.sprite.setVelocity(movementVector.x, movementVector.y)

        switch (this.direction) {
            case Interaction.UP:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleBack, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkBack, true)
                }
                break;
            case Interaction.DOWN:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleFront, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkFront, true)
                }
                break;
            case Interaction.LEFT:
                this.sprite.setFlipX(true)
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleSide, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkSide, true)
                }
                break;
            case Interaction.RIGHT:
                this.sprite.setFlipX(false)
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleSide, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkSide, true)
                }
                break;
        }
    }

    control() {
        if (!this.controllable) return
        this.move()
    }
}