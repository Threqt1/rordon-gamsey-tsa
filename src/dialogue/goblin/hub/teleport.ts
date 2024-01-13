import { Dialogue } from "../../"

export enum TeleporterDialogueEventNames {
}

export type TeleporterDialogueEvents = {
}

let Base: Dialogue = {
    getOptionText() { return "" },
    getDialogueText() {
        return [
            "Ah, so you want to retrieve the fruit those goblins stole from me?",
            "Beware, their cave is full of the trickery expected of their kind",
            "Are you sure you want to go?"
        ]
    },
    next: []
}

let Teleport: Dialogue = {
    getOptionText() { return "Yes, teleport me!" },
    getDialogueText() {
        return [
            "Good luck, Mr. Chef."
        ]
    },
    next: []
}

let MoreGoblinInfo: Dialogue = {
    getOptionText() { return "Tell me more about the Goblin Cave. " },
    getDialogueText() {
        return [
            "The Goblins have been the scourge of this planet for ages.",
            "They steal food from all the other tribes, hiding it away.",
            "They store this food in deep underground cave networks.",
            "The one they put my masterpiece in is a smaller-scale one.",
            "Don't underestimate the difficuly though."
        ]
    },
    next: []
}

Base.next = [Teleport, MoreGoblinInfo]
Teleport.next = []
MoreGoblinInfo.next = [Teleport]
export const TeleportDialogue = Base