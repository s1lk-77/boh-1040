# Problem Statement

## Domain

Live Action Roleplaying games, or LARPs, are interactive, action-packed roleplaying games where a player's real time, real life actions represent the actions their character undertakes. They might move between locations to explore the game world, converse with other players, and engage in (simulated) combat. Bringing a fictional world into a physical space comes with limitations. For example, we don't actually have "dark eerie catacombs" sitting around, so we need to tape a sign to the wall saying "this is a dark eerie catacomb" and let the players' imagination do the rest. In general, elements that don't map cleanly from fiction to real life (say, magic) are abstracted as **mechanics**.

MIT's LARP club, [Assassins' Guild](https://assassin.mit.edu/web/Who_are_we%3F), plays LARPs that are heavy on mechanics, information, and puzzle-solving. These games range from 3-4 hours to up to 10 days during IAP. Often, during a game, players will acquire new abilities, items, and clues as a result of taking specific game actions. The game must reactively communicate to the player what they have discovered, and the player will need to remember this. We can't rely on human game runners (GMs) to constantly remind players, as players significantly outnumber GMs. But as a player, you want to be able to look up all the information your character should know with ease. And, as a GM, you would like to manage the invaluable currency of player attention economically to avoid breaking immersion or wasting the time a player would be using to actually play your game.

## Bad situations

The three bad situations hereby stated build off of each other, and all of them pertain to the player's frustration over the amount of information they have to keep track of at all times during the game, as well as the GM's frustration of having to jump through elaborate hoops to accommodate the player in this respect.

### Problem 1: Player cognitive load and ease of reference

In a game where most content appear as physical text, bookkeeping information for future reference is a frustrating task, particularly when you're racing against the clock to complete your goals and the situations you find yourself in require fast information lookup (e.g. real-time combat). Say, if you just unlocked an ability, you would want a reference to its description and effect so you can (1) review the description in case you forget and (2) communicate the effect quickly to other players when you use the ability on them. As your cognitive load is limited, simply relying on human memory is infeasible.

### Problem 1a: The brute force solution that is still a problem

You can bring a piece of paper and copy down all the text you need, but that generates two more bad situations:

1. Time Cost. You have to spend time transcribing the text at the cost of taking other meaningful game actions: for example, you could be exploring more of the game space instead of crouched on the floor copying words. It's a boring menial task that breaks immersion and subtracts from your player experience.
2. Storage Cost. Your growing length of notes get messy and clunky, and you have to hold them in your hand, which is tricky when you want to pull out a NERF gun to shoot someone.

### Problem 1b: The status quo that is still a problem

Currently in the Guild, an interface we universally use is small paper cutouts of _Ability Cards_ and _Item Cards_. Cards packet information nicely and can be produced in bulk, and a player can hold the information they need by holding the physical card. While this offshores cognitive load, it is still a bad situation:

1. Production Cost. The players' ease comes at the cost of our other group of stakeholders: game runners. Formatting, printing, and cutting hundreds of sheets of small cards is ponderous. Distributing each set of cards to their corresponding game location is equally ponderous. Sometimes, GMs forgo the tedium and tell you to manually copy the text anyways.
2. Storage Cost. Pocket space is a limited resource; it runs out fast and is difficult to manage under pressure.
3. Lookup Cost. Especially in longer games, characters tend to have many abilities, items, etc. Your deck of cutouts can easily go up to sizes in the fifties. Finding a card is not a fast operation.

That aside, the card types we currently have, i.e. Ability and Item, still fail to account for all the types of information a player would like to have on hand during a game, such as text-based clues to a puzzle.

## Corroboration

This problem is quite specific to Assassins' Guild and our style of LARP, which the greater LARP community may refer to as "Secrets & Powers," or even "MIT Style." I browsed the internet for comparable bad situations but found no dedicated discussions related to this subject beyond in Assassins' Guild's Discord server, for which I was an Admin for the past three years. Beyond that, I have been a member of the Guild for five years, a High Councillor (officer) for four years, and the Grandmaster (president) from 2024-2025. I have played on the order of 50 Guild games, GM'ed 10 games, and written two. The corroborating evidence I hereby present is, summarily, my plenitude of experience and the conversations I have both had with and witnessed between other members of the Guild.

A concrete example I can provide is the 10-day-long LARP that we ran the past IAP, titled _Avatar: Peace in Ba Sing Se_. In this game, both the **herbalism** mechanic and a mechanic where you sought "ancient knowledge" to perfect your personal skills, named **Jing**, required players to run around the game collecting cards. Players initially obtained physical copies of all the ability cards they unlocked, but by day six, a decent portion had pivoted to either digitally typed collections, photos, or their own memories. Another mechanic in the game involved "murder mystery trails," which gave players information at each step of the trail. Some players found it tedious to have to manually record this information. This is the bad situation in action, corroborated by a non-comprehensive sample of discussions exchanged in the Assassins' Guild Discord server:

<img width="979" height="316" alt="proof1" src="https://github.com/user-attachments/assets/8ecc28d0-375a-46d1-8196-aad635d9d8c7" />
<img width="979" height="140" alt="proof2" src="https://github.com/user-attachments/assets/cb07a3fa-ee1a-4633-9314-f8cf21ac265f" />
<img width="938" height="112" alt="proof3" src="https://github.com/user-attachments/assets/cdab597d-da1d-4748-a9e9-f40bbfb2ac6c" />

Finally, since the release of this very assignment, I have had at least one upcoming 10-day GM team ask me to complete this project, for 6.1040 or not, so they can incorporate an application like this into their production.

## Workarounds and comparables

### Workaround 1: The Box

Some GMs have employed the Box, which is a physical box holding a large set of folders. Each folder is labeled, and a label can be anything from a character's name to a specific numerical code identifying the content stored inside (think: hash buckets). A discoverable game location will then show a retrieve code: "go to the box and obtain a copy of 301250." The player visits the indicated folder for their reward.

The box is a redistribution of labor, a compromise between players and GMs. The latter no longer need to run around distributing cards to locations, but the former must now walk to the box room each time. It doesn't sound so bad until this walk goes from the basement of building 26 to the third floor of building 34. Sometimes, in a sequential puzzle, you need the information from the previous step to solve the next, and making several round trips from 26 to 34 and back gets frustrating very quickly, especially on a time crunch.

### Workaround 1a: The Receipt Printer

The receipt printer is an iteration on the Box, significantly reducing the production cost on the GM side. Instead of a Box, the GMs had a receipt printer to take a hash code and print the relevant file. This was a great innovation from last spring (Spring 2026), and it worked fantastically for a game that used 3 adjacent rooms. However, it does not address the players' walking distance in bigger games.

### Workaround 2: The Camera

As my observations in the past three years inform me, a highly popular workaround is the phone camera. Instead of transcribing text or holding cards, players will simply take photos. This is almost a good solution, albeit a few limitations:

1. Clarity. Photos of text can be hard to read. Lighting, angle, and blurriness impact the user experience.
2. Storage. It clogs your camera roll.
3. Retrieval. Although retrieving a photo is faster than sifting through a pocket full of cards, it still takes time.
4. Distribution. Sharing the information with other players is logistically complicated. It requires sending images over social media, which in turn requires you to have their contact.

Corroboration: I have encountered all four situations in the games I have played.

The growing prevalence of photography highly suggests that players are _already_ seeking to digitalize the information retrieval and storage process. This inspired me to brainstorm a more modularized, streamlined solution: a web gadget.

## Solution sketch

A small web app that dynamically caches the information a player has discovered and speeds up the lookup process. This will reduce player frustration and elevate their game experience.

### Player Side

The player "logs in" with a GM-provided game code and a self-assigned username. This navigates them to a home page where they can type up hash codes provided by the GMs to retrieve digital copies of ability, item, and clue cards. The application remembers what codes the player has retrieved and displays them all as a catalog. The player can additionally search and filter through this catalog, allowing for fast lookup.

**FEATURES**\
Player: user can add themself to a game as a player by providing a valid gameCode\
Inventory: player can see a list of what abilities they have\
Lookup: player can add new abilities to their inventory with a look up code\
Filter: player can filter through their inventory

### GM Side

The GMs provide a JSON file mapping lookup codes to description texts with a GM-defined game code of the game they are running.

**FEATURES**\
GM: user can create a game with a gameCode and access its contents thereafter as GM\
Adding abilities: GM can add abilities to game\
Editing abilities: GM can edit or delete abilities from the game\
_Stretch goal: streamlining data upload_\
Uploading abilities: GM can export from GameTeX and batch upload abilities\
Accounts: GMs have accounts

## Stakeholder List

- **Players**: This is primarily a player-facing app, and players are the core stakeholders whose game experience this application is designed to improve. This entails reducing the menial tedium surrounding information collection as much as possible.
- **Gamemasters**: GMs are necessary stakeholders who generate the game experience for the players, so this app must not alter the game production process enough as to inconvenience the GM team. Barriers to production must at worst remain where they are, and ideally they would decrease significantly if data upload can be streamlined.
