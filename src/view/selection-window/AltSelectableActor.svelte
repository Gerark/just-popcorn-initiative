<!--<script>
   export let name;
   export let icon;
   export let isSelected;
   export let isHighlighted;
   export let owners = [];
   export let actorSize = 0;
   export let showStats = true;
   export let stats = [];

   let baseWidth = 76;
   let baseHeight = 128;
   $: statsCount = showStats ? stats.length : 0;
   $: statHeight = (18 + (actorSize * 2.5));
   $: finalAvatarHeight = baseHeight + (actorSize * 10 * 2);
   $: finalHeight = finalAvatarHeight + (statsCount === 0 ? 0 : (statsCount - 1) * statHeight);
</script>

<div class="main" class:box={isSelected}
     class:selected={isSelected} class:unselected={!isSelected} class:highlighted={isHighlighted}
     style:--alt-selectable-actor-width="{76 + actorSize * 10}px"
     style:--alt-selectable-actor-height="{finalHeight}px"
     style:--alt-selectable-actor-font-size="{14 + actorSize * 2}px"
     on:keydown on:click on:dblclick on:mouseenter on:mouseleave}>
   <img class="icon" src="{icon}" alt="{icon}" style:height="{finalAvatarHeight}px"/>
   <div class="name">{name}</div>
   {#if owners && owners.length > 0}
      <div class="owner-icon-container">
         {#each owners as owner}
            <div class="fa-solid fa-circle owner-icon"
                 style:color="{owner.color}"
                 style:font-size="{(14 + actorSize) * 0.5}px"></div>
         {/each}
      </div>
   {/if}
   {#if showStats && stats.length > 0}
      <div class="stat-container">
         {#each stats as stat}
            <div class="stat-item">{@html stat}</div>
         {/each}
      </div>
   {/if}
</div>

<style lang="scss">
   .main {
      position: relative;
      background-color: $bg-color-primary;
      border: 2px solid transparent;
      border-radius: 10px;
      width: var(--alt-selectable-actor-width);
      height: var(--alt-selectable-actor-height);
      overflow: hidden;
      cursor: pointer;
      display: flex;
      flex-flow: column nowrap;
      justify-items: center;
      justify-content: flex-start;
      align-content: flex-start;
      font-size: var(--alt-selectable-actor-font-size);
      scale: 1;

      span {
         position: absolute;
         display: block;
         z-index: 1;
      }

      &.highlighted:not(.selected) {
         border-bottom: 2px solid $primary-color;

         .icon {
            animation: zoom-image-in 0.25s ease-out both;
         }
      }

      &:hover:not(.selected) {
         border-bottom: 2px solid $primary-color;

         .icon {
            animation: zoom-image-in 0.25s ease-out both;
         }
      }

      &.unselected {
      }

      &.selected {
         border: 2px solid $primary-color;
         border-radius: 10px;

         .icon {
            animation: zoom-image-in-x2 0.25s ease-out both;
         }
      }

      .icon {
         position: absolute;
         object-fit: cover;
         border: none;
         z-index: -1;
         animation: zoom-image-out 0.25s ease-out both;
      }

      .name {
         background: #000000CC;
         color: white;
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
         padding: 2px 2px 2px 2px;
      }

      .stat-container {
         color: white;
         background: #000000CC;
         display: flex;
         flex-flow: column nowrap;
         align-items: center;
         align-content: center;
         justify-content: center;
         margin-top: auto;
         max-height: 120px;

         div {
            width: 100%;
            margin: auto;
            padding: 0 1px;
            border-top: 1px solid white;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
         }

         div:nth-child(n+2) {
            background: black;
         }
      }

      .owner-icon-container {
         display: flex;
         background: #000000FF;
         flex-flow: row nowrap;
         justify-content: center;
         align-self: flex-start;
         gap: 2px;
         pointer-events: none;
         z-index: 1;
         padding: 2px 4px;
         border-radius: 8px;
         margin: 1px;

         .owner-icon {
            pointer-events: none;
         }
      }
   }

   @keyframes zoom-image-out {
      from {
         transform: scale(1.1) translateY(-5px) rotateZ(2.5deg);
         filter: grayscale(0%) opacity(100%);
      }
      to {
         transform: scale(1) translateY(0px) rotateZ(0deg);
         filter: grayscale(100%) opacity(75%);
      }
   }

   @keyframes zoom-image-in {
      from {
         transform: scale(1) translateY(0px) rotateZ(0deg);
         filter: grayscale(100%) opacity(75%);
      }
      to {
         transform: scale(1.1) translateY(-5px) rotateZ(2.5deg);
         filter: grayscale(0%) opacity(100%);
      }
   }

   @keyframes zoom-image-in-x2 {
      from {
         transform: scale(1.1) translateY(-5px) rotateZ(2.5deg);
         filter: grayscale(0%) opacity(100%);
      }
      to {
         transform: scale(1.2) translateY(-5px) rotateZ(5deg);
         filter: grayscale(0%) opacity(100%);
      }
   }
</style>-->