import { Controllable, Keybind, Keybinds } from "../../extensions"
import { PlayerTextures } from "./textures"

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export default class Player extends Phaser.Physics.Arcade.Sprite implements Controllable {
    private _controllable: boolean
    private static _keyBinds: Keybinds = {
        [Direction.UP]: {
            keyCode: Phaser.Input.Keyboard.KeyCodes.W,
            repeat: true
        },
        [Direction.DOWN]: {
            keyCode: Phaser.Input.Keyboard.KeyCodes.S,
            repeat: true
        },
        [Direction.LEFT]: {
            keyCode: Phaser.Input.Keyboard.KeyCodes.A,
            repeat: true
        },
        [Direction.RIGHT]: {
            keyCode: Phaser.Input.Keyboard.KeyCodes.D,
            repeat: true
        },
    }
    private _keyCodeKeyBindings: { [key: number]: Phaser.Input.Keyboard.Key } = {}

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, PlayerTextures.TextureKey)

        PlayerTextures.makeAnimations(scene.anims)

        scene.sys.displayList.add(this)
        scene.sys.updateList.add(this)
        scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)

        for (let keyBind of Object.values(Player._keyBinds)) {
            this._keyCodeKeyBindings[keyBind.keyCode] = scene.input.keyboard!.addKey(keyBind.keyCode, true, keyBind.repeat)
        }

        this._controllable = true
    }

    private checkDown(input: Phaser.Input.Keyboard.KeyboardPlugin, keybind: Keybind) {
        return input.checkDown(this._keyCodeKeyBindings[keybind.keyCode])
    }

    private _speed = 50;
    private _direction: Direction = Direction.DOWN

    private move(input: Phaser.Input.Keyboard.KeyboardPlugin) {
        let velX = 0
        let velY = 0

        if (this.checkDown(input, Player._keyBinds[Direction.UP])) {
            velY = -1
            this._direction = Direction.UP
        } else if (this.checkDown(input, Player._keyBinds[Direction.DOWN])) {
            velY = 1
            this._direction = Direction.DOWN
        }

        if (this.checkDown(input, Player._keyBinds[Direction.RIGHT])) {
            velX = 1
            this._direction = Direction.RIGHT
        } else if (this.checkDown(input, Player._keyBinds[Direction.LEFT])) {
            velX = -1
            this._direction = Direction.LEFT
        }

        this.setVelocity(velX * this._speed, velY * this._speed)

        switch (this._direction) {
            case Direction.UP:
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleBack, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkBack, true)
                }
                break;
            case Direction.DOWN:
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleFront, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkFront, true)
                }
                break;
            case Direction.LEFT:
                this.setFlipX(true)
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleSide, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkSide, true)
                }
                break;
            case Direction.RIGHT:
                this.setFlipX(false)
                if (velX === 0 && velY === 0) {
                    this.anims.play(PlayerTextures.Animations.IdleSide, true)
                } else {
                    this.anims.play(PlayerTextures.Animations.WalkSide, true)
                }
                break;
        }
    }

    public set controllable(controllable: boolean) {
        this._controllable = controllable
    }

    public isCurrentlyControllable(): boolean {
        return this.controllable;
    }

    public control(input: Phaser.Input.InputPlugin): void {
        this.move(input.keyboard!)
    }
}