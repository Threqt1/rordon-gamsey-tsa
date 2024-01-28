import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Gamsey, sir!",
            "\"Sausage\", straight from cave!",
            "Please eat all of it!"
        ]
    },
    nextOptions: []
}

export const FinalGoblinTableDialogue = {
    Dialogue: Base,
    Events
}