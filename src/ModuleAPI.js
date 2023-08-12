import SelectionWindowApplication from "./view/SelectionWindowApplication.js";
import { dispatchCloseSelectionWindow } from "./ModuleStore.js";
import { moduleSocket } from "./ModuleSocket.js";

export class ModuleAPI
{
    static get instance()
    {
        return game.modules.get("just-popcorn-initiative").api;
    }

    constructor()
    {
        this.selectionWindow = null;
        Hooks.on("createCombatant", () => this._onCombatantCreated());
        Hooks.on("deleteCombatant", () => this._onCombatantDeleted());
        Hooks.on("updateCombat", () => this._onCombatUpdate());
    }

    async executePassTurnTo(combatantId)
    {
        const nextCombatant = game.combat.turns.find((x) => { return x.id === combatantId; });
        if (nextCombatant == null)
        {
            return new Promise(() => { throw new Error("You can't pass your turn. The selected combatant can't be found."); });
        }

        if (game.combat.turn + 1 > game.combat.turns.length)
        {
            return new Promise(() => { throw new Error("You can't pass your turn to another combatant. You are the last one of your turn"); });
        }

        return await moduleSocket.executeAsGM("passTurnTo", combatantId);
    }

    closeSelectionWindow()
    {
        dispatchCloseSelectionWindow();
    }

    selectCombatantToken(combatantId)
    {
        const combatant = this._getCombatantById(combatantId);
        if (!combatant)
        {
            ui.notifications.warn(`You can't focus the token. Select a combatant from the grid first.`);
            return;
        }

        const token = game.canvas.tokens.objects.children.find((x) => x.id === combatant.tokenId);
        if (!token)
        {
            ui.notifications.warn(`You can't focus the token. No token can be found in the current canvas.`);
            return;
        }

        const scale = Math.max(1, canvas.stage.scale.x);
        canvas.animatePan({ x: token.document.x, y: token.document.y, scale, duration: 1000 });
    }

    showSelectionWindowOrPassTurn()
    {
        if (!game.combat || !game.combat.current)
        {
            ui.notifications.warn(`You can't pass your turn. No combat is currently active.`);
            return;
        }

        if (game.combat.current.turn == null)
        {
            ui.notifications.warn(`You can't pass your turn. The combat didn't start yet.`);
            return;
        }

        const actorId = game.combat.turns[game.combat.turn].actorId;
        const actor = game.actors.get(actorId);
        if (actor == null)
        {
            ui.notifications.error(`You can't pass your turn. The current actor in combat is not valid.`);
            return;
        }

        if (!actor.isOwner)
        {
            ui.notifications.warn(`You can't pass your turn. It's not your turn yet.`);
            return;
        }

        if (game.combat.current.turn + 1 >= game.combat.turns.length ||
       game.combat.current.turn + 2 >= game.combat.turns.length)
        {
            game.combat.nextTurn();
            return;
        }

        this._showSelectionWindow();
    }

    async swapCombatantTurn(firstCombatantId, secondCombatantId)
    {
        if (secondCombatantId !== firstCombatantId)
        {
            const firstCombatant = this._getCombatantById(firstCombatantId);
            const secondCombatant = this._getCombatantById(secondCombatantId);
            const currentCombatant = game.combat.turns[game.combat.turn];
            if (secondCombatant.initiative === firstCombatant.initiative ||
          secondCombatant.initiative >= currentCombatant.initiative)
            {
                await this._rearrangeCombatants();
            }

            const secondInitiative = secondCombatant.initiative;
            await secondCombatant.update({ initiative: firstCombatant.initiative });
            await firstCombatant.update({ initiative: secondInitiative });
        }
    }

    async _rearrangeCombatants()
    {
        let currentInitiative = game.combat.turns.length * 10;
        for (let i = 0; i < game.combat.turns.length; i++)
        {
            const combatant = game.combat.turns[i];
            await combatant.update({ initiative: currentInitiative });
            currentInitiative -= 10;
        }
    }

    _showSelectionWindow()
    {
        this.selectionWindow = new SelectionWindowApplication().render(true, { focus: true });
    }

    _onCombatantCreated(combatant)
    {
        setTimeout(() => { this._svelteSelectionWindowRoot?.updateData(); }, 100);
    }

    _onCombatantDeleted(combatant)
    {
        setTimeout(() => { this._svelteSelectionWindowRoot?.updateData(); }, 100);
    }

    _onCombatUpdate()
    {
        setTimeout(() => { this._svelteSelectionWindowRoot?.updateData(); }, 100);
    }

    _getCombatantById(combatantId)
    {
        return game.combat.turns.find((x) => { return x.id === combatantId; });
    }

    get _svelteSelectionWindowRoot()
    {
        if (this.selectionWindow && this.selectionWindow.svelte.applicationShell)
        {
            return this.selectionWindow.svelte.component(0);
        }
        return null;
    }
}