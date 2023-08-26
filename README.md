# Just... Popcorn Initiative

![Latest Release Download Count](https://img.shields.io/github/downloads/gerark/just-popcorn-initiative/latest/module.zip?style=for-the-badge&label=DOWNLOADS&color=2b82fc&link=https%3A%2F%2Fgithub.com%2FGerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.zip)
![Foundry Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Fgerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Compatible%20Version&query=$.compatibility.minimum&colorB=orange&style=for-the-badge)
![Foundry Verified Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Fgerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Verified%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)
![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Fgerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

![Showcase Animation](docs/videos/base.gif)

---

An alternative approach to combat sequencing. Rather than relying on standard initiative, it allows players and GMs to
designate the subsequent combatant at the conclusion of their turn.

### Reason

I've recently come across the 'Popcorn Initiative' as an alternate method to add some excitement to my D&D session. My
group enjoys playing a crunchy system, but we're also open to incorporating narrative choices into our battles.
Unfortunately, Foundry VTT doesn't offer a built-in way for this (at least not for D&D 5e). So, I went ahead and created
this module to fill in the missing functionality.

### How it works?

Once you've got the module enabled, the "End Turn" and "Next Turn" buttons on the combat tracker will behave
differently. When you use them to move the current actor's turn, a Selection Window will pop up for the player or GM to
make their choice.

**Overridden Buttons**

![Overridden Buttons](docs/pictures/overridden-buttons.png)

**Selection Window**

![Selection Window](docs/pictures/selection-window.png)
