<script>
   import { getContext } from "svelte";
   import { ApplicationShell } from '#runtime/svelte/component/core';
   import { settings } from "../../ModuleStore.js";
   import { locSettings } from "../../ModuleUtils.js";

   import { currentTheme } from "@gerark/just-svelte-lib/styles/themeStore";
   import {
      Theme,
      Flex,
      Button,
      Label,
      PropertyInspector,
      PropertyInspectorValueStore
   } from "@gerark/just-svelte-lib/components";

   export let elementRoot;

   const { application, moduleAPI } = getContext('#external');
   const headerButtonNoClose = application.reactive.storeAppOptions.headerButtonNoClose;
   setTimeout(() =>
   {
      headerButtonNoClose.set(true);
   }, 1);

   function close()
   {
      moduleAPI.closeConfig();
   }
</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
   <Theme theme="{$currentTheme}">
      <Flex class="vertical thick scrollable" height="100%" width="100%" flex="{['1', '1, 1']}">
         <div class="property-inspector-container">
            <PropertyInspector height="100%" item="{$settings}" title="" --columns="1fr 2fr">
               <Label let:key slot="name">{$settings[key].label}</Label>
               <PropertyInspectorValueStore item="{$settings[key]}" let:key
                                            slot="value"></PropertyInspectorValueStore>
            </PropertyInspector>
         </div>
         <Button class="btn success md" on:click={close} width="100%">
            <span>{locSettings(`close.button`)}</span>
            <i class="fa fa-check"></i>
         </Button>
      </Flex>
   </Theme>
</ApplicationShell>

<style lang="scss">
   .property-inspector-container {
      width: 100%;
      height: 100%;
      min-height: 50px;
   }
</style>