<script>
    import { getContext } from 'svelte';
    import { ApplicationShell } from '#runtime/svelte/component/core';
    import { Timing } from "@typhonjs-fvtt/runtime/util";
    import { locWindow } from "../../ModuleUtils.js";
    import { ModuleSettings } from "../../ModuleSettings.js";
    import {
        selectableCombatants,
        previousCombatants,
        isAnyCombatantSelected,
        selectedCombatantId,
        toolboxActions,
        showActorStats,
        isSelectionWindowHovered,
        isTokenPickerRunning,
        selectionWindowState
    } from "../../ModuleStore.js";
    import { currentTheme } from "@gerark/just-svelte-lib/styles/themeStore";
    import {
        Theme,
        Flex,
        TabControl,
        Tab,
        Button,
        Typography,
        ButtonToolbar,
        GenericTooltip
    } from "@gerark/just-svelte-lib/components";
    import CombatantGrid from "./CombatantGrid.svelte";
    import TokenPicker from "./TokenPicker.svelte";
    import { CanvasInteraction } from "../../CanvasInteraction.js";

    export let elementRoot;

    const { application, moduleAPI } = getContext('#external');
    const headerButtonNoClose = application.reactive.storeAppOptions.headerButtonNoClose;
    // Application position store reference. Stores need to be a top level variable to be accessible for reactivity.
    const position = application.position;

    // A debounced callback that serializes application state after 500-millisecond delay.
    const storePosition = Timing.debounce(() =>
    {
        selectionWindowState.set(application.state.get().position);
        ModuleSettings.saveSetting(selectionWindowState);
    }, 500);

    // Reactive statement to invoke debounce callback on TJSPosition changes.
    $: storePosition($position);
    setTimeout(() =>
    {
        headerButtonNoClose.set(true);
    }, 1);

    function _panToToken(id)
    {
        CanvasInteraction.panToCombatantToken(id);
    }

    function _highlightToken(event, id, highlight = true)
    {
        CanvasInteraction.highlightCombatantToken(event, id, highlight);
    }

    function _onConfirm()
    {
        moduleAPI.executePassTurnTo($selectedCombatantId);
    }

    function _onWindowHover(isHover)
    {
        $isSelectionWindowHovered = isHover;
    }
</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <div style:width="100%"
         style:height="100%"
         on:mouseenter={(e) => _onWindowHover(true)}
         on:mouseleave={(e) => _onWindowHover(false)}
         role=application>
        <Theme theme="{$currentTheme}">
            <Flex class="background vertical" height="100%" width="100%"
                  flex="{['1 1', '0 0']}">
                {#if !$isTokenPickerRunning}
                    <Flex class="horizontal  clip-overflow" height="100%" min-height="50px" flex="{['1 0','0 0']}">
                        <TabControl>
                            <Typography slot="header" class="size-sm align-center" let:tab>{tab.label}</Typography>
                            <Tab
                                    data="{{label: locWindow(`selectable-actors.title`) + ' (' + $selectableCombatants.length + ')'}}">
                                <CombatantGrid combatants="{$selectableCombatants}"
                                               on:itemClick={(e) => $selectedCombatantId = e.detail.id}
                                               on:itemDoubleClick={(e) => { $selectedCombatantId = e.detail.id; _panToToken($selectedCombatantId) }}
                                               on:itemMouseEnter={(e) => { _highlightToken(e, e.detail.id, true); }}
                                               on:itemMouseExit={(e) => { _highlightToken(e, e.detail.id, false); }}
                                               showStats="{$showActorStats}">
                                </CombatantGrid>
                            </Tab>
                            <Tab
                                    data="{{label: locWindow(`previous-actors.title`) + ' (' + $previousCombatants.length + ')'}}">
                                <CombatantGrid combatants="{$previousCombatants}" showStats="{$showActorStats}"
                                               areCombatantInteractable="{false}">
                                </CombatantGrid>
                            </Tab>
                        </TabControl>
                        <div style="padding: var(--tjust-padding-xl);width:100%;height:100%;box-sizing: border-box;">
                            <ButtonToolbar items="{$toolboxActions}" direction="vertical"></ButtonToolbar>
                        </div>
                    </Flex>
                    <Flex class="horizontal thick" height="auto">
                        <Button class="btn error md" on:click="{() => moduleAPI.closeSelectionWindow()}"
                                width="100%">
                            {locWindow(`close.button`)}
                            <i class="fa fa-xmark"></i>
                        </Button>
                        {#if $isAnyCombatantSelected}
                            <Button class="btn success md" on:click="{_onConfirm}" width="100%">
                                {locWindow(`confirm.button`)}
                                <i class="fa fa-check"></i>
                            </Button>
                        {/if}
                    </Flex>
                {:else}
                    <TokenPicker
                            on:mouseenter={(e) => _onWindowHover(true)}
                            on:mouseleave={(e) => _onWindowHover(false)}>
                    </TokenPicker>
                {/if}
            </Flex>
        </Theme>
    </div>
</ApplicationShell>

<style lang="scss">
  .content {
    max-height: var(--max-height);
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    gap: 5px;
    flex: 1;
  }

  .modalButtonContainer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    margin-top: auto;
    gap: 5px;
  }
</style>