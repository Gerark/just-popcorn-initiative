import { get as svelteGet, get as storeGet } from "svelte/store";
import {
    currentTokenPickerTarget,
    isTokenPickerRunning,
    previousCombatants,
    selectableCombatants,
    selectedCombatantId
} from "./ModuleStore.js";
import { ModuleUtils } from "./ModuleUtils.js";
import { ModuleAPI } from "./ModuleAPI.js";
import { CanvasInteraction } from "./CanvasInteraction.js";

export class StoreUpdater
{
    static async updateCombatants(combat)
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

    static highlightCombatantItem(token, isHover)
    {
        const tokenId = token.document.id;
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

    static getToolboxActions(combatantId)
    {
        const actions = [];
        actions.push(
            { icon: "fa-solid fa-circle-xmark", command: () => { ModuleAPI.instance.closeSelectionWindow(); } });
        actions.push({ icon: "fa-solid fa-eye-dropper", command: () => { isTokenPickerRunning.set(true); } });

        if (combatantId !== "-1")
        {
            actions.push({
                icon: "fa-solid fa-bullseye",
                command: () => { CanvasInteraction.panToCombatantToken(combatantId); }
            });
        }
        return actions;
    }

    static onGlobalClick()
    {
        if (svelteGet(isTokenPickerRunning))
        {
            const currentToken = svelteGet(currentTokenPickerTarget);
            if (currentToken)
            {
                const currentCombat = game.combat;
                const tokenId = currentToken.id;
                for (let i = currentCombat.turn; i < currentCombat.turns.length; i++)
                {
                    const combatant = currentCombat.turns[i];
                    if (combatant.tokenId === tokenId)
                    {
                        selectedCombatantId.set(combatant.id);
                        isTokenPickerRunning.set(false);
                        break;
                    }
                }
            }
        }
    }

    static _updateSelectableCombatants(combat)
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

    static _updatePreviousCombatants(combat)
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