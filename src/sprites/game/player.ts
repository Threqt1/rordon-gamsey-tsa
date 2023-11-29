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

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = new BaseSprite(scene, x, y, PlayerTexture.TextureKey)
        this.scene = scene
        this.input = new BaseInput(scene, Player.keybinds)

        this.scene.sprites.makeCOllisionsForBody(SceneEnums.CollisionCategories.CONTROLLABLE, this.sprite.body as Phaser.Physics.Arcade.Body)

        this.controllable = true
    }

    direction: Interaction = Interaction.DOWN

    move(input: Phaser.Input.Keyboard.KeyboardPlugin) {
        let velX = 0
        let velY = 0

        if (this.input.checkDown(input, Interaction.UP)) {
            velY = -1
            this.direction = Interaction.UP
        } else if (this.input.checkDown(input, Interaction.DOWN)) {
            velY = 1
            this.direction = Interaction.DOWN
        }

        if (this.input.checkDown(input, Interaction.RIGHT)) {
            velX = 1
            this.direction = Interaction.RIGHT
        } else if (this.input.checkDown(input, Interaction.LEFT)) {
            velX = -1
            this.direction = Interaction.LEFT
        }

        let movementVector = new Phaser.Math.Vector2(velX, velY).normalize()
        if (velX != 0 && velY != 0) {
            movementVector = movementVector.scale(this.speed * 1.2)
        } else {
            movementVector = movementVector.scale(this.speed)
        }

        this.sprite.setVelocity(movementVector.x, movementVector.y)

        switch (this.direction) {
            case Interaction.UP:
                if (velX === 0 && velY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleBack, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkBack, true)
                }
                break;
            case Interaction.DOWN:
                if (velX === 0 && velY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleFront, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkFront, true)
                }
                break;
            case Interaction.LEFT:
                this.sprite.setFlipX(true)
                if (velX === 0 && velY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleSide, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkSide, true)
                }
                break;
            case Interaction.RIGHT:
                this.sprite.setFlipX(false)
                if (velX === 0 && velY === 0) {
                    this.sprite.anims.play(PlayerTexture.Animations.IdleSide, true)
                } else {
                    this.sprite.anims.play(PlayerTexture.Animations.WalkSide, true)
                }
                break;
        }
    }

    setControllable(controllable: boolean) {
        this.controllable = controllable
    }

    isControllable(): boolean {
        return this.controllable;
    }

    control(input: Phaser.Input.InputPlugin) {
        if (!this.controllable) return
        this.move(input.keyboard!)
    }
}