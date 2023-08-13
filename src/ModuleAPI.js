import SelectionWindowApplication from "./view/SelectionWindowApplication.js";
import {
    previousCombatants,
    selectableCombatants,
    selectedCombatantId
} from "./ModuleStore.js";
import { moduleSocket } from "./ModuleSocket.js";
import { get as storeGet } from "svelte/store";
import { errorNotification, warningNotification, getCombatantById } from "./ModuleUtils.js";

export class ModuleAPI
{
    static get instance()
    {
        return game.modules.get("just-popcorn-initiative").api;
    }

    constructor()
    {
        this.selectionWindow = null;
        Hooks.on("createCombatant", (ev) => this._updateCombatantsData(ev));
        Hooks.on("deleteCombatant", (ev) => this._updateCombatantsData(ev));
        Hooks.on("updateCombat", (ev) => this._updateCombatantsData(ev));
        Hooks.on("canvasTearDown", () => this.closeSelectionWindow());
        Hooks.on("hoverToken", (token, isHover) => { this._highlightActor(token.document.id, isHover); });
        if (game.combat)
        {
            this._updateCombatantsData(game.combat);
        }
    }

    executePassTurnTo(combatantId)
    {
        const currentCombat = game.combat;
        const nextCombatant = currentCombat.turns.find((x) => { return x.id === combatantId; });
        if (nextCombatant == null)
        {
            errorNotification("Can't end turn. The selected combatant can't be found.");
        }

        if (currentCombat.turn + 1 > currentCombat.turns.length)
        {
            errorNotification("Can't pass turn to another combatant. The current combatant is the last on this round.");
        }

        moduleSocket.executeAsGM("passTurnTo", combatantId, currentCombat.id).then(() =>
        {
            this.closeSelectionWindow();
        }).catch((error) =>
        {
            errorNotification(error.message);
        });
    }

    closeSelectionWindow()
    {
        if (this.selectionWindow)
        {
            this.selectionWindow.close();
        }
    }

    panToCombatantToken(combatantId, duration = 1000)
    {
        const { result, token } = this._tryGetToken(combatantId);
        if (result)
        {
            const scale = Math.max(0.6, canvas.stage.scale.x);
            canvas.animatePan({ x: token.document.x, y: token.document.y, scale, duration });
        }
    }

    highlightCombatantToken(event, combatantId, highlight = true)
    {
        const { result, token } = this._tryGetToken(combatantId);
        if (result)
        {
            if (highlight)
            {
                if (!token.controlled)
                {
                    token._onHoverIn(event, { hoverOutOthers: true });
                }
            }
            else
            {
                token._onHoverOut(event);
            }
        }
    }

    showSelectionWindowOrPassTurn()
    {
        const currentCombat = game.combat;
        if (!currentCombat || !currentCombat.current)
        {
            warningNotification(`Can't end turn. No combat is currently active.`);
            return;
        }

        if (currentCombat.current.combatantId == null)
        {
            warningNotification(`Can't end turn. No combatant is currently playing.`);
            return;
        }

        const actorId = currentCombat.turns[currentCombat.turn].actorId;
        const actor = game.actors.get(actorId);
        if (actor == null)
        {
            errorNotification(`Can't end turn. The current actor in combat is not valid.`);
            return;
        }

        if (!actor.isOwner)
        {
            warningNotification(`Can't end turn. It's not your turn yet.`);
            return;
        }

        if (currentCombat.current.turn + 1 >= currentCombat.turns.length ||
       currentCombat.current.turn + 2 >= currentCombat.turns.length)
        {
            currentCombat.nextTurn();
            return;
        }

        this._showSelectionWindow();
    }

    async swapCombatantTurn(firstCombatantId, secondCombatantId, combat)
    {
        if (secondCombatantId !== firstCombatantId)
        {
            const firstCombatant = getCombatantById(combat, firstCombatantId);
            const secondCombatant = getCombatantById(combat, secondCombatantId);
            const currentCombatant = combat.turns[combat.turn];
            if (secondCombatant.initiative === firstCombatant.initiative ||
          secondCombatant.initiative >= currentCombatant.initiative)
            {
                await this._rearrangeCombatants(combat);
            }

            const secondInitiative = secondCombatant.initiative;
            await secondCombatant.update({ initiative: firstCombatant.initiative });
            await firstCombatant.update({ initiative: secondInitiative });
        }
    }

    async _rearrangeCombatants(combat)
    {
        let currentInitiative = combat.turns.length * 10;
        for (let i = 0; i < combat.turns.length; i++)
        {
            const combatant = combat.turns[i];
            await combatant.update({ initiative: currentInitiative });
            currentInitiative -= 10;
        }
    }

    _showSelectionWindow()
    {
        this.selectionWindow = new SelectionWindowApplication().render(true, { focus: true });
    }

    _updateCombatantsData(combat)
    {
        setTimeout(() =>
        {
            this._updateSelectableCombatants(combat);
            this._updatePreviousCombatants(combat);
            this._closeSelectionWindowIfRequired(combat);
        }, 100);
    }

    /**
     *
     * @param combat
     */
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
                    isHighlighted: false
                });
            }
            list.sort((a, b) =>
            {
                return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
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


    /*
You should never see the Selection Window is there's no valid combat.
If the current combatant in the fight is not owned by the player the Selection Window shouldn't be shown
If you are the last or the second last combatant in the round the popcorn initiative will select automatically according to the options
*/
    _closeSelectionWindowIfRequired(combat)
    {
        const isValidCombat = combat && combat.current && combat.current.turn != null;
        if (!isValidCombat)
        {
            this.closeSelectionWindow();
            return;
        }

        const actorId = combat.turns.length > combat.turn ? combat.turns[combat.turn].actorId : "0";
        const actor = game.actors.get(actorId);
        const isValidAndOwnedActor = actor != null && actor.isOwner;
        if (!isValidAndOwnedActor)
        {
            this.closeSelectionWindow();
            return;
        }

        const isLastOrSecondLastCombatant = combat.current.turn + 1 >= combat.turns.length || combat.current.turn + 2 >= combat.turns.length;
        if (isLastOrSecondLastCombatant)
        {
            this.closeSelectionWindow();
        }
    }

    _highlightActor(tokenId, isHover)
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

    _tryGetToken(combatantId)
    {
        let result = true;
        const combatant = getCombatantById(game.combat, combatantId);
        if (!combatant)
        {
            warningNotification(`Can't focus the token. Can't find a token for the selected combatant.`);
            result = false;
        }

        const token = game.canvas.tokens.objects.children.find((x) => x.id === combatant.tokenId);
        if (!token)
        {
            warningNotification(`Can't focus the token. No token with that id can be found in the current canvas.`);
            result = false;
        }

        return { result, token };
    }
}