import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "CARETAKER" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "Ah, Ervin's son? The similarities are evident.",
            "Estel told me you were coming.",
            "Are you ready to start?"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getName(_) { return "CARETAKER" },
    getOptionText() { return "What is this \"trial\"?" },
    getContentText() {
        return [
            "Oh, just a small test of reflexes.",
            "After all, exploring the woods does require a bit of skill.",
            "If you finish, I wouldn't be opposed to giving you some of our Fruits."
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getName(_) { return "CARETAKER" },
    getOptionText() { return "Let's go" },
    getContentText() {
        return [
            "As you wish...",
            "Prepare yourself, young chef...",
            "Show me those skills your father taught you!"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1, Option2]
Option1.nextOptions = [Option2]

export const Dialogue = Base