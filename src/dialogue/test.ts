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
    getOptionText() { return "Bozo" },
    getDialogueText() {
        return [
            "Howdy Mr. Chef",
            "You have stumbled into my abode",
            "Time for questioning",
        ]
    },
    next: []
}
let Option1: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "Bread" },
    getDialogueText() {
        return [
            "So",
            "You like bread you say",
            "But what do you really know?",
        ]
    },
    next: []
}
let Option2: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "Flour" },
    getDialogueText() {
        return [
            "So",
            "Your a flour kinda guy?",
            "Never woulda guessed",
            "But what's your real knowledge?",
        ]
    },
    next: []
}
let Option12: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "Butter" },
    getDialogueText() {
        return [
            "Butter serves as a leavening agent",
            "Additionally it provides moisture",
            "It also supplies texture and flavor",
            "And makes your dough \"BUTTERY\" smooth"
        ]
    },
    next: []
}
let Option22: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "Bread Flour" },
    getDialogueText() {
        return [
            "Of all the flour types",
            "Bread flour contain the highets gluten content",
            "Gluten in flour promotes elasticity in the dough",
            "strengthens and is the fundamentals of bread dough",
        ]
    },
    next: []
}
let Leave: Dialogue<TestDialogueEmitter> = {
    getOptionText() { return "Farewell Mr." },
    getDialogueText() {
        return [
            "May the dough serve you well!"
        ]
    },
    next: []
}

Base.next = [Option1, Option2]
Option1.next = [Option12, Leave]
Option2.next = [Option22, Leave]
Option12.next = [Option1, Leave]
Option22.next = [Option2, Leave]
export const TestDialogue = Base

// let Base: Dialogue<TestDialogueEmitter> = {
//     getOptionText() { return "return" },
//     getDialogueText() {
//         return [
//             "this is the test dialogue system use E to move through the dialogue",
//             "there can be multiple dialogues in one block",
//             "use the 1, 2, or 3 buttons to select the options coming up next",
//         ]
//     },
//     next: []
// }

// let Option1: Dialogue<TestDialogueEmitter> = {
//     getOptionText() { return "heres the first option" },
//     getDialogueText() {
//         return [
//             "you picked the first option",
//             "great job",
//             "let's redirect you back"
//         ]
//     },
//     next: []
// }

// let Option2: Dialogue<TestDialogueEmitter> = {
//     getOptionText() { return "heres the second option" },
//     getDialogueText() {
//         return [
//             "you picked the second option",
//             "event greater job",
//             "let's redirect you back"
//         ]
//     },
//     next: []
// }

// let Option3: Dialogue<TestDialogueEmitter> = {
//     getOptionText() { return "heres the third option" },
//     getDialogueText() {
//         return [
//             "you picked the third option",
//             "greatest job",
//             "let's redirect you back"
//         ]
//     },
//     next: []
// }

// let Leave: Dialogue<TestDialogueEmitter> = {
//     getOptionText() { return "exit" },
//     getDialogueText() { return ["see you later"] },
//     next: []
// }

// Base.next = [Option1, Option2, Option3]
// Option1.next = [Base, Leave]
// Option2.next = [Base, Leave]
// Option3.next = [Base, Leave]

// export const TestDialogue = Base