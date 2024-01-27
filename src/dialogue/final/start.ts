import { Dialogue } from ".."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "And so, with the pumpkin, apple, and sausages, the player cooked.",
            "And cooked some more.",
            "And as he finished, the deadline for Rordon Gamsey's holy feeding ceremony arrived.",
            "Representatives from all tribes gathered to feed the ruler himself."
        ]
    },
    nextOptions: []
}

export const FinalStartDialogue = {
    Dialogue: Base,
    Events
}