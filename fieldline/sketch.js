// FIELDLINE: a field-line flower, a generative piece for SDG 5 (Gender Equality).
// Written for p5.js 2.3.3.
//
// "The central question of gender equality is a question of power."
// Call to action: Pass the mic. Nominate a woman. Change who decides.
//
// Idea: every point is a person, and a point's power is how much weight
//   their action carries. Power sets how many lines leave a point, and so how
//   much of the canvas that point controls.
//   The piece plays in rounds. Round 1: women hold 27.5% of the world's
//   parliament seats, so 27.5% of the points glow gold, a colour of the
//   women's suffrage movement, and the rest are a washed-out grey. Round 2:
//   women are 22.4% of cabinet ministers, so 56 of its 250 points are gold.
//   Round 3: women lead 14.5% of countries, so 29 of its 200 points (about
//   one for every country) are gold. Round 4: women are 6% of corporate CEOs,
//   so 12 of its 200 points are gold. The gold points are fewer every round.
//   Round 5 is NOT data: it is an imagined future. It starts where round 4
//   left off (6% gold, pressed small). Then grey points gently fade and gold
//   points grow in at their seats, mixed through every shape, while the
//   pressed gold points slowly grow to full size. This goes on until gold
//   points are as many as grey ones, so women and everyone else are in balance.
//   A gold point carries less power than a grey one, and the gold is pressed
//   smaller each round: 0.7, 0.6, 0.5 and then 0.4 of a grey point's power.
//   A line is something passed from one person to another. Many lines side by
//   side close into a petal, and all the petals together make the flower.
//   The points sit on round shapes, like globes. Round 1 has a chamber of 120
//   seats, 33 of them (27.5%) gold, and other shapes that hold everyone
//   outside it, 33 of 120 gold too. Round 2 has 10 cabinet tables of 25 seats
//   (250 points), 56 of them gold (22.4%). Round 3 has one big globe of 200
//   points, 29 of them gold (14.5%). Round 4 has a skyline of 5 towers of 40
//   points (200 points), 12 of them gold (6%). Every piece lays the shapes out
//   differently, but each round's share never changes.
//
// How it works: this is a dipole field-line agent system. The points are
//   poles of two kinds. Small travellers called agents set off from every
//   pole. On each frame an agent reads the push and pull of all the poles
//   where it stands, takes one step that way, and draws the step it took.
//
// How it plays, rounds 1 to 4: the points glow into view first, one straight
//   after another. Then the agents set off and their trails build up into
//   petals. After a few seconds the picture is kept, like a long-exposure
//   photograph, and new lines keep flowing over it. Then the grey slowly
//   outshines the gold: the gold dims until everything is grey. Then the lines
//   are reeled back into their points while the picture fades to white. The
//   points burst into a swarm of jiggling dots that calm down and gather into
//   the message. The words hold for two seconds, still jiggling a little, then
//   the dots loosen and fly off to become the points of the next round, which
//   begins.
//
// How it plays, round 5 (imagined): the picture is kept as usual, then it
//   fades away while grey points gently fade and gold points grow in at their
//   seats, mixed through every shape, while the pressed gold points slowly
//   grow to full size. When gold points are as many as grey ones, the points in the
//   middle fade and burst into jiggling dots, half gold and half grey. They
//   gather into the words "Pass the mic. Nominate a woman. Change who decides."
//   in a cleared space in the middle, made like the other messages, while
//   round 5's lines keep flowing around it. After about three seconds the lines
//   reel back into their points and the picture fades to white, while the dots
//   keep jiggling. Then the dots fly off to become round 1's points, and the
//   story starts again.
//
// Each load is different: how the shapes are laid out, where the points sit
// on them, and which points are highlighted. A round's share never changes.
// The next round starts by itself after the message, and a click starts the
// next round at any time. In round 5's balance phase a click swaps the grey
// point nearest the mouse for a gold one. After round 5 the story starts
// again from round 1.
//
// Based on: the dipole field-line agent example sketch I was given (two
//   poles, agents that follow the normalised field, force divided by distance
//   squared). TODO: add the source of that example here.
//
// The message's swarm of dots: inspired by "Eparpille", a coded font
//   experiment by @aurel.smcn, posted by @contemporarytype on Instagram on
//   4 December 2025 (https://www.instagram.com/p/DR0Cb0pjIUr/). Only the
//   idea was borrowed; no code was taken from it.
//
// Typeface: Reddit Sans by Stephen Hutchings and OrangeRed for Reddit, Inc.
//   (2023), SIL Open Font License 1.1. It is bundled in fonts/ with its
//   licence (fonts/RedditSans-OFL.txt), and drawn at weight 200.
//
// Message layout: a 12-column grid in the Swiss style, after Josef
//   Müller-Brockmann, Grid Systems in Graphic Design (1981).

// CANVAS. The size of the picture in pixels.

const CANVAS_W = 1920;
const CANVAS_H = 1080;

// THE FOUR DATA ROUNDS. Round 1 is parliament seats, round 2 cabinet
// ministers, round 3 countries and round 4 corporate CEOs. The rounds
// themselves are in ROUNDS, further down, because their messages need the
// message constants first.
// Source for the shares: UN Women and UN Gender Snapshot 2026.
const CHAMBER_GOLD = 33; // round 1: 33 of the 120 chamber seats are gold (27.5%)
const OUTSIDE_GOLD = 33; // round 1: 33 of the 120 outside points are gold (27.5%)
const TABLE_COUNT = 10; // round 2: this many cabinet tables
const SEATS_PER_TABLE = 25; // round 2: a typical cabinet size
const TABLE_GOLD = [6, 6, 6, 6, 6, 6, 5, 5, 5, 5]; // round 2: gold per table, 56 of 250 (22.4%)
const GLOBE_POINTS = 200; // round 3: one point for each country (about 193 UN members)
const GLOBE_GOLD = 29; // round 3: 29 of the 200 points are gold, exactly 14.5%
const TOWER_COUNT = 5; // round 4: this many corporate towers
const SEATS_PER_TOWER = 40; // round 4: 40 companies, one CEO each, per tower
const TOWER_GOLD = [3, 3, 2, 2, 2]; // round 4: gold per tower, 12 of 200 is exactly 6%

// Points and power: how close points may sit, and how strong each kind is.
const CHAMBER_POINT_GAP = 40; // the smallest space left between two points in round 1
const CABINET_POINT_GAP = 32; // the same for round 2
const GLOBE_POINT_GAP = 32; // the same for round 3
const TOWER_POINT_GAP = 40; // the same for round 4
const EDGE_GAP = 20; // points stay at least this far in from the canvas edges
const FULL_POWER = 1;
const GOLD_POWERS = [0.7, 0.6, 0.5, 0.4]; // gold power in rounds 1 to 4, pressed smaller each round

// The layout of the shapes. Every piece makes a new one: a chamber that holds
// 120 seats, somewhere near the middle, and a few smaller round shapes around it that
// share the other 120 points. Sizes are radii in pixels.
const CHAMBER_SEATS = 120;
const OUTSIDE_POINTS = 120; // CHAMBER_SEATS + OUTSIDE_POINTS must equal round 1's pointCount
const CHAMBER_SMALLEST = 300; // the chamber's size is somewhere between these two
const CHAMBER_BIGGEST = 470;
const CHAMBER_SPREAD = 0.2; // its centre sits up to this share of the canvas away from the middle
const OUTSIDE_SMALLEST = 130; // an outside shape's size is somewhere between these two
const OUTSIDE_BIGGEST = 420;
const FEWEST_SHAPES = 1; // how many shapes sit outside the chamber, at least and at most
const MOST_SHAPES = 4;
const SHAPE_GAP = 140; // the least space left between two shapes
const TABLE_SMALLEST = 110; // a cabinet table's size is somewhere between these two
const TABLE_BIGGEST = 160;
const TABLE_GAP = 50; // the least space left between two tables
const GLOBE_SMALLEST = 400; // round 3's globe is somewhere between these two radii
const GLOBE_BIGGEST = 480;
const TOWER_SHORTEST = 260; // a tower's half-height is somewhere between these two
const TOWER_TALLEST = 400;
const TOWER_WIDTH = 0.3; // a tower's half-width, as a share of its half-height
const GROUND_Y = 960; // every tower stands on this line
const TOWER_SHIFT = 30; // a tower's centre moves up to this far left or right of its slot
const STRETCH = 0.25; // how far a shape can stretch from a circle into an oval
const SHAPE_TRIES = 300; // how many random spots to try when adding shapes
const PLACE_TRIES = 500; // how many random spots to try for one point before giving up on a layout
const ROOM_SAMPLES = 100; // how many spots to test when working out how much of a shape shows

// TIMING. Lengths are in frames (60 frames is 1 second).
const APPEAR_FRAMES = 120; // every point starts to appear within this time (2 seconds)
const GROW_FRAMES = 45; // one point takes this long to grow to full size
const POINTS_FRAMES = APPEAR_FRAMES + GROW_FRAMES; // when all points are in
const BUILD_FRAMES = 300; // the lines build up without fading for this long (5 seconds)
const KEEP_FRAME = POINTS_FRAMES + BUILD_FRAMES; // then the picture is kept
const FADE_EVERY = 1; // after that, moving lines get a shade lighter every frame (short tails)

// The ending. The finished picture plays for a while, then the gold slowly
// dims into grey. The lines are reeled back into their points while the
// picture fades to white. The points burst into a swarm of dots that gather
// into the message, hold, then fly off, and a new piece starts by itself.
// Lengths are in frames.
const HOLD_FRAMES = 150; // the finished picture plays in full colour (2.5 seconds)
const DIM_FRAMES = 360; // the gold dims into grey (6 seconds)
const RETRACT_FRAMES = 100; // the lines are pulled back into their points (under 2 seconds)
const GATHER_FRAMES = 120; // the dots leave the points and settle into the letters (2 seconds)
const READ_FRAMES = 120; // the words hold, small dots and a small jiggle (2 seconds)
const READ_E = 0.25; // e while the words can be read: small dots, small jiggle
const LOOSEN_FRAMES = 45; // the dots jiggle loose again (under 1 second)
const SCATTER_FRAMES = 100; // the dots fly off to become the next piece's points (under 2 seconds)
const DIM_START = KEEP_FRAME + HOLD_FRAMES;
const RETRACT_START = DIM_START + DIM_FRAMES; // rounds 1 to 4; round 5 works out its own
const FLIGHT_FRAMES = LOOSEN_FRAMES + SCATTER_FRAMES; // the dots fly for this long

// FIELD AND AGENTS. How the travellers move, and the two kinds of point.
const STEP = 3; // how far an agent moves each frame, in pixels
const MAX_STEPS = 220; // an agent gives up after this many steps
const ARRIVE_DISTANCE = 3; // an agent this close to a point has landed
const SPIN = 0.0015; // how far the lines turn around their point each frame
// The two kinds of point. Agents leave a giving point and land on a receiving one.
const GIVING = "giving";
const RECEIVING = "receiving";

// THE LOOK. Colours, lines, points and glow.
// Depth: a trail is thin and dark close to a point, and swells and fades as
// it moves away, so the middle of a petal seems to bulge towards you.
const FAR_DISTANCE = 170; // further than this from every point counts as "far"
const NEAR_WEIGHT = 0.6;
const FAR_WEIGHT = 1.7;
const NEAR_ALPHA = 165;
const FAR_ALPHA = 55;
const SOFT_WIDTH = 2; // lines from a soft shape are this many times wider
const SOFT_ALPHA = 0.5; // and this strong, as if out of focus
const GLOW_WIDTH = 9; // the soft glow is this many times wider than the trail
const GLOW_ALPHA = 0.035; // and this much fainter
const POINT_SIZE = 10; // how wide the dot of a point with power 1 is
const POINT_GLOW = 12; // how much wider than the dot its soft glow reaches
const GLOW_DISCS = 6; // how many faint discs build up that glow

// Gold and white are colours of the women's suffrage movement.
// Colours are [red, green, blue].
const WHITE = [255, 255, 255];
const GOLD = [196, 138, 44]; // the highlighted points: women's share
const GREY = [160, 158, 154]; // every other point: a soft, washed-out grey
const TEXT_GREY = [112, 110, 106]; // the small words of the message, darker so they can be read

// TEXT AND MESSAGES. The screen-reader text, the typeface, and the message layouts.
const DESCRIPTION = [ // the text a screen reader says about the artwork, joined with spaces
  "A white canvas. Small dots glow into view within two seconds on round shapes of",
  "different sizes, crowding towards each shape's edge. In round 1 the densest shape sits",
  "near the middle, with smaller ones scattered around it; in round 2 ten similar shapes,",
  "one near the middle, stand for cabinet tables; in round 3 one big globe fills the middle",
  "with a dot for every country; in round 4 five upright towers of different heights stand",
  "side by side like a city skyline. Some shapes run off the edges of the canvas. Most dots",
  "are a soft, washed-out grey. A smaller share are slightly smaller and gold, matching",
  "women's share in each round: 27.5% in round 1, 22.4% in round 2, 14.5% in round 3 and 6%",
  "in round 4. Fine lines flow out of every dot and build up into rounded petals; the lines",
  "on the smaller shapes look soft, as if out of focus. The picture holds still while new",
  "lines keep flowing over it. Then the gold slowly dims until everything is grey, and the",
  "lines are reeled back into their points as the picture fades to white. The points burst",
  "into a swarm of jiggling grey dots that calm down and gather into the words: in round 1,",
  "only 27.5% of National Parliament seats belong to Women; in round 2, only 22.4% of",
  "Cabinet Ministers are Women; in round 3, only 14.5% countries are led by a Woman; and in",
  "round 4, only 6% of corporate CEOs are Women. The words hold for two seconds while the",
  "dots keep jiggling a little, then the dots jiggle loose and fly off to become the points",
  "of the next round, which begins with a different layout. The gold points are fewer and",
  "smaller each round. After round 4 the dots jiggle loose and fly off to become round 5's",
  "points, an imagined future rather than data. Round 5 starts with 6% of its points gold",
  "and pressed small, in a layout borrowed from one of the earlier rounds. The kept picture",
  "fades away while grey points gently fade and gold points grow in at their seats, mixed",
  "through every shape, as their lines flow out and connect, and the pressed gold points",
  "slowly grow to full size. When gold points are as many as grey ones, points in the",
  "middle fade and burst into jiggling dots, half gold and half grey, that gather into the",
  "words Pass the mic. Nominate a woman. Change who decides. in a clear space in the middle",
  "while round 5's lines keep flowing around it. After about three seconds the lines reel",
  "in, the picture fades to white, and the dots fly off to become round 1's points, so the",
  "story starts again. A click starts the next round or swaps the nearest grey point for a",
  "gold one during the balance phase.",
].join(" ");

// Round 1's message uses a "Split" layout on a 12-column grid with 160 px
// margins: "only 27.5%" sits in the left column and the sentence sits in the
// right column, starting at column 7. "Women" shares the number's baseline and
// the sentence's first line shares "only"'s baseline, so the two columns read
// as one statement. There are three sizes only. Lines break by meaning, never
// inside "of National Parliament seats". size is the font size in pixels; x is
// the edge of each line that align says (left or right) and y is the line its
// letters sit on.
const FONT_NAME = "Reddit Sans"; // set up in style.css
const FONT_WEIGHT = 200; // very light, from the font's weights of 200 to 900
const NUMBER_TEXT = 300; // the biggest size: the number
const WOMEN_TEXT = 150; // 2.5 times the small size: "Women"
const SMALL_TEXT = 60; // the smallest size: every other word (a 1 : 2.5 : 5 scale)
const MARGIN = 160; // empty space at the left and right edges
const COLUMN = (CANVAS_W - 2 * MARGIN) / 12; // the space inside the margins, in 12 columns
const LEFT_X = MARGIN; // the left column's edge
const RIGHT_X = MARGIN + 6 * COLUMN; // the right column starts at column 7 (x = 960)
const NUMBER_NUDGE = 9; // the big number moves left so its "2" lines up with "only"
const TOP_LINE = 420; // the shared top baseline: "only" and the first line of the sentence
const BOTTOM_LINE = 690; // the shared bottom baseline: the number and "Women"
const LINE_GAP = 75; // baseline to baseline for two small lines (1.25 x SMALL_TEXT)
const RIGHT_EDGE = CANVAS_W - MARGIN; // the right margin's edge, where right-aligned lines end
const ALIGN_LEFT = "left"; // the same words as p5's LEFT and RIGHT, which do not exist yet here
const ALIGN_RIGHT = "right";
const ALIGN_CENTER = "center";

// Round 2's message uses a "Diagonal" layout: the reading line runs from
// top-left to bottom-right and ends on "Women". These are the baselines.
const DIAGONAL_LEAD_Y = 210; // "only"
const DIAGONAL_NUMBER_Y = 480; // "22.4%"
const DIAGONAL_PHRASE_Y = 660; // "of Cabinet Ministers"
const DIAGONAL_SUBJECT_Y = 915; // "Women"

// Round 3's message uses a "Margin" layout: everything on the left margin, the
// right side left empty. These are the baselines.
const MARGIN_LEAD_Y = 240; // "only"
const MARGIN_NUMBER_Y = 510; // "14.5%"
const MARGIN_PHRASE_Y = 630; // "countries"
const MARGIN_SUBJECT_Y = 885; // "Woman"

// Round 4's message uses a "Sentence" layout: it reads like one sentence, the
// sizes do the shouting. Two lines flush-left, and the words of different sizes
// share a baseline. A word with follows: true starts right after the word
// before it (placeFollowingLines works out its x).
const SENTENCE_TOP_Y = 555; // "only 6%"
const SENTENCE_BOTTOM_Y = 735; // "of corporate CEOs are Women"
const WORD_GAP = 36; // the space between two words on one line

// The message is drawn as a swarm of dots (see "Based on" in the header).
// Sizes of the dots and their jiggle are shares of the line's font size.
const DOT_GAP = 0.045; // each dot covers a square this share of the font size wide
const MIN_CELL = 2; // but a square is never narrower than this many pixels
const INK_ALPHA = 40; // a pixel with more alpha than this (out of 255) counts as ink
const DOT_TIGHT = 0.04; // dot width when e is 0: small, so the letters read
const DOT_LOOSE = 0.13; // dot width when e is 1: big and overlapping, so the letters blur
const MIN_PACE = 0.75; // the slowest dot flies at 0.75 of the speed of the fastest
const JIGGLE_EVERY = 4; // the dots jump to a new nudge every 4 frames (15 times a second)
const JIGGLE_MEMORY = 0.4; // how much of the last nudge is kept
const JIGGLE_REACH = 0.08; // how far a nudge moves a dot, as a share of the font size

// ROUND 5, "balance". It is an imagined future, NOT data. Grey points
// gently fade and gold points grow in at their seats until gold points are as
// many as grey ones. Lengths are in frames.
const BALANCE_START_POWER = 0.4; // the pressed gold at the start, where round 4 left off
const START_GOLD_SHARE = 0.06; // the share of points that start gold (round 4's 6%)
const MEMORY_FADE_FRAMES = 150; // the kept picture fades out over this long (2.5 seconds)
const SHRINK_FRAMES = 60; // a grey point that gives up its seat fades over this long (1 second)
const SWAP_EVERY = 4; // every this many frames a grey point starts to fade, a gold one is planned
const SEAT_DELAY = 40; // the new gold point appears this long after, as the grey one fades
const BALANCE_LONGEST = 1800; // if there is no balance by now (30 seconds), count it as reached

// FINAL CALL TO ACTION (after round 5): three centred lines, made into a
// swarm of dots like every other message, but half gold and half grey.
// Lengths are in frames.
const FINAL_TEXT = 100; // the size of the final words
const FINAL_TOP_Y = 440; // "Pass the mic."
const FINAL_MIDDLE_Y = 565; // "Nominate a woman."
const FINAL_BOTTOM_Y = 690; // "Change who decides."
const FINAL_CTA = [
  { words: "Pass the mic.", size: FINAL_TEXT, align: ALIGN_CENTER, x: CANVAS_W / 2, y: FINAL_TOP_Y },
  { words: "Nominate a woman.", size: FINAL_TEXT, align: ALIGN_CENTER, x: CANVAS_W / 2, y: FINAL_MIDDLE_Y },
  { words: "Change who decides.", size: FINAL_TEXT, align: ALIGN_CENTER, x: CANVAS_W / 2, y: FINAL_BOTTOM_Y },
];
const FINAL_HOLD = 180; // the final words jiggle this long while round 5 keeps running (3 seconds)
const FINAL_GOLD_SHARE = 0.5; // half of the final dots are gold, the rest grey
const CLEAR_PADDING = 50; // the clear space reaches this far round the words
const CLEAR_SOFT = 60; // and its edge fades out over this much more
const CLEAR_RINGS = 4; // the middle is washed white with this many nested rounded rectangles
const CLEAR_WASH = 12; // how much white (out of 255) each one adds every frame

// The rounds, played in this order. The story starts again from round 1 after the last one. To add
// a round, add one object here. share is the women's share it shows, makeLayout
// is the function that lays out its shapes, planGold is the function that picks
// its gold points, pointCount is how many points it has, pointGap is the space
// left between two points, goldPower is the power of a gold point (the gold is
// pressed smaller each round), agentsPerPower is how many agents a point with
// power 1 sends out, and message is its five lines. dots is filled in by
// setup(). Round 5 has isBalance: true. It is imagined, not data, and each time
// it borrows the layout, pointCount and pointGap of a random data round
// (chooseBalanceLayout fills them in). Its message is left empty: the final
// words (FINAL_CTA) are a message of their own. (The functions are
// named here before they are written below; that is fine for function
// declarations.)
const ROUNDS = [
  {
    share: 0.275, // national parliament seats
    makeLayout: makeChamberLayout,
    planGold: planChamberPiece,
    pointCount: CHAMBER_SEATS + OUTSIDE_POINTS, // 240
    pointGap: CHAMBER_POINT_GAP,
    goldPower: GOLD_POWERS[0],
    agentsPerPower: 4, // fewer lines per point: 240 points cost more to draw
    message: [
      { words: "only", size: SMALL_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: TOP_LINE },
      { words: "27.5%", size: NUMBER_TEXT, align: ALIGN_LEFT, x: LEFT_X - NUMBER_NUDGE, y: BOTTOM_LINE },
      { words: "of National Parliament seats", size: SMALL_TEXT, align: ALIGN_LEFT, x: RIGHT_X, y: TOP_LINE },
      { words: "belong to", size: SMALL_TEXT, align: ALIGN_LEFT, x: RIGHT_X, y: TOP_LINE + LINE_GAP },
      { words: "Women", size: WOMEN_TEXT, align: ALIGN_LEFT, x: RIGHT_X, y: BOTTOM_LINE },
    ],
    dots: [],
  },
  {
    share: 0.224, // cabinet ministers
    makeLayout: makeCabinetLayout,
    planGold: planCabinetPiece,
    pointCount: TABLE_COUNT * SEATS_PER_TABLE, // 250
    pointGap: CABINET_POINT_GAP,
    goldPower: GOLD_POWERS[1],
    agentsPerPower: 4, // fewer lines per point: 250 points cost more to draw
    message: [
      { words: "only", size: SMALL_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: DIAGONAL_LEAD_Y },
      { words: "22.4%", size: NUMBER_TEXT, align: ALIGN_LEFT, x: LEFT_X - NUMBER_NUDGE, y: DIAGONAL_NUMBER_Y },
      { words: "of Cabinet Ministers", size: SMALL_TEXT, align: ALIGN_RIGHT, x: RIGHT_EDGE, y: DIAGONAL_PHRASE_Y },
      { words: "are", size: SMALL_TEXT, align: ALIGN_RIGHT, x: RIGHT_EDGE, y: DIAGONAL_PHRASE_Y + LINE_GAP },
      { words: "Women", size: WOMEN_TEXT, align: ALIGN_RIGHT, x: RIGHT_EDGE, y: DIAGONAL_SUBJECT_Y },
    ],
    dots: [],
  },
  {
    share: 0.145, // countries led by a woman
    makeLayout: makeGlobeLayout,
    planGold: planGlobePiece,
    pointCount: GLOBE_POINTS, // 200
    pointGap: GLOBE_POINT_GAP,
    goldPower: GOLD_POWERS[2],
    agentsPerPower: 6,
    message: [
      { words: "only", size: SMALL_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: MARGIN_LEAD_Y },
      { words: "14.5%", size: NUMBER_TEXT, align: ALIGN_LEFT, x: LEFT_X - NUMBER_NUDGE, y: MARGIN_NUMBER_Y },
      { words: "countries", size: SMALL_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: MARGIN_PHRASE_Y },
      { words: "are led by a", size: SMALL_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: MARGIN_PHRASE_Y + LINE_GAP },
      { words: "Woman", size: WOMEN_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: MARGIN_SUBJECT_Y },
    ],
    dots: [],
  },
  {
    share: 0.06, // corporate CEOs
    makeLayout: makeTowerLayout,
    planGold: planTowerPiece,
    pointCount: TOWER_COUNT * SEATS_PER_TOWER, // 200
    pointGap: TOWER_POINT_GAP,
    goldPower: GOLD_POWERS[3],
    agentsPerPower: 6,
    message: [
      { words: "only", size: SMALL_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: SENTENCE_TOP_Y },
      { words: "6%", size: NUMBER_TEXT, align: ALIGN_LEFT, x: 0, y: SENTENCE_TOP_Y, follows: true },
      { words: "of corporate CEOs are", size: SMALL_TEXT, align: ALIGN_LEFT, x: LEFT_X, y: SENTENCE_BOTTOM_Y },
      { words: "Women", size: WOMEN_TEXT, align: ALIGN_LEFT, x: 0, y: SENTENCE_BOTTOM_Y, follows: true },
    ],
    dots: [],
  },
  {
    isBalance: true, // round 5: an imagined future, NOT data
    share: START_GOLD_SHARE, // where round 4 left off; the balance phase then grows it
    makeLayout: null, // chosen at random from the data rounds each time
    planGold: planBalancePiece,
    pointCount: 0, // taken from the chosen data round
    pointGap: 0, // taken from the chosen data round
    goldPower: BALANCE_START_POWER,
    agentsPerPower: 4, // like rounds 1 and 2: round 5 grows to over 300 points, which cost more
    message: [], // the final words are FINAL_CTA, not a message of this round
    dots: [],
  },
];

// STATE. What the sketch remembers while it plays.
let points = []; // every point (pole) on the canvas
let shapes = []; // the round shapes the points sit on; shapes[0] is the chamber
let agents = []; // every traveller that draws a trail
let trails; // a separate layer for the trails, so they can fade without the points fading
let memory; // the picture kept at KEEP_FRAME; it never fades
let memoryGrey; // a grey copy of the kept picture, for the ending
let currentRound = 0; // which round is playing: an index into ROUNDS
let messageDots = []; // the dots of the message being shown, taken from a round
let heldE = 1; // the envelope e as it was read at the last jiggle
let frame; // how many frames this piece has been playing
let messageStart = 0; // the frame when the message on screen began
let loosenAt = 0; // message time when its dots loosen
let messageLength = 0; // message time when it is over
let isMessageShowing = false; // true while a message is on screen instead of the picture
let retractStart = RETRACT_START; // the frame the lines start to reel in (Infinity in round 5 until balance)
let seatings = []; // the gold points planned to appear in round 5, each {x, y, shape, at}
let isBalanced = false; // true once round 5 has as many gold points as grey ones
let balanceFrame = null; // the frame when the last planned gold appeared after that
let finalDots = []; // the dots of the final words, half gold and half grey
let finalBox = null; // the box round the final dots: left, right, top, bottom
let isFinalOn = false; // true while the final message plays over round 5

// SETUP AND CLICKS. Starting the sketch, reacting to a click, and starting a piece.

// Runs once at the start: makes the canvas and the layers, waits for the
// message's typeface to load, works out every round's message dots, and builds
// the first piece. It waits, so it is an async function.
async function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  trails = createGraphics(CANVAS_W, CANVAS_H);
  memory = createGraphics(CANVAS_W, CANVAS_H);
  memoryGrey = createGraphics(CANVAS_W, CANVAS_H);
  await document.fonts.load(`${FONT_WEIGHT} 62px "${FONT_NAME}"`);
  for (const entry of ROUNDS) {
    placeFollowingLines(entry.message);
    entry.dots = makeMessageDots(entry.message);
  }
  finalDots = makeMessageDots(FINAL_CTA);
  finalBox = boxAround(finalDots);
  describe(DESCRIPTION);
  newPiece();
}

// A click anywhere starts the next round from the beginning. During round 5's
// balance phase it swaps the grey point nearest the mouse for a gold one instead.
function mousePressed() {
  if (isBalancing()) {
    swapGrey(nearestGrey(mouseX, mouseY));
    return;
  }
  if (!isMessageShowing) goToNextRound(); // during a message the next round is already chosen
  newPiece();
}

// Moves on to the next round, and back to round 1 after the last one.
function goToNextRound() {
  currentRound = (currentRound + 1) % ROUNDS.length;
}

// The round that is playing now.
function thisRound() {
  return ROUNDS[currentRound];
}

// Plans a new piece of the current round and starts it playing from the beginning.
function newPiece() {
  planPiece();
  startPiece(0);
}

// Starts the planned piece playing at startFrame: clears the agents and the
// layers, gives the points their moments to appear, and sends the agents out.
// A new piece starts at 0. After the message it starts at POINTS_FRAMES,
// because the points are already there.
function startPiece(startFrame) {
  agents = [];
  frame = startFrame;
  trails.background(WHITE);
  memory.background(WHITE);
  setAppearTimes();
  for (const point of points) makeAgents(point, point.power);
  resetBalance();
}

// Gets round 5's balance phase ready, and says that the picture (not a
// message) is on screen. Rounds 1 to 4 reel their lines in at RETRACT_START.
// Round 5 works its own time out once it is balanced.
function resetBalance() {
  isMessageShowing = false;
  isBalanced = false;
  balanceFrame = null;
  isFinalOn = false;
  seatings = [];
  retractStart = thisRound().isBalance ? Infinity : RETRACT_START;
}

// PLANNING A PIECE. Layouts, shapes, points and the gold ones, all worked out before drawing.

// Plans the next piece of the current round: a new layout, new points on it,
// and exactly the round's number of points highlighted. Nothing is drawn yet,
// so this can run while the screen is white.
function planPiece() {
  if (thisRound().isBalance) chooseBalanceLayout();
  makeLayoutWithPoints();
  thisRound().planGold();
  giveKinds();
}

// Round 1: highlights CHAMBER_GOLD chamber seats and OUTSIDE_GOLD of the
// points outside the chamber, 66 gold points in all.
function planChamberPiece() {
  highlightCount(points.filter((point) => point.shape === shapes[0]), CHAMBER_GOLD);
  highlightCount(points.filter((point) => point.shape !== shapes[0]), OUTSIDE_GOLD);
}

// Round 2: gives each table its gold count from TABLE_GOLD.
function planCabinetPiece() {
  spreadGold(TABLE_GOLD);
}

// Round 3: highlights GLOBE_GOLD of the points on the globe.
function planGlobePiece() {
  highlightCount(points, GLOBE_GOLD);
}

// Round 4: gives each tower its gold count from TOWER_GOLD.
function planTowerPiece() {
  spreadGold(TOWER_GOLD);
}

// Round 5 (imagined): highlights START_GOLD_SHARE of the points, at random,
// pressed to BALANCE_START_POWER. Round 5's picture is not data.
function planBalancePiece() {
  highlightCount(points, round(points.length * START_GOLD_SHARE));
}

// Round 5 uses the layout of one of the four data rounds, picked at random each
// time, with that round's point count and the gap it leaves between points.
function chooseBalanceLayout() {
  const donor = random(ROUNDS.filter((entry) => !entry.isBalance));
  thisRound().makeLayout = donor.makeLayout;
  thisRound().pointCount = donor.pointCount;
  thisRound().pointGap = donor.pointGap;
}

// Gives each shape its gold count from a list, in a random order so a
// different shape gets the extra gold point each time.
function spreadGold(goldCounts) {
  const golds = shuffle(goldCounts);
  shapes.forEach((shape, i) => {
    highlightCount(points.filter((point) => point.shape === shape), golds[i]);
  });
}

// Makes a new layout and puts the points on it. If a shape turns out too full
// to take all of its points, the layout is thrown away and a new one is made.
function makeLayoutWithPoints() {
  do {
    points = [];
    thisRound().makeLayout();
  } while (!makePoints());
}

// Round 1's layout: the chamber first, then as many smaller shapes around
// it as fit without touching, up to a random number between FEWEST_SHAPES and
// MOST_SHAPES.
function makeChamberLayout() {
  shapes = [makeChamber()];
  const wanted = floor(random(FEWEST_SHAPES, MOST_SHAPES + 1));
  for (let tries = 0; tries < SHAPE_TRIES && shapes.length <= wanted; tries++) {
    const shape = makeOutsideShape();
    if (hasSpaceFor(shape, SHAPE_GAP)) shapes.push(shape);
  }
  shareOutsidePoints(shapes.slice(1));
}

// Round 2's layout: the first table near the middle with sharp lines, then
// soft tables at random spots until there are TABLE_COUNT. If not all of
// them fit, makePoints() notices and the layout is thrown away.
function makeCabinetLayout() {
  shapes = [makeTable(spotNearMiddle(), 0)];
  for (let tries = 0; tries < SHAPE_TRIES && shapes.length < TABLE_COUNT; tries++) {
    const table = makeTable({ x: random(CANVAS_W), y: random(CANVAS_H) }, 1);
    if (hasSpaceFor(table, TABLE_GAP)) shapes.push(table);
  }
}

// Round 3's layout: one big globe near the middle, with sharp lines, that
// holds all of the points.
function makeGlobeLayout() {
  const spot = spotNearMiddle();
  const globe = makeShape(spot.x, spot.y, random(GLOBE_SMALLEST, GLOBE_BIGGEST), 0);
  globe.count = GLOBE_POINTS;
  shapes = [globe];
}

// Round 4's layout: TOWER_COUNT towers of different heights standing side by
// side on the ground line. The tallest one has sharp lines, the rest are soft.
function makeTowerLayout() {
  const halves = [];
  for (let i = 0; i < TOWER_COUNT; i++) halves.push(random(TOWER_SHORTEST, TOWER_TALLEST));
  const tallest = halves.indexOf(max(halves));
  shapes = halves.map((half, i) => makeTower(towerX(i), half, i === tallest ? 0 : 1));
}

// Where tower number i stands: the middle of its slot across the canvas,
// moved a little left or right by chance.
function towerX(i) {
  const slot = (CANVAS_W - 2 * MARGIN) / TOWER_COUNT;
  return MARGIN + (i + 0.5) * slot + random(-TOWER_SHIFT, TOWER_SHIFT);
}

// Makes one upright tower with SEATS_PER_TOWER points, standing on the ground
// line. half is half its height. It is made like makeShape's shapes, but narrow
// and not tilted.
function makeTower(x, half, soft) {
  const y = GROUND_Y - half;
  return { x: x, y: y, rx: half * TOWER_WIDTH, ry: half, tilt: 0, count: SEATS_PER_TOWER, soft: soft };
}

// Makes one cabinet table at a spot: a shape with SEATS_PER_TABLE seats.
function makeTable(spot, soft) {
  const table = makeShape(spot.x, spot.y, random(TABLE_SMALLEST, TABLE_BIGGEST), soft);
  table.count = SEATS_PER_TABLE;
  return table;
}

// A spot somewhere near the middle of the canvas, never quite the same twice.
function spotNearMiddle() {
  const x = CANVAS_W / 2 + random(-1, 1) * CHAMBER_SPREAD * CANVAS_W;
  const y = CANVAS_H / 2 + random(-1, 1) * CHAMBER_SPREAD * CANVAS_H;
  return { x: x, y: y };
}

// Makes the chamber: CHAMBER_SEATS seats on a big round shape near the middle of the
// canvas. Its lines are sharp.
function makeChamber() {
  const spot = spotNearMiddle();
  const chamber = makeShape(spot.x, spot.y, random(CHAMBER_SMALLEST, CHAMBER_BIGGEST), 0);
  chamber.count = CHAMBER_SEATS;
  return chamber;
}

// Makes a smaller shape anywhere on the canvas. Shapes near an edge run off
// it. Its lines are soft, as if out of focus.
function makeOutsideShape() {
  const size = random(OUTSIDE_SMALLEST, OUTSIDE_BIGGEST);
  return makeShape(random(CANVAS_W), random(CANVAS_H), size, 1);
}

// Makes a round shape centred on (x, y), stretched a little into an oval and
// turned to a random angle. size is its radius before stretching, and soft is
// how out of focus its lines look, from 0 (sharp) to 1 (soft).
function makeShape(x, y, size, soft) {
  const stretch = random(1 - STRETCH, 1 + STRETCH);
  return { x: x, y: y, rx: size * stretch, ry: size / stretch, tilt: random(PI), count: 0, soft: soft };
}

// True if a new shape would leave at least gap to every shape already in the
// layout. Each shape counts as a circle as wide as its longest side.
function hasSpaceFor(shape, gap) {
  for (const other of shapes) {
    const reach = max(shape.rx, shape.ry) + max(other.rx, other.ry) + gap;
    if (squaredDistance(shape.x, shape.y, other.x, other.y) < reach * reach) return false;
  }
  return true;
}

// Shares the OUTSIDE_POINTS points outside the chamber between the other
// shapes, by how much room each one shows on the canvas. Each shape gets its
// fair part of the points still left, so the parts always add up to exactly
// OUTSIDE_POINTS.
function shareOutsidePoints(outside) {
  let roomLeft = 0;
  for (const shape of outside) {
    shape.room = shape.rx * shape.ry * shownShare(shape);
    roomLeft += shape.room;
  }
  let pointsLeft = OUTSIDE_POINTS;
  for (const shape of outside) {
    shape.count = round((pointsLeft * shape.room) / roomLeft);
    pointsLeft -= shape.count;
    roomLeft -= shape.room;
  }
}

// Roughly how much of a shape shows on the canvas, from 0 to 1: the share of
// ROOM_SAMPLES random spots on it that land on the canvas.
function shownShare(shape) {
  let shown = 0;
  for (let i = 0; i < ROOM_SAMPLES; i++) {
    if (isInsideCanvas(spotOnBall(shape))) shown++;
  }
  return shown / ROOM_SAMPLES;
}

// Puts every shape's points on it. Returns false if a shape was too full to
// take all of its points, or the round's point count is not reached (for
// example, too few shapes fit), so that the layout can be thrown away.
function makePoints() {
  for (const shape of shapes) {
    for (let i = 0; i < shape.count; i++) {
      const place = placeOnBall(shape);
      if (place === null) return false;
      points.push(makePoint(place, shape));
    }
  }
  return points.length === thisRound().pointCount;
}

// Highlights exactly count points of a group, picked at random: they turn
// gold and carry the round's gold power, which is less than a grey point's.
// The gold is pressed smaller each round.
function highlightCount(group, count) {
  for (const point of shuffle(group).slice(0, count)) {
    point.isHighlighted = true;
    point.power = thisRound().goldPower;
    point.colour = GOLD;
  }
}

// Finds a free spot on a shape: a spot on the canvas that leaves a gap to
// every other point. Returns null if none turns up after PLACE_TRIES tries.
function placeOnBall(shape) {
  for (let tries = 0; tries < PLACE_TRIES; tries++) {
    const place = spotOnBall(shape);
    if (isInsideCanvas(place) && hasRoom(place)) return place;
  }
  return null;
}

// Picks a random spot on a shape as if it were the surface of a ball seen
// from the front. Near the edge of a ball we see its surface side-on, so the
// spots crowd together there and each shape gets a clear round outline.
// The spot is then turned by the shape's tilt.
function spotOnBall(shape) {
  const depth = random(-1, 1); // how far the spot is towards us or away from us
  const out = sqrt(1 - depth * depth); // how far out from the centre it then sits
  const angle = random(TWO_PI);
  const across = cos(angle) * out * shape.rx;
  const down = sin(angle) * out * shape.ry;
  const x = shape.x + across * cos(shape.tilt) - down * sin(shape.tilt);
  const y = shape.y + across * sin(shape.tilt) + down * cos(shape.tilt);
  return { x: x, y: y };
}

// True if a place is on the canvas, at least EDGE_GAP in from every edge.
function isInsideCanvas(place) {
  const insideX = place.x >= EDGE_GAP && place.x <= CANVAS_W - EDGE_GAP;
  const insideY = place.y >= EDGE_GAP && place.y <= CANVAS_H - EDGE_GAP;
  return insideX && insideY;
}

// True if a point placed here would leave a gap to every other point.
function hasRoom(place) {
  const gap = thisRound().pointGap;
  for (const point of points) {
    const squared = squaredDistance(place.x, place.y, point.x, point.y);
    if (squared < gap * gap) return false;
  }
  return true;
}

// Makes one plain grey point on a shape. highlightCount() later picks which
// points turn gold.
function makePoint(place, shape) {
  return {
    x: place.x,
    y: place.y,
    shape: shape,
    power: FULL_POWER,
    colour: GREY,
    isHighlighted: false,
    kind: GIVING,
    appearsAt: 0,
    ...balanceState(),
  };
}

// The extra things a point remembers in round 5's balance phase.
function balanceState() {
  return {
    shrink: 1, // how much of its size it keeps while it fades away, 1 down to 0
    leavesAt: Infinity, // the frame when it starts to shrink away (it gave up its seat)
    growAt: null, // the frame when it started to grow, or null
    growFrom: 0, // the power it grows from
  };
}

// Lines the points up in a random order to appear one straight after another,
// all of them starting within APPEAR_FRAMES, however many there are.
function setAppearTimes() {
  const order = shuffle(points);
  for (let i = 0; i < order.length; i++) {
    order[i].appearsAt = (i * APPEAR_FRAMES) / order.length;
  }
}

// Sorts the points into the two kinds, in a random order.
// Each point joins the side that has less power so far. This keeps the two
// sides even, so most agents find somewhere to land.
function giveKinds() {
  let givingPower = 0;
  let receivingPower = 0;
  for (const point of shuffle(points)) {
    if (givingPower <= receivingPower) {
      point.kind = GIVING;
      givingPower += point.power;
    } else {
      point.kind = RECEIVING;
      receivingPower += point.power;
    }
  }
}

// AGENTS AND THE FIELD. The travellers, and the push and pull that steers them.

// Gives a point its agents, facing out at equal angles. More power means
// more agents, and each round says how many a point with power 1 sends out.
// power is the power to count them for (a growing point is given the agents of
// the power it is growing to).
function makeAgents(point, power) {
  const count = round(power * thisRound().agentsPerPower);
  const turn = random(TWO_PI);
  for (let i = 0; i < count; i++) {
    const agent = { home: point, angle: turn + (TWO_PI * i) / count, isHome: false };
    sendOut(agent);
    agents.push(agent);
  }
}

// Puts an agent just beside its home point, ready to travel. Its direction
// is its own angle plus a slow turn that grows with time, so each new trail
// leaves a little further round than the last one.
function sendOut(agent) {
  const angle = agent.angle + frame * SPIN;
  agent.x = agent.home.x + cos(angle) * ARRIVE_DISTANCE;
  agent.y = agent.home.y + sin(angle) * ARRIVE_DISTANCE;
  agent.steps = 0;
}

// Moves every agent one step: along the field, or, once the reeling in
// starts, back towards its point.
function moveAgents() {
  for (const agent of agents) {
    if (frame > retractStart) reelIn(agent);
    else moveAgent(agent);
  }
}

// Moves one agent a step along the field and draws the step it took.
// Agents from a receiving point travel against the field, back to a giver.
// An agent that has stopped sets off again from home.
function moveAgent(agent) {
  const direction = fieldAt(agent.x, agent.y);
  const way = agent.home.kind === GIVING ? 1 : -1;
  const nextX = agent.x + direction.x * STEP * way;
  const nextY = agent.y + direction.y * STEP * way;
  // isStuck: the agent turned back on itself
  const isStuck = squaredDistance(nextX, nextY, agent.lastX, agent.lastY) < STEP * STEP;
  drawTrail(agent, nextX, nextY);
  agent.lastX = agent.x;
  agent.lastY = agent.y;
  agent.x = nextX;
  agent.y = nextY;
  agent.steps++;
  if (isStuck || hasStopped(agent)) sendOut(agent);
}

// Pulls one agent back along its line, towards its own point, and draws the
// step. This is the opposite way to moveAgent, and the field lines never
// change, so walking back along the field leads home. Once it is home it
// stays there, and it is never sent out again.
function reelIn(agent) {
  if (agent.isHome) return;
  const direction = fieldAt(agent.x, agent.y);
  const way = agent.home.kind === GIVING ? -1 : 1;
  const nextX = agent.x + direction.x * STEP * way;
  const nextY = agent.y + direction.y * STEP * way;
  drawTrail(agent, nextX, nextY);
  agent.x = nextX;
  agent.y = nextY;
  agent.steps = max(0, agent.steps - 1);
  agent.isHome = hasReturned(agent);
}

// True if an agent is back at its home point (close enough), or has left the
// canvas, so there is nothing more to pull in.
function hasReturned(agent) {
  const reach = ARRIVE_DISTANCE * 2;
  const squared = squaredDistance(agent.x, agent.y, agent.home.x, agent.home.y);
  return squared < reach * reach || !isOnCanvas(agent.x, agent.y);
}

// An agent stops when it is inside the clear space of the final message, lands on a
// point of the other kind, leaves the canvas, or has taken too many steps.
function hasStopped(agent) {
  if (isFinalOn && distanceFromWords(agent.x, agent.y) < CLEAR_PADDING) return true;
  for (const point of points) {
    const squared = squaredDistance(agent.x, agent.y, point.x, point.y);
    const isClose = squared < ARRIVE_DISTANCE * ARRIVE_DISTANCE;
    if (isClose && point.kind !== agent.home.kind) return true;
  }
  return !isOnCanvas(agent.x, agent.y) || agent.steps >= MAX_STEPS;
}

// True if (x, y) is inside the canvas.
function isOnCanvas(x, y) {
  return x >= 0 && x < CANVAS_W && y >= 0 && y < CANVAS_H;
}

// Adds up the push and pull of every point at (x, y).
// Each point's pull is its power divided by the distance squared, so a near
// point counts for far more than a distant one. This is what bunches the
// trails together into petals. Returns the direction as a vector of length 1.
function fieldAt(x, y) {
  let totalX = 0;
  let totalY = 0;
  for (const point of points) {
    const dx = x - point.x;
    const dy = y - point.y;
    const distance = sqrt(dx * dx + dy * dy);
    const pull = pushOf(point) / (distance * distance);
    totalX += (dx / distance) * pull;
    totalY += (dy / distance) * pull;
  }
  const size = sqrt(totalX * totalX + totalY * totalY);
  return { x: totalX / size, y: totalY / size };
}

// A giving point pushes agents away from itself. A receiving point pulls them in.
function pushOf(point) {
  if (point.kind === GIVING) return point.power;
  return -point.power;
}

// PLAYING THE PICTURE. Drawing each frame: the layers, the trails, the points, dimming and fading.

// Every frame: the message is shown if there is one on screen, and the picture
// plays if not.
function draw() {
  frame++;
  if (isMessageShowing) showMessage();
  else playPicture();
}

// Plays one frame of the picture. Once the points are in, every agent takes
// a step. The lines build up until the picture is kept; after that the moving
// lines fade behind themselves. While the final message is on, the middle is
// washed white and the message is drawn over the picture. Later the gold dims (rounds 1
// to 4) or grey points fade and gold ones grow in (round 5), then the lines are reeled back
// in while the picture fades to white, and the picture ends.
function playPicture() {
  if (frame === KEEP_FRAME) remember();
  if (frame > KEEP_FRAME) fadeTrails();
  if (frame > POINTS_FRAMES) moveAgents();
  if (isFinalOn) washMiddle();
  if (isDimming()) dimGold();
  if (isBalanceRound() && frame >= KEEP_FRAME) playBalance();
  showLayers();
  for (const point of points) drawPoint(point, gentle((frame - point.appearsAt) / GROW_FRAMES) * point.shrink * endingSize());
  if (isFinalOn) drawSwarm(frame - messageStart);
  if (frame === retractStart + RETRACT_FRAMES) endPicture();
}

// True while the playing round is round 5, the imagined balance round.
function isBalanceRound() {
  return thisRound().isBalance === true;
}

// True while the gold is dimming into grey. Round 5 never dims its gold.
function isDimming() {
  return !isBalanceRound() && frame > DIM_START;
}

// Ends the picture: rounds 1 to 4 go on to their message, and round 5 hands
// its final dots over to round 1.
function endPicture() {
  if (isBalanceRound()) handOverMessage();
  else startMessage();
}

// How big round 5's points are drawn while the lines reel in: they shrink away
// as the picture fades. Other rounds keep their points. retractStart is
// Infinity before the balance, which gives 1.
function endingSize() {
  return isBalanceRound() ? 1 - stage(retractStart, RETRACT_FRAMES) : 1;
}

// Keeps the picture as it is now, like a long-exposure photograph: the lines
// are copied into the memory layer, which never fades, and into a grey copy
// of it for the ending. The moving layer starts again from white.
function remember() {
  memory.image(trails, 0, 0);
  memoryGrey.image(trails, 0, 0);
  memoryGrey.filter(GRAY);
  trails.background(WHITE);
}

// Shows the kept picture with the moving lines laid over it. While the gold
// dims, the grey copy of the kept picture is laid over it, a little stronger
// each frame. MULTIPLY mode darkens like ink printed over ink, so the white
// parts of the moving layer leave the picture under it as it is. Once the
// lines are being reeled in, the fading layers are shown instead.
function showLayers() {
  if (frame > retractStart) {
    showFadingLayers();
    return;
  }
  showKeptPicture();
  if (isDimming()) showGreyCopy();
  blendMode(MULTIPLY);
  image(trails, 0, 0);
  blendMode(BLEND);
}

// Shows the kept picture. In round 5 it fades away after KEEP_FRAME, so that
// the live moving lines show what has changed since.
function showKeptPicture() {
  const fade = isBalanceRound() ? stage(KEEP_FRAME, MEMORY_FADE_FRAMES) : 0;
  if (fade === 0) {
    image(memory, 0, 0);
    return;
  }
  background(WHITE);
  tint(255, 255 * (1 - fade));
  image(memory, 0, 0);
  noTint();
}

// Lays the grey copy of the kept picture over it, a little stronger each
// frame while the gold dims.
function showGreyCopy() {
  tint(255, 255 * stage(DIM_START, DIM_FRAMES));
  image(memoryGrey, 0, 0);
  noTint();
}

// Shows the grey picture (in round 5, the memory layer) and the moving lines on
// white, both fading out together while the lines are reeled in, until only white
// is left.
function showFadingLayers() {
  const fade = 1 - stage(retractStart, RETRACT_FRAMES);
  background(WHITE);
  tint(255, 255 * fade);
  image(isBalanceRound() ? memory : memoryGrey, 0, 0);
  blendMode(MULTIPLY);
  image(trails, 0, 0);
  blendMode(BLEND);
  noTint();
}

// Turns every gold point a little greyer each frame, so the gold slowly dims
// and the lines near it turn grey too.
function dimGold() {
  const amount = stage(DIM_START, DIM_FRAMES);
  for (const point of points) {
    if (point.isHighlighted) point.colour = mixColours(GOLD, GREY, amount);
  }
}

// Makes every moving line lighter by shade, so it fades to white behind
// itself, one shade a time. ADD mode adds the fill colour to what is already
// there.
function fadeTrails() {
  if (frame % FADE_EVERY !== 0) return;
  trails.blendMode(ADD);
  trails.noStroke();
  trails.fill(1);
  trails.rect(0, 0, CANVAS_W, CANVAS_H);
  trails.blendMode(BLEND);
}

// Draws the step an agent has just taken onto the trails layer, twice: a
// wide faint stroke for the glow, then a thin stroke on top. Lines from a
// soft shape are wider and fainter, as if out of focus. While the final
// message is on, steps fade out towards the words and are not drawn near them.
function drawTrail(agent, nextX, nextY) {
  const openness = opennessAt(nextX, nextY);
  if (openness === 0) return;
  const far = constrain(nearestDistance(nextX, nextY) / FAR_DISTANCE, 0, 1);
  const soft = agent.home.shape.soft;
  const weight = lerp(NEAR_WEIGHT, FAR_WEIGHT, far) * lerp(1, SOFT_WIDTH, soft);
  const alpha = lerp(NEAR_ALPHA, FAR_ALPHA, far) * freshness(agent) * lerp(1, SOFT_ALPHA, soft) * openness;
  drawTrailLines(agent, nextX, nextY, weight, alpha);
}

// Draws a trail's step twice: a wide faint stroke for the glow, then a thin
// stroke on top, in the colour of the points around it.
function drawTrailLines(agent, nextX, nextY, weight, alpha) {
  const colour = colourAt(nextX, nextY);
  trails.strokeCap(SQUARE);
  trails.stroke(colour[0], colour[1], colour[2], alpha * GLOW_ALPHA);
  trails.strokeWeight(weight * GLOW_WIDTH);
  trails.line(agent.x, agent.y, nextX, nextY);
  trails.stroke(colour[0], colour[1], colour[2], alpha);
  trails.strokeWeight(weight);
  trails.line(agent.x, agent.y, nextX, nextY);
}

// An agent's trail fades the longer it has travelled, from 1 down to 0.
// Short trails that land quickly stay strong. Long wanderers melt away.
function freshness(agent) {
  return 1 - agent.steps / MAX_STEPS;
}

// Mixes the colours of the points around (x, y). Near points count for much
// more, so a trail takes on the colour of whichever points it passes.
function colourAt(x, y) {
  const mix = [0, 0, 0];
  let totalWeight = 0;
  for (const point of points) {
    const squared = squaredDistance(x, y, point.x, point.y);
    const weight = point.power / (squared * squared); // power divided by distance to the 4th
    for (let i = 0; i < 3; i++) mix[i] += point.colour[i] * weight;
    totalWeight += weight;
  }
  return [mix[0] / totalWeight, mix[1] / totalWeight, mix[2] / totalWeight];
}

// How far (x, y) is from the point closest to it.
function nearestDistance(x, y) {
  let nearest = Infinity;
  for (const point of points) {
    nearest = min(nearest, squaredDistance(x, y, point.x, point.y));
  }
  return sqrt(nearest);
}

// Draws one point: a small soft glow with a solid dot on top, both in the
// point's own colour. grown is how far it has grown, from 0 to 1. Its area
// grows with its power, so a point with half the power covers half the area.
function drawPoint(point, grown) {
  const size = pointDiameter(point, grown);
  noStroke();
  fill(point.colour[0], point.colour[1], point.colour[2], 14);
  for (let disc = 1; disc <= GLOW_DISCS; disc++) {
    circle(point.x, point.y, size + (POINT_GLOW * grown * disc) / GLOW_DISCS);
  }
  fill(point.colour);
  circle(point.x, point.y, size);
}

// How wide a point's solid dot is when it has grown by grown (0 to 1).
function pointDiameter(point, grown) {
  return sqrt(point.power) * POINT_SIZE * grown;
}

// THE MESSAGES. The swarm of jiggling dots that gather into words and fly to the next points.

// Shows the message on a white screen. The old points burst into a swarm of
// jiggling dots that gather into the words, the words hold, then the dots
// loosen, then fly off to become the next round's points.
function showMessage() {
  const t = frame - messageStart;
  background(WHITE);
  drawSwarm(t);
  if (t >= messageLength) finishMessage();
}

// Ends a message: the next round starts by itself.
function finishMessage() {
  isMessageShowing = false;
  startPiece(POINTS_FRAMES);
}

// Starts the message of the round that is ending. The next round is planned
// too, so the dots can fly to its points when they loosen.
function startMessage() {
  const from = sourcesFromPoints(points);
  const dots = thisRound().dots;
  goToNextRound();
  planPiece();
  beginMessage(dots, from, READ_FRAMES, FLIGHT_FRAMES);
}

// Puts a message on screen. The dots start at the places in from, gather for
// GATHER_FRAMES, hold for readFrames, loosen, and the message is over
// afterLoosen frames later.
function beginMessage(dots, from, readFrames, afterLoosen) {
  setUpMessage(dots, from, readFrames, afterLoosen);
  isMessageShowing = true;
}

// Gets a message ready, with its times, but does not show it on its own: the
// final message plays over round 5's picture.
function setUpMessage(dots, from, readFrames, afterLoosen) {
  messageDots = dots;
  messageStart = frame;
  loosenAt = GATHER_FRAMES + readFrames;
  messageLength = loosenAt + afterLoosen;
  heldE = 1;
  aimDots(from);
}

// Turns points into places for dots to start from: where each is, its colour
// and how wide its dot is.
function sourcesFromPoints(list) {
  return list.map((point) => ({ x: point.x, y: point.y, colour: point.colour, size: pointDiameter(point, 1) }));
}

// Draws one line of text in the message's font, size and weight on a hidden
// layer, with its edge (line.align) at line.x and its letters sitting on line.y.
// It is only used to find the dots, so they sit exactly on the letters.
function drawLine(layer, line) {
  setLineStyle(layer, line);
  layer.noStroke();
  layer.fill(TEXT_GREY);
  layer.text(line.words, line.x, line.y);
}

// Sets the message's font, weight, alignment and size for a line on a layer.
function setLineStyle(layer, line) {
  layer.textFont(FONT_NAME);
  layer.textWeight(line.weight || FONT_WEIGHT);
  layer.textAlign(line.align, BASELINE);
  layer.textSize(line.size);
}

// Works out the x of every line that follows the one before it: the earlier
// line's x, plus its measured width, plus WORD_GAP. The words are measured on a
// hidden layer in the same font, weight and size they are drawn in. This runs
// once, before the dots are made.
function placeFollowingLines(message) {
  const layer = createGraphics(CANVAS_W, CANVAS_H);
  for (let i = 1; i < message.length; i++) {
    if (!message[i].follows) continue;
    setLineStyle(layer, message[i - 1]);
    message[i].x = message[i - 1].x + layer.textWidth(message[i - 1].words) + WORD_GAP;
  }
  layer.remove();
}

// Draws the swarm at message time t (in frames): only the dots, on white.
function drawSwarm(t) {
  if (isJiggleFrame(t)) jiggleDots(t);
  noStroke();
  for (const dot of messageDots) drawDot(dot, t);
}

// True on the frames when the dots jiggle: every JIGGLE_EVERY frames. They
// jiggle the whole time, so the count simply starts at the message's start.
function isJiggleFrame(t) {
  return t % JIGGLE_EVERY === 0;
}

// Jiggle motion modelled on "Eparpille" by @aurel.smcn (Instagram post via
// @contemporarytype, 4 December 2025). Only every few frames, each dot picks a
// new random nudge, part new and part like its last one, and the envelope e is
// read again. In between, everything holds still, so the motion steps.
function jiggleDots(t) {
  heldE = envelope(t);
  for (const dot of messageDots) {
    dot.nx = lerp(randomGaussian(), dot.nx, JIGGLE_MEMORY);
    dot.ny = lerp(randomGaussian(), dot.ny, JIGGLE_MEMORY);
  }
}

// The envelope e at message time t: how loose the dots are. It falls from 1
// (big, jiggling dots) to READ_E while the dots gather, stays there while the
// words are read, then rises back to 1 as the dots loosen. Then it stays at 1.
function envelope(t) {
  if (t < GATHER_FRAMES) return lerp(1, READ_E, t / GATHER_FRAMES);
  const loosened = constrain((t - loosenAt) / LOOSEN_FRAMES, 0, 1);
  return lerp(READ_E, 1, loosened);
}

// Draws one dot of the message. First it gathers from its old place into its
// letter place; after that it holds, loosens, and flies to its new point.
function drawDot(dot, t) {
  if (t < GATHER_FRAMES) drawGatheringDot(dot, t);
  else drawFlyingDot(dot, t);
}

// Draws a dot on its way from its old place into its letter place, jiggling.
// It shrinks or grows from its starting size to the dot size, and its colour
// turns from its starting colour to its own colour.
function drawGatheringDot(dot, t) {
  const gather = gatherOf(dot, t);
  const reach = JIGGLE_REACH * dot.size * heldE;
  const x = lerp(dot.source.x, dot.x, gather) + dot.nx * reach;
  const y = lerp(dot.source.y, dot.y, gather) + dot.ny * reach;
  const diameter = lerp(dot.source.size, looseSize(dot), gather);
  fill(mixColours(dot.source.colour, dot.colour, gather));
  circle(x, y, diameter);
}

// Draws a dot that is on its letter place or flying to its new point. It
// jiggles, and the jiggle fades as it lands. Its size and colour turn into
// the point's.
function drawFlyingDot(dot, t) {
  const travel = travelOf(dot, t);
  const reach = JIGGLE_REACH * dot.size * heldE * (1 - travel);
  const x = lerp(dot.x, dot.target.x, travel) + dot.nx * reach;
  const y = lerp(dot.y, dot.target.y, travel) + dot.ny * reach;
  const diameter = lerp(looseSize(dot), pointDiameter(dot.target, 1), travel);
  fill(mixColours(dot.colour, dot.target.colour, travel));
  circle(x, y, diameter);
}

// How wide a dot is right now: small when e is low, big when e is high.
function looseSize(dot) {
  return lerp(DOT_TIGHT, DOT_LOOSE, heldE) * dot.size;
}

// How far a dot has come from its old point into its letter place, from 0
// to 1. It starts and ends slowly. Slower dots arrive after quicker ones.
function gatherOf(dot, t) {
  return gentle(constrain(t / (GATHER_FRAMES * dot.pace), 0, 1));
}

// How far a dot has travelled to its point, from 0 to 1. It starts slowly,
// speeds up, and arrives late. Slower dots arrive after quicker ones.
function travelOf(dot, t) {
  const u = constrain((t - loosenAt) / (FLIGHT_FRAMES * dot.pace), 0, 1);
  return gentle(u) * gentle(u) * gentle(u);
}

// Works out where the message's dots sit. Each line of the message is drawn
// on a hidden layer exactly as it will be drawn on the canvas, and the layer's
// pixels are read to place the dots. This runs once, because the words never
// change. Returns the dots of one message (a list of lines). (textToPoints
// cannot reach weight 200 of a variable font.)
function makeMessageDots(message) {
  const dots = [];
  const layer = createGraphics(CANVAS_W, CANVAS_H);
  layer.pixelDensity(1); // one layer pixel per canvas pixel; must come before the text settings
  for (const line of message) addLineDots(layer, line, dots);
  layer.remove();
  return dots;
}

// Draws one line on the hidden layer, covers the page with small squares, and
// adds one dot to the dots list for every square that has ink in it.
function addLineDots(layer, line, dots) {
  layer.clear();
  drawLine(layer, line);
  layer.loadPixels();
  const side = max(MIN_CELL, round(DOT_GAP * line.size));
  for (let y = 0; y < CANVAS_H; y += side) {
    for (let x = 0; x < CANVAS_W; x += side) {
      const centre = inkCentre(layer, x, y, side);
      if (centre !== null) dots.push(makeDot(centre, line.size));
    }
  }
}

// Finds the middle of the ink inside one square of the hidden layer. Using
// the middle of the ink, not the middle of the square, means a thin stem still
// gets a dot right on it. Returns null if the square has no ink.
function inkCentre(layer, left, top, side) {
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let y = top; y < min(top + side, CANVAS_H); y++) {
    for (let x = left; x < min(left + side, CANVAS_W); x++) {
      if (layer.pixels[(y * CANVAS_W + x) * 4 + 3] <= INK_ALPHA) continue;
      sumX += x + 0.5;
      sumY += y + 0.5;
      count++;
    }
  }
  return count === 0 ? null : { x: sumX / count, y: sumY / count };
}

// Makes one dot of the message at its place on a letter. aimDots() gives it
// its old point, its new point, its random pace and its jiggle.
function makeDot(centre, size) {
  return { x: centre.x, y: centre.y, size: size, nx: 0, ny: 0, pace: 1, source: null, target: null, colour: TEXT_GREY };
}

// Gets the dots ready to move. They are shuffled, and dot i starts on place
// i of from (the old points, or the old message's dots), counting round again
// if there are fewer places than dots, and flies at the end to the same count
// of the next piece's points. Each dot also gets a new random pace and a new
// random start for its jiggle.
function aimDots(from) {
  const order = shuffle(messageDots);
  for (let i = 0; i < order.length; i++) {
    order[i].source = from[i % from.length];
    order[i].target = points[i % points.length];
    order[i].pace = random(MIN_PACE, 1);
    order[i].nx = randomGaussian();
    order[i].ny = randomGaussian();
  }
}

// ROUND 5: THE BALANCE. An imagined future, NOT data. Every few frames a grey point
// fades away, and a new gold point grows in at its seat a moment later, until
// gold points are as many as grey ones. Pressed gold points slowly grow to
// full size too.

// One frame of the balance phase, in this order: swap a seat now and then, seat
// the gold points that are due, move the points, and check whether the balance
// has been reached.
function playBalance() {
  swapNow();
  seatDueGolds();
  updatePoints();
  checkBalance();
  checkSettled();
}

// True while a click can swap a grey point for a gold one: round 5's balance
// phase, until the balance is reached.
function isBalancing() {
  return isBalanceRound() && frame >= KEEP_FRAME && !isBalanced;
}

// Every SWAP_EVERY frames, until the balance is reached, a random grey point is
// swapped, and one pressed gold point is lifted. A random grey (not the one
// nearest the gold) mixes gold and grey through every shape, so the balance
// shows everywhere, not as gold shapes beside grey ones.
function swapNow() {
  if (isBalanced || (frame - KEEP_FRAME) % SWAP_EVERY !== 0) return;
  const grey = points.filter(isGrey);
  if (grey.length > 0) swapGrey(random(grey));
  liftOnePressed();
}

// Lifts one random pressed gold point gently: it grows from its power to full
// power, and its agents are made again. Does nothing if none is left.
function liftOnePressed() {
  const pressed = points.filter(isPressedGold);
  if (pressed.length === 0) return;
  const point = random(pressed);
  startGrowing(point, point.power);
}

// A grey point fades away, and a gold point is planned to grow in at its seat
// SEAT_DELAY frames later. Does nothing if there is no grey point (null).
function swapGrey(grey) {
  if (grey === null) return;
  beginLeaving(grey);
  seatings.push({ x: grey.x, y: grey.y, shape: grey.shape, at: frame + SEAT_DELAY });
}

// True for a grey point that stays: not gold, and not fading away.
function isGrey(point) {
  return !point.isHighlighted && point.leavesAt === Infinity;
}

// True for a pressed gold point that is not growing yet.
function isPressedGold(point) {
  return point.isHighlighted && point.growAt === null && point.power < FULL_POWER;
}

// The grey point nearest to (x, y), or null if there is none.
function nearestGrey(x, y) {
  let best = null;
  let bestSquared = Infinity;
  for (const point of points.filter(isGrey)) {
    const squared = squaredDistance(x, y, point.x, point.y);
    if (squared < bestSquared) {
      best = point;
      bestSquared = squared;
    }
  }
  return best;
}

// Adds the gold point of every seating whose time has come, and takes those
// seatings off the list.
function seatDueGolds() {
  for (const seating of seatings) {
    if (frame >= seating.at) addGoldPoint(seating);
  }
  seatings = seatings.filter((seating) => frame < seating.at);
}

// Adds a new gold point at a seating. It grows in from nothing, and its lines
// flow out as it grows. Its kind is the side (giving or receiving) that has
// less power.
function addGoldPoint(seating) {
  const gold = makePoint(seating, seating.shape);
  gold.isHighlighted = true;
  gold.colour = GOLD;
  gold.kind = weakerSide();
  gold.appearsAt = frame;
  points.push(gold);
  startGrowing(gold, 0);
}

// Starts a point's power growing from a start power to full power, over
// GROW_FRAMES, and makes its agents again for full power.
function startGrowing(point, from) {
  point.growFrom = from;
  point.growAt = frame;
  point.power = from;
  removeAgents(point);
  makeAgents(point, FULL_POWER);
}

// The kind (giving or receiving) of the side that has less power so far, as
// in giveKinds(). A tie goes to giving.
function weakerSide() {
  let giving = 0;
  let receiving = 0;
  for (const point of points) {
    if (point.kind === GIVING) giving += point.power;
    else receiving += point.power;
  }
  return giving <= receiving ? GIVING : RECEIVING;
}

// A grey point that gives up its seat starts to fade away from now.
function beginLeaving(point) {
  point.leavesAt = frame;
}

// Moves every point on one frame: grows it, shrinks it if it is fading away, or
// takes it away once it has shrunk to nothing. It loops over a copy of the
// list, because points can be removed on the way.
function updatePoints() {
  for (const point of points.slice()) {
    if (point.growAt !== null) growPoint(point);
    point.shrink = 1 - gentle((frame - point.leavesAt) / SHRINK_FRAMES);
    if (frame >= point.leavesAt + SHRINK_FRAMES) removePoint(point);
  }
}

// Grows a point's power one step; when it is full, the growing is over.
function growPoint(point) {
  const grown = gentle((frame - point.growAt) / GROW_FRAMES);
  point.power = lerp(point.growFrom, FULL_POWER, grown);
  if (grown === 1) point.growAt = null;
}

// Takes a point away, with its agents.
function removePoint(point) {
  points.splice(points.indexOf(point), 1);
  removeAgents(point);
}

// Takes away every agent that belongs to a point.
function removeAgents(point) {
  agents = agents.filter((agent) => agent.home !== point);
}

// Stops swapping once gold points will be as many as grey ones (counting the
// golds still to appear), or when BALANCE_LONGEST frames have passed. Golds
// that are planned still appear.
function checkBalance() {
  if (isBalanced) return;
  if (projectedGap() >= 0 || frame - KEEP_FRAME >= BALANCE_LONGEST) isBalanced = true;
}

// How many more gold points than grey ones there will be once every planned
// gold has appeared.
function projectedGap() {
  const gold = points.filter((point) => point.isHighlighted).length;
  return gold + seatings.length - points.filter(isGrey).length;
}

// After the balance is reached, waits for the last planned gold to appear. That
// frame is the balanceFrame: the final message starts and gathers
// (GATHER_FRAMES), then jiggles (FINAL_HOLD) from there, then the lines are reeled in.
function checkSettled() {
  if (!isBalanced || balanceFrame !== null) return;
  if (seatings.length > 0) return;
  balanceFrame = frame;
  startFinalMessage();
  retractStart = frame + GATHER_FRAMES + FINAL_HOLD;
}

// THE FINAL MESSAGE. When gold and grey are equal, the points in the middle
// fade and burst into jiggling dots, half gold and half grey, that gather into
// the final words in a clear space while round 5 keeps running around it.

// Starts the final message: the points near the words fade away and the
// message dots burst out of them (all the points if none are near).
function startFinalMessage() {
  isFinalOn = true;
  memory.background(WHITE);
  paintFinalDots();
  const leaving = points.filter(isInClearing);
  for (const point of leaving.filter(isStaying)) beginLeaving(point);
  const from = sourcesFromPoints(leaving.length > 0 ? leaving : points);
  setUpMessage(finalDots, from, FINAL_HOLD + RETRACT_FRAMES, FLIGHT_FRAMES);
}

// Makes half of the final dots gold and the rest grey, mixed evenly.
function paintFinalDots() {
  const goldCount = round(finalDots.length * FINAL_GOLD_SHARE);
  shuffle(finalDots).forEach((dot, i) => {
    dot.colour = i < goldCount ? GOLD : TEXT_GREY;
  });
}

// True for a point that is not fading away.
function isStaying(point) {
  return point.leavesAt === Infinity;
}

// True for a point inside the clear space, soft edge included.
function isInClearing(point) {
  return distanceFromWords(point.x, point.y) < CLEAR_PADDING + CLEAR_SOFT;
}

// Works out the box round some dots, from their x and y.
function boxAround(dots) {
  const xs = dots.map((dot) => dot.x);
  const ys = dots.map((dot) => dot.y);
  return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
}

// How far (x, y) is from the box round the final words (0 inside it).
function distanceFromWords(x, y) {
  const dx = max(finalBox.left - x, 0, x - finalBox.right);
  const dy = max(finalBox.top - y, 0, y - finalBox.bottom);
  return sqrt(dx * dx + dy * dy);
}

// How open the picture is at (x, y): 1 when the final message is off, and
// while it is on, 0 near the words rising to 1 beyond the soft edge.
function opennessAt(x, y) {
  if (!isFinalOn) return 1;
  return constrain((distanceFromWords(x, y) - CLEAR_PADDING) / CLEAR_SOFT, 0, 1);
}

// Washes the old lines in the middle towards white: a few nested white
// rounded rectangles on the trails layer, from the soft edge in to the words.
function washMiddle() {
  trails.noStroke();
  trails.fill(WHITE[0], WHITE[1], WHITE[2], CLEAR_WASH);
  for (let i = 0; i < CLEAR_RINGS; i++) {
    const padding = lerp(CLEAR_PADDING + CLEAR_SOFT, CLEAR_PADDING, i / (CLEAR_RINGS - 1));
    const width = finalBox.right - finalBox.left + 2 * padding;
    const height = finalBox.bottom - finalBox.top + 2 * padding;
    trails.rect(finalBox.left - padding, finalBox.top - padding, width, height, padding);
  }
}

// Hands the final dots over to round 1: round 1's points are planned, every
// dot gets one as its target, and the message takes over from the picture.
function handOverMessage() {
  currentRound = 0;
  planPiece();
  finalDots.forEach((dot, i) => {
    dot.target = points[i % points.length];
  });
  isFinalOn = false;
  isMessageShowing = true;
}

// SMALL HELPERS. Tools used by many parts of the sketch.

// The distance between two places, squared. Comparing squared distances
// skips a square root, which matters because this runs millions of times a
// second.
function squaredDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

// Turns a steady 0 to 1 into one that starts and ends slowly.
function gentle(amount) {
  const t = constrain(amount, 0, 1);
  return t * t * (3 - 2 * t);
}

// Mixes two colours: an amount of 0 gives the first and 1 gives the second.
function mixColours(first, second, amount) {
  const mix = [];
  for (let i = 0; i < 3; i++) mix.push(lerp(first[i], second[i], amount));
  return mix;
}

// How far one stage of the ending has got, from 0 (not started) to 1 (done).
// It starts and ends slowly.
function stage(start, length) {
  return gentle((frame - start) / length);
}
