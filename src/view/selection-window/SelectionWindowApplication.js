import { SvelteApplication } from '#runtime/svelte/application';

import SelectionWindow from './SelectionWindow.svelte';
import { ModuleUtils } from '../../ModuleUtils.js';

export default class SelectionWindowApplication extends SvelteApplication
{
    static get defaultOptions()
    {
        const moduleAPI = game.modules.get("just-popcorn-initiative").api;
        const { w, h, x, y } = ModuleUtils.getSizeAndPositionForSelectionWindow();
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'popcorn-initiative-overlay',
            classes: ['selection-window'],
            resizable: true,
            width: w,
            height: h,
            left: x,
            top: y,

            svelte: {
                class: SelectionWindow,
                target: document.body,
                context: { moduleAPI }
            }
        });
    }
}