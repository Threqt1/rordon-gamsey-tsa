import { DialogueSystem } from "../../../game/systems"

enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Ah, there you are~",
            "I was worried you ran off after meeting Estel!",
            "Are you ready to begin?",
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "Wait, what is this trial exactly?" },
    getContentText() {
        return [
            "Hm...?",
            "Oh, it's a small test of courage that children undergo.",
            "It's meant to prove their might before they go into the woods alone."
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getOptionText() { return "What's in the woods?" },
    getContentText() {
        return [
            "Goblins...",
            "To be precise, small little cretins that have no understanding of when a joke goes too far...",
            "Hmph!",
            "Not that a big, strong chef like you has to be worried...",
            "Now, let's begin."
        ]
    },
    nextOptions: []
}

let Option3: DialogueSystem.Dialogue = {
    getOptionText() { return "Let's go" },
    getContentText() {
        return [
            "So excited, like a child...",
            "How cute~",
            "You're a man on a mission, I won't hold you too long.",
            "Allow us to begin!"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1, Option3]
Option1.nextOptions = [Option2]
Option2.nextOptions = [Option3]

export const Teleporter = {
    Dialogue: Base,
    Events
}

enum Events1 {
}

let Base1: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "You're back again?~",
            "Well, I respect the dedication!",
            "Are you ready to try again?",
        ]
    },
    nextOptions: []
}

let Option1_1: DialogueSystem.Dialogue = {
    getOptionText() { return "Let me try again!" },
    getContentText() {
        return [
            "Very well!"
        ]
    },
    nextOptions: []
}

Base1.nextOptions = [Option1_1]

export const TeleporterRetry = {
    Dialogue: Base1,
    Events1
}