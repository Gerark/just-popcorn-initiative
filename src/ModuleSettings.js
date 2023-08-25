import { locSettings } from "./ModuleUtils.js";
import { Constants } from "./ModuleUtils.js";
import { canSelectWhenRoundIsOver, overrideEndTurnButton, canLastActorSelectThemselves } from "./ModuleStore.js";
import { ConfigurationWindowApplicationProxy } from "./view/configuration-window/ConfigurationWindowApplication.js";
import { get as svelteGet } from "svelte/store";

export class ModuleSettings
{
    static initialize()
    {
        this._registerSettings();
        overrideEndTurnButton.set(this._getSettingValue(Constants.Options.OverrideNextTurnButton));
        canSelectWhenRoundIsOver.set(this._getSettingValue(Constants.Options.CanSelectWhenRoundIsOver));
        canLastActorSelectThemselves.set(this._getSettingValue(Constants.Options.CanLastActorSelectThemselves));
    }

    static async save()
    {
        let reloadRequired = false;
        reloadRequired |= this._setSettingValue(Constants.Options.OverrideNextTurnButton, svelteGet(overrideEndTurnButton));
        reloadRequired |= this._setSettingValue(Constants.Options.CanSelectWhenRoundIsOver, svelteGet(canSelectWhenRoundIsOver));
        reloadRequired |= this._setSettingValue(Constants.Options.CanLastActorSelectThemselves, svelteGet(canLastActorSelectThemselves));
        if (reloadRequired)
        {
            await SettingsConfig.reloadConfirm({ world: true });
        }
    }

    static _registerSettings()
    {
        game.settings.registerMenu(Constants.ModuleName, "configuration", {
            name: locSettings("configure.button"),
            label: locSettings("configure.button"),
            icon: "fas fa-gear",
            type: ConfigurationWindowApplicationProxy,
            restricted: true
        });
        this._addSetting(Constants.Options.OverrideNextTurnButton, Boolean, true, true, overrideEndTurnButton);
        this._addSetting(Constants.Options.CanSelectWhenRoundIsOver, Boolean, true, false, canSelectWhenRoundIsOver);
        this._addSetting(Constants.Options.CanLastActorSelectThemselves, Boolean, false, false, canLastActorSelectThemselves);
    }

    static _addSetting(id, type, defaultValue, requiresReload, storeVariable)
    {
        game.settings.register(Constants.ModuleName, id, {
            name: locSettings(`${id}-title`),
            hint: locSettings(`${id}-description`),
            scope: "world",
            config: false,
            default: defaultValue,
            requiresReload,
            type,
            onChange: (newValue) =>
            {
                storeVariable.set(newValue);
            }
        });
    }

    static _getSettingValue(id)
    {
        return game.settings.get(Constants.ModuleName, id);
    }

    static _setSettingValue(id, value)
    {
        if (this._getSettingValue(id) !== value)
        {
            game.settings.set(Constants.ModuleName, id, value);
            const setting = game.settings.settings.get(`${Constants.ModuleName}.${id}`);
            return setting.requiresReload;
        }
        return false;
    }
}