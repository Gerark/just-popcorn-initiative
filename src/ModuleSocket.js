import { ModuleAPI } from "./ModuleAPI.js";
import { performSwap } from "./InitiativeSwapper.js";

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
    performSwap(selectedCombatantId, combatId);
}

/**
 *
 */
function closeSelectionWindow()
{
    ModuleAPI.instance.closeSelectionWindow();
}