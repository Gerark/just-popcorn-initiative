import { derived, writable } from "svelte/store";
import { ModuleUtils } from "./ModuleUtils.js";
import getToolboxActions from "./ToolboxActions.js";

export const selectableCombatants = writable([]);
export const previousCombatants = writable([]);
export const isSelectionWindowHovered = writable(false);
export const isTokenPickerRunning = writable(false);
export const previousActorsDrawerOpen = writable(true);
export const avatarSize = writable(1);
export const showActorStats = writable(false);
export const statLabels = writable([]);
export const currentIconImageType = writable("token");
export const selectionWindowSize = writable("mini");
export const selectionWindowPosition = writable("center");
export const selectedCombatantId = _createSelectedCombatantId();
export const canSelectWhenRoundIsOver = writable(true);
export const canLastActorSelectThemselves = writable(false);
export const overrideEndTurnButton = writable(true);
export const settings = writable([]);

export const isAnyCombatantSelected = derived(selectableCombatants, ($selectableCombatants) =>
{
    return $selectableCombatants.some((x) =>
    {
        return x.isSelected;
    });
});
export const toolboxActions = derived([selectedCombatantId, avatarSize], ([$selectedCombatantId, $avatarSize]) =>
{
    return getToolboxActions($selectedCombatantId, $avatarSize);
});

export const currentTokenPickerTarget = derived([selectableCombatants, isTokenPickerRunning],
    ([$selectableCombatants, $isTokenPickerRunning]) =>
    {
        let tokenResult = null;
        if ($isTokenPickerRunning)
        {
            const combatant = $selectableCombatants.find((x) => x.isHighlighted);
            if (combatant != null)
            {
                const { result, token } = ModuleUtils.tryGetToken(game.combat, combatant.id);
                if (result)
                {
                    tokenResult = {
                        id: token.document.id,
                        icon: token.document.texture.src,
                        name: token.document.name,
                        owners: ModuleUtils.retrieveOwnersInfo(token.document.actorId)
                    };
                }
            }
        }
        return tokenResult;
    });

export const layoutCorners = writable([]);
export const windowSizes = writable([]);
export const combatantImageTypes = writable([]);

/**
 *
 */
function _createSelectedCombatantId()
{
    const { subscribe, set } = writable("-1");
    return {
        subscribe,
        set: (combatantId) =>
        {
            selectableCombatants.update((list) =>
            {
                list.forEach((x) => x.isSelected = combatantId === x.id);
                return list;
            });
            set(combatantId);
        }
    };
}