import { SvelteApplication } from '#runtime/svelte/application';

import RequestWindowShell from './RequestWindowShell.svelte';

export default class RequestWindowApplication extends SvelteApplication
{
    static get defaultOptions()
    {
        const moduleAPI = game.modules.get("just-popcorn-initiative").api;
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'popcorn-initiative-overlay',
            classes: ['tjs-essential-svelte-esm'],
            resizable: true,
            width: 800,
            height: 700,

            svelte: {
                class: RequestWindowShell,
                target: document.body,
                context: { moduleAPI }
            }
        });
    }
}