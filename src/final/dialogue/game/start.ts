import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "And so, with the Sacred Apple, Special Sauce, and... Illegal Sausages? The player cooked.",
            "And cooked some more.",
            "And as he completed his masterpiece...",
            "The deadline for Rordon Gamsey's holy ceremony of food arrived.",
            "Representatives from all tribes gathered to feed the ruler himself."
        ]
    },
    nextOptions: []
}

export const Dialogue = Base