import { Dialogue } from ".";

export enum TestDialogueEventNames {
    OPTION_1 = "op1",
    OPTION_2 = "op2",
    OPTION_3 = "op3"
}

export type TestDialogueEvents = {
    [TestDialogueEventNames.OPTION_1]: [],
    [TestDialogueEventNames.OPTION_2]: [],
    [TestDialogueEventNames.OPTION_3]: []
}

export class TestDialogueEmitter extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    override emit<K extends keyof TestDialogueEvents>(
        eventName: K,
        ...args: TestDialogueEvents[K]
    ): boolean {
        return super.emit(eventName, ...args)
    }

    override once<K extends keyof TestDialogueEvents>(
        eventName: K,
        listener: (...args: TestDialogueEvents[K]) => void
    ): this {
        return super.once(eventName, listener)
    }
}

export const TestDialogue: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "" },
    getDialogueText() { return ["hello", "good job making it this far"] },
    next: [
        {
            getOptionText() { return "op1" },
            getDialogueText() { return ["good job1"] },
            next: []
        },
        {
            getOptionText() { return "op2" },
            getDialogueText() { return ["good job2"] },
            next: []
        },
        {
            getOptionText() { return "op3" },
            getDialogueText() { return ["good job3"] },
            next: []
        }
    ]
}