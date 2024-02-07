import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Hello, travelling chef!",
            "I have to say, I've never seen you before",
            "What brings you here?"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "Estel agreed to help me if I did some trial." },
    getContentText() {
        return [
            "Ah... I'm sorry to hear that.",
            "But don't be too worried!",
            "Aunt Estel may be crude, sassy, vain, uncouth, mischevious, sarcastic, and...",
            "Well, you get the point.",
            "But, I don't think she's malicious at heart."
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getOptionText() { return "Uh huh..." },
    getContentText() {
        return [
            "Really, i mean it!",
            "She's been around for quie some time.",
            "I doubt anyone can see that much carnage without losing their sense of formality."
        ]
    },
    nextOptions: []
}

let Option3: DialogueSystem.Dialogue = {
    getOptionText() { return "Carnage?" },
    getContentText() {
        return [
            "Whoops, I've said too much.",
            "If you want to know more, speak to that old man - The Overseer.",
            "He's also really, really, REALLY old!"
        ]
    },
    nextOptions: []
}

let Option4: DialogueSystem.Dialogue = {
    getOptionText() { return "Just looking around..." },
    getContentText() {
        return [
            "If that's the case, want me to tell you about our history?",
            "I know we may seem cunning and mischevious, but I can assure you -",
            "We have QUITE the history."
        ]
    },
    nextOptions: []
}

let Option5: DialogueSystem.Dialogue = {
    getOptionText() { return "Sure." },
    getContentText() {
        return [
            "Great! Alright, sit tight...",
            "*clears throat*",
            "Long ago before Gamsey took the throne, there were the Eight Sovereigns of Elysian.",
            "They looked over all the beings and sought to maintain a never ending peace.",
            "Amongst the eight, the third was named Xuiye.",
            "She believed in everlasting joy and in the existence of goodness in all.",
            "She blessed our kind with our magic and still looks over us in spirit",
            "It is even believed all our crops are the \"body\" of Xuiye.",
            "That sounds kind of disgusting, though."
        ]
    },
    nextOptions: []
}

let Option6: DialogueSystem.Dialogue = {
    getOptionText() { return "Is that all real?" },
    getContentText() {
        return [
            "Well, it's real to us.",
            "I mean, how else would we be able to perform magic?",
            "You should really speak to the Overseer, he's way better at this stuff.",
            "He's Aunt Estel's friend, and he's really old.",
            "He probably knows way more."
        ]
    },
    nextOptions: []
}

let Option7: DialogueSystem.Dialogue = {
    getOptionText() { return "Alright, I'll be off now." },
    getContentText() {
        return [
            "Goodbye!"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1, Option4]
Option1.nextOptions = [Option2]
Option2.nextOptions = [Option3]
Option3.nextOptions = [Option7]
Option4.nextOptions = [Option5]
Option5.nextOptions = [Option6]
Option6.nextOptions = [Option7]

export const Dialogue = Base