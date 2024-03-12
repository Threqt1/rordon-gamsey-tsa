import { DialogueSystem } from "../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "[Use E to interact with objects, including progressing through dialogue]",
            "[Use W, A, S, and D to move your character]",
            "[Use number keys (1, 2, 3, etc.) to choose options during dialogue]",
            "...",
            "Elysian - a place of peace, prosperity, and most importantly - cooking.",
            "A place where three races lived in harmony... until Rordon Gamsey appeared.",
            "The vile dragon conquered Elysian in his quests for dishes to satisfy him.",
            "Ervin - Elysian's master chef - attempted to rise to this challenge...",
            "But was soundly defeated by Ramsey's unparalleled picky eating...",
            "Now, Elysian's only hope - Ervin's son - must search far and wide...",
            "FOR A DISH TO SATIATE RORDON GAMSEY!!!",
        ]
    },
    nextOptions: []
}

export const Dialogue = Base