import { Dialogue } from "../../"

enum Events {
}

let Base: Dialogue.Dialogue = {
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

export const ElfMinigameLoseDialogue = {
    Dialogue: Base,
    Events
}