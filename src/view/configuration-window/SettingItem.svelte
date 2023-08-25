<script>
    import { roundArrow } from "tippy.js";
    import { tooltip } from "../tippy-action/tooltip.js";

    export let name;
    export let description;
    export let storeValue;

    function toggleStoreValue()
    {
        $storeValue = !$storeValue;
    }
</script>

<div class="option"
     use:tooltip={{content: `${description}`, placement: 'right', theme: 'just', arrow: roundArrow}}
     on:click={() => { toggleStoreValue(); }}>
    <span class="option-label">{name}</span>
    <input class="option-value" type="checkbox" bind:checked={$storeValue}/>
</div>


<style lang="scss">

  .option {
    background-color: $bg-color-table-item-odd;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    padding: 5px;
    cursor: default;
  }

  .option:nth-child(even) {
    background-color: $bg-color-table-item-even;
  }

  .option:hover {
    box-shadow: 0 0 0 1px $secondary-color;
  }

  .option-value {
    flex: 0;
  }

  .option:hover > .option-label {
    animation: slide-right .1s cubic-bezier(.25, .46, .45, .94) both
  }

  .option-label {
    flex: 1;
    text-align: left;
    margin-left: 5px;
    animation: slide-left .1s cubic-bezier(.25, .46, .45, .94) both
  }

  @keyframes slide-right {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(5px);
    }
  }

  @keyframes slide-left {
    0% {
      transform: translateX(5px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>