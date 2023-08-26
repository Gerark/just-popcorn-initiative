import { locSettings, Constants } from "./ModuleUtils.js";
import { StoreUpdater } from "./StoreUpdater.js";
import {
    canSelectWhenRoundIsOver,
    overrideEndTurnButton,
    canLastActorSelectThemselves,
    previousActorsDrawerOpen,
    selectionWindowSize, selectionWindowPosition
} from "./ModuleStore.js";
import { ConfigurationWindowApplicationProxy } from "./view/configuration-window/ConfigurationWindowApplication.js";
import { get as svelteGet } from "svelte/store";

export class ModuleSettings
{
    static initialize()
    {
        this._settings = [];
        this._registerSettings();
        StoreUpdater.updateSettings();
    }

    static async save()
    {
        let reloadRequired = false;
        this._settings.forEach((x) =>
        {
            reloadRequired |= this._setSettingValue(x.id, svelteGet(x.storeValue));
        });
        if (reloadRequired)
        {
            await SettingsConfig.reloadConfirm({ world: true });
        }
    }

    static async saveSetting(storeValue)
    {
        const setting = this._settings.find((x) =>
        {
            return x.storeValue === storeValue;
        });
        if (setting != null)
        {
            const reloadRequired = this._setSettingValue(setting.id, svelteGet(setting.storeValue));
            if (reloadRequired)
            {
                await SettingsConfig.reloadConfirm({ world: true });
            }
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
        this._addSetting(Constants.Options.PreviousActorsDrawerOpen, Boolean, true, false, previousActorsDrawerOpen, false);
        this._addSetting(Constants.Options.SelectionWindowSize, String, Constants.WindowSize.Normal.id, false, selectionWindowSize);
        this._addSetting(Constants.Options.SelectionWindowPosition, String, "center", false, selectionWindowPosition);
    }

    static _addSetting(id, type, defaultValue, requiresReload, storeValue, isGlobal = true)
    {
        const setting = this._createSetting(id, requiresReload, storeValue);
        this._settings.push(setting);
        game.settings.register(Constants.ModuleName, id, {
            name: locSettings(`${id}-title`),
            hint: locSettings(`${id}-description`),
            scope: isGlobal ? "world" : "client",
            config: false,
            default: defaultValue,
            requiresReload,
            type,
            onChange: (newValue) =>
            {
                storeValue.set(newValue);
            }
        });
        storeValue.set(this._getSettingValue(id));
    }

    static _getSettingValue(id)
    {
        return game.settings.get(Constants.ModuleName, id);
    }

    static _createSetting(id, requiresReload, storeValue)
    {
        return { id, requiresReload, storeValue };
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