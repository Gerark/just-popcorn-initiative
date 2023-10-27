<script>
    import {
        EditableList,
        Flex,
        HeaderBox,
        Image,
        Select,
        Tab,
        TextBox,
        Button,
        Typography
    } from "@gerark/just-svelte-lib/components";
    import { locSettings, ModuleUtils, NotificationUtils } from "../../ModuleUtils.js";
    import { currentIconImageType, statLabels } from "../../ModuleStore.js";
    import Avatar from "../selection-window/Avatar.svelte";
    import { popupSource } from "@gerark/just-svelte-lib/actions/popup";
    import { statsPickerContextMenuStore } from "./statsPickerContextMenuStore.js";
    import { currentActorPreview } from "../../ModuleStore.js";

    function createStat(event)
    {
        event.detail.result = {
            label: '',
            value: '',
            showToPlayer: false,
            stats: []
        };
    }

    function copyStat(event)
    {
        const clone = structuredClone(event.detail.item);
        event.detail.result = clone;
    }

    function statsUpdated(event)
    {
        statLabels.set(event.detail);
    }

    let actors = [];
    game.actors.forEach((actor) =>
    {
        actors.push({
            id: actor.id,
            label: actor.name,
            icon: ModuleUtils.getActorIcon(actor.id, $currentIconImageType),
            value: actor.id,
        });
    });
    let currentActorId = actors.length > 0 ? actors[0].id : -1;
    $: currentActorPreview.set(currentActorId !== -1 ? generatePreviewActorData(currentActorId, $statLabels) : null);

    let showStats = true;

    function generatePreviewActorData(actorId, statLabels)
    {
        let actor = game.actors.get(actorId);
        const actorStats = [];
        statLabels.forEach((x) =>
        {
            if (x.showToPlayer || game.user.isGM)
            {
                const resolvedText = ModuleUtils.resolvePropertyText(actor, x.label);
                actorStats.push({ label: resolvedText, id: x.id });
            }
        });

        return {
            icon: ModuleUtils.getActorIcon(actorId, $currentIconImageType),
            name: actor.name,
            id: actorId,
            owners: ModuleUtils.retrieveOwnersInfo(actorId),
            stats: actorStats
        };
    }

    function togglePlayerVisibility(index)
    {
        statLabels.update(x =>
        {
            x[index].showToPlayer = !x[index].showToPlayer;
            return x;
        });
    }
</script>

<Tab data="{{header: locSettings('stats.tab'), icon: 'list'}}">
    <div class="property-inspector-container">
        <Flex class="horizontal" width="100%">
            <HeaderBox width="220px">
                <Flex class="horizontal" slot="header" flex="{['1', '0 1']}">
                    <Typography>{locSettings('combatant-preview-title')}</Typography>
                </Flex>
                <svelte:fragment slot="content">
                    {#if actors.length > 0}
                        <Select items="{actors}" bind:value={currentActorId} dropdownMaxHeight="200px" width="190px"
                                let:item>
                            <Flex class="horizontal thick" width="100%">
                                <Typography class="size-xs overflow-ellipsis align-left"
                                            width="140px">{item.label}</Typography>
                                <Image class="contain" source="{item.icon}" --image-width="24px"
                                       --image-height="24px"></Image>
                            </Flex>
                        </Select>
                    {/if}
                    {#if $currentActorPreview}
                        <div style:width="200px">
                            <Avatar isInteractable="{false}" {showStats} combatant="{$currentActorPreview}"></Avatar>
                        </div>
                    {/if}
                </svelte:fragment>
            </HeaderBox>
            <div style:background="red" style:width="100%" style:height="100%">
                <EditableList title="{locSettings('stats.tab')}" items="{$statLabels}" on:copy={copyStat}
                              on:create={createStat}
                              on:listUpdated={statsUpdated}
                              let:index dndzone="stats">
                    <Flex class="horizontal">
                        <TextBox bind:value={$statLabels[index].label} canReset="{false}" class="sm"
                                 on:valuechanged={(e) => { statLabels.update((v) => { v[index].label = e.detail; return v; }) }}></TextBox>
                        <Button class="icon sm"
                                on:click={() => { togglePlayerVisibility(index); }}
                                tooltip="{locSettings('toggle-player-visibility.title') + '.\n' + locSettings($statLabels[index].showToPlayer ? 'visible' : 'hidden')}">
                            <i class="fa fa-{$statLabels[index].showToPlayer ? 'eye' : 'eye-slash'}"></i>
                        </Button>
                        <Button class="icon sm"
                                on:click={() => { statsPickerContextMenuStore.show() }}
                                actions="{[{run: popupSource, params: {popupId: 'statsPicker', flagStore: $statsPickerContextMenuStore.visibilityFlag}}]}"
                                tooltip="{locSettings('pick-stat.title')}">
                            <i class="fa fa-list"></i>
                        </Button>
                    </Flex>
                </EditableList>
            </div>
        </Flex>
    </div>
</Tab>

<style lang="scss">
  .property-inspector-container {
    width: 100%;
    height: 100%;
    min-height: 50px;
  }
</style>