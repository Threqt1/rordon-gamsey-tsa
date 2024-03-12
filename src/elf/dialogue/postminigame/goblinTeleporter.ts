import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Help! Help! Please help me!"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "What's wrong?" },
    getContentText() {
        return [
            "Goblins! They stole the Sacred Apple!",
            "Please, get it back!"
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getOptionText() { return "THATS MY APPLE!!!" },
    getContentText() {
        return [
            "STOP YELLING AT ME!!!",
            "JUST GET IT BACK!!!!!!"
        ]
    },
    nextOptions: []
}

let Option3: DialogueSystem.Dialogue = {
    getOptionText() { return "You have my word." },
    getContentText() {
        return [
            "The switch-up is crazy... but thank you.",
            "Follow this path, you will find their chasm.",
            "Maybe you can steal their sausage too - it's top tier, y'know."
        ]
    },
    nextOptions: []
}


Base.nextOptions = [Option1]
Option1.nextOptions = [Option2]
Option2.nextOptions = [Option3]

export const Dialogue = Base