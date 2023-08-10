<script>
   import { getContext } from 'svelte';
   import { EmptyApplicationShell } from '#runtime/svelte/component/core';
   import { draggable } from '#runtime/svelte/store/position';
   import SelectableActor from './SelectableActor.svelte';
   import SimpleActor from "./SimpleActor.svelte";
   import { subscribeToCloseRequestWindow } from "../ModuleStore.js";

   export let elementRoot;

   const { application, moduleAPI } = getContext('#external');
   const position = application.position;

   subscribeToCloseRequestWindow(() =>
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

   function _onCombatantSelected(combatant)
   {
      selectableCombatants.forEach(x => x.isSelected = false);
      combatant.isSelected = true;
      selectedCombatantId = combatant.id;
      selectableCombatants = selectableCombatants;
      isAnyCombatantSelected = true;
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
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
   <main class="drag-target" use:draggable={{ position, hasTargetClassList: ['drag-target'] }}
         on:contextmenu={() => application.close()}
         role=application>
      <div class="appIcon drag-target fa-solid fa-crosshairs fa-xl" alt="icon"></div>
      <h1 class="drag-target">Select the next Combatant</h1>
      <div class="content">
         <div class="drag-target combatant-container prev">
            {#each previousCombatants as combatant (combatant.id)}
               <SimpleActor
                name="{combatant.name}"
                icon="{combatant.icon}"
               />
            {/each}
         </div>
         <span class="fa-solid fa-caret-right fa-4x"></span>
         <div class="drag-target combatant-container">
            {#each selectableCombatants as combatant (combatant.id)}
               <SelectableActor
                isSelected="{combatant.isSelected}"
                name="{combatant.name}"
                icon="{combatant.icon}"
                on:selected={(ev) => _onCombatantSelected(combatant)}
               />
            {/each}
         </div>
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
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 10px;
   }

   .combatant-container {
      display: flex;
      flex-flow: row wrap;
      justify-content: right;
      align-items: center;
      align-content: center;
      gap: 10px;
   }

   .combatant-container.prev {
      min-width: 200px;
      align-items: flex-start;
      align-content: flex-start;
   }

   span {
      color: $primary-color
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

   .appIcon {
      position: absolute;
      margin: 7px 0px;
      max-width: 32px;
      color: $primary-color;
   }

   h1 {
      color: $primary-color;
      border-color: $primary-color;
      padding-bottom: 5px;
      font-size: small;
   }
</style>