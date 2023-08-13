import { ModuleUtils } from "./ModuleUtils.js";

export class CanvasInteraction
{
    static panToCombatantToken(combatantId, duration = 1000)
    {
        const { result, token } = ModuleUtils.tryGetToken(game.combat, combatantId);
        if (result)
        {
            const scale = Math.max(0.6, canvas.stage.scale.x);
            canvas.animatePan({ x: token.document.x, y: token.document.y, scale, duration });
        }
    }

    static highlightCombatantToken(event, combatantId, highlight = true)
    {
        const { result, token } = ModuleUtils.tryGetToken(game.combat, combatantId);
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

}