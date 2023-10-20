import { locSettings, Constants } from "./ModuleUtils.js";
import { StoreUpdater } from "./StoreUpdater.js";
import {
    canSelectWhenRoundIsOver,
    overrideEndTurnButton,
    canLastActorSelectThemselves,
    selectionWindowAnchor,
    layoutCorners,
    statLabels,
    combatantImageTypes,
    currentIconImageType,
    selectionWindowState
} from "./ModuleStore.js";
import { ConfigurationWindowApplicationProxy } from "./view/configuration-window/ConfigurationWindowApplication.js";
import { get as svelteGet } from "svelte/store";
import { currentTheme } from "@gerark/just-svelte-lib/styles/themeStore";

export class ModuleSettings
{
    static initialize()
    {
        this._settings = [];
        this._registerSettings();

        combatantImageTypes.set([
            {
                value: Constants.CombatantImageType.token.id,
                label: locSettings(Constants.CombatantImageType.token.text)
            },
            {
                value: Constants.CombatantImageType.actor.id,
                label: locSettings(Constants.CombatantImageType.actor.text)
            }
        ]);
        layoutCorners.set([
            { value: "topLeft", label: locSettings(`${Constants.Options.SelectionWindowAnchor}-topLeft`) },
            { value: "topRight", label: locSettings(`${Constants.Options.SelectionWindowAnchor}-topRight`) },
            { value: "bottomLeft", label: locSettings(`${Constants.Options.SelectionWindowAnchor}-bottomLeft`) },
            {
                value: "bottomRight",
                label: locSettings(`${Constants.Options.SelectionWindowAnchor}-bottomRight`)
            },
            { value: "center", label: locSettings(`${Constants.Options.SelectionWindowAnchor}-center`) },
            { value: "free", label: locSettings(`${Constants.Options.SelectionWindowAnchor}-free`) }
        ]);
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

    static async resetToDefault()
    {
        let reloadRequired = false;
        this._settings.forEach((x) =>
        {
            x.storeValue.set(x.defaultValue);
            reloadRequired |= this._setSettingValue(x.id, x.defaultValue);
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
        this._addSetting(Constants.Options.SelectionWindowAnchor, String, "free", false, selectionWindowAnchor);
        this._addSetting(Constants.Options.Theme, String, "dark-juice", false, currentTheme);
        this._addSetting(Constants.Options.CombatantImageType, String, Constants.CombatantImageType.token.id, false, currentIconImageType);
        this._addSetting(Constants.Options.Stats, Array, [], false, statLabels);
        this._addSetting(Constants.Options.SelectionWindowState, Object, {}, false, selectionWindowState);
    }

    static _addSetting(id, type, defaultValue, requiresReload, storeValue, isGlobal = true)
    {
        const setting = this._createSetting(id, requiresReload, storeValue, defaultValue);
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

    static _createSetting(id, requiresReload, storeValue, defaultValue)
    {
        return { id, requiresReload, storeValue, defaultValue };
    }

    static _setSettingValue(id, value)
    {
        if (this._getSettingValue(id) !== value || typeof (value) === "object")
        {
            game.settings.set(Constants.ModuleName, id, value);
            const setting = game.settings.settings.get(`${Constants.ModuleName}.${id}`);
            return setting.requiresReload;
        }
        return false;
    }
}