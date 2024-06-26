import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "ORC CHEF" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "Ol' geezer Gamsey,",
            "Try our sauce this year, will ya?",
            "Come on... give it a shot!"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base