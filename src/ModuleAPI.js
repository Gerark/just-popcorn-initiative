import SelectionWindowApplication from "./view/selection-window/SelectionWindowApplication.js";
import { moduleSocket } from "./ModuleSocket.js";
import { NotificationUtils, ModuleUtils, ReasonType } from "./ModuleUtils.js";
import { StoreUpdater } from "./StoreUpdater.js";
import { get as svelteGet } from "svelte/store";
import { isSelectionWindowHovered, isTokenPickerRunning, selectedCombatantId } from "./ModuleStore.js";

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
        Hooks.on("hoverToken", (token, isHover) => { this._onHoverToken(token, isHover); });
        document.addEventListener("click", (e) => { StoreUpdater.onGlobalClick(); });
    }

    executePassTurnTo(combatantId)
    {
        const currentCombat = game.combat;
        moduleSocket.executeAsGM("passTurnTo", combatantId, currentCombat.id).then(() =>
        {
            this.closeSelectionWindow();
        }).catch((error) =>
        {
            NotificationUtils.error(error.options.cause);
        });
    }

    closeSelectionWindow()
    {
        this.selectionWindow?.close();
        this.selectionWindow = null;
        isTokenPickerRunning.set(false);
        isSelectionWindowHovered.set(false);
        selectedCombatantId.set("-1");
    }

    showSelectionWindowOrPassTurn()
    {
        const currentCombat = game.combat;
        const { shouldClose, reason } = ModuleUtils.shouldCloseSelectionWindow(currentCombat);
        if (reason === ReasonType.EndTurnLastOrSecondLast)
        {
            currentCombat.nextTurn();
            return;
        }

        if (shouldClose)
        {
            NotificationUtils.notify(reason);
            return;
        }

        this.selectionWindow = new SelectionWindowApplication().render(true, { focus: true });
        this._updateCombatantsData(currentCombat);
    }

    _updateCombatantsData(combat)
    {
        if (this.selectionWindow)
        {
            StoreUpdater.updateCombatants(combat).then(() =>
            {
                const { shouldClose } = ModuleUtils.shouldCloseSelectionWindow(combat);
                if (shouldClose)
                {
                    this.closeSelectionWindow();
                }
            });
        }
    }

    _onHoverToken(token, isHover)
    {
        if (this.selectionWindow)
        {
            if (!svelteGet(isSelectionWindowHovered))
            {
                StoreUpdater.highlightCombatantItem(token, isHover);
            }
        }
    }
}