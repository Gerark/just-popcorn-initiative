<script>
    import { currentTokenPickerTarget, isTokenPickerRunning } from "../../ModuleStore.js";
    import SelectableActor from "./SelectableActor.svelte";
    import { locWindow } from "../../ModuleUtils.js";

</script>

<div class="tokenPickerWatermark" on:mouseenter on:mouseleave on:click>
    <div class="info">
        {@html locWindow(`combatant-picker.title`)}
    </div>
    <SelectableActor icon="{$currentTokenPickerTarget && $currentTokenPickerTarget.icon}"
                     name="{$currentTokenPickerTarget ? $currentTokenPickerTarget.name : ``}"
                     owners="{$currentTokenPickerTarget ? $currentTokenPickerTarget.owners : []}"
                     isSelected="{true}"
                     isHighlighted="{false}"></SelectableActor>
</div>

<style lang="scss">
  .tokenPickerWatermark {
    background-color: $bg-color-primary;
    color: $primary-color;
    position: fixed;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    font-size: 24px;
    gap: 20px;
  }

  .info {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
</style>