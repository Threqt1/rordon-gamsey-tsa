import { Dialogue } from "../../"

export enum TeleporterDialogueEventNames {
    TELEPORT = "teleport"
}

export type TeleporterDialogueEvents = {
    [TeleporterDialogueEventNames.TELEPORT]: [],
}

export class TeleporterDialogueEmitter extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    override emit<K extends keyof TeleporterDialogueEvents>(
        eventName: K,
        ...args: TeleporterDialogueEvents[K]
    ): boolean {
        return super.emit(eventName, ...args)
    }

    override once<K extends keyof TeleporterDialogueEvents>(
        eventName: K,
        listener: (...args: TeleporterDialogueEvents[K]) => void
    ): this {
        return super.once(eventName, listener)
    }
}

let Base: Dialogue<TeleporterDialogueEmitter> = {
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

let Teleport: Dialogue<TeleporterDialogueEmitter> = {
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

let MoreElfInfo: Dialogue<TeleporterDialogueEmitter> = {
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