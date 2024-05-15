import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "GOBLIN CHEF" },
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