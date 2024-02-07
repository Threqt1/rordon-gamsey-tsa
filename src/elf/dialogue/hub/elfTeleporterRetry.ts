import { DialogueSystem } from "../../../game/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "You're back again?~",
            "Well, I respect the dedication!",
            "Are you ready to try again?",
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "Let me try again!" },
    getContentText() {
        return [
            "Very well!"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1]

export const Dialogue = Base