import { DialogueSystem } from "../../../game/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
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

export const Dialogue = Base