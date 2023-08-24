<script>
   export let name;
   export let icon;
   export let isHighlighted;
</script>

<div class="combatant-item drag-target" class:highlighted={isHighlighted}>
   <img class="combatant-icon drag-target" class:highlighted={isHighlighted} src="{icon}" alt="{icon}"/>
   <div class="combatant-name drag-target">{name}</div>
</div>

<style lang="scss">
   .combatant-item {
      width: auto;
      height: auto;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      border: 1px solid $secondary-disabled-color;
      border-radius: 10px;
      vertical-align: middle;
      filter: grayscale(100%);
   }

   .combatant-icon {
      width: 24px;
      margin: 1px 3px 1px 8px;
      height: auto;
   }

   .combatant-icon.highlighted {
      margin: 0px 2px 0px 8px;
   }

   .combatant-name {
      color: $primary-color;
      width: 89px;
      text-align: left;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   .combatant-item.highlighted {
      border: 2px solid $secondary-color;
   }
</style>