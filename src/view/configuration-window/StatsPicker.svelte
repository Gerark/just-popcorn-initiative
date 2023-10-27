<script>
    import { ContextMenu, TreeViewMenu } from "@gerark/just-svelte-lib/components";
    import { writable } from "svelte/store";
    import { createEventDispatcher } from "svelte";

    export let actorId = -1;
    export let contextMenuStore = null;

    let data = writable([]);
    const dispatch = createEventDispatcher();

    $: {
        updateTree(actorId);
    }

    function updateTree(actorId)
    {
        let actor = game.actors.get(actorId);
        if (actor)
        {
            let counter = { value: 0 };
            let rootItems = [];
            updateTreeNode(actor.system, rootItems, counter, "system");
            data.set(rootItems);
        }
    }

    function updateTreeNode(object, items, counter, path)
    {
        for (const childKey in object)
        {
            ++counter.value;
            let childDataNode = { id: counter.value, label: childKey };
            if (typeof object[childKey] === 'object')
            {
                childDataNode.items = [];
                updateTreeNode(object[childKey], childDataNode.items, counter, path + "." + childKey);
            }
            else
            {
                childDataNode.payload = { path: path + "." + childKey };
            }
            items.push(childDataNode);
        }
    }

    function onStatSelected(ev)
    {
        console.log(ev.detail);
        contextMenuStore.hide();
        dispatch("statpicked", ev.detail.payload.path);
    }
</script>

<ContextMenu {contextMenuStore}>
    <div class="panel panel-shadow">
        <TreeViewMenu itemsStore="{data}" on:leafselected={onStatSelected} height="300px">

        </TreeViewMenu>
    </div>
</ContextMenu>

<style lang="scss">

</style>