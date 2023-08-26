<script>
    import { draggable } from '#runtime/svelte/store/position';
    import { getContext } from "svelte";
    import { EmptyApplicationShell } from '#runtime/svelte/component/core';
    import { settings } from "../../ModuleStore.js";
    import { locSettings } from "../../ModuleUtils.js";
    import SettingItem from "./SettingItem.svelte";
    import SimpleButton from "../SimpleButton.svelte";

    export let elementRoot;

    const { application, moduleAPI } = getContext('#external');
    const position = application.position;

    function close()
    {
        moduleAPI.closeConfig();
    }
</script>

<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
    <div class="drag-target mainContent" use:draggable={{ position, hasTargetClassList: ['drag-target'] }}
         role=application>
        <span class="drag-target title">{locSettings("configuration.title")}</span>
        <div class="drag-target setting-list">
            {#each $settings as setting}
                {#if setting.separator}
                    <div class="setting-separator"></div>
                {:else}
                    <SettingItem name="{setting.name}" description="{setting.description}"
                                 storeValue="{setting.value}" command="{setting.command}"
                                 options="{setting.options}"></SettingItem>
                {/if}
            {/each}
        </div>
        <div class="drag-target modalButtonContainer">
            <SimpleButton icon="check" text="{locSettings(`close.button`)}"
                          on:click={close}></SimpleButton>
        </div>
    </div>
</EmptyApplicationShell>

<style lang="scss">
  .mainContent {
    text-align: center;
    display: flex;
    flex-direction: column;
    background-color: $bg-color-primary;
    border-radius: 15px;
    gap: 5px;
    height: 100%;
    width: 100%;
    padding: 8px;
    color: $primary-color;
  }

  .title {
    border-bottom: 1px solid $primary-color;
    padding-bottom: 5px;
  }

  .setting-list {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }

  .setting-separator {
    border-bottom: 1px solid $primary-color
  }
</style>