import { Dialogue, DialogueWalker, DialogueWalkerStatus } from "../dialogue"
import { Controllable } from "../plugins"

type Keybinds = {
    [key: number]: keyof typeof Phaser.Input.Keyboard.KeyCodes
}

class BaseSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame)

        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    }
}

class BaseInput {
    scene: Phaser.Scene
    input: Phaser.Input.Keyboard.KeyboardPlugin
    keyMap: { [key: string]: Phaser.Input.Keyboard.Key }
    keybinds: Keybinds

    constructor(scene: Phaser.Scene, keybinds: Keybinds) {
        this.scene = scene
        this.input = this.scene.input.keyboard!
        this.keyMap = {}
        this.keybinds = keybinds

        this.registerNewKeybinds(keybinds)
    }

    registerNewKeybinds(keybinds: Keybinds) {
        for (let keyBind of Object.values(keybinds)) {
            this.keyMap[keyBind] = this.scene.input.keyboard!.addKey(keyBind)
        }
    }

    getKeyForInteraction(interaction: number) {
        return this.keyMap[this.keybinds[interaction]]
    }

    checkIfKeyDown(interaction: number, resetKeys: boolean = true) {
        let key = this.getKeyForInteraction(interaction)
        if (!key) return
        if (key.isDown) {
            if (resetKeys) this.input.resetKeys()
            return true
        }
        return false
    }
}

enum DialogueInteractions {
    OPTION_1,
    OPTION_2,
    OPTION_3,
    SUBMIT
}

const DialogueOptionKeybinds: Keybinds = {
    [DialogueInteractions.OPTION_1]: "ONE",
    [DialogueInteractions.OPTION_2]: "TWO",
    [DialogueInteractions.OPTION_3]: "THREE",
    [DialogueInteractions.SUBMIT]: "ENTER"

}

export class BaseDialogue<E extends Phaser.Events.EventEmitter> implements Controllable {
    scene: Phaser.Scene
    input: BaseInput
    dialogueWalker: DialogueWalker<E>
    emitter: E
    active: boolean

    constructor(scene: Phaser.Scene, dialogue: Dialogue<E>, emitter: new () => E) {
        this.scene = scene
        this.emitter = new emitter()
        this.dialogueWalker = new DialogueWalker<E>(this.emitter, dialogue, scene.registry)
        this.input = new BaseInput(scene, DialogueOptionKeybinds)
        this.active = false

        scene.sprites.addGUIControllables(this)
    }

    display() {
        if (this.dialogueWalker.status === DialogueWalkerStatus.DIALOGUE) {
            console.log(this.dialogueWalker.getCurrentText())
        } else if (this.dialogueWalker.status === DialogueWalkerStatus.OPTIONS) {
            console.log(this.dialogueWalker.getCurrentOptions().map(r => r.getOptionText(this.dialogueWalker.registry)))
        }
    }

    processDialogue() {
        if (this.input.checkIfKeyDown(DialogueInteractions.SUBMIT)) {
            this.dialogueWalker.progressDialogue()
            this.display()
        }
    }

    processOptions() {
        if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_1)) {
            this.dialogueWalker.chooseOption(0)
        } else if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_2)) {
            this.dialogueWalker.chooseOption(1)
        } else if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_3)) {
            this.dialogueWalker.chooseOption(2)
        } else {
            return
        }
        this.display()
    }

    cleanup() {
        this.active = false
        this.scene.sprites.gameControllablesEnabled = true
    }

    start() {
        if (this.active) return
        this.active = true
        this.scene.sprites.gameControllablesEnabled = false
        this.display()
    }

    control() {
        if (!this.active) return
        switch (this.dialogueWalker.status) {
            case DialogueWalkerStatus.DIALOGUE:
                this.processDialogue()
                break;
            case DialogueWalkerStatus.OPTIONS:
                this.processOptions()
                break;
            case DialogueWalkerStatus.FINISHED:
                this.cleanup()
                break;
        }
    }
}

export { BaseSprite, BaseInput }
export type { Keybinds }
