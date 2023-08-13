import { ModuleAPI } from "./ModuleAPI.js";
import { errorNotification, getCombatById } from "./ModuleUtils.js";

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
 *
 * @param combatId
 */
function passTurnTo(selectedCombatantId, combatId)
{
    const combat = getCombatById(combatId);
    if (!combat)
    {
        errorNotification("A request to end turn can't be performed. The combatId provided is not valid");
        return;
    }

    const nextCombatant = combat.turns[combat.turn + 1];
    ModuleAPI.instance.swapCombatantTurn(selectedCombatantId, nextCombatant.id, combat).then(async () =>
    {
        await combat.nextTurn();
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