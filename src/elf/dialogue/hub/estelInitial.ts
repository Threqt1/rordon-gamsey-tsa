import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Hm?... ah, the young chef himself.",
            "I am Estel, representative of the elves.",
            "I knew your father, Ervin - a fine man. How may I help you?"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "I want to defeat Gamsey!" },
    getContentText() {
        return [
            "Defeat Gamsey? A bold aspiration.",
            "The elves will stand with you on one condition.",
            "Prove your worth!"
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getOptionText() { return "How?" },
    getContentText() {
        return [
            "Talk to the Caretaker, the one in charge of the young.",
            "If you pass the test all elves take in their youth...",
            "We might support you!",
            "She is up near the campfire. Good luck!"
        ]
    },
    nextOptions: []
}

let Option3: DialogueSystem.Dialogue = {
    getOptionText() { return "Where are the other elves?" },
    getContentText() {
        return [
            "...",
            "Next question, please."
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1, Option3]
Option1.nextOptions = [Option2]
Option3.nextOptions = [Option1]

export const Dialogue = Base