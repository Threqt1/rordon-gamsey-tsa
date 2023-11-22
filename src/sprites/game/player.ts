import { CollisionCategory } from "../../enums/collisionCategories"
import { Controllable } from "../../plugins/sprites"
import { PlayerTexture } from "../../textures/player"
import { BaseSpriteWithInput, Keybinds } from "../base"

enum Interaction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export default class GamePlayer extends BaseSpriteWithInput implements Controllable {
    private static _keybinds: Keybinds = {
        [Interaction.UP]:
            "W",
        [Interaction.DOWN]:
            "S",
        [Interaction.LEFT]:
            "A",
        [Interaction.RIGHT]:
            "D",
    }

    protected getKeybinds(): Keybinds {
        return GamePlayer._keybinds
    }
    private _controllable: boolean
    private _speed = 80;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, PlayerTexture.TextureKey)

        this.scene.sprites.makeCollisionsFor(CollisionCategory.CONTROLLABLE, this.body as Phaser.Physics.Arcade.Body)

        this._controllable = true
    }

    private _direction: Interaction = Interaction.DOWN

    private move(input: Phaser.Input.Keyboard.KeyboardPlugin) {
        let keybinds = this.getKeybinds()
        let velX = 0
        let velY = 0

        if (this.checkDown(input, Interaction.UP)) {
            velY = -1
            this._direction = Interaction.UP
        } else if (this.checkDown(input, Interaction.DOWN)) {
            velY = 1
            this._direction = Interaction.DOWN
        }

        if (this.checkDown(input, Interaction.RIGHT)) {
            velX = 1
            this._direction = Interaction.RIGHT
        } else if (this.checkDown(input, Interaction.LEFT)) {
            velX = -1
            this._direction = Interaction.LEFT
        }

        let movementVector = new Phaser.Math.Vector2(velX, velY).normalize()
        if (velX != 0 && velY != 0) {
            movementVector = movementVector.scale(this._speed * 1.2)
        } else {
            movementVector = movementVector.scale(this._speed)
        }

        this.setVelocity(movementVector.x, movementVector.y)

        switch (this._direction) {
            case Interaction.UP:
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTexture.Animations.IdleBack, true)
                } else {
                    this.anims.play(PlayerTexture.Animations.WalkBack, true)
                }
                break;
            case Interaction.DOWN:
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTexture.Animations.IdleFront, true)
                } else {
                    this.anims.play(PlayerTexture.Animations.WalkFront, true)
                }
                break;
            case Interaction.LEFT:
                this.setFlipX(true)
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTexture.Animations.IdleSide, true)
                } else {
                    this.anims.play(PlayerTexture.Animations.WalkSide, true)
                }
                break;
            case Interaction.RIGHT:
                this.setFlipX(false)
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTexture.Animations.IdleSide, true)
                } else {
                    this.anims.play(PlayerTexture.Animations.WalkSide, true)
                }
                break;
        }
    }

    public setControllable(controllable: boolean) {
        this._controllable = controllable
    }

    public isControllable(): boolean {
        return this._controllable;
    }

    public control(input: Phaser.Input.InputPlugin): void {
        if (!this._controllable) return
        this.move(input.keyboard!)
    }
}