/**
 *
 * @param message
 */
export function moduleMessage(message)
{
    return `Popcorn Initiative - ${message}`;
}

/**
 *
 * @param message
 */
export function errorNotification(message)
{
    ui.notifications.error(moduleMessage(message));
}

/**
 *
 * @param message
 */
export function errorPromise(message)
{
    return new Promise(() => { throw new Error(message); });
}

/**
 *
 * @param message
 */
export function warningNotification(message)
{
    ui.notifications.warn(moduleMessage(message));
}

/**
 *
 * @param combatId
 *
 * @param combat
 *
 * @param combatantId
 */
export function getCombatantById(combat, combatantId)
{
    return combat.turns.find((x) => { return x.id === combatantId; });
}

/**
 *
 * @param combatId
 */
export function getCombatById(combatId)
{
    return game.combats.get(combatId);
}