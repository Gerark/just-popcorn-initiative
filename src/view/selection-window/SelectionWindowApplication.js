import { SvelteApplication } from '#runtime/svelte/application';

import SelectionWindow from './SelectionWindow.svelte';
import { ModuleUtils } from '../../ModuleUtils.js';
import { previousActorsDrawerOpen } from '../../ModuleStore.js';
import { get as svelteGet } from 'svelte/store';

export default class SelectionWindowApplication extends SvelteApplication
{
    static get defaultOptions()
    {
        const moduleAPI = game.modules.get("just-popcorn-initiative").api;
        const size = ModuleUtils.getSizeForSelectionWindow();
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'popcorn-initiative-overlay',
            classes: ['tjs-essential-svelte-esm'],
            resizable: true,
            width: size.w + (svelteGet(previousActorsDrawerOpen) ? 0 : -100),
            height: size.h,

            svelte: {
                class: SelectionWindow,
                target: document.body,
                context: { moduleAPI }
            }
        });
    }
}