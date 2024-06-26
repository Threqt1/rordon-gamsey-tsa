/**
 * A dialogue object has three distinct parts:
 * Option - The text to be displayed when the dialogue is an option
 * Content - The actual content of the dialogue, displayed in succession when it's chosen
 * Options - THe rest of the options avaliable after all the content is displayed
 */

export type Dialogue = {
    canBeChosen?: (registry: Phaser.Data.DataManager) => boolean
    getOptionText: (registry: Phaser.Data.DataManager) => string
    getContentText: (registry: Phaser.Data.DataManager) => string[]
    /**
     * Ran when the dialogue's content has finished being displayed
     * @param registry The current game data manager
     * @param eventEmitter The dialogue's event emitter
     */
    getName: (registry: Phaser.Data.DataManager) => string
    dialogueFinished?: (registry: Phaser.Data.DataManager, eventEmitter: Phaser.Events.EventEmitter) => void
    /**
     * Ran when the dialogue has been started
     * @param registry The current game data manager
     * @param eventEmitter The dialogue's event emitter
     */
    dialogueStarted?: (registry: Phaser.Data.DataManager, eventEmitter: Phaser.Events.EventEmitter) => void
    nextOptions: Dialogue[]
}

export enum WalkerState {
    CONTENT,
    OPTIONS,
    FINISHED
}

/**
 * A utility class to iterate through dialogue, 
 */
export class Walker {
    currentDialogue!: Dialogue
    currentName!: string
    currentContent!: string[]
    currentContentPosition!: number
    currentOptions!: Dialogue[]

    emitter!: Phaser.Events.EventEmitter
    state!: WalkerState
    registry!: Phaser.Data.DataManager

    constructor() {

    }

    /**
     * Start walking a new dialogue, cleaning up from the old one
     * @param dialogue The new dialogue to walk
     * @param emitter The emitter for the new dialogue
     */
    startWithNewDialogue(dialogue: Dialogue, emitter: Phaser.Events.EventEmitter, registry: Phaser.Data.DataManager) {
        this.emitter = emitter
        this.state = WalkerState.CONTENT
        this.registry = registry

        this.switchToNewBlock(dialogue)
    }

    /**
     * Switch the walker to a new dialogue block
     * @param dialogue The dialogue to start
     */
    switchToNewBlock(dialogue: Dialogue): void {
        this.currentDialogue = dialogue
        this.currentName = this.currentDialogue.getName(this.registry)
        this.currentContent = this.currentDialogue.getContentText(this.registry)
        this.currentContentPosition = 0
        this.currentOptions = this.getAvaliableOptions();

        this.state = WalkerState.CONTENT
    }

    getAvaliableOptions() {
        let availableOptions: Dialogue[] = []

        for (let option of this.currentDialogue.nextOptions) {
            if (option.canBeChosen !== undefined && !option.canBeChosen(this.registry)) continue
            availableOptions.push(option)
        }

        return availableOptions
    }

    /**
     * Continue iterating through the current dialogue's content
     */
    progressContent(): void {
        this.currentContentPosition++
        if (this.currentContentPosition < this.currentContent.length) return
        if (this.currentDialogue.dialogueFinished != undefined) this.currentDialogue.dialogueFinished(this.registry, this.emitter)
        if (this.currentOptions.length > 0) {
            this.state = WalkerState.OPTIONS
        } else {
            this.state = WalkerState.FINISHED
        }
    }

    /**
     * Choose an option out of the current options
     * @param index The index of the option in the currentOptions array
     */
    chooseOption(index: number): void {
        if (index >= this.currentOptions.length) return
        let selectedDialogue = this.currentOptions[index]!
        this.switchToNewBlock(selectedDialogue)
    }

    /**
     * Get the current content based on the internal content position
     * @returns The content
     */
    getCurrentContent(): string {
        return this.currentContent[this.currentContentPosition]
    }
}


