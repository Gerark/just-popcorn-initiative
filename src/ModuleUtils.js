import {
    canSelectWhenRoundIsOver,
    selectionWindowAnchor,
    selectionWindowState
} from "./ModuleStore.js";
import { get as svelteGet } from "svelte/store";

export const Constants = {
    ModuleName: "just-popcorn-initiative",
    ModuleTextName: "Just Popcorn Initiative",
    ModuleTextNameAcronym: "JPI",
    Options: {
        OverrideNextTurnButton: "override-next-turn",
        CanSelectWhenRoundIsOver: "select-when-round-is-over",
        CanLastActorSelectThemselves: "select-themselves-when-round-is-over",
        PreviousActorsDrawerOpen: "previous-actor-drawer-open",
        InstallCommonMacros: "install-common-macros",
        ResetToDefault: "reset-to-default",
        SelectionWindowAnchor: "selection-window-anchor",
        CombatantImageType: "selection-window-icon-type",
        Stats: "selection-window-stats",
        SelectionWindowState: "selection-window-state",
        Theme: "selection-window-theme"
    },
    CombatantImageType: {
        token: { id: "token", text: "selection-window-icon-type-token" },
        actor: { id: "actor", text: "selection-window-icon-type-actor" }
    }
};

export const ReasonType = {
    None: -1,
    EndTurnNoCombat: 0,
    EndTurnNoCombatantPlaying: 1,
    EndTurnActorIsNotValid: 2,
    EndTurnNotYourTurn: 3,
    EndTurnLastOrSecondLast: 4,
    EndTurnInvalidSelectedCombatant: 5,
    EndTurnInvalidCombatId: 6,
    TryGetTokenInvalidId: 7,
    TryGetTokenInvalidCombatantId: 8,
    ConfigNoPermission: 9
};

export class NotificationUtils
{
    static notify(reason)
    {
        switch (reason)
        {
        case ReasonType.EndTurnNoCombat:
            this.warning(locSystem(`EndTurnNoCombat`));
            break;
        case ReasonType.EndTurnNoCombatantPlaying:
            this.warning(locSystem(`EndTurnNoCombatantPlaying`));
            break;
        case ReasonType.EndTurnActorIsNotValid:
            this.warning(locSystem(`EndTurnActorIsNotValid`));
            break;
        case ReasonType.EndTurnNotYourTurn:
            this.warning(locSystem(`EndTurnNotYourTurn`));
            break;
        case ReasonType.EndTurnInvalidSelectedCombatant:
            this.warning(locSystem(`EndTurnInvalidSelectedCombatant`));
            break;
        case ReasonType.EndTurnLastOrSecondLast:
            this.warning(locSystem(`EndTurnLastOrSecondLast`));
            break;
        case ReasonType.EndTurnInvalidCombatId:
            this.warning(locSystem(`EndTurnInvalidCombatId`));
            break;
        case ReasonType.TryGetTokenInvalidId:
            this.warning(locSystem(`TryGetTokenInvalidId`));
            break;
        case ReasonType.TryGetTokenInvalidCombatantId:
            this.warning(locSystem(`TryGetTokenInvalidCombatantId`));
            break;
        case ReasonType.ConfigNoPermission:
            this.warning(locSystem(`ConfigNoPermission`));
            break;
        }
    }

    static error(message)
    {
        ui.notifications.error(this._moduleMessage(message));
    }

    static warning(message)
    {
        ui.notifications.warn(this._moduleMessage(message));
    }

    static message(message)
    {
        ui.notifications.notify(this._moduleMessage(message));
    }

    static errorPromise(message)
    {
        return new Promise(() =>
        {
            throw new Error(message);
        });
    }

    static _moduleMessage(message)
    {
        return `Popcorn Initiative - ${message}`;
    }
}

export class ModuleUtils
{
    static getCombatantById(combat, combatantId)
    {
        return combat.turns.find((x) =>
        {
            return x.id === combatantId;
        });
    }

    static getCombatById(combatId)
    {
        return game.combats.get(combatId);
    }

    static tryGetToken(combat, combatantId)
    {
        let result = true;
        let token = null;
        let reason = ReasonType.None;
        const combatant = this.getCombatantById(combat, combatantId);
        if (!combatant)
        {
            reason = ReasonType.TryGetTokenInvalidCombatantId;
            result = false;
        }
        else
        {
            token = game.canvas.tokens.objects.children.find((x) => x.id === combatant.tokenId);
            if (!token)
            {
                reason = ReasonType.TryGetTokenInvalidId;
                result = false;
            }
        }

        return { result, token, reason };
    }

    static retrieveOwnersInfo(actorId)
    {
        const owners = [];
        const actor = game.actors.get(actorId);
        for (const key in actor.ownership)
        {
            const ownershipLevel = actor.ownership[key];
            if (key !== "default")
            {
                const player = game.users.get(key);
                if (ownershipLevel === 3 && player && !player.isGM)
                {
                    owners.push({ color: player.color });
                }
            }
        }
        return owners;
    }

    /*
You should never see the Selection Window if there's no valid combat.
If the current combatant in the fight is not owned by the player the Selection Window shouldn't be shown
If you are the last or the second last combatant in the round the popcorn initiative will select automatically according to the options
*/
    static shouldCloseSelectionWindow(combat)
    {
        let reason = ReasonType.None;

        if (!combat || !combat.current)
        {
            reason = ReasonType.EndTurnNoCombat;
        }
        else if (combat.current.combatantId === null)
        {
            reason = ReasonType.EndTurnNoCombatantPlaying;
        }
        else
        {
            const actorId = combat.turns.length > combat.turn ? combat.turns[combat.turn].actorId : "0";
            const actor = game.actors.get(actorId);
            if (actor === null)
            {
                reason = ReasonType.EndTurnActorIsNotValid;
            }
            else if (!actor.isOwner)
            {
                reason = ReasonType.EndTurnNotYourTurn;
            }
            else
            {
                const isLast = combat.current.turn + 1 >= combat.turns.length;
                const isSecondLast = combat.current.turn + 2 === combat.turns.length;
                if (isSecondLast || (isLast && !svelteGet(canSelectWhenRoundIsOver)))
                {
                    reason = ReasonType.EndTurnLastOrSecondLast;
                }
            }
        }

        return { shouldClose: reason !== ReasonType.None, reason };
    }

    static async installMacro(name, code, icon)
    {
        let existingFolder = game.folders.contents.find((f) => f.name === Constants.ModuleTextName);
        if (!existingFolder)
        {
            existingFolder = await Folder.create({
                name: Constants.ModuleTextName,
                type: "Macro"
            }, {});
        }

        const macroData = {
            name: `${Constants.ModuleTextNameAcronym} - ${name}`,
            type: "script",
            command: code,
            img: icon,
            folder: existingFolder
        };

        const existingMacro = game.macros.contents.find((m) => m.name === `${Constants.ModuleTextNameAcronym} - ${name}`);
        if (!existingMacro)
        {
            await Macro.create(macroData, {});
        }

    }

    static isMacroInstalled(name)
    {
        return game.macros.contents.find((m) => m.name === `${Constants.ModuleTextNameAcronym} - ${name}`);
    }

    static getPropertyByPath(obj, path)
    {
        const segments = path.split('.');
        for (let i = 0; i < segments.length; i++)
        {
            obj = obj[segments[i]];
            if (!obj)
            {
                return;
            }
        }

        return obj;
    }

    static resolvePropertyText(actor, inputText)
    {
        const propertyPathRegex = /\{([^}]+)}/g;

        let text = inputText.replace(propertyPathRegex, (match, capturedText) =>
        {
            return ModuleUtils.getPropertyByPath(actor, capturedText);
        });

        const iconPathRegex = /\[\[(.*?)]]/g;
        text = text.replace(iconPathRegex, (match, capturedText) =>
        {
            return `<i class="fa fa-${capturedText}"></i>`;
        });

        return text;
    }

    static getPositionForSelectionWindow()
    {
        const { width, height } = svelteGet(selectionWindowState);
        const windowAnchorPosition = svelteGet(selectionWindowAnchor);
        let x = window.innerWidth / 2 - width / 2;
        let y = window.innerHeight / 2 - height / 2;
        switch (windowAnchorPosition)
        {
        case "topLeft":
            x = 0;
            y = 0;
            break;
        case "topRight":
            x = window.innerWidth - width;
            y = 0;
            break;
        case "bottomLeft":
            x = 0;
            y = window.innerHeight - height;
            break;
        case "bottomRight":
            x = window.innerWidth - width;
            y = window.innerHeight - height;
            break;
        }

        return { x, y };
    }

    static getCombatantIcon(combatant, type)
    {
        const actor = game.actors.get(combatant.actorId);
        if (actor)
        {
            if (type === Constants.CombatantImageType.actor.id)
            {
                return actor.img;
            }
            else if (type === Constants.CombatantImageType.token.id)
            {
                return combatant.img;
            }
        }

        return combatant.img;
    }

    static getActorIcon(actorId, type)
    {
        const actor = game.actors.get(actorId);
        if (actor)
        {
            if (type === Constants.CombatantImageType.actor.id)
            {
                return actor.img;
            }
            else if (type === Constants.CombatantImageType.token.id)
            {
                return actor.prototypeToken.texture.src;
            }
        }

        return "";
    }
}

/**
 *
 * @param localizationKey
 */
export function locWindow(localizationKey)
{
    return localize(`Window.${localizationKey}`);
}

/**
 *
 * @param localizationKey
 */
export function locSystem(localizationKey)
{
    return localize(`SystemMessage.${localizationKey}`);
}

/**
 *
 * @param localizationKey
 */
export function locSettings(localizationKey)
{
    return localize(`Settings.${localizationKey}`);
}

/**
 *
 * @param localizationKey
 */
function localize(localizationKey)
{
    return game.i18n.localize(`JPI.${localizationKey}`);
}
