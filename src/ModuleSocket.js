import { ModuleAPI } from "./ModuleAPI.js";

export let moduleSocket;

/**
 *
 */
export function initializeSocket()
{
    moduleSocket = socketlib.registerModule("just-popcorn-initiative");
    moduleSocket.register("passTurnTo", passTurnTo);
    moduleSocket.register("closeRequestWindow", closeRequestWindow);
}

/**
 *
 * @param selectedCombatantId
 */
function passTurnTo(selectedCombatantId)
{
    const nextCombatant = game.combat.turns[game.combat.turn + 1];
    ModuleAPI.instance.swapCombatantTurn(selectedCombatantId, nextCombatant.id).then(async () =>
    {
        await game.combat.nextTurn();
        await moduleSocket.executeForEveryone("closeRequestWindow");
    }
    );
}

/**
 *
 */
function closeRequestWindow()
{
    ModuleAPI.instance.closeRequestWindow();
}