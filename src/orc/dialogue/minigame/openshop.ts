import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Alright, open shop!"
        ]
    },
    nextOptions: []
}

Base.nextOptions = []

export const Dialogue = Base