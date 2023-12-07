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

let Base: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "return" },
    getDialogueText() {
        return [
            "this is the test dialogue system use enter to move through the dialogue",
            "there can be multiple dialogues in one block",
            "use the 1, 2, or 3 buttons to select the options coming u[ next"
        ]
    },
    next: []
}

let Option1: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "heres the first option" },
    getDialogueText() {
        return [
            "you picked the first option",
            "great job",
            "let's redirect you back"
        ]
    },
    next: []
}

let Option2: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "heres the second option" },
    getDialogueText() {
        return [
            "you picked the second option",
            "event greater job",
            "let's redirect you back"
        ]
    },
    next: []
}

let Option3: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "heres the third option" },
    getDialogueText() {
        return [
            "you picked the third option",
            "greatest job",
            "let's redirect you back"
        ]
    },
    next: []
}

let Leave: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "exit" },
    getDialogueText() { return ["see you later"] },
    next: []
}

Base.next = [Option1, Option2, Option3]
Option1.next = [Base, Leave]
Option2.next = [Base, Leave]
Option3.next = [Base, Leave]

export const TestDialogue = Base



// export const TestDialogue: Dialogue<TestDialogueEmitter> = {
//     getOptionText() { return "" },
//     getDialogueText() { return ["hello", "good job making it this far"] },
//     next: [
//         {
//             getOptionText() { return "op1" },
//             getDialogueText() { return ["good job1"] },
//             next: []
//         },
//         {
//             getOptionText() { return "op2" },
//             getDialogueText() { return ["good job2"] },
//             next: []
//         },
//         {
//             getOptionText() { return "op3" },
//             getDialogueText() { return ["good job3"] },
//             next: []
//         }
//     ]
// }

