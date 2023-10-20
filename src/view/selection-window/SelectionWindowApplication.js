import { SvelteApplication } from '#runtime/svelte/application';

import SelectionWindow from './SelectionWindow.svelte';
import { ModuleUtils } from '../../ModuleUtils.js';
import { get as svelteGet } from "svelte/store";
import { selectionWindowState, selectionWindowAnchor } from "../../ModuleStore.js";

export default class SelectionWindowApplication extends SvelteApplication
{
    constructor(options)
    {
        super(options);

        try
        {
            // Attempt to parse client game setting and set application state.
            const app = this.state.get();


            const state = svelteGet(selectionWindowState);
            const anchor = svelteGet(selectionWindowAnchor);
            const isEmptyState = Object.keys(state).length !== 0;
            if (!isEmptyState)
            {
                app.position = state;
            }

            if (anchor !== "free" || isEmptyState)
            {
                const { x, y } = ModuleUtils.getPositionForSelectionWindow();
                app.position.left = x;
                app.position.top = y;
            }
            this.state.set(app);
        }
        catch (err)
        { /**/
        }
    }

    static get defaultOptions()
    {
        const moduleAPI = game.modules.get("just-popcorn-initiative").api;
        const { x, y } = ModuleUtils.getPositionForSelectionWindow();
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'popcorn-initiative-overlay',
            classes: ['selection-window'],
            resizable: true,
            width: 450,
            height: 310,
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