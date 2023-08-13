import { ModuleUtils, NotificationUtils } from "./ModuleUtils.js";

export class CanvasInteraction
{
    static panToCombatantToken(combatantId, duration = 1000)
    {
        const { result, token, reason } = ModuleUtils.tryGetToken(game.combat, combatantId);
        console.log(reason);
        if (!result)
        {
            NotificationUtils.notify(reason);
            return;
        }

        const scale = Math.max(0.6, canvas.stage.scale.x);
        canvas.animatePan({ x: token.document.x, y: token.document.y, scale, duration });
    }

    static highlightCombatantToken(event, combatantId, highlight = true)
    {
        const { result, token, reason } = ModuleUtils.tryGetToken(game.combat, combatantId);
        if (!result)
        {
            NotificationUtils.notify(reason);
            return;
        }

        if (!highlight)
        {
            token._onHoverOut(event);
        }
        else if (!token.controlled)
        {
            token._onHoverIn(event, { hoverOutOthers: true });
        }
    }

}