import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "[TUTORIAL]",
            "[PRESS E ON PATTIES TO FLIP THEM WHEN THEY ARE READY]",
            "[FLIP AS MANY AS YOU CAN TO PLEASE THE ORC CHEF]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base