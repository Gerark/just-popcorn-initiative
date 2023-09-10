<script>
   import { createEventDispatcher } from "svelte";
   import { tooltip } from "../tippy-action/tooltip.js";
   import { roundArrow } from "tippy.js";

   const dispatch = createEventDispatcher();

   export let icon;
   export let command;
   export let tooltipText;
   export let label = "";
</script>

<main>
   <button
    class="button toolboxButton {icon || ''}"
    on:click={() => { dispatch("actionRequested", command) }}
    use:tooltip={{content: `${tooltipText}`, placement: 'right', theme: 'just', arrow: roundArrow}}>{label || ""}</button>
</main>

<style lang="scss">

   .toolboxButton {
      width: 28px;
      height: 28px;
      color: $primary-color;
      padding: 1px;
      margin: auto;
      border: 1px solid #CCC;
      border-radius: 10px;
      cursor: pointer;
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