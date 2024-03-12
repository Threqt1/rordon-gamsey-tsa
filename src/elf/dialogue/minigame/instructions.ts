import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "[TUTORIAL]",
            "[PRESS THE KEYS UNDER EACH FRUIT TO SLICE IT]",
            "[COMPLETELY SLICE ALL THE FRUITS IN EACH LEVEL TO WIN]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base