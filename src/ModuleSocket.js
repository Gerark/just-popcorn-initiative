import { ModuleAPI } from "./ModuleAPI.js";
import { performSwap } from "./InitiativeSwapper.js";
import { Constants } from "./ModuleUtils.js";

export let moduleSocket;

/**
 *
 */
export function initializeSocket()
{
    moduleSocket = socketlib.registerModule(Constants.ModuleName);
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