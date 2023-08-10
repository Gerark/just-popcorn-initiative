import { ModuleAPI } from './ModuleAPI.js';
import { initializeSocket } from "./ModuleSocket.js";

Hooks.once("socketlib.ready", () =>
{
    initializeSocket();
});

Hooks.once('ready', () =>
{
    const module = game.modules.get("just-popcorn-initiative");
    module.api = new ModuleAPI();
});

Hooks.on("renderCombatTracker5e", (app, html/* , data*/) =>
{
    const nextButton = $("a.combat-control", html).filter(`[data-control="nextTurn"]`);
    nextButton[0].dataset.control = "popcornInitiativeNextTurn";
    nextButton.click((/* event*/) =>
    {
        const module = game.modules.get("just-popcorn-initiative");
        module.api.showRequestWindowOrPassTurn();
    });
});