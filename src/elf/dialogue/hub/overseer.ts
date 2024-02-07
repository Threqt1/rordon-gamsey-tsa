import { DialogueSystem } from "../../../game/systems"
import { ElfHubScene } from "../../scenes"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Hm? Who are you?"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "I'm Ervin's son, Estel brought me here to face a trial." },
    getContentText() {
        return [
            "With what? Finding a lady that'll put up with that ugly mug?",
            "Because I'm sorry, that ain't happening"
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getOptionText() { return "Really..." },
    getContentText() {
        return [
            "What? Just sayin' the truth."
        ]
    },
    nextOptions: []
}

let Option3: DialogueSystem.Dialogue = {
    getOptionText() { return "Also, the kid out front said to talk to you." },
    canBeChosen(registry) {
        return (registry.values as ElfHubScene.SceneData).talkedToPochi === true
    },
    getContentText() {
        return [
            "Pochi? About What?",
            "Every time I try to talk to him, he runs off and cries to Estel.",
            "Then, she comes and harrases me!"
        ]
    },
    nextOptions: []
}

let Option4: DialogueSystem.Dialogue = {
    getOptionText() { return "He said you were old and know a lot." },
    getContentText() {
        return [
            "Im gonna ignore the first part...",
            "But what do you want to know about?"
        ]
    },
    nextOptions: []
}

let Option5: DialogueSystem.Dialogue = {
    getOptionText() { return "Is Xuiye real?" },
    getContentText() {
        return [
            "Nah, not that I know of.",
            "Our people needed something to believe in, and we thought a gentle soverign would do just fine.",
            "It's important to protect the dreams of the innocent before that hunk'a lard rips em' away."
        ]
    },
    nextOptions: []
}

let Option6: DialogueSystem.Dialogue = {
    getOptionText() { return "What happened to Estel before Gamsey took over?" },
    getContentText() {
        return [
            "Look, I get your curiosity, but I trust Estel.",
            "In spite of her vanity, she's a good lady in a world that's been against her in every way.",
            "If you need to know...",
            "Long before that old piece'a jelly took his seat, Estel was part of the decision process to set him free of the chains.",
            "I don't know the details, I was a young soldier and she was my commander.",
            "She could've told me to set the world on fire and I would have done it.",
            "It ain't my place to sell her secrets, sorry."
        ]
    },
    nextOptions: []
}


Base.nextOptions = [Option1]
Option1.nextOptions = [Option2]
Option2.nextOptions = [Option3]
Option3.nextOptions = [Option4]
Option4.nextOptions = [Option5, Option6]

export const Dialogue = Base