import { Controllable, Keybinds } from "../../extensions"
import BaseSprite from "../base"
import { PlayerTextures } from "./textures"

export enum Interaction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export default class Player extends BaseSprite implements Controllable {
    protected getKeybinds(): Keybinds {
        return {
            [Interaction.UP]:
                Phaser.Input.Keyboard.KeyCodes.W,
            [Interaction.DOWN]:
                Phaser.Input.Keyboard.KeyCodes.S,
            [Interaction.LEFT]:
                Phaser.Input.Keyboard.KeyCodes.A,
            [Interaction.RIGHT]:
                Phaser.Input.Keyboard.KeyCodes.D,
        }
    }
    private _controllable: boolean
    private static _animationsMade: boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, PlayerTextures.TextureKey)

        if (!Player._animationsMade) {
            PlayerTextures.makeAnimations(scene.anims)
            Player._animationsMade = true
        }

        this._controllable = true
    }

    private _speed = 50;
    private _direction: Interaction = Interaction.DOWN

    private move(input: Phaser.Input.Keyboard.KeyboardPlugin) {
        let keybinds = this.getKeybinds()
        let velX = 0
        let velY = 0

        if (this.checkDown(input, keybinds[Interaction.UP])) {
            velY = -1
            this._direction = Interaction.UP
        } else if (this.checkDown(input, keybinds[Interaction.DOWN])) {
            velY = 1
            this._direction = Interaction.DOWN
        }

        if (this.checkDown(input, keybinds[Interaction.RIGHT])) {
            velX = 1
            this._direction = Interaction.RIGHT
        } else if (this.checkDown(input, keybinds[Interaction.LEFT])) {
            velX = -1
            this._direction = Interaction.LEFT
        }

        this.setVelocity(velX * this._speed, velY * this._speed)

        switch (this._direction) {
            case Interaction.UP:
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleBack, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkBack, true)
                }
                break;
            case Interaction.DOWN:
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleFront, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkFront, true)
                }
                break;
            case Interaction.LEFT:
                this.setFlipX(true)
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleSide, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkSide, true)
                }
                break;
            case Interaction.RIGHT:
                this.setFlipX(false)
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleSide, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkSide, true)
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