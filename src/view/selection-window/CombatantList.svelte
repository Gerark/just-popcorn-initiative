<script>
   import SimpleActor from "./SimpleActor.svelte";
   import { locWindow } from "../../ModuleUtils.js";

   export let combatants;

</script>

<main>
   <span class="drag-target title">{locWindow(`previous-actors.title`)}</span>
   <div class="drag-target list">
      {#each combatants as combatant (combatant.id)}
         <SimpleActor
          name="{combatant.name}"
          icon="{combatant.icon}"
          isHighlighted="{combatant.isHighlighted}"
         />
      {/each}
   </div>
</main>

<style lang="scss">
   main {
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: right;
      align-items: flex-start;
      align-content: flex-start;
      flex: 1 1;
      gap: 4px;
   }

   .list {
      height: 100%;
      flex: 1 1;
      display: flex;
      flex-flow: column nowrap;
      gap: 5px;
      padding: 5px;
      overflow: auto;
   }

   .title {
      width: 100%;
      color: $secondary-color;
      opacity: 50%;
      border-bottom: 1px solid $primary-color;
   }
</style>