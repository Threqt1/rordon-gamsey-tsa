import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Gamsey, sir!",
            "\"Sausage\", straight from cave!",
            "Freshly stol- borrowed from other!",
            "Please eat all it!"
        ]
    },
    nextOptions: []
}

export const FinalGoblinTableDialogue = {
    Dialogue: Base,
    Events
}