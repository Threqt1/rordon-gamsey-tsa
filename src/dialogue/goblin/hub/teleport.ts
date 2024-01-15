import { Dialogue } from "../../"

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Ah, so you want to retrieve the fruit those goblins stole from me?",
            "Beware, their cave is full of the trickery expected of their kind",
            "Are you sure you want to go?"
        ]
    },
    nextOptions: []
}

let Teleport: Dialogue.Dialogue = {
    getOptionText() { return "Yes, teleport me!" },
    getContentText() {
        return [
            "Good luck, Mr. Chef."
        ]
    },
    nextOptions: []
}

let MoreGoblinInfo: Dialogue.Dialogue = {
    getOptionText() { return "Tell me more about the Goblin Cave. " },
    getContentText() {
        return [
            "The Goblins have been the scourge of this planet for ages.",
            "They steal food from all the other tribes, hiding it away.",
            "They store this food in deep underground cave networks.",
            "The one they put my masterpiece in is a smaller-scale one.",
            "Don't underestimate the difficuly though."
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Teleport, MoreGoblinInfo]
Teleport.nextOptions = []
MoreGoblinInfo.nextOptions = [Teleport]

export const GoblinHubTeleporterDialogue = {
    Dialogue: Base,
    Events
}