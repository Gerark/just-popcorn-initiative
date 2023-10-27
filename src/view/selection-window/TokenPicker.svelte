<script>
    import { currentTokenPickerTarget, isTokenPickerRunning } from "../../ModuleStore.js";
    import { locWindow } from "../../ModuleUtils.js";
    import {
        Flex,
        Typography,
        Card,
        Image
    } from "@gerark/just-svelte-lib/components";

    function _disableTokenPicker()
    {
        $isTokenPickerRunning = false;
    }
</script>

<div on:click={(e) => _disableTokenPicker()} on:keydown={(e) => _disableTokenPicker()} role="button" tabindex="0"
     on:mouseenter on:mouseleave style:width="100%" style:height="100%">
    <Flex class="vertical thick component justify-center" width="100%" height="100%">
        <Typography
                width="100%"
                class="size-md align-center">{@html locWindow(`combatant-picker.title`)}</Typography>
        <Card width="100px" height="100px">
            <Typography slot="header" class="size-sm align-center overflow-ellipsis"
                        width="100%">{$currentTokenPickerTarget ? $currentTokenPickerTarget.name : ''}</Typography>
            <svelte:fragment slot="content">
                {#if $currentTokenPickerTarget}
                    <Image class="cover"
                           source="{$currentTokenPickerTarget ? $currentTokenPickerTarget.icon : ''}"
                           --image-width="64px" --image-height="64px"></Image>
                {/if}
            </svelte:fragment>
        </Card>
    </Flex>
</div>

<style lang="scss">
</style>