import { get as storeGet } from "svelte/store";
import { previousCombatants, selectableCombatants, selectedCombatantId } from "./ModuleStore.js";
import { ModuleUtils } from "./ModuleUtils.js";

export class StoreUpdater
{
    async updateCombatants(combat)
    {
        return new Promise((resolve) =>
        {
            setTimeout(() =>
            {
                this._updateSelectableCombatants(combat);
                this._updatePreviousCombatants(combat);
                resolve();
            }, 100);
        });
    }
    
    highlightCombatantItem(tokenId, isHover)
    {
        selectableCombatants.update((list) =>
        {
            list.forEach((x) =>
            {
                x.isHighlighted = (x.tokenId === tokenId) ? isHover : false;
            });
            return list;
        });

        previousCombatants.update((list) =>
        {
            list.forEach((x) =>
            {
                x.isHighlighted = (x.tokenId === tokenId) ? isHover : false;
            });
            return list;
        });
    }

    _updateSelectableCombatants(combat)
    {
        const list = [];
        const turn = combat.turn;
        if (turn != null)
        {
            for (let i = turn + 1; i < combat.turns.length; i++)
            {
                const combatant = combat.turns[i];
                const isSelected = storeGet(selectedCombatantId) === combatant.id;
                list.push({
                    icon: combatant.img,
                    name: combatant.name,
                    id: combatant.id,
                    isSelected,
                    tokenId: combatant.tokenId,
                    actorId: combatant.actorId,
                    isHighlighted: false,
                    owners: ModuleUtils.retrieveOwnersInfo(combatant.actorId)
                });
            }
            list.sort((a, b) =>
            {
                const actorAIsCharacter = game.actors.get(a.actorId).type === "character" ? 0 : 1;
                const actorBIsCharacter = game.actors.get(b.actorId).type === "character" ? 0 : 1;
                const sortedByType = actorAIsCharacter - actorBIsCharacter;
                return sortedByType || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
            });
        }
        selectableCombatants.set(list);
    }

    _updatePreviousCombatants(combat)
    {
        const list = [];
        const turn = combat.turn;
        if (turn != null)
        {
            for (let i = 0; i <= turn && i < combat.turns.length; i++)
            {
                const combatant = combat.turns[i];
                list.push({
                    icon: combatant.img,
                    name: combatant.name,
                    id: combatant.id,
                    tokenId: combatant.tokenId
                });
            }
        }

        previousCombatants.set(list);
    }
}