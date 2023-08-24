<script>
   import SelectableActor from "./SelectableActor.svelte";
   import { createEventDispatcher } from "svelte";
   import { locWindow } from "../../ModuleUtils.js";

   export let combatants;

   const dispatch = createEventDispatcher();

   function _onItemClick(combatant)
   {
      dispatch("itemClick", combatant);
   }

   function _onItemDoubleClick(combatant)
   {
      dispatch("itemDoubleClick", combatant);
   }

   function _onItemMouseEnter(combatant)
   {
      dispatch("itemMouseEnter", combatant);
   }

   function _onItemMouseExit(combatant)
   {
      dispatch("itemMouseExit", combatant);
   }

</script>

<main>
   <span class="drag-target title">{locWindow(`selectable-actors.title`)}</span>
   <div class="drag-target grid">
      {#each combatants as combatant (combatant.id)}
         <SelectableActor
          isSelected="{combatant.isSelected}"
          isHighlighted="{combatant.isHighlighted}"
          name="{combatant.name}"
          icon="{combatant.icon}"
          owners="{combatant.owners}"
          on:click={(ev) => _onItemClick(combatant)}
          on:dblclick={(ev) => _onItemDoubleClick(combatant)}
          on:mouseenter={(ev) => _onItemMouseEnter(combatant)}
          on:mouseleave={(ev) => _onItemMouseExit(combatant)}
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
      gap: 0;
   }

   .grid {
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      overflow: auto;
      gap: 5px 2px;
      padding: 5px;
   }

   .grid::-webkit-scrollbar {
      width: 2px;
   }

   .grid::-webkit-scrollbar-thumb {
      background-color: $primary-color;
      outline: 1px solid $primary-color;
   }

   .title {
      color: $secondary-color;
      opacity: 50%;
      border-bottom: 1px solid $primary-color;
   }
</style>