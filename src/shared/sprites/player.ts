import { PlayerTexture } from "../textures"
import { InputSystem, SpritesPlugin } from "../systems"
import { SpriteUtil } from "../util"

const SPEED = 56
const DIAGONAL_SPEED_BOOST_FACTOR = 1.25

export class Player implements SpritesPlugin.Controllable {
    static keybinds: InputSystem.Keybinds = {
        [SpriteUtil.Direction.UP]:
            "W",
        [SpriteUtil.Direction.DOWN]:
            "S",
        [SpriteUtil.Direction.LEFT]:
            "A",
        [SpriteUtil.Direction.RIGHT]:
            "D",
    }
    sprite: Phaser.Physics.Arcade.Sprite
    scene: Phaser.Scene
    input: InputSystem.System
    controllable: boolean
    speed: number
    direction: SpriteUtil.Direction

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.physics.add.sprite(x, y, PlayerTexture.TextureKey)
        this.scene = scene
        this.input = new InputSystem.System(scene, Player.keybinds)
        this.controllable = true
        this.speed = SPEED
        this.direction = SpriteUtil.Direction.DOWN

        PlayerTexture.configurePlayerPhysicsBody(this.sprite.body as Phaser.Physics.Arcade.Body)
    }

    /**
     * Move the player based on input
     */
    move() {
        let velocityX = 0
        let velocityY = 0

        if (this.input.checkIfKeyDown(SpriteUtil.Direction.UP)) {
            velocityY = -1
            this.direction = SpriteUtil.Direction.UP
        } else if (this.input.checkIfKeyDown(SpriteUtil.Direction.DOWN)) {
            velocityY = 1
            this.direction = SpriteUtil.Direction.DOWN
        }

        if (this.input.checkIfKeyDown(SpriteUtil.Direction.RIGHT)) {
            velocityX = 1
            this.direction = SpriteUtil.Direction.RIGHT
        } else if (this.input.checkIfKeyDown(SpriteUtil.Direction.LEFT)) {
            velocityX = -1
            this.direction = SpriteUtil.Direction.LEFT
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
            case SpriteUtil.Direction.UP:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleBack, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkBack, true)
                }
                break;
            case SpriteUtil.Direction.DOWN:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleFront, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkFront, true)
                }
                break;
            case SpriteUtil.Direction.LEFT:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleLeft, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkLeft, true)
                }
                break;
            case SpriteUtil.Direction.RIGHT:
                if (velocityX === 0 && velocityY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleRight, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkRight, true)
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