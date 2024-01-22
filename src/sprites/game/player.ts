import { Direction } from ".."
import { Controllable } from "../../plugins"
import { PlayerTexture } from "../../textures"
import { BaseInput, Keybinds } from "../input"

const SPEED = 56
const DIAGONAL_SPEED_BOOST_FACTOR = 1.25

export class Player implements Controllable {
    static keybinds: Keybinds = {
        [Direction.UP]:
            "W",
        [Direction.DOWN]:
            "S",
        [Direction.LEFT]:
            "A",
        [Direction.RIGHT]:
            "D",
    }
    sprite: Phaser.Physics.Arcade.Sprite
    scene: Phaser.Scene
    input: BaseInput
    controllable: boolean
    speed: number
    direction: Direction

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.physics.add.sprite(x, y, PlayerTexture.TextureKey)
        this.scene = scene
        this.input = new BaseInput(scene, Player.keybinds)
        this.controllable = true
        this.speed = SPEED
        this.direction = Direction.DOWN
    }

    /**
     * Move the player based on input
     */
    move() {
        let velocityX = 0
        let velocityY = 0

        if (this.input.checkIfKeyDown(Direction.UP)) {
            velocityY = -1
            this.direction = Direction.UP
        } else if (this.input.checkIfKeyDown(Direction.DOWN)) {
            velocityY = 1
            this.direction = Direction.DOWN
        }

        if (this.input.checkIfKeyDown(Direction.RIGHT)) {
            velocityX = 1
            this.direction = Direction.RIGHT
        } else if (this.input.checkIfKeyDown(Direction.LEFT)) {
            velocityX = -1
            this.direction = Direction.LEFT
        }

        // Find the direction, then apply appropriate speed scaling
        let movementVector = new Phaser.Math.Vector2(velocityX, velocityY).normalize()
        if (velocityX != 0 && velocityY != 0) {
            movementVector = movementVector.scale(this.speed * DIAGONAL_SPEED_BOOST_FACTOR)
        } else {
            movementVector = movementVector.scale(this.speed)
        }

        this.sprite.setVelocity(movementVector.x, movementVector.y)

        this.playDirectionAnimation(velocityX, velocityY)
    }

    /**
     * Play the appropriate animation based on direction and current velocity
     * @param velocityX The X Velocity
     * @param velocityY The Y Velocity
     */
    playDirectionAnimation(velocityX: number, velocityY: number) {
        switch (this.direction) {
            case Direction.UP:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleBack, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkBack, true)
                }
                break;
            case Direction.DOWN:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleFront, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkFront, true)
                }
                break;
            case Direction.LEFT:
                this.sprite.setFlipX(true)
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleSide, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkSide, true)
                }
                break;
            case Direction.RIGHT:
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

    setControllable(controllable: boolean): void {
        this.controllable = controllable
        if (!this.controllable) {
            this.sprite.setVelocity(0, 0)
            this.playDirectionAnimation(0, 0)
        }
    }
}