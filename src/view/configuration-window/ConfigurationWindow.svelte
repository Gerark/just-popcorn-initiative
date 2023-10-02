<script>
   import {draggable} from '#runtime/svelte/store/position';
   import {getContext} from "svelte";
   import {EmptyApplicationShell} from '#runtime/svelte/component/core';
   import {settings} from "../../ModuleStore.js";
   import {locSettings} from "../../ModuleUtils.js";
   import SettingItem from "./SettingItem.svelte";
   import SimpleButton from "../SimpleButton.svelte";
   import PropertyInspector from "@gerark/just-svelte-lib/components/PropertyInspector/PropertyInspector.svelte";
   import PropertyInspectorValueStore
      from "@gerark/just-svelte-lib/components/PropertyInspector/PropertyInspectorValueStore.svelte";
   import Label from "@gerark/just-svelte-lib/components/Label/Label.svelte";
   import Theme from "@gerark/just-svelte-lib/components/Theme/Theme.svelte";
   import {createDefaultThemes} from "@gerark/just-svelte-lib/styles/createTheme";
   import {writable} from "svelte/store";

   export let elementRoot;

   const {application, moduleAPI} = getContext('#external');
   const position = application.position;

   function close() {
      moduleAPI.closeConfig();
   }

   export const allThemes = writable(createDefaultThemes());
</script>

<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
   <Theme theme="{$allThemes[0].value}">
      <div class="drag-target mainContent" role=application
           use:draggable={{ position, hasTargetClassList: ['drag-target'] }}>
         <Label>{locSettings("configuration.title")}</Label>
         <PropertyInspector item="{$settings}" title="Configuration">
            <Label let:key slot="name">{$settings[key].label}</Label>
            <PropertyInspectorValueStore item="{$settings[key]}" let:key slot="value"></PropertyInspectorValueStore>
         </PropertyInspector>
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
            <SimpleButton icon="check" on:click={close}
                          text="{locSettings(`close.button`)}"></SimpleButton>
         </div>
      </div>
   </Theme>
</EmptyApplicationShell>

<style lang="scss">
   .mainContent {
      text-align: center;
      display: flex;
      flex-direction: column;
      background-color: var(--theme-just-bg-color);
      border-radius: 15px;
      gap: 5px;
      cursor: default;
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