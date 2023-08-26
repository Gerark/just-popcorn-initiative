import { get as svelteGet, get as storeGet } from "svelte/store";
import {
    canLastActorSelectThemselves,
    canSelectWhenRoundIsOver,
    overrideEndTurnButton,
    currentTokenPickerTarget,
    isTokenPickerRunning,
    previousCombatants,
    selectableCombatants,
    selectedCombatantId, selectionWindowSize, settings, selectionWindowPosition
} from "./ModuleStore.js";
import { locSettings, ModuleUtils, Constants } from "./ModuleUtils.js";
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

    static updateSettings()
    {
        const newSettings = [];
        newSettings.push({
            name: locSettings(`${Constants.Options.OverrideNextTurnButton}-title`),
            description: locSettings(`${Constants.Options.OverrideNextTurnButton}-description`),
            value: overrideEndTurnButton
        });
        newSettings.push({
            name: locSettings(`${Constants.Options.CanLastActorSelectThemselves}-title`),
            description: locSettings(`${Constants.Options.CanLastActorSelectThemselves}-description`),
            value: canLastActorSelectThemselves
        });
        newSettings.push({
            name: locSettings(`${Constants.Options.CanSelectWhenRoundIsOver}-title`),
            description: locSettings(`${Constants.Options.CanSelectWhenRoundIsOver}-description`),
            value: canSelectWhenRoundIsOver
        });
        newSettings.push({
            name: locSettings(`${Constants.Options.SelectionWindowSize}-title`),
            description: locSettings(`${Constants.Options.SelectionWindowSize}-description`),
            value: selectionWindowSize,
            options: [
                { value: Constants.WindowSize.Normal.id, label: locSettings(Constants.WindowSize.Normal.text) },
                { value: Constants.WindowSize.Mini.id, label: locSettings(Constants.WindowSize.Mini.text) }
            ]
        });
        newSettings.push({
            name: locSettings(`${Constants.Options.SelectionWindowPosition}-title`),
            description: locSettings(`${Constants.Options.SelectionWindowPosition}-description`),
            value: selectionWindowPosition,
            options: [
                { value: "topLeft", label: locSettings(`${Constants.Options.SelectionWindowPosition}-topLeft`) },
                { value: "topRight", label: locSettings(`${Constants.Options.SelectionWindowPosition}-topRight`) },
                { value: "bottomLeft", label: locSettings(`${Constants.Options.SelectionWindowPosition}-bottomLeft`) },
                {
                    value: "bottomRight",
                    label: locSettings(`${Constants.Options.SelectionWindowPosition}-bottomRight`)
                },
                { value: "center", label: locSettings(`${Constants.Options.SelectionWindowPosition}-center`) }
            ]
        });
        newSettings.push({ separator: true });

        if (!ModuleAPI.instance.areCommonMacrosInstalled())
        {
            newSettings.push({
                name: locSettings(`${Constants.Options.InstallCommonMacros}-title`),
                description: locSettings(`${Constants.Options.InstallCommonMacros}-description`),
                command: () =>
                {
                    ModuleAPI.instance.installCommonMacros();
                }
            });
        }
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

    static getToolboxActions(combatantId)
    {
        const actions = [];
        actions.push({
            id: 1,
            icon: "fa-solid fa-eye-dropper",
            command: () =>
            {
                isTokenPickerRunning.set(true);
            },
            tooltip: "tools.select-from-token.tooltip"
        });

        if (combatantId !== "-1")
        {
            actions.push({
                id: 2,
                icon: "fa-solid fa-bullseye",
                command: () =>
                {
                    CanvasInteraction.panToCombatantToken(combatantId);
                },
                tooltip: "tools.zoom-combatant.tooltip"
            });
        }

        if (game.user.isGM)
        {
            actions.push({
                id: 3,
                icon: "fa-solid fa-gear",
                command: () =>
                {
                    ModuleAPI.instance.showConfig();
                },
                tooltip: "tools.configuration.tooltip"
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
                if (!storeGet(canLastActorSelectThemselves))
                {
                    lastIndex -= 1;
                }
            }

            for (let i = turn + 1; i < lastIndex; i++)
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
            let startIndex = 0;
            const endIndex = combat.turns.length;
            if (turn + 1 === combat.turns.length)
            {
                if (storeGet(canLastActorSelectThemselves))
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
                list.push({
                    icon: combatant.img,
                    name: combatant.name,
                    id: combatant.id,
                    tokenId: combatant.tokenId
                });
            }
        }

        previousCombatants.set(list.reverse());
    }
}