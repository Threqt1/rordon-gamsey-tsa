import { Dialogue } from "../../"

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "I see.",
            "You've decided to take my challenge.",
            "Good luck, Mr. Chef.",
            "Do you have any questions before I send you?"
        ]
    },
    nextOptions: []
}

let Teleport: Dialogue.Dialogue = {
    getOptionText() { return "No, teleport me!" },
    getContentText() {
        return [
            "Alright, safe travels."
        ]
    },
    nextOptions: []
}

let MoreElfInfo: Dialogue.Dialogue = {
    getOptionText() { return "Tell me more about Elf Land. " },
    getContentText() {
        return [
            "Elf Land is a lush grassland that has been our home for decades.",
            "We elves enjoy farming the rich soil for various crops.",
            "The wildlife coexists with us, and we forbid meat, unlike the other dirty chefs.",
            "I hope you enjoy the highest quality vegetables in Elf Land."
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Teleport, MoreElfInfo]
Teleport.nextOptions = []
MoreElfInfo.nextOptions = [Teleport]

export default {
    Dialogue: Base,
    Events
}