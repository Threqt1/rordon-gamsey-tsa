import { Dialogue } from "../../"

export enum Events {
    END = "end"
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "I-I've been beat...",
            "Mr. Chef, you've mastered the art of the knife.",
            "I have never seen this level of skil... it's one in a thousand.",
            "Take this - the heirloom of the elves.",
            "Grown in seclusion by the high elves themselves, it's the pinnacle of elf cultivation.",
            "Now go, Master Chef, and make something to appease Rordon Gamsey."
        ]
    },
    dialogueFinished(_, emitter) {
        emitter.emit(Events.END)
    },
    nextOptions: []
}

export default {
    Dialogue: Base,
    Events
}