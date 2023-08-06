import BasicApplication from "./view/BasicApplication.js";

export class JustPopcornInitiativeAPI {
   constructor() {
      this.requestWindow = null;
   }

   init(){
      // FVTT hooks
      Hooks.on("createCombatant", () => this.onCombatantCreated());
      Hooks.on("deleteCombatant", () => this.onCombatantDeleted());

      // PopcornInitiative hooks
      Hooks.on("Just.PopcornInitiative.Open", () => this.showRequestWindow());
   }

   showRequestWindow() {
      this.requestWindow = new BasicApplication().render(true, {focus: true});
   }

   onCombatantCreated(combatant) {
      setTimeout(() => { this.requestWindow?.svelte.component(0).updateData(); }, 100);
   }

   onCombatantDeleted(combatant) {
      setTimeout(() => { this.requestWindow?.svelte.component(0).updateData(); }, 100);
   }
}