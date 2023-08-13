<script>

</script>

<main>
   <button class="toolboxButton fa-solid fa-bullseye" on:click></button>
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