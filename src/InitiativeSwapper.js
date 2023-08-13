import { ModuleUtils, NotificationUtils, ReasonType } from "./ModuleUtils.js";
import { moduleSocket } from "./ModuleSocket.js";

/**
 *
 * @param nextCombatantId
 *
 * @param combatId
 */
export function performSwap(nextCombatantId, combatId)
{
    const { combat, first, second, reason } = _prepareSwapCombatant(combatId, nextCombatantId);
    if (reason !== ReasonType.None)
    {
        NotificationUtils.notify(reason);
        throw new Error("Error", { cause: reason });
    }

    _swapCombatantTurn(first, second, combat).then(async () =>
    {
        await combat.nextTurn();
        await moduleSocket.executeForEveryone("closeSelectionWindow");
    }
    );
}

/**
 *
 * @param combatId
 *
 * @param nextCombatantId
 */
function _prepareSwapCombatant(combatId, nextCombatantId)
{
    let reason = ReasonType.None;
    let combat = null, first = null, second = null;

    combat = ModuleUtils.getCombatById(combatId);
    if (!combat)
    {
        reason = ReasonType.EndTurnInvalidCombat;
    }
    else
    {
        first = ModuleUtils.getCombatantById(combat, nextCombatantId);
        if (first == null)
        {
            reason = ReasonType.EndTurnInvalidSelectedCombatant;
        }
        else if (combat.turn + 1 > combat.turns.length - 1)
        {
            reason = ReasonType.EndTurnLastOrSecondLast;
        }
        else
        {
            second = combat.turns[combat.turn + 1];
        }
    }

    return { combat, first, second, reason };
}

/**
 *
 * @param firstCombatant
 *
 * @param secondCombatant
 *
 * @param combat
 */
async function _swapCombatantTurn(firstCombatant, secondCombatant, combat)
{
    if (secondCombatant.id !== firstCombatant.id)
    {
        const currentCombatant = combat.turns[combat.turn];
        if (secondCombatant.initiative === firstCombatant.initiative ||
       secondCombatant.initiative >= currentCombatant.initiative)
        {
            await _rearrangeCombatants(combat);
        }

        const secondInitiative = secondCombatant.initiative;
        await secondCombatant.update({ initiative: firstCombatant.initiative });
        await firstCombatant.update({ initiative: secondInitiative });
    }
}

/**
 *
 * @param combat
 */
async function _rearrangeCombatants(combat)
{
    let currentInitiative = combat.turns.length * 10;
    for (let i = 0; i < combat.turns.length; i++)
    {
        const combatant = combat.turns[i];
        await combatant.update({ initiative: currentInitiative });
        currentInitiative -= 10;
    }
}