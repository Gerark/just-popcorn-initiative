<script>
   import { getContext } from 'svelte';
   import { EmptyApplicationShell } from '#runtime/svelte/component/core';
   import { draggable } from '#runtime/svelte/store/position';
   import {
      selectableCombatants,
      previousCombatants,
      isAnyCombatantSelected,
      selectedCombatantId
   } from "../ModuleStore.js";
   import CombatantList from "./CombatantList.svelte";
   import CombatantGrid from "./CombatantGrid.svelte";
   import CombatantSelectionToolbox from "./CombatantSelectionToolbox.svelte";
   import { errorNotification } from "../ModuleUtils.js";

   export let elementRoot;

   const { application, moduleAPI } = getContext('#external');
   const position = application.position;

   function _focusToken()
   {
      moduleAPI.focusCombatantToken($selectedCombatantId);
   }

   function _onConfirm()
   {
      moduleAPI.executePassTurnTo($selectedCombatantId);
   }
</script>

<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
   <main class="drag-target" use:draggable={{ position, hasTargetClassList: ['drag-target'] }}
         on:contextmenu={() => application.close()}
         role=application>
      <div class="drag-target content">
         <CombatantList combatants="{$previousCombatants}"></CombatantList>
         <CombatantGrid combatants="{$selectableCombatants}"
                        on:itemClick={(e) => $selectedCombatantId = e.detail.id}
                        on:itemDoubleClick={(e) => { $selectedCombatantId = e.detail.id; this.focusToken() }}></CombatantGrid>
         <CombatantSelectionToolbox on:focusToken={_focusToken}></CombatantSelectionToolbox>
      </div>
      {#if $isAnyCombatantSelected}
         <div class="drag-target selectButtonContainer">
            <button on:click={_onConfirm}>Confirm</button>
         </div>
      {/if}
   </main>
</EmptyApplicationShell>

<style lang="scss">
   .content {
      max-height: 380px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      gap: 5px;
   }

   main {
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

   .selectButtonContainer {
      flex-grow: 4;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-end;
   }
</style>