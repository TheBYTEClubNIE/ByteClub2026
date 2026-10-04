// Bytle: one tech word a day. Add words anywhere in the list (exactly five
// letters, A-Z); the daily order is a fixed shuffle, so everyone gets the
// same word on the same day.
//
// SERVER ONLY: this file holds every answer. Only app/api/bytle imports it,
// and the browser just sends guesses there (the calendar is lib/bytle-day.ts).

export const WORDS: [string, string][] = [
  ["ARRAY", "An ordered list of values you reach by index."],
  ["CACHE", "A small, fast store for data you'll probably need again."],
  ["QUERY", "A request for data, usually sent to a database."],
  ["STACK", "Last in, first out: the newest item comes off first."],
  ["QUEUE", "First in, first out, like the line at the canteen."],
  ["LINUX", "The open-source kernel behind most of the internet's servers."],
  ["PARSE", "Turn raw text into a structure a program can work with."],
  ["MERGE", "Combine the changes from two branches into one."],
  ["REACT", "A JavaScript library for building UIs out of components."],
  ["CLASS", "A blueprint for creating objects in object-oriented code."],
  ["FLOAT", "A number with a decimal point, stored approximately."],
  ["CONST", "A variable binding in JavaScript that can't be reassigned."],
  ["ASYNC", "Code that waits for something without blocking everything else."],
  ["AWAIT", "Pause an async function until a promise settles."],
  ["FETCH", "The browser's built-in way to make HTTP requests."],
  ["PROXY", "A server that sits between you and the server you're talking to."],
  ["TOKEN", "A string that proves who you are, or a chunk of text an LLM reads."],
  ["MUTEX", "A lock that lets only one thread touch shared data at a time."],
  ["GRAPH", "A set of nodes connected by edges."],
  ["TUPLE", "A fixed-size, ordered group of values."],
  ["SHELL", "The program that reads and runs your terminal commands."],
  ["BUILD", "Turn source code into something you can run or ship."],
  ["DEBUG", "Track down why the code is doing what it's doing."],
  ["PIXEL", "The smallest dot of colour on a screen."],
  ["FRAME", "One still image in an animation or video."],
  ["ROUTE", "A URL path your app knows how to handle."],
  ["REGEX", "A pattern language for finding and matching text."],
  ["LOGIC", "The rules that decide what a program does next."],
  ["INPUT", "Data going into a program."],
  ["BYTES", "Groups of eight bits. Also, us."],
  ["CLOUD", "Other people's computers, rented by the hour."],
  ["SWIFT", "Apple's language for iOS and macOS apps."],
  ["MYSQL", "A popular open-source relational database."],
  ["REDIS", "An in-memory data store, often used as a cache."],
  ["KAFKA", "A platform for streaming events between services."],
  ["NGINX", "A fast web server that's also a reverse proxy."],
  ["HTTPS", "HTTP, but encrypted."],
  ["MODEL", "In ML, the thing trained on data to make predictions."],
  ["TRAIN", "Teach a model by showing it lots of examples."],
  ["EPOCH", "One full pass over the training data."],
  ["LAYER", "One stage of computation in a neural network."],
  ["AGENT", "An AI system that plans and takes actions using tools."],
  ["VIRUS", "Malicious code that copies itself into other programs."],
  ["PATCH", "A small change that fixes or updates code."],
  ["CLONE", "Make a full local copy of a Git repository."],
  ["SCOPE", "The part of the code where a variable is visible."],
  ["WHILE", "A loop that keeps going as long as a condition is true."],
  ["BREAK", "Jump out of a loop early."],
  ["YIELD", "Hand back a value from a generator and pause until asked again."],
  ["THROW", "Raise an error and let someone else deal with it."],
  ["CATCH", "Handle an error that something else threw."],
  ["SUPER", "Call the parent class from a child class."],
  ["FALSE", "The other boolean."],
  ["INDEX", "A position in a list, or a structure that speeds up database lookups."],
  ["TABLE", "Rows and columns in a relational database."],
  ["JOINS", "SQL's way of combining rows from two tables."],
  ["EVENT", "Something that happened, like a click, that code can react to."],
  ["STATE", "The data your app remembers right now."],
  ["HOOKS", "React functions like useState that give components memory."],
  ["PROPS", "Data passed into a React component from its parent."],
  ["NODES", "The points in a graph or tree."],
  ["TREES", "Hierarchies of nodes, with the root at the top."],
  ["HEAPS", "Trees where every parent beats its children, great for priority queues."],
  ["CRASH", "When a program stops unexpectedly."],
  ["ERROR", "When something went wrong and, ideally, told you why."],
  ["SPAWN", "Start a new process."],
  ["CORES", "Independent processing units inside a CPU."],
  ["CHIPS", "Tiny slices of silicon doing the actual computing."],
  ["ROBOT", "A machine that senses its surroundings and acts on them."],
  ["MACRO", "A shortcut that expands into more code or actions."],
  ["PRINT", "Output some text. Also everyone's first debugger."],
  ["LOCAL", "Running on your own machine, not someone else's."],
  ["ADMIN", "The account with all the permissions."],
  ["LOGIN", "Prove who you are to get in."],
  ["SERVE", "Respond to incoming requests."],
  ["PORTS", "Numbered doors on a machine that network traffic knocks on."],
  ["BLOCK", "A chunk of code between braces, or one link in a blockchain."],
  ["CHAIN", "Things linked in sequence, like promises or blocks."],
  ["SPARK", "An engine for processing big data across many machines."],
  ["TORCH", "PyTorch's core library for tensors and deep learning."],
  ["NUMPY", "Python's go-to library for fast arrays and maths."],
  ["EMOJI", "Tiny pictures encoded as Unicode characters."],
  ["ASCII", "The original 128-character text encoding."],
  ["UNITY", "A popular engine for building games."],
  ["FLASK", "A lightweight Python web framework."],
  ["RAILS", "The Ruby framework that made 'convention over configuration' famous."],
  ["TESTS", "Code that checks that your code works."],
  ["MOCKS", "Fake stand-ins used in tests instead of the real thing."],
  ["AGILE", "A way of building software in short, iterative cycles."],
  ["SCRUM", "An agile framework with sprints and daily standups."],
  ["ALPHA", "An early, rough version of a product."],
  ["PRIME", "A number divisible only by 1 and itself."],
  ["MOUSE", "The pointer you move around the screen."],
  ["RANGE", "A sequence of numbers between two ends."],
  ["SLICE", "A piece cut out of a list or string."],
  ["SPLIT", "Break a string into parts."],
  ["SHIFT", "Remove the first item of a list, or move bits to the left."],
  ["FLAGS", "Options that switch a behaviour on or off."],
  ["OAUTH", "The protocol behind 'Sign in with Google'."],
  ["NONCE", "A number used once, common in security protocols."],
  ["SPACE", "The key that settles every tabs-vs-spaces argument."],
  ["BATCH", "A group of items processed together."],
  ["VALUE", "The actual data a variable holds."],
  ["TYPES", "Labels like string or number that say what data can do."],
  ["LINKS", "Pointers from one page, or node, to another."],
  ["FONTS", "Files that define how text looks."],
  ["HACKS", "Quick, clever fixes. Hopefully temporary."],
  ["BUGGY", "Full of bugs. Every first draft."],
  ["JULIA", "A fast language built for scientific computing."],
  ["SCALA", "A JVM language mixing object-oriented and functional styles."],
  ["AZURE", "Microsoft's cloud platform."],
  ["TIMER", "Something that runs code after a delay."],
  ["LATEX", "The typesetting system behind most research papers."],
  ["FIGMA", "The design tool where interfaces get drawn before they're coded."],
];

// Fixed shuffle, so the daily order isn't alphabetical but is the same for everyone.
const ORDER = (() => {
  const idx = WORDS.map((_, i) => i);
  let s = 20231;
  for (let i = idx.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
})();

export function wordFor(day: number) {
  const n = WORDS.length;
  const [word, meaning] = WORDS[ORDER[((day % n) + n) % n]];
  return { word, meaning };
}

export type Mark = "hit" | "near" | "miss";

// Two passes so repeated letters are marked the way people expect:
// exact hits first, then "near" only while unmatched copies remain.
export function score(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(5).fill("miss");
  const left: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) marks[i] = "hit";
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (marks[i] !== "hit" && left[guess[i]] > 0) {
      marks[i] = "near";
      left[guess[i]]--;
    }
  }
  return marks;
}

/* one game, played on the server */

export const ROWS = 6;

export type Stats = { played: number; won: number; streak: number; best: number; lastWon: number; dist: number[] };
export const NO_STATS: Stats = { played: 0, won: 0, streak: 0, best: 0, lastWon: -99, dist: [0, 0, 0, 0, 0, 0] };

// What the server keeps (sealed in a cookie) for one browser.
export type Game = { day: number; guesses: string[]; stats: Stats };

// What the browser gets: marks for each guess, and the word only once the game is over.
export type View = {
  day: number;
  rows: { guess: string; marks: Mark[] }[];
  status: "playing" | "won" | "lost";
  stats: Stats;
  word?: string;
  meaning?: string;
};

export function view(game: Game): View {
  const { word, meaning } = wordFor(game.day);
  const won = game.guesses.includes(word);
  const over = won || game.guesses.length >= ROWS;
  return {
    day: game.day,
    rows: game.guesses.map((guess) => ({ guess, marks: score(guess, word) })),
    status: won ? "won" : over ? "lost" : "playing",
    stats: game.stats,
    ...(over ? { word, meaning } : {}),
  };
}

// Adds a guess to a game still in play; stats only change when it ends.
export function play(game: Game, guess: string): Game {
  const guesses = [...game.guesses, guess];
  const won = guess === wordFor(game.day).word;
  if (!won && guesses.length < ROWS) return { ...game, guesses };
  const s: Stats = { ...game.stats, dist: [...game.stats.dist], played: game.stats.played + 1 };
  if (won) {
    s.won += 1;
    s.dist[guesses.length - 1] += 1;
    s.streak = s.lastWon === game.day - 1 ? s.streak + 1 : 1;
    s.best = Math.max(s.best, s.streak);
    s.lastWon = game.day;
  } else {
    s.streak = 0;
  }
  return { ...game, guesses, stats: s };
}
