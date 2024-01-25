import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Help! Help! Please help me!"
        ]
    },
    nextOptions: []
}

let Option1: Dialogue.Dialogue = {
    getOptionText() { return "What's wrong?" },
    getContentText() {
        return [
            "Goblins! They took the apple I collected from the woods!",
            "I got it from the \"Great Branch\" too...",
            "Please, get it back!"
        ]
    },
    nextOptions: []
}

let Option2: Dialogue.Dialogue = {
    getOptionText() { return "Great Branch?" },
    getContentText() {
        return [
            "The Great branch was a gift of Xuiye!",
            "It grants us with a beautiful apple after every winter solstice...",
            "If the goblins take its fruit, Xuiye will disgrace us!",
            "Please, get it back!"
        ]
    },
    nextOptions: []
}

let Option3: Dialogue.Dialogue = {
    getOptionText() { return "You have my word." },
    getContentText() {
        return [
            "Thank you, thank you, thank you!",
            "Follow this path, you will find their chasm.",
            "Please be careful, they are vicious fiends..."
        ]
    },
    nextOptions: []
}


Base.nextOptions = [Option1]
Option1.nextOptions = [Option2, Option3]
Option2.nextOptions = [Option3]

export const GoblinMinigameTeleporterDialogue = {
    Dialogue: Base,
    Events
}