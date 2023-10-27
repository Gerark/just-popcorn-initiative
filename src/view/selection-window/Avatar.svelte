<script>

    import { quintOut } from "svelte/easing";
    import {
        Flex,
        Card,
        Separator,
        Typography,
        Image,
    } from "@gerark/just-svelte-lib/components";
    import { slide } from "svelte/transition";
    import { flip } from "svelte/animate";

    export let combatant;
    export let isInteractable = false;
    export let showStats = false;

    let isGM = game.user.isGM;
</script>

<Flex class="horizontal" width="100%" flex="{['0', '1']}">
    <Flex class="vertical" width="100%" height="100%">
        <Card height="90px" width="70px"
              isButtonEnabled="{isInteractable}"
              isHighlighted="{combatant.isHighlighted}"
              on:click
              on:dblclick
              on:mouseenter
              on:mouseleave>
            <Typography class="size-2xs align-center overflow-ellipsis" slot="header"
                        width="100%">{combatant.name}</Typography>
            <Image class="contain" slot="content" source="{combatant.icon}"
                   --image-width="64px" --image-height="64px"></Image>
        </Card>
        <Separator
                class="{combatant.isSelected ? 'primary' : combatant.isHighlighted ? 'secondary' : 'transparent'} sm"></Separator>
    </Flex>
    {#if showStats}
        <Flex class="vertical align-start" width="100%" height="100%">
            <div in:slide="{{ duration: 250, easing: quintOut, axis: 'x' }}"
                 class="stat-block" style:height="90px" style:width="125px">
                <div style:width="100%" style:height="auto">
                    {#each combatant.stats as stat (stat.id)}
                        <div animate:flip={{ duration: 500, easing: quintOut }}>
                            {#if stat.showToPlayer || isGM}
                                <Typography class="size-xs align-left overflow-ellipsis" slot="header"
                                            width="100%">{@html stat.label}
                                </Typography>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <Separator
                    class="transparent sm"></Separator>
        </Flex>
    {/if}
</Flex>

<style lang="scss">
  .stat-block {
    box-sizing: border-box;
    padding: var(--tjust-padding-sm);
    background: var(--tjust-surface-d4);
  }
</style>