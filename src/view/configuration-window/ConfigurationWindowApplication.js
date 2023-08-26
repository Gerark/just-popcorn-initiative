import { SvelteApplication } from '#runtime/svelte/application';

import ConfigurationWindow from './ConfigurationWindow.svelte';
import { ModuleAPI } from '../../ModuleAPI.js';
import { locSettings } from '../../ModuleUtils.js';

export class ConfigurationWindowApplicationProxy extends FormApplication
{
    constructor(options = {})
    {
        super({}, options);
        ModuleAPI.instance.showConfig();
    }

    async _updateObject(event, formData)
    {
    }

    render()
    {
        this.close();
    }
}

export default class ConfigurationWindowApplication extends SvelteApplication
{
    static get defaultOptions()
    {
        const moduleAPI = game.modules.get("just-popcorn-initiative").api;
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'popcorn-initiative-config',
            classes: ['tjs-essential-svelte-esm'],
            resizable: true,
            title: locSettings("window-title"),
            width: 500,
            height: 300,

            svelte: {
                class: ConfigurationWindow,
                target: document.body,
                context: { moduleAPI }
            }
        });
    }
}