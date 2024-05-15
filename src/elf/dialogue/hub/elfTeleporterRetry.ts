import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "CARETAKER" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "You again?",
            "You failed our simple trial...",
            "Why would we give you our Apple?"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getName(_) { return "CARETAKER" },
    getOptionText() { return "Let me try again!" },
    getContentText() {
        return [
            "...",
            "I guess I can make an exception..."
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1]

export const Dialogue = Base