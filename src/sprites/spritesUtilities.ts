/**
 * Enum for the cardinal directions
 */
export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

/**
 * Check if an interacting body is inside the zone
 * @param zone The zone to check
 * @returns If an interacting body is in the zone or not
 */
export function isInsideZone(zone: Phaser.GameObjects.Zone): boolean {
    let body = zone.body as Phaser.Physics.Arcade.Body
    let touching = !body.touching.none
    let wasTouching = !body.wasTouching.none
    let embedded = body.embedded

    if (touching && !wasTouching || touching && wasTouching || embedded) {
        return true
    }

    return false
}
