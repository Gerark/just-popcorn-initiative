<script>
   import { getContext } from 'svelte';
   import { EmptyApplicationShell } from '#runtime/svelte/component/core';
   import { draggable } from '#runtime/svelte/store/position';
   import { subscribeToCloseSelectionWindow } from "../ModuleStore.js";
   import CombatantList from "./CombatantList.svelte";
   import CombatantGrid from "./CombatantGrid.svelte";
   import CombatantSelectionToolbox from "./CombatantSelectionToolbox.svelte";

   export let elementRoot;

   const { application, moduleAPI } = getContext('#external');
   const position = application.position;

   subscribeToCloseSelectionWindow(() =>
   {
      application.close();
   });

   let selectableCombatants = [];
   let previousCombatants = [];
   let isAnyCombatantSelected = false;
   let selectedCombatantId = -1;
   updateData();

   export function updateData()
   {
      _updateSelectableCombatants();
      _updatePreviousCombatants();
   }

   function _updatePreviousCombatants()
   {
      previousCombatants = [];
      let turn = game.combat.turn;
      for (let i = 0; i <= turn; i++)
      {
         let combatant = game.combat.turns[i];
         previousCombatants.push({
            icon: combatant.img,
            name: combatant.name,
            id: combatant.id
         });
      }
   }

   function _updateSelectableCombatants()
   {
      selectableCombatants = [];
      isAnyCombatantSelected = false;
      let turn = game.combat.turn;
      for (let i = turn + 1; i < game.combat.turns.length; i++)
      {
         let combatant = game.combat.turns[i];
         const isSelected = selectedCombatantId === combatant.id;
         selectableCombatants.push({
            icon: combatant.img,
            name: combatant.name,
            id: combatant.id,
            isSelected: isSelected
         });
         if (isSelected)
         {
            isAnyCombatantSelected = true;
         }
      }
      selectableCombatants.sort((a, b) =>
      {
         return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      });

      if (!isAnyCombatantSelected)
      {
         selectedCombatantId = -1;
      }
      selectableCombatants = selectableCombatants;
   }

   function _selectCombatant(combatant)
   {
      selectableCombatants.forEach(x => x.isSelected = false);
      combatant.isSelected = true;
      selectedCombatantId = combatant.id;
      selectableCombatants = selectableCombatants;
      isAnyCombatantSelected = true;
   }

   function _focusToken(event)
   {
      moduleAPI.selectCombatantToken(selectedCombatantId);
   }

   function _onConfirm()
   {
      moduleAPI.executePassTurnTo(selectedCombatantId)
       .then(() =>
       {
          application.close();
       })
       .catch((error) =>
       {
          ui.notifications.error(error.message);
       });
   }

   function _onCombatantDoubleClick(combatant)
   {
      _selectCombatant(combatant);
      _focusToken();
   }
</script>

<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
   <main class="drag-target" use:draggable={{ position, hasTargetClassList: ['drag-target'] }}
         on:contextmenu={() => application.close()}
         role=application>
      <div class="drag-target content">
         <CombatantList combatants="{previousCombatants}"></CombatantList>
         <CombatantGrid combatants="{selectableCombatants}"
                        on:itemClick={(e) => _selectCombatant(e.detail)}
                        on:itemDoubleClick={(e) => _onCombatantDoubleClick(e.detail)}></CombatantGrid>
         <CombatantSelectionToolbox on:focusToken={_focusToken}></CombatantSelectionToolbox>
      </div>
      {#if isAnyCombatantSelected}
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