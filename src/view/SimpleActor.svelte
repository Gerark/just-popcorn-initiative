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
      max-width: 48px;
      width: auto;
      height: auto;
      display: inline-block;
      border: 1px solid #CCC;
      border-radius: 10px;
      box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
      vertical-align: middle;
      padding: 5px;
      text-align: center;
      filter: grayscale(100%);
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
</style>