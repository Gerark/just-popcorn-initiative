import { isTokenPickerRunning, selectedCombatantId, showActorStats } from "./ModuleStore.js";
import { CanvasInteraction } from "./CanvasInteraction.js";
import { ModuleAPI } from "./ModuleAPI.js";
import { locWindow } from "./ModuleUtils.js";
import { get as svelteGet } from "svelte/store";

/**
 *
 * @param combatantId
 *
 * @param avatarSizeVal
 */
export default function getToolboxActions(combatantId)
{
    const actions = [];
    let id = 0;
    id = addAction(actions, buildTokenPickingAction(), id);
    if (combatantId !== "-1")
    {
        id = addAction(actions, buildPanToCombatantAction(), id);
    }

    id = addAction(actions, toggleStatAction(), id);

    if (game.user.isGM)
    {
        addAction(actions, buildConfigAction(), id);
    }
    return actions;
}

/**
 *
 * @param actions
 *
 * @param actionBuilder
 *
 * @param action
 *
 * @param id
 */
function addAction(actions, action, id)
{
    action.id = id;
    actions.push(action);
    id += 1;
    return id;
}

const buildTokenPickingAction = () =>
{
    return {
        icon: "fa-solid fa-eye-dropper",
        onClick: () =>
        {
            isTokenPickerRunning.set(true);
        },
        description: locWindow("tools.select-from-token.tooltip")
    };
};

const buildPanToCombatantAction = () =>
{
    return {
        icon: "fa-solid fa-bullseye",
        onClick: () =>
        {
            CanvasInteraction.panToCombatantToken(svelteGet(selectedCombatantId));
        },
        description: locWindow("tools.zoom-combatant.tooltip")
    };
};

const toggleStatAction = () =>
{
    return {
        icon: "fa-solid fa-list-ol",
        onClick: () =>
        {
            showActorStats.update((val) =>
            {
                return !val;
            });
        },
        description: locWindow("tools.toggleStats.tooltip")
    };
};

const buildConfigAction = () =>
{
    return {
        icon: "fa-solid fa-gear",
        onClick: () =>
        {
            ModuleAPI.instance.showConfig();
        },
        description: locWindow("tools.configuration.tooltip")
    };
};