<script>
   import { getContext, onMount } from 'svelte';
   import { EmptyApplicationShell } from '#runtime/svelte/component/core';
   import { draggable } from '#runtime/svelte/store/position';
   import { locWindow } from "../../ModuleUtils.js";
   import { ModuleSettings } from "../../ModuleSettings.js";
   import {
      selectableCombatants,
      previousCombatants,
      isAnyCombatantSelected,
      selectedCombatantId,
      toolboxActions,
      isSelectionWindowHovered, isTokenPickerRunning, previousActorsDrawerOpen
   } from "../../ModuleStore.js";
   import CombatantList from "./CombatantList.svelte";
   import CombatantGrid from "./CombatantGrid.svelte";
   import CombatantSelectionToolbox from "./Toolbox.svelte";
   import { CanvasInteraction } from "../../CanvasInteraction.js";
   import TokenPickerWatermark from "./TokenPickerWatermark.svelte";
   import SimpleButton from "../SimpleButton.svelte";
   import SimpleDrawer from "./SimpleDrawer.svelte";

   export let elementRoot;

   const { application, moduleAPI } = getContext('#external');
   const position = application.position;

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

   function _onActionRequested(ev)
   {
      ev.detail();
   }

   function _disableTokenPicker()
   {
      $isTokenPickerRunning = false;
   }

   function _onPreviousActorsToggled()
   {
      ModuleSettings.saveSetting(previousActorsDrawerOpen);
      _updateWindowSize();
   }

   function _updateWindowSize()
   {
      if ($previousActorsDrawerOpen)
      {
         elementRoot.style.width = "615px";
      }
      else
      {
         elementRoot.style.width = "515px";
      }
   }
</script>

<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
   <div class="drag-target mainContent" use:draggable={{ position, hasTargetClassList: ['drag-target'] }}
        on:mouseenter={(e) => _onWindowHover(true)}
        on:mouseleave={(e) => _onWindowHover(false)}
        role=application>
      <div class="drag-target content" style="--max-height: {(application.position.height - 60) + `px`}">
         <div class="drag-target prevActorContainer">
            <SimpleDrawer bind:isOpen={$previousActorsDrawerOpen} on:toggle={() => { _onPreviousActorsToggled() }}>
               <CombatantList combatants="{$previousCombatants}"></CombatantList>
            </SimpleDrawer>
         </div>
         <CombatantGrid combatants="{$selectableCombatants}"
                        on:itemClick={(e) => $selectedCombatantId = e.detail.id}
                        on:itemDoubleClick={(e) => { $selectedCombatantId = e.detail.id; _panToToken($selectedCombatantId) }}
                        on:itemMouseEnter={(e) => { _highlightToken(e, e.detail.id, true); }}
                        on:itemMouseExit={(e) => { _highlightToken(e, e.detail.id, false); }}>
         </CombatantGrid>
         <CombatantSelectionToolbox actions="{$toolboxActions}"
                                    on:actionRequested={_onActionRequested}></CombatantSelectionToolbox>
      </div>
      <div class="drag-target modalButtonContainer">
         {#if $isAnyCombatantSelected}
            <SimpleButton text="{locWindow(`confirm.button`)}" icon="check"
                          on:click={_onConfirm}/>
         {/if}
         <SimpleButton text="{locWindow(`close.button`)}" icon="xmark" isCancelButton="true"
                       on:click={ () => moduleAPI.closeSelectionWindow() }/>
      </div>
   </div>
   {#if $isTokenPickerRunning}
      <TokenPickerWatermark
       on:mouseenter={(e) => _onWindowHover(true)}
       on:mouseleave={(e) => _onWindowHover(false)}
       on:click={(e) => _disableTokenPicker()}></TokenPickerWatermark>
   {/if}
</EmptyApplicationShell>

<style lang="scss">
   .mainContent {
      text-align: center;
      display: flex;
      flex-direction: column;
      background: linear-gradient(0deg, $bg-color-primary 88%, $bg-color-primary 100%);
      border-radius: 15px;
      border-color: $bg-color-primary;
      gap: 10px;
      height: 100%;
      width: 100%;
      padding: 8px;
   }

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

   .prevActorContainer {
      height: 100%;
      flex: auto 0;
   }

   .modalButtonContainer {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      margin-top: auto;
      gap: 5px;
   }
</style>