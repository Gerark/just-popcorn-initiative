<script>
   export let name;
   export let icon;
   export let isSelected;
   export let isHighlighted;
   export let owners = [];
</script>

<main class:selected={isSelected} class:unselected={!isSelected} class:highlighted={isHighlighted}
      on:keydown on:click on:dblclick on:mouseenter on:mouseleave>
   <div class="combatant-item" class:selected={isSelected} class:unselected={!isSelected}
        class:highlighted={isHighlighted}>
      <img class="combatant-icon" src="{icon}" alt="{icon}"/>
      <div class="combatant-name">{name}</div>
   </div>
   <div class="owner-icon-container">
      {#each owners as owner}
         <div class="fa-solid fa-circle fa-xs owner-icon" style="{`--player-color:${owner.color};`}"></div>
      {/each}
   </div>
</main>


<style lang="scss">
   main {
      display: flex;
      flex-flow: column nowrap;
      cursor: pointer;
   }

   .combatant-item {
      max-width: 64px;
      width: auto;
      height: auto;
      display: flex;
      flex-flow: column nowrap;
      border: 1px solid $secondary-disabled-color;
      border-radius: 10px;
      vertical-align: middle;
      padding: 5px 5px 15px 5px;
      gap: 2.5px;
      text-align: center;
   }

   .owner-icon {
      color: var(--player-color);
      pointer-events: none;
   }

   .owner-icon-container {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      gap: 2px;
      transform: translate(0px, -11px);
      pointer-events: none;
   }

   main.unselected {
      animation: zoom-out 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
   }

   main.selected {
      animation: zoom-in 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
   }

   main:hover:not(.selected) {
      animation: zoom-in 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
   }

   main.highlighted:not(.selected) {
      animation: zoom-in 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
   }

   .combatant-item.unselected {
      filter: grayscale(100%);
   }

   .combatant-item.selected {
      border: 2px solid $primary-color;
   }

   .combatant-item.highlighted:not(.selected) {
      border: 1px solid $secondary-color;
      filter: none;
   }

   .combatant-item:active {
      border: 1px solid $primary-color;
   }

   .combatant-item:hover:not(.selected) {
      border: 1px solid $secondary-color;
      filter: none;
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