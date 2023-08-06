import { JustPopcornInitiativeAPI } from './JustPopcornInitiativeAPI.js';

Hooks.once('ready', () => 
{
   if (game.just == null)
   {
      game.just = {};
   }

   game.just.popcornInitiative = new JustPopcornInitiativeAPI();
   game.just.popcornInitiative.init();
});