<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    import {
        Card,
        Image,
        Grid,
        Separator,
        Flex,
        Typography
    } from "@gerark/just-svelte-lib/components";
    import Avatar from "./Avatar.svelte";

    export let combatants;
    export let showStats;
    export let areCombatantInteractable = true;

    const dispatch = createEventDispatcher();

    function _onItemClick(combatant)
    {
        dispatch("itemClick", combatant);
    }

    function _onItemDoubleClick(combatant)
    {
        dispatch("itemDoubleClick", combatant);
    }

    function _onItemMouseEnter(combatant)
    {
        combatant.isHighlighted = true;
        combatants = combatants;
        dispatch("itemMouseEnter", combatant);
    }

    function _onItemMouseExit(combatant)
    {
        combatant.isHighlighted = false;
        combatants = combatants;
        dispatch("itemMouseExit", combatant);
    }

</script>

<Grid columnSize="{showStats ? '200px' : '70px'}">
    {#each combatants as combatant}
        <Avatar
                {combatant}
                isInteractable="{areCombatantInteractable}"
                {showStats}
                on:click={(ev) => _onItemClick(combatant)}
                on:dblclick={(ev) => _onItemDoubleClick(combatant)}
                on:mouseenter={(ev) => _onItemMouseEnter(combatant)}
                on:mouseleave={(ev) => _onItemMouseExit(combatant)}></Avatar>
    {/each}
</Grid>

<style lang="scss">
</style>