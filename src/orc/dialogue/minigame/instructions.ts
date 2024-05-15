import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "NARRATOR" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "[TUTORIAL]",
            "[USE WASD TO MOVE THE SELECTED GRILL SPOT]",
            "[PRESS E ON PATTIES TO FLIP THEM WHEN THEY ARE READY]",
            "[FLIP AS MANY AS YOU CAN TO PLEASE THE ORC CHEF]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base