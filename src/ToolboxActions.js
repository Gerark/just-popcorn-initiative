import { avatarSize, isTokenPickerRunning, showActorStats } from "./ModuleStore.js";
import { CanvasInteraction } from "./CanvasInteraction.js";
import { Constants } from "./ModuleUtils.js";
import { ModuleSettings } from "./ModuleSettings.js";
import { ModuleAPI } from "./ModuleAPI.js";

/**
 *
 * @param combatantId
 *
 * @param avatarSizeVal
 */
export default function getToolboxActions(combatantId, avatarSizeVal)
{
    const actions = [];
    let id = 0;
    id = addAction(actions, buildTokenPickingAction(), id);
    if (combatantId !== "-1")
    {
        id = addAction(actions, buildPanToCombatantAction(), id);
    }

    id = addAction(actions, buildAvatarSizeAction(avatarSizeVal), id);
    id = addAction(actions, toggleStatAction(), id);

    if (game.user.isGM)
    {
        id = addAction(actions, buildConfigAction(avatarSizeVal), id);
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
        command: () =>
        {
            isTokenPickerRunning.set(true);
        },
        tooltip: "tools.select-from-token.tooltip"
    };
};

const buildPanToCombatantAction = (combatantId) =>
{
    return {
        icon: "fa-solid fa-bullseye",
        command: () =>
        {
            CanvasInteraction.panToCombatantToken(combatantId);
        },
        tooltip: "tools.zoom-combatant.tooltip"
    };
};

const buildAvatarSizeAction = (avatarSizeVal) =>
{
    return {
        label: `${avatarSizeVal + 1}x`,
        command: () =>
        {
            avatarSize.update((size) =>
            {
                if (size < Constants.AvatarSizes.length - 1)
                {
                    return size + 1;
                }
                else
                {
                    size = 0;
                }

                return size;
            });
            ModuleSettings.save();
        },
        tooltip: "tools.change-avatar-size.tooltip"
    };
};

const toggleStatAction = () =>
{
    return {
        icon: "fa-solid fa-list-ol",
        command: () =>
        {
            showActorStats.update((val) =>
            {
                return !val;
            });
        },
        tooltip: "tools.toggleStats.tooltip"
    };
};

const buildConfigAction = () =>
{
    return {
        icon: "fa-solid fa-gear",
        command: () =>
        {
            ModuleAPI.instance.showConfig();
        },
        tooltip: "tools.configuration.tooltip"
    };
};