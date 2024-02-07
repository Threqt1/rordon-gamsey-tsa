import { DialogueSystem } from "../../../game/systems"

enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Not even being able to pass this simple trial...",
            "You aren't ready for the real world, dearie...",
            "Lay these foolish ambitions to rest."
        ]
    },
    nextOptions: []
}

Base.nextOptions = []

export const Lose = {
    Dialogue: Base,
    Events
}