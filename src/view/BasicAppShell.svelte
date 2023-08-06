<script>
   import { getContext }         from 'svelte';
   import { EmptyApplicationShell } from '#runtime/svelte/component/core';
   import { draggable }             from '#runtime/svelte/store/position';
   import SelectableActor from './SelectableActor.svelte'

   export let elementRoot;

   const context = getContext('#external');
   const position = context.application.position;

   let actors = []
   let isAnyActorSelected = false;
   let currentActorId = -1;
   updateData();

   export function updateData() {
      actors = [];
      isAnyActorSelected = false;
      game.combat.turns.forEach(turn => {
         const isSelected = currentActorId === turn.actorId;
         actors.push({
            icon : turn.img,
            name : turn.name,
            id : turn.actorId,
            isSelected : isSelected
         });
         if(isSelected) {
            isAnyActorSelected = true;
         }
      });
      actors.sort((a,b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 });

      if(!isAnyActorSelected) {
         currentActorId = -1;
      }
      actors = actors;
   }

   function onActorSelected(actor) {
      actors.forEach(x => x.isSelected = false);
      actor.isSelected = true;
      currentActorId = actor.id;
      actors = actors;
      isAnyActorSelected = true;
   }
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
   <main class="drag-target" use:draggable={{ position, hasTargetClassList: ['drag-target'] }}
         on:contextmenu={() => context.application.close()}
         role=application>
      <img class="appIcon" src="modules/just-popcorn-initiative/assets/icons/icon.webp" alt="icon"/>
      <h1 class="drag-target">Who goes next?</h1>
      <div class="drag-target combatant-container">
         {#each actors as actor (actor.id)}
            <SelectableActor
             isSelected="{actor.isSelected}"
             name="{actor.name}"
             icon="{actor.icon}"
             on:selected={(ev) => onActorSelected(actor)}
            />
         {/each}
      </div>
      {#if isAnyActorSelected}
         <div class="drag-target selectButtonContainer">
            <button>SELECT</button>
         </div>
      {/if}
   </main>
</EmptyApplicationShell>

<style lang="scss">
   .combatant-container {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 10px;
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
      max-width: 32px;
   }

   h1 {
      color: $primary-color;
      border-color: $primary-color;
      padding-bottom: 5px;
   }
</style>