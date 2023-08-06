import { SvelteApplication }  from '#runtime/svelte/application';

import BasicAppShell          from './BasicAppShell.svelte';

export default class BasicApplication extends SvelteApplication
{
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: 'popcorn-initiative-overlay',
         classes: ['tjs-essential-svelte-esm'],
         width: 800,
         height: 400,

         svelte: {
            class: BasicAppShell,
            target: document.body
         }
      });
   }
}