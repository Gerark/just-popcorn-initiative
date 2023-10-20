<script>
    import { getContext } from "svelte";
    import { ApplicationShell } from '#runtime/svelte/component/core';
    import { settings } from "../../ModuleStore.js";
    import { Constants, locSettings } from "../../ModuleUtils.js";
    import { ModuleSettings } from "../../ModuleSettings.js";

    import { currentTheme } from "@gerark/just-svelte-lib/styles/themeStore";
    import {
        Theme,
        Flex,
        Button,
        Label,
        PropertyInspector,
        PropertyInspectorValueStore
    } from "@gerark/just-svelte-lib/components";
    import { ModuleAPI } from "../../ModuleAPI.js";

    export let elementRoot;

    let areCommonMacrosInstalled = ModuleAPI.instance.areCommonMacrosInstalled();

    const { application, moduleAPI } = getContext('#external');
    const headerButtonNoClose = application.reactive.storeAppOptions.headerButtonNoClose;
    setTimeout(() =>
    {
        headerButtonNoClose.set(true);
    }, 1);

    function installMacro()
    {
        moduleAPI.installCommonMacros();
        areCommonMacrosInstalled = true;
    }

    function close()
    {
        moduleAPI.closeConfig();
    }

    async function reset()
    {
        const reload = await Dialog.confirm({
            title: locSettings("reset-to-default-modal-title"),
            content: `<p>${locSettings("reset-to-default-modal-description")}</p>`
        });

        if (reload)
        {
            ModuleSettings.resetToDefault();
        }
    }
</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <Theme theme="{$currentTheme}">
        <Flex class="vertical thick scrollable" height="100%" width="100%" flex="{['1', '1, 1']}">
            <div class="property-inspector-container">
                <PropertyInspector height="100%" item="{$settings}" title="" --columns="1fr 2fr">
                    <Label let:key slot="name">{$settings[key].label}</Label>
                    <PropertyInspectorValueStore item="{$settings[key]}" let:key
                                                 slot="value"></PropertyInspectorValueStore>
                </PropertyInspector>
            </div>
            <Flex class="horizontal" height="auto">
                {#if !areCommonMacrosInstalled}
                    <Button class="btn secondary md" on:click={installMacro} width="50%"
                            tooltip="{locSettings(`${Constants.Options.InstallCommonMacros}-description`)}">
                        <span>{locSettings(`${Constants.Options.InstallCommonMacros}-title`)}</span>
                        <i class="fa fa-refresh"></i>
                    </Button>
                {/if}
                <Button class="btn warning md" on:click={reset} width="50%"
                        tooltip="{locSettings('reset-to-default-description')}">
                    <span>{locSettings(`reset-to-default-title`)}</span>
                    <i class="fa fa-refresh"></i>
                </Button>
                <Button class="btn success md" on:click={close} width="100%">
                    <span>{locSettings(`close.button`)}</span>
                    <i class="fa fa-check"></i>
                </Button>
            </Flex>
        </Flex>
    </Theme>
</ApplicationShell>

<style lang="scss">
  .property-inspector-container {
    width: 100%;
    height: 100%;
    min-height: 50px;
  }
</style>