<script>
   export let showIcon = false;
   export let icon = "";
   export let text = "";
   export let isCancelButton = false;

   $: showIcon = icon != null && icon.length > 0;
</script>

<button class="button" class:cancel={isCancelButton} class:icon={showIcon} on:click>
   <span>{text}</span>
   {#if showIcon}
      <i class="fa-solid fa-{icon}"></i>
   {/if}
</button>

<style lang="scss">

</style>