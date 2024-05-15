import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "ORC HEAD CHEF" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "WHOA!!!",
            "Now, what happened to you?!"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getName(_) { return "ORC HEAD CHEF" },
    getOptionText() { return "I want to defeat Gamsey!" },
    getContentText() {
        return [
            "YOU JUST CAME BARELLIN' DOWN ME RAILROAD!!!",
            "WHATCHA MEAN YOU WANNA DEFEAT GAMSEY????"
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getName(_) { return "ORC HEAD CHEF" },
    getOptionText() { return "I want to defeat Gamsey!" },
    getContentText() {
        return [
            "Such dedication... I am truly impressed...",
            "Hmmm... yes... you are qualified for my inheritance..."
        ]
    },
    nextOptions: []
}

let Option3: DialogueSystem.Dialogue = {
    getName(_) { return "ORC HEAD CHEF" },
    getOptionText() { return "Old man, are you okay?" },
    getContentText() {
        return [
            "I'm alright... I'M PERFECTLY FINE!!",
            "You want to defeat Gamsey? Very well...",
            "Enter me chef's hut to my left...",
            "If you can survive a day on the line...",
            "I'll give you my [SPECIAL SAUCE]"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1]
Option1.nextOptions = [Option2]
Option2.nextOptions = [Option3]

export const Dialogue = Base