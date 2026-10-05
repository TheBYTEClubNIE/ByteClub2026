// Bytle: one tech word a day, 4 to 8 letters long. Add words anywhere in the
// list (A-Z only). Each day takes the next length from LENGTHS and the next
// word of that length from a fixed shuffle, so everyone gets the same word on
// the same day, and you get one more try than the word has letters.
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
  // 4 letters
  ["JAVA", "A language that runs anywhere there's a JVM, from Android apps to banks."],
  ["BYTE", "Eight bits: enough for one character of plain text."],
  ["CODE", "Instructions written for a computer to follow."],
  ["LOOP", "Code that repeats until a condition says stop."],
  ["NULL", "A value that means there's nothing here."],
  ["BASH", "The default shell on most Linux systems."],
  ["HASH", "A fixed-size fingerprint computed from any data."],
  ["JSON", "A text format for data: objects, arrays, strings and numbers."],
  ["HTML", "The markup that gives a web page its structure."],
  ["DATA", "The facts and numbers a program works with."],
  ["FILE", "A named chunk of data stored on disk."],
  ["PUSH", "Send your local commits up to the remote repository."],
  ["PULL", "Fetch commits from the remote and merge them in."],
  ["FORK", "Your own copy of someone else's repository."],
  ["SORT", "Put items in order."],
  ["HEAP", "Memory for data whose size isn't known until the program runs."],
  ["TREE", "A hierarchy of nodes hanging from a single root."],
  ["PORT", "A numbered endpoint on a machine that network traffic is sent to."],
  ["HOST", "A machine on a network that offers services."],
  ["SYNC", "Make two copies of some data match."],
  ["BOOL", "A type with just two values: true and false."],
  ["CHAR", "A single character, like a or 7."],
  ["ENUM", "A type with a fixed set of named values."],
  ["VOID", "A return type that means the function gives nothing back."],
  ["TRUE", "The boolean that isn't false."],
  ["ELSE", "What runs when the if condition isn't met."],
  ["EXIT", "End the program, ideally with code 0."],
  ["GRID", "A layout of rows and columns, in CSS or anywhere else."],
  ["PING", "Check whether a machine is reachable, and how fast it answers."],
  ["UNIX", "The 1970s operating system that inspired Linux and macOS."],
  ["RUST", "A systems language that is fast and memory safe."],
  ["RUBY", "A friendly scripting language, home of Rails."],
  ["PERL", "An old-school scripting language famous for text processing."],
  ["LISP", "One of the oldest languages, built almost entirely from parentheses."],
  ["DART", "The language behind Flutter apps."],
  ["REPO", "A repository: your project and its whole history."],
  ["BLOB", "A binary large object, like an image stored in a database."],
  ["CRON", "A scheduler that runs commands at set times."],
  ["DIFF", "The lines that changed between two versions of a file."],
  ["UUID", "A 128-bit ID that is practically guaranteed to be unique."],
  ["WIKI", "A website anyone can edit, like Wikipedia."],
  ["ICON", "A small picture that stands for an app or an action."],
  ["MAIN", "The function where many programs start."],
  ["LOGS", "Timestamped records of what a program did."],
  ["MESH", "A 3D shape made of vertices, edges and faces."],
  // 6 letters
  ["PYTHON", "A popular language known for readable code and huge libraries."],
  ["BINARY", "Base two: everything a computer stores is ones and zeros."],
  ["SERVER", "A computer that answers requests from other computers."],
  ["CLIENT", "The side that asks a server for something."],
  ["KERNEL", "The core of an operating system, the part that talks to the hardware."],
  ["VECTOR", "A list of numbers, or a growable array in C++."],
  ["SCRIPT", "A small program that automates a task."],
  ["SOCKET", "One end of a network connection."],
  ["BRANCH", "A separate line of development in Git."],
  ["COMMIT", "A saved snapshot of your changes in Git."],
  ["DOCKER", "A tool that packages apps into containers."],
  ["GITHUB", "Where code lives, gets reviewed and gets starred."],
  ["CURSOR", "The blinking marker that shows where you'll type."],
  ["GLOBAL", "Visible from everywhere in the program."],
  ["OBJECT", "Data bundled together with the methods that work on it."],
  ["STRING", "A sequence of characters."],
  ["LAMBDA", "A small function with no name."],
  ["MODULE", "A file of code you can import somewhere else."],
  ["PACKET", "A small chunk of data sent across a network."],
  ["ROUTER", "A device that forwards packets between networks."],
  ["LINKER", "Stitches compiled files together into one program."],
  ["DEPLOY", "Put your code where real users can reach it."],
  ["ENCODE", "Turn data into another format, like text into bytes."],
  ["DECODE", "Turn encoded data back into its original form."],
  ["ESCAPE", "Mark a character so it's treated literally."],
  ["FILTER", "Keep only the items that match a condition."],
  ["LENGTH", "How many items, or characters, something has."],
  ["OUTPUT", "Data coming out of a program."],
  ["RETURN", "Hand a value back from a function."],
  ["SELECT", "The SQL keyword that reads data."],
  ["UPDATE", "Change existing data, in SQL or anywhere else."],
  ["DELETE", "Remove data. Make sure you meant it."],
  ["INSERT", "Add new rows to a table."],
  ["SCHEMA", "The shape of your data: tables, columns and types."],
  ["BACKUP", "A copy you'll be glad you made."],
  ["CONFIG", "Settings that change how a program behaves."],
  ["THREAD", "A sequence of instructions that can run alongside others."],
  ["MEMORY", "Where a running program keeps its data."],
  ["PROMPT", "What you type into a terminal, or into an AI model."],
  ["WIDGET", "A small, reusable piece of a user interface."],
  ["SPRITE", "A 2D image used as a character or object in a game."],
  ["PLUGIN", "An add-on that gives a program new features."],
  ["STREAM", "Data that arrives a piece at a time."],
  ["REDUCE", "Combine a whole list into a single value."],
  ["ASSERT", "Fail loudly if something that must be true isn't."],
  ["CANVAS", "An HTML element you can draw on with code."],
  ["SWITCH", "Pick a branch of code based on a value."],
  ["DOMAIN", "A human-readable web address, like nie.ac.in."],
  ["DEVOPS", "Developers and operations working as one team."],
  ["NEURON", "A single unit in a neural network."],
  ["TENSOR", "A multi-dimensional array, the building block of deep learning."],
  // 7 letters
  ["COMPILE", "Turn source code into something a machine can run."],
  ["BOOLEAN", "A true-or-false value."],
  ["PROGRAM", "A set of instructions for a computer."],
  ["NETWORK", "Computers connected so they can talk to each other."],
  ["BACKEND", "The server side of an app, the part users never see."],
  ["RUNTIME", "When the program is actually running, or the thing that runs it."],
  ["PROMISE", "A JavaScript value that will arrive later."],
  ["LIBRARY", "Reusable code someone else wrote so you don't have to."],
  ["INTEGER", "A whole number, no decimals."],
  ["POINTER", "A variable that holds a memory address."],
  ["BROWSER", "The app you're using to read this."],
  ["GRAPHQL", "A query language where the client asks for exactly the data it needs."],
  ["GENERIC", "Code written once that works with many types."],
  ["CONSOLE", "Where logs and errors show up while you debug."],
  ["PACKAGE", "Bundled code you install with a package manager."],
  ["STORAGE", "Where data stays when the power goes off."],
  ["PROCESS", "A running instance of a program."],
  ["ROUTING", "Deciding which code handles which URL."],
  ["SESSION", "What a server remembers about you between requests."],
  ["COOKIES", "Small bits of data a website keeps in your browser."],
  ["SANDBOX", "A safe, isolated place to run code you don't trust."],
  ["DEFAULT", "The value you get when you don't pick one."],
  ["KEYWORD", "A word reserved by the language, like if or return."],
  ["LOGGING", "Writing down what your program is doing."],
  ["COMMAND", "An instruction you type into a terminal."],
  ["CAPTCHA", "A test to tell humans and bots apart."],
  ["HACKERS", "People who love figuring out how things work."],
  ["WEBHOOK", "A URL another service calls when something happens."],
  ["PATTERN", "A reusable solution to a common design problem."],
  ["ITERATE", "Go through items one at a time."],
  ["RELEASE", "A version of the software you ship to users."],
  ["VERSION", "A numbered snapshot of software, like v5.0."],
  ["DATASET", "A collection of data, often used to train a model."],
  ["PYTORCH", "A deep learning library built around tensors."],
  ["JUPYTER", "Notebooks that mix code, output and notes."],
  ["ANDROID", "Google's mobile operating system."],
  ["QUANTUM", "Computing with qubits instead of bits."],
  ["REQUEST", "What a client sends to a server."],
  ["BACKLOG", "The list of work you haven't done yet."],
  // 8 letters
  ["FUNCTION", "A named block of code you can call again and again."],
  ["VARIABLE", "A named place to keep a value."],
  ["DATABASE", "An organised store of data you can query."],
  ["FRONTEND", "The part of an app users see and touch."],
  ["TERMINAL", "A text window for typing commands."],
  ["COMPILER", "Turns source code into machine code."],
  ["PROTOCOL", "Rules two systems agree on so they can talk."],
  ["KEYBOARD", "Your main input device. Mind the coffee."],
  ["FIREWALL", "A filter that decides which network traffic gets through."],
  ["HARDWARE", "The parts of a computer you can touch."],
  ["SOFTWARE", "The programs that run on the hardware."],
  ["INTERNET", "A network of networks."],
  ["PASSWORD", "A secret that proves it's you. Make it long."],
  ["DEBUGGER", "A tool for pausing code and poking at it."],
  ["OVERFLOW", "When a value is too big for the space it's stored in."],
  ["ITERATOR", "An object that hands you items one at a time."],
  ["OPERATOR", "A symbol like + or && that works on values."],
  ["CALLBACK", "A function you pass in to be called later."],
  ["RESPONSE", "What a server sends back."],
  ["TEMPLATE", "A reusable starting point with blanks to fill in."],
  ["ABSTRACT", "Describing the what without the how."],
  ["DOCUMENT", "A file of content, or the root of a web page's DOM."],
  ["ENDPOINT", "A URL your API answers on."],
  ["REDIRECT", "Send the browser on to a different URL."],
  ["SNAPSHOT", "A copy of the state at one moment in time."],
  ["PIPELINE", "Steps that run one after another, like build, test, deploy."],
  ["ARGUMENT", "A value you pass into a function."],
  ["CONSTANT", "A value that never changes."],
  ["DEADLOCK", "Two threads each waiting for the other, forever."],
  ["ENCODING", "How characters are turned into bytes."],
  ["INSTANCE", "One object made from a class."],
  ["REGISTRY", "A central list where packages or settings are kept."],
];

// The week's rhythm of word lengths; neighbouring days always differ.
export const LENGTHS = [5, 6, 4, 7, 5, 8, 6];

// One more try than the word has letters, and never fewer than six.
export const triesFor = (letters: number) => Math.max(6, letters + 1);
export const MAX_TRIES = triesFor(Math.max(...LENGTHS));

// Each length's words in a fixed shuffle, so the order isn't alphabetical
// but is the same for everyone.
const POOLS = new Map(
  [...new Set(LENGTHS)].map((n) => {
    const list = WORDS.filter(([w]) => w.length === n);
    const order = list.map((_, i) => i);
    let s = 20231 + n;
    for (let i = order.length - 1; i > 0; i--) {
      s = (Math.imul(s, 1103515245) + 12345) >>> 0;
      const j = s % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    return [n, order.map((i) => list[i])];
  })
);

export function wordFor(day: number) {
  const week = LENGTHS.length;
  const slot = ((day % week) + week) % week;
  const letters = LENGTHS[slot];
  // which word of this length: how many earlier days used the same length
  const k =
    Math.floor(day / week) * LENGTHS.filter((n) => n === letters).length +
    LENGTHS.slice(0, slot).filter((n) => n === letters).length;
  const pool = POOLS.get(letters)!;
  const [word, meaning] = pool[((k % pool.length) + pool.length) % pool.length];
  return { word, meaning };
}

export type Mark = "hit" | "near" | "miss";

// Two passes so repeated letters are marked the way people expect:
// exact hits first, then "near" only while unmatched copies remain.
export function score(guess: string, answer: string): Mark[] {
  const n = answer.length;
  const marks: Mark[] = Array(n).fill("miss");
  const left: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    if (guess[i] === answer[i]) marks[i] = "hit";
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < n; i++) {
    if (marks[i] !== "hit" && left[guess[i]] > 0) {
      marks[i] = "near";
      left[guess[i]]--;
    }
  }
  return marks;
}

/* one game, played on the server */

// dist[i]: games won on guess i + 1
export type Stats = { played: number; won: number; streak: number; best: number; lastWon: number; dist: number[] };
export const NO_STATS: Stats = { played: 0, won: 0, streak: 0, best: 0, lastWon: -99, dist: Array(MAX_TRIES).fill(0) };

// What the server keeps (sealed in a cookie) for one browser.
export type Game = { day: number; guesses: string[]; stats: Stats };

// What the browser gets: marks for each guess, and the word only once the game is over.
export type View = {
  day: number;
  letters: number;
  tries: number;
  rows: { guess: string; marks: Mark[] }[];
  status: "playing" | "won" | "lost";
  stats: Stats;
  word?: string;
  meaning?: string;
};

export function view(game: Game): View {
  const { word, meaning } = wordFor(game.day);
  const tries = triesFor(word.length);
  const won = game.guesses.includes(word);
  const over = won || game.guesses.length >= tries;
  return {
    day: game.day,
    letters: word.length,
    tries,
    rows: game.guesses.map((guess) => ({ guess, marks: score(guess, word) })),
    status: won ? "won" : over ? "lost" : "playing",
    stats: game.stats,
    ...(over ? { word, meaning } : {}),
  };
}

// Adds a guess to a game still in play; stats only change when it ends.
export function play(game: Game, guess: string): Game {
  const guesses = [...game.guesses, guess];
  const { word } = wordFor(game.day);
  const won = guess === word;
  if (!won && guesses.length < triesFor(word.length)) return { ...game, guesses };
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
