<script>
   import { createEventDispatcher } from "svelte";

   const dispatch = createEventDispatcher();

</script>

<main>
   <span class="title">Tools</span>
   <div class="toolboxList">
      <button class="toolboxButton fa-solid fa-bullseye" on:click={() => dispatch("focusToken")}></button>
      <button class="toolboxButton fa-solid fa-bullseye"></button>
      <button class="toolboxButton fa-solid fa-bullseye"></button>
      <button class="toolboxButton fa-solid fa-bullseye"></button>
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

   .toolboxButton {
      width: auto;
      height: auto;
      color: $primary-color;
      padding: 5px;
      display: inline-block;
      border: 1px solid #CCC;
      border-radius: 10px;
      cursor: pointer;
      vertical-align: middle;
      filter: grayscale(100%);
   }

   .toolboxButton:active {
      border: 1px solid $primary-color;
   }

   .toolboxButton:hover {
      border: 1px solid $secondary-color;
      color: $primary-color;
      filter: none;
   }
</style>