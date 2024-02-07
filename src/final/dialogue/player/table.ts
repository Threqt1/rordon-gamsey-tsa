import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Gamsey! I have made the ultimate dish!",
            "This is sure to satisfy you!",
            "I call it \"Elysian\", made with ingredients from all across the world!"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base