<script>
   import { createEventDispatcher } from "svelte";

   const dispatch = createEventDispatcher();

   export let isOpen = true;

   function toggle()
   {
      isOpen = !isOpen;
      dispatch("toggle");
   }
</script>

<div class="drawer">
   {#if isOpen}
      <slot></slot>
   {/if}
   <button class="button handle" on:click={toggle}>
      {#if isOpen}
         <i class="fa-solid fa-caret-left fa-xs handle-icon"></i>
      {:else}
         <i class="fa-solid fa-caret-right fa-xs handle-icon"></i>
      {/if}
   </button>
</div>

<style lang="scss">
   .drawer {
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
   }

   .handle {
      width: 5px;
      border-width: 0px;
      border-right-width: 1px;
   }

   .handle-icon {
      text-align: left;
      margin: 0 0 0 -2px;
   }
</style>