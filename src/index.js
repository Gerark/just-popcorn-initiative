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