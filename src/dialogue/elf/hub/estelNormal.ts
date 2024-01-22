import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Welcome to our quaint little village~",
            "Now feel free to explore the place while I prepare your trial.",
            "Don’t go too far, I would hate to see you wind up as a Goblins supper."
        ]
    },
    nextOptions: []
}

let Option1: Dialogue.Dialogue = {
    getOptionText() { return "Nah, I'd win" },
    getContentText() {
        return [
            "They would cause you a bit of trouble, I'm sure.",
            "Head over to the trialgiver when you're ready, young chef."
        ]
    },
    nextOptions: []
}


Base.nextOptions = [Option1]

export const ElfHubEstelNormalDialogue = {
    Dialogue: Base,
    Events
}