<script>
   import { createEventDispatcher } from "svelte";

   export let name;
   export let icon;
   export let isSelected;

   const dispatch = createEventDispatcher();

   function onActorSelected()
   {
      dispatch("selected");
   }
</script>

<div class="combatant-item" class:selected={isSelected} class:unselected={!isSelected} on:keydown={onActorSelected}
     on:click={onActorSelected}>
   <img class="combatant-icon" src="{icon}" alt="{icon}"/>
   <div class="combatant-name">{name}</div>
</div>

<style lang="scss">
   .combatant-item {
      max-width: 64px;
      width: auto;
      height: auto;
      display: inline-block;
      border: 1px solid #CCC;
      border-radius: 10px;
      cursor: pointer;
      vertical-align: middle;
      padding: 5px;
      text-align: center;
   }

   .unselected {
      animation: zoom-out 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
      filter: grayscale(100%);
   }

   .selected {
      border: 2px solid $primary-color;
      animation: zoom-in 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
   }

   .combatant-item:active {
      border: 1px solid $primary-color;
   }

   .combatant-item:hover:not(.selected) {
      border: 1px solid $secondary-color;
      filter: none;
      animation: zoom-in-half 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
   }

   .combatant-icon {
      width: auto;
      height: auto;
   }

   .combatant-name {
      color: white;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   @keyframes zoom-in {
      100% {
         transform: scale(1.05);
      }
   }

   @keyframes zoom-in-half {
      100% {
         transform: scale(1.0);
      }
   }

   @keyframes zoom-out {
      100% {
         transform: scale(0.95);
      }
   }

</style>