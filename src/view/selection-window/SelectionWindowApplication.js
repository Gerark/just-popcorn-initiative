import { SvelteApplication } from '#runtime/svelte/application';

import SelectionWindow from './SelectionWindow.svelte';

export default class SelectionWindowApplication extends SvelteApplication
{
    static get defaultOptions()
    {
        const moduleAPI = game.modules.get("just-popcorn-initiative").api;
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'popcorn-initiative-overlay',
            classes: ['tjs-essential-svelte-esm'],
            resizable: true,
            width: 610,
            height: 440,

            svelte: {
                class: SelectionWindow,
                target: document.body,
                context: { moduleAPI }
            }
        });
    }
}