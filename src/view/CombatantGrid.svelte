<script>
   import SelectableActor from "./SelectableActor.svelte";
   import { createEventDispatcher } from "svelte";

   export let combatants;

   const dispatch = createEventDispatcher();

   function _onCombatantSelected(combatant)
   {
      dispatch("combatantSelected", combatant);
   }

</script>

<main>
   <span class="drag-target title">Selectable Actors</span>
   <div class="drag-target grid">
      {#each combatants as combatant (combatant.id)}
         <SelectableActor
          isSelected="{combatant.isSelected}"
          name="{combatant.name}"
          icon="{combatant.icon}"
          on:selected={(ev) => _onCombatantSelected(combatant)}
         />
      {/each}
   </div>
</main>

<style lang="scss">
   main {
      height: 100%;
      flex: 3 1;
      display: flex;
      flex-flow: column nowrap;
      gap: 5px;
   }

   .grid {
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: right;
      align-items: flex-start;
      align-content: flex-start;
      overflow: auto;
      flex: 3 1;
      gap: 2px;
      padding: 5px;
   }

   .title {
      color: $secondary-color;
      opacity: 50%;
      border-bottom: 1px solid $primary-color;
   }
</style>