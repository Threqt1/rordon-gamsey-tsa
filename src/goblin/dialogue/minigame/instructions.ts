import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "[TUTORIAL]",
            "[SNEAK THROUGH THE CAVE, AVOIDING THE BLUE LIGHTS]",
            "[OBTAIN THE APPLE AND SAUSAGES WHILE ESCAPING TO WIN]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base