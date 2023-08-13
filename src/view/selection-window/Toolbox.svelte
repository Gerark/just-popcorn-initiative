<script>
   import ToolboxButton from "./ToolboxButton.svelte";

   export let actions = [];
</script>

<main>
   <span class="title">Tools</span>
   <div class="toolboxList">
      {#each actions as action}
         <ToolboxButton icon="{action.icon}" command="{action.command}" on:actionRequested></ToolboxButton>
      {/each}
   </div>
</main>

<style lang="scss">
   main {
      display: flex;
      flex-flow: column nowrap;
   }

   .title {
      width: 100%;
      color: $secondary-color;
      opacity: 50%;
      border-bottom: 1px solid $primary-color;
   }

   .toolboxList {
      display: flex;
      flex-flow: column nowrap;
      gap: 2.5px;
      padding: 5px 0;
   }
</style>