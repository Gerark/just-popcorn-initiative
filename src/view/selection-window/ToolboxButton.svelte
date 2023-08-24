<script>
   import { createEventDispatcher } from "svelte";
   import { tooltip } from "../tippy-action/tooltip.js";
   import { roundArrow } from "tippy.js";

   const dispatch = createEventDispatcher();

   export let icon;
   export let command;
   export let tooltipText;
</script>

<main>
   <button
    class="button toolboxButton {icon}"
    on:click={() => { dispatch("actionRequested", command) }}
    use:tooltip={{content: `${tooltipText}`, placement: 'right', theme: 'just', arrow: roundArrow}}></button>
</main>

<style lang="scss">

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