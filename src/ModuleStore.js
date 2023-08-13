import { writable, derived } from "svelte/store";

export const focusTokenWhenHighlightingActors = writable(true);
export const selectableCombatants = writable([]);
export const previousCombatants = writable([]);
export const selectedCombatantId = _createSelectedCombatantId();
export const isAnyCombatantSelected = derived(selectableCombatants, ($selectableCombatants) =>
{
    return $selectableCombatants.some((x) =>
    {
        return x.isSelected;
    });
});

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