import { ModuleAPI } from "./ModuleAPI.js";

export let moduleSocket;

/**
 *
 */
export function initializeSocket()
{
    moduleSocket = socketlib.registerModule("just-popcorn-initiative");
    moduleSocket.register("passTurnTo", passTurnTo);
    moduleSocket.register("closeSelectionWindow", closeSelectionWindow);
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
        await moduleSocket.executeForEveryone("closeSelectionWindow");
    }
    );
}

/**
 *
 */
function closeSelectionWindow()
{
    ModuleAPI.instance.closeSelectionWindow();
}