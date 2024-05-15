import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "NARRATOR" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "[TUTORIAL]",
            "[SNEAK THROUGH THE CAVE, AVOIDING THE BLUE LIGHTS AND VOIDS]",
            "[USE THE LADDERS TO PROGRESS BETWEEN STAGES]",
            "[OBTAIN THE APPLE AND SAUSAGES AND ESCAPE BACK TO THE ENTRANCE TO WIN]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base