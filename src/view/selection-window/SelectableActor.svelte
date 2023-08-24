<script>
   export let name;
   export let icon;
   export let isSelected;
   export let isHighlighted;
   export let owners = [];
</script>

<main class:selected={isSelected} class:unselected={!isSelected} class:highlighted={isHighlighted}
      on:keydown on:click on:dblclick on:mouseenter on:mouseleave}>
   <div class="combatant-item" class:selected={isSelected} class:unselected={!isSelected}
        class:highlighted={isHighlighted}>
      <img class="combatant-icon" src="{icon}" alt="{icon}"/>
      <div class="combatant-name">{name}</div>
   </div>
   <div class="owner-icon-container">
      {#each owners as owner}
         <div class="fa-solid fa-circle owner-icon" style="{`--player-color:${owner.color};`}"></div>
      {/each}
   </div>
</main>


<style lang="scss">
   main {
      background-color: $bg-color-primary;
      width: 64px;
      height: 85px;
      display: flex;
      flex-flow: column nowrap;
      cursor: pointer;
      border: 1px solid $secondary-disabled-color;
      border-radius: 10px;
      gap: 2px;
   }

   .combatant-item {
      display: flex;
      flex-flow: column nowrap;
      vertical-align: middle;
      text-align: center;
   }

   .owner-icon {
      color: var(--player-color);
      pointer-events: none;
      font-size: 5px;
   }

   .owner-icon-container {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      gap: 2px;
      pointer-events: none;
   }

   main.unselected {
      animation: zoom-out 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
   }

   main.selected {
      animation: zoom-in 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
      border: 2px solid $primary-color;
   }

   .main:active {
      border: 2px solid $primary-color;
   }

   main:hover:not(.selected) {
      animation: zoom-in 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
      border: 2px solid $secondary-color;
   }

   main.highlighted:not(.selected) {
      animation: zoom-in 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
      border: 2px solid $secondary-color;
   }

   .combatant-item.unselected {
      filter: grayscale(100%);
   }

   .combatant-item.selected {
   }

   .combatant-item.highlighted:not(.selected) {
      filter: none;
   }

   .combatant-item:hover:not(.selected) {
      filter: none;
   }

   .combatant-icon {
      width: auto;
      height: auto;
      margin: 5px 5px 0 5px;
   }

   .combatant-name {
      color: white;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 3px 0 3px;
   }

   @keyframes zoom-in {
      100% {
         transform: scale(1.1);
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