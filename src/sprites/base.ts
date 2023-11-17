import { Keybinds } from "../extensions";

export default abstract class BaseSprite extends Phaser.Physics.Arcade.Sprite {
    protected _keyCodeKeyBindings: { [key: number]: Phaser.Input.Keyboard.Key }

    constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene, x, y, key)

        this._keyCodeKeyBindings = {}

        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)

        for (let keyBind of Object.values(this.getKeybinds())) {
            this._keyCodeKeyBindings[keyBind.keyCode] = scene.input.keyboard!.addKey(keyBind.keyCode, true, keyBind.repeat)
        }
    }

    protected abstract getKeybinds(): Keybinds
}