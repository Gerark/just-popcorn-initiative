import { get as svelteGet, writable } from "svelte/store";
import {
    canLastActorSelectThemselves,
    canSelectWhenRoundIsOver, currentIconImageType, combatantImageTypes,
    currentTokenPickerTarget,
    isTokenPickerRunning, layoutCorners,
    overrideEndTurnButton,
    previousCombatants,
    selectableCombatants,
    selectedCombatantId,
    selectionWindowAnchor,
    settings,
    statLabels
} from "./ModuleStore.js";
import { themes as allThemes, currentTheme } from "@gerark/just-svelte-lib/styles/themeStore";
import { Constants, locSettings, ModuleUtils } from "./ModuleUtils.js";
import { ModuleAPI } from "./ModuleAPI.js";
import { ModuleSettings } from "./ModuleSettings.js";
import * as svelte from "svelte";

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

    static updateSettings()
    {
        const newSettings = [];
        newSettings.push({
            label: locSettings(`${Constants.Options.OverrideNextTurnButton}-title`),
            description: locSettings(`${Constants.Options.OverrideNextTurnButton}-description`),
            store: overrideEndTurnButton
        });
        newSettings.push({
            label: locSettings(`${Constants.Options.CanLastActorSelectThemselves}-title`),
            description: locSettings(`${Constants.Options.CanLastActorSelectThemselves}-description`),
            store: canLastActorSelectThemselves
        });
        newSettings.push({
            label: locSettings(`${Constants.Options.CanSelectWhenRoundIsOver}-title`),
            description: locSettings(`${Constants.Options.CanSelectWhenRoundIsOver}-description`),
            store: canSelectWhenRoundIsOver
        });
        newSettings.push({
            label: locSettings(`${Constants.Options.CombatantImageType}-title`),
            description: locSettings(`${Constants.Options.CombatantImageType}-description`),
            store: currentIconImageType,
            type: "Enum",
            values: combatantImageTypes
        });
        newSettings.push({
            label: locSettings(`${Constants.Options.SelectionWindowAnchor}-title`),
            description: locSettings(`${Constants.Options.SelectionWindowAnchor}-description`),
            store: selectionWindowAnchor,
            type: "Enum",
            values: layoutCorners
        });

        const allDefaultThemesValue = svelteGet(allThemes);
        const newList = [...allDefaultThemesValue, {
            id: allDefaultThemesValue.length,
            label: 'old-orange',
            value: 'old-orange'
        }];
        const allThemesV2 = writable(newList);

        newSettings.push({
            label: locSettings(`${Constants.Options.Theme}-title`),
            description: locSettings(`${Constants.Options.Theme}-description`),
            store: currentTheme,
            type: "Enum",
            values: allThemesV2
        });
        settings.set(newSettings);
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

    static onGlobalClick()
    {
        if (svelteGet(isTokenPickerRunning))
        {
            const currentToken = svelteGet(currentTokenPickerTarget);
            if (currentToken)
            {
                const currentCombat = game.combat;
                const tokenId = currentToken.id;
                const turn = currentCombat.turn + 1 === currentCombat.turns.length ? 0 : currentCombat.turn;
                for (let i = turn; i < currentCombat.turns.length; i++)
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
        let turn = combat.turn;
        if (turn != null)
        {
            let lastIndex = combat.turns.length;
            // If we're on the last combatant we show all combatant starting from turn 0
            if (turn + 1 === combat.turns.length)
            {
                turn = -1;
                if (!svelteGet(canLastActorSelectThemselves))
                {
                    lastIndex -= 1;
                }
            }

            for (let i = turn + 1; i < lastIndex; i++)
            {
                const combatant = combat.turns[i];
                const actorStats = [];
                const actor = game.actors.get(combatant.actorId);
                if (actor)
                {
                    const labels = svelteGet(statLabels);
                    labels.forEach((x) =>
                    {
                        const resolvedText = ModuleUtils.resolvePropertyText(actor, x.label);
                        actorStats.push({ label: resolvedText, id: actorStats.length, showToPlayer: x.showToPlayer });
                    });
                }

                const isSelected = svelteGet(selectedCombatantId) === combatant.id;
                list.push({
                    icon: ModuleUtils.getCombatantIcon(combatant, svelteGet(currentIconImageType)),
                    name: combatant.name,
                    id: combatant.id,
                    isSelected,
                    tokenId: combatant.tokenId,
                    actorId: combatant.actorId,
                    isHighlighted: false,
                    owners: ModuleUtils.retrieveOwnersInfo(combatant.actorId),
                    stats: actorStats
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
            let startIndex = 0;
            const endIndex = combat.turns.length;
            if (turn + 1 === combat.turns.length)
            {
                if (svelteGet(canLastActorSelectThemselves))
                {
                    startIndex = endIndex;
                }
                else
                {
                    startIndex = turn;
                }
            }

            for (let i = startIndex; i <= turn && i < endIndex; i++)
            {
                const combatant = combat.turns[i];
                const actorStats = [];
                const actor = game.actors.get(combatant.actorId);
                if (actor)
                {
                    const labels = svelteGet(statLabels);
                    labels.forEach((x) =>
                    {
                        const resolvedText = ModuleUtils.resolvePropertyText(actor, x.label);
                        actorStats.push({ label: resolvedText, id: actorStats.length, showToPlayer: x.showToPlayer });
                    });
                }

                list.push({
                    icon: ModuleUtils.getCombatantIcon(combatant, svelteGet(currentIconImageType)),
                    name: combatant.name,
                    id: combatant.id,
                    tokenId: combatant.tokenId,
                    stats: actorStats
                });
            }
        }

        previousCombatants.set(list.reverse());
    }
}