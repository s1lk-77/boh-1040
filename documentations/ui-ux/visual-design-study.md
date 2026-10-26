# UI/UX Design Study (Beta Sprint)

## Design Philosophies

**An Ode to the Color Red**

I really leaned into the cheesiness of it.

Is BOLD red the most UX friendly color for a website? No. But my target audience is Assassins’ Guild, and I know the melodrama and humor will find itself at home. Whats a game without its flavor text anyways. Most Guild publicity things are egregiously red (see slide 5 in the [deck](./deck.pdf)), and I thought it was beyond context-appropriate to make BoH just as cheesy and nerdy looking. It perfectly telegraphs what kind of people we are, and who cares if scares away a few normies xD. The most important thing is the player page does NOT use this red and is designed to maximize UX. As for the GMs... if you're writing a guild game you can appreciate my background and font choice. I TRUST.

If I get user complaints though I will swiftly tone it down.

**Player Side**

1. Minimalist

As BoH is a digital assistant to physical gameplay, the player side UI should, all functionalities equal, look "unattractive." We do not want to distract the players from the game they are playing. Concrete ways to achieve this including using simple, grayscale color schemes and unembellished or even brutalist display boxes. However, an unattractive UI does NOT mean a tedious UX. The UX should be minimal in the sense that it requires the least amount of finger navigation, the least amount of time spent looking at the phone screen, and the least amount of cognitive load while still being intuitive.

Concrete ways to achieve minimalist UX:

- As few button clicks as possible.
- As few "page rerenders" as possible. The fewer pages the better.
- CLEAR eye guidance. A player should not need to figure out what to look at.

2. Mobile first

Most players are using this app on a mobile device, probably a phone. All display logic and UI arrangements should respect the phone screen.

- Frequently clicked buttons at the bottom to reduce click distance
- Square buttons over long buttons
- Buttons should be big enough for thumb to click
- Search bar at the bottom
- `onTouchStart`, `onTouchEnd`, and swipe behavior
- Main bounding box width should be close to 100%
- Buttons react on `:active` as opposed to `:hover`

**GM Side**

1. Coloration

The GM interface does not need to be minimalist and should define a distinctive color scheme. Specifically, a primary red, secondary white-black color scheme in reference to the Assasins' Guild's colors. However, red is a challenging color to work with because it is easily mistaken as error, invalid, incorrect, etc, so we want to invoke the red color scheme through a series of red-adjacent pinks. I do really like the single-color scheme example in slide 1 of the [deck](./deck.pdf) because it look the right amount of clean, and I will attempt to recreate that feel with the color red.

The ability cards and other card types in the future will have their own color schemes. This should either follow Guild conventions (yellow/pink for abilities, orange for stats, green for out-of-game text), or be a setting that the user can adjust.

2. Parallelizable

The GM interface should be designed to support multiple GMs working in parallel. As such, the webapp should support networked updates, such as Web Sockets.

3. NOT corporate

We are MIT Assassins' Guild, and we run around our college campus being nerds pretending to be nerds. We are CERTAINLY not corporate. There is a certain corporate, professional, formal, "big company" look to modern web design that I want to avoid like the plague. More so that a lot of websites either look like they were made by the same set of tech bros or the same flavor of AI generation. BoH a webapp made by nerds, for nerds. Long live artistic creativity.

4. Responsive / Reactive

UI can and should be more reactive and "juicy" and eye-catching on the GM Dashboard, because we are not at risk of distracting them from gameplay.

**A Homage to GameTeX**

We will try recreate the look of GameTeX rendered cards one to one (slide 2 in the [deck](./deck.pdf)). GameTeX is as integral to Assassins' Guild as it is our most evocative cultural artifact. In this church we lay our sacrifices on the altar of GameTeX. We will also be using the field names exactly as declared in GameTeX, both as our homage and to minimize the cognitive load when GMs transfer their GameTeX data into our app.

**Typography**

I just know I want all the input/editable fields to be a monospace font. Specifically Fira Code because I love that font. I admit the @ symbol looks a little weird, but this is my webapp and this is my art. More specifically, I also want to, to whatever extent I can, evoke the nostalgia of working in a LaTeX editor.

Outside of input fields, the app should have 1 unified, readable font. 3 fonts is too many, and only the app title "Bag of Holding" gets a pass for being the third font on a single page.

## ARIA Labeling & Accessibility

I really do want this entire website to be aria labeled, but gosh I do not have the time. If I have ANY time left, I will implement accessibilty features.

## Design Decisions

- Made ability card entries larger than in the Figma to accomodate thumb width
- Made ability card entries display one line of the description because players are more likely to remember descriptions than names
- Adjusted border weights on a lot of components for better eye guidance
  - borders are now ONLY around the things you should be looking at
- Instructions / help tools. A user should be able to access enough helpful messages on a page to be informed of what they are doing
  - Use popovers: we also do not want returning users to be flooded with help messages, so we hide them in popovers
- Button click rates:
  - on player dashboard: cards > Filter > plus >> back = settings = help
  - on card display: flip > back > arrows > plus > settings
- change magnifying glass to a plus, feels more semantic as you are adding abilities

For next sprint:

- when player has added an ability open it in display mode. Reduces 1 click.
