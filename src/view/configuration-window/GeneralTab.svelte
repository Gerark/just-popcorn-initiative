<script>

    import { settings } from "../../ModuleStore.js";
    import {
        Tab,
        Label,
        PropertyInspector,
        PropertyInspectorValueStore
    } from "@gerark/just-svelte-lib/components";
    import { locSettings } from "../../ModuleUtils.js";

</script>

<Tab data="{{header: locSettings('general.tab'), icon: 'cog'}}">
    <div class="property-inspector-container">
        <PropertyInspector height="100%" item="{$settings}" title="" --columns="1fr 2fr">
            <Label let:key slot="name">{$settings[key].label}</Label>
            <PropertyInspectorValueStore item="{$settings[key]}" let:key
                                         slot="value"></PropertyInspectorValueStore>
        </PropertyInspector>
    </div>
</Tab>

<style lang="scss">
  .property-inspector-container {
    width: 100%;
    height: 100%;
    min-height: 50px;
  }
</style>