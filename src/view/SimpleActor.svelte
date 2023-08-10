<script>
   export let name;
   export let icon;
</script>

<div class="combatant-item drag-target">
   <img class="combatant-icon drag-target" src="{icon}" alt="{icon}"/>
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
      border: 1px solid #CCC;
      border-radius: 10px;
      box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
      vertical-align: middle;
      filter: grayscale(100%);
   }

   .combatant-icon {
      width: 24px;
      margin: 1px 3px 1px 8px;
      height: auto;
   }

   .combatant-name {
      color: $primary-color;
      width: 100px;
      text-align: left;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }
</style>