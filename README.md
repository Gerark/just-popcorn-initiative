# Just... Popcorn Initiative

![Latest Release Download Count](https://img.shields.io/github/downloads/gerark/just-popcorn-initiative/latest/module.zip?style=for-the-badge&label=LATEST%20VERSION%20DOWNLOADS&color=2b82fc&link=https%3A%2F%2Fgithub.com%2FGerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.zip)
![Foundry Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Fgerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Compatible%20Version&query=$.compatibility.minimum&colorB=orange&style=for-the-badge)
![Foundry Verified Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Fgerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Verified%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)
![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Fgerark%2Fjust-popcorn-initiative%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

<img src="docsRes/videos/base.gif" alt="drawing" width="800"/>

---

An alternative approach to combat sequencing. Rather than relying on standard initiative, it allows players and GMs to
designate the subsequent combatant at the conclusion of their turn.

### Reason

I've recently come across the 'Popcorn Initiative' as an alternate method to add some excitement to my D&D session. My
group enjoys playing a crunchy system, but we're also open to incorporating narrative choices into our battles.
Unfortunately, Foundry VTT doesn't offer a built-in way for this (at least not for D&D 5e). So, I went ahead and created
this module to fill in the missing functionality.

### Credits

This package is built w/ the [TyphonJS Runtime Library](https://github.com/typhonjs-fvtt-lib/typhonjs)

### How it works?

Once you've got the module enabled, the "End Turn" and "Next Turn" buttons on the combat tracker will behave
differently. When you use them to move the current actor's turn, a Selection Window will pop up for the player or GM to
make their choice.

**Overridden Buttons**

<img src="docsRes/pictures/overridden-buttons.png" alt="drawing" width="600"/>

**Selection Window**

<img src="docsRes/pictures/selection-window.png" alt="drawing" width="600"/>

### Selection Window

The Selection Window is split into three sections:

- Selectable Actors:
   - This displays a list of actors that haven't taken their turn in this round, allowing you to choose from them.
- Previous Actors:
   - A recap of all the actors who have already completed their turn in this round.
- Side Toolbar:
   - Several options designed to assist in selecting the next actor.
   - Quick access to the Configuration Window ( only GM )

### Configuration Window

#### General

<img src="docsRes/pictures/configuration-window.png" alt="drawing" width="600"/>

Accessible from the Module Settings or through the Selection Window Toolbar

|                       Setting                       |                                                                                                                Description                                                                                                                |
|:---------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|          Override "Combat Tracker" buttons          |                                                    Turn on/off the overridden behaviour for those buttons in case they conflict or we want to use a macro to show the Selection Window                                                    |
| Allow Self Selection at the start of the next round | Activate the option for a player to independently select themselves as the subsequent participant for consecutive rounds. This provides the player with the ability to maintain their position in the ongoing sequence if they so desire. |
|              Let the Last actor choose              |                                                                                        Enable last actor to choose first combatant of next round.                                                                                         |
|                   Combatant Icon                    |                                                                            Choose if the Actor should be visualized with their token or their character image                                                                             |
|              Selection Window position              |                                                                                               Choose the position of the selection window.                                                                                                |
|                    Current Theme                    |                                                                                                   Change the UI style of this extension                                                                                                   |

#### Stats

<img src="docsRes/videos/stats.gif" alt="drawing" width="800"/>

In the Selection Window, it is possible to display a list of statistics for each actor. Each text is treated as HTML
with just two additional markup elements:

- Icons:
   - Icons can be shown alongside text. All the FontAwesome icons available in Foundry can be used here.
   - The syntax is: _[[ICON NAME]]_
   - For example: _[[hand]]_
- Values:
   - Values are linked to the current ruleset and can be represented in this format: {{PATH TO THE VALUE}}
   - For instance, _{{system.attributes.hp.value}}_ in a D&D 5e system will access the current HP value of each actor.
   - To simplify access to these values, you can use the Stats Picker (as demonstrated in the video) and select the
     specific variable you're interested in.
   - When using the Stats Picker, once a stat is chosen, the path is saved to the clipboard.

#### Special Buttons:

<img src="docsRes/pictures/special-buttons.png" alt="drawing" width="400"/>

- Install Macros Button
   - New macros will be added to your libraries. One is used to select the next actor in the combat tracker and the
     other one used to open the configuration window

- Reset
   - Reset all the configuration values to the default values. This operation can't be undone.

### Themes

You can select different themes from the Configuration Window

<img src="docsRes/videos/themes.gif" alt="drawing" width="800"/>

### Compatibility Issues

Any ruleset that ties an initiative value to the actor should work smoothly without any problems.
Anyway I still need to thoroughly test this module, especially regarding its interaction with other modules that depend
on turns/rounds for tracking effects and time. Once I identify specific issues, I'll make sure to list them.

### Under the Hood

This module is quite straightforward. It tweaks the initiative values of each actor according to the choice made when
the player/GM ends their turn.
