import { DialogueSystem, InputSystem, SpritesPlugin } from "../systems"

enum Interactions {
    OPTION_1,
    OPTION_2,
    OPTION_3,
    SUBMIT
}

const Keybinds: InputSystem.Keybinds = {
    [Interactions.OPTION_1]: "ONE",
    [Interactions.OPTION_2]: "TWO",
    [Interactions.OPTION_3]: "THREE",
    [Interactions.SUBMIT]: "E"

}

/**
 * Handles communicating between player input and the internal dialogue walker
 */
export class BaseDialogue implements SpritesPlugin.Controllable {
    baseScene: Phaser.Scene
    activeScene!: Phaser.Scene
    dialogueSprite: DialogueSystem.DialogueSprite
    input: InputSystem.System
    dialogueWalker: DialogueSystem.Walker
    controllable: boolean
    endCallback?: (() => void)

    constructor(scene: Phaser.Scene, width: number, height: number) {
        this.baseScene = scene
        this.dialogueSprite = new DialogueSystem.DialogueSprite(scene, width, height)
        this.dialogueSprite.setVisible(false)
        this.input = new InputSystem.System(scene, Keybinds)
        this.dialogueWalker = new DialogueSystem.Walker()
        this.controllable = false

        scene.sprites.controllables.push(this)
    }

    /**
     * Start the dialogue on a specific dialogue block
     * @param scene The scene the function was called from
     * @param dialogue The dialogue to start
     * @param emitter The emitter to emit events to
     * @param endCallback Function to run once dialogue is finished
     * @returns 
     */
    start(
        scene: Phaser.Scene,
        dialogue: DialogueSystem.Dialogue,
        emitter: Phaser.Events.EventEmitter,
        registry: Phaser.Data.DataManager,
        endCallback?: () => void,
        timeout?: number
    ): void {
        if (this.controllable) return
        this.activeScene = scene
        this.endCallback = endCallback

        this.dialogueWalker.startWithNewDialogue(dialogue, emitter, registry)
        this.dialogueSprite.setVisible(true)
        if (timeout) {
            this.controllable = false
            this.baseScene.time.delayedCall(timeout, () => {
                this.stop()
            })
        } else {
            this.activeScene.sprites.setControllable(false)
            this.input.input.resetKeys()
            this.controllable = true
        }
        this.displayCurrentDialogue()
    }

    /**
     * Display the current dialogue based on the dialogue walker's state
     */
    displayCurrentDialogue(): void {
        if (this.dialogueWalker.state === DialogueSystem.WalkerState.CONTENT) {
            this.dialogueSprite.setText(this.dialogueWalker.getCurrentContent())
        } else if (this.dialogueWalker.state === DialogueSystem.WalkerState.OPTIONS) {
            let dialogueOptionsText = this.dialogueWalker.currentOptions
                //Format text properly
                .map((option, index) => `(${index + 1}) ${option.getOptionText(this.dialogueWalker.registry)}`)
                .join("\n")
            this.dialogueSprite.setText(dialogueOptionsText)
        }
    }

    /**
     * Handle input while the state is on content
     */
    handleContentInput(): void {
        if (this.input.checkIfKeyDown(Interactions.SUBMIT)) {
            this.input.input.resetKeys()
            this.dialogueWalker.progressContent()
            this.displayCurrentDialogue()
        }
    }

    /**
     * Handle input while the state is on options
     */
    handleOptionsInput(): void {
        if (this.input.checkIfKeyDown(Interactions.OPTION_1)) {
            this.dialogueWalker.chooseOption(0)
        } else if (this.input.checkIfKeyDown(Interactions.OPTION_2)) {
            this.dialogueWalker.chooseOption(1)
        } else if (this.input.checkIfKeyDown(Interactions.OPTION_3)) {
            this.dialogueWalker.chooseOption(2)
        } else {
            // If no valid key was chosen, exit
            return
        }
        this.displayCurrentDialogue()
    }

    /**
     * Handle input
     */
    control(): void {
        if (!this.controllable) return
        switch (this.dialogueWalker.state) {
            case DialogueSystem.WalkerState.CONTENT:
                this.handleContentInput()
                break;
            case DialogueSystem.WalkerState.OPTIONS:
                this.handleOptionsInput()
                break;
            case DialogueSystem.WalkerState.FINISHED:
                this.stop()
                break;
        }
        this.input.input.resetKeys()
    }

    /**
     * Stop the dialogue
     */
    stop(): void {
        this.controllable = false
        this.dialogueSprite.setVisible(false)
        this.activeScene.sprites.setControllable(true)
        if (this.endCallback !== undefined) this.endCallback()
    }

    setControllable(controllable: boolean): void {
        this.controllable = controllable
    }
}
