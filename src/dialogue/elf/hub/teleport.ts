import { Dialogue } from "../../"

export enum TeleporterDialogueEventNames {
    TELEPORT = "teleport"
}

export type TeleporterDialogueEvents = {
    [TeleporterDialogueEventNames.TELEPORT]: [],
}

let Base: Dialogue = {
    getOptionText() { return "" },
    getDialogueText() {
        return [
            "I see.",
            "You've decided to take my challenge.",
            "Good luck, Mr. Chef.",
            "Do you have any questions before I send you?"
        ]
    },
    next: []
}

let Teleport: Dialogue = {
    getOptionText() { return "No, teleport me!" },
    getDialogueText() {
        return [
            "Alright, safe travels."
        ]
    },
    choose(_, eventEmitter) {
        eventEmitter.emit(TeleporterDialogueEventNames.TELEPORT)
    },
    next: []
}

let MoreElfInfo: Dialogue = {
    getOptionText() { return "Tell me more about Elf Land. " },
    getDialogueText() {
        return [
            "Elf Land is a lush grassland that has been our home for decades.",
            "We elves enjoy farming the rich soil for various crops.",
            "The wildlife coexists with us, and we forbid meat, unlike the other dirty chefs.",
            "I hope you enjoy the highest quality vegetables in Elf Land."
        ]
    },
    next: []
}

Base.next = [Teleport, MoreElfInfo]
Teleport.next = []
MoreElfInfo.next = [Teleport]
export const TeleportDialogue = Base