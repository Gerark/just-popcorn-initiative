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

<Grid columnSize="{showStats ? '150px' : '70px'}">
   {#each combatants as combatant}
      <Flex class="horizontal" width="100%">
         <Flex class="vertical" width="100%" height="100%">
            <Card height="90px" width="70px"
                  isButtonEnabled="{areCombatantInteractable}"
                  isHighlighted="{combatant.isHighlighted}"
                  on:click={(ev) => _onItemClick(combatant)}
                  on:dblclick={(ev) => _onItemDoubleClick(combatant)}
                  on:mouseenter={(ev) => _onItemMouseEnter(combatant)}
                  on:mouseleave={(ev) => _onItemMouseExit(combatant)}>
               <Typography class="size-2xs align-center overflow-ellipsis" slot="header"
                           width="100%">{combatant.name}</Typography>
               <Image class="contain" slot="content" source="{combatant.icon}"
                      --image-width="64px" --image-height="64px"></Image>
            </Card>
            <Separator
             class="{combatant.isSelected ? 'primary' : combatant.isHighlighted ? 'secondary' : 'transparent'} sm"></Separator>
         </Flex>
         <Flex class="vertical" width="100%" height="100%">
            {#if showStats}
               <div in:slide="{{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}"
                    class="stat-block" style:height="auto" style:width="100%">
                  <div style:width="64px" style:height="auto">
                     {#each combatant.stats as stat}
                        <Typography class="size-xs align-left overflow-ellipsis" slot="header"
                                    width="100%">{@html stat}
                        </Typography>
                     {/each}
                  </div>
               </div>
            {/if}
            <Separator
             class="transparent sm"></Separator>
         </Flex>
      </Flex>
   {/each}
</Grid>

<style lang="scss">
   .stat-block {
      background: var(--tjust-surface-d4);
   }
</style>