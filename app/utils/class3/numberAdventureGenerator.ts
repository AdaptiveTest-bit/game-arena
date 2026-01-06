// Generator for Class 3: Number Adventure
// Implements templates, difficulty engine, dedupe (hash), and option generation

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export interface Question {
  id: string; // unique hash
  chapter: string;
  topic: string;
  skill: string;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  answer: string;
}

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const hash = (s: string) => {
  // simple hash for dedupe (stable for session)
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(36);
};

// Templates covering Class 3 syllabus (numbers, place value, addition, subtraction, comparison, patterns, odd/even)
export function generateQuestion(usedHashes: Set<string>, difficulty: Difficulty): Question {
  // Build a pool of templates with broad variety across Class 3 topics
  const templates = [] as Array<() => Question>;

  // Easy templates (single-step, recognition, place value basics)
  templates.push(() => {
    const a = randInt(10, 99);
    const b = randInt(1, 9);
    const ans = a + b;
    const prompt = `What is ${a} + ${b}?`;
    const options = shuffle([ans, ans + randInt(1, 5), Math.max(ans - randInt(1, 5), 0), ans + randInt(6, 12)]).map(String);
    const id = hash(`add:${a}:${b}`);
    return { id, chapter: 'Numbers', topic: 'Addition', skill: 'One-step addition', difficulty: 'easy', prompt, options, answer: String(ans) };
  });

  templates.push(() => {
    const n = randInt(20, 99);
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const prompt = `What is the place value of the digit ${ones} in the number ${n}?`;
    const options = shuffle([String(ones), String(ones * 10), String(tens * 10), String(n)]);
    const id = hash(`place:${n}:${ones}`);
    return { id, chapter: 'Numbers', topic: 'Place Value', skill: 'Ones/Tens recognition', difficulty: 'easy', prompt, options, answer: String(ones) };
  });

  templates.push(() => {
    // Missing number in sequence
    const start = randInt(5, 30);
    const step = randInt(1, 5);
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    const missingIdx = randInt(0, 3);
    const correct = seq[missingIdx];
    const shown = seq.map((v, i) => (i === missingIdx ? '___' : String(v))).join(', ');
    const prompt = `Fill in the blank: ${shown}`;
    const options = shuffle([correct, correct + step, Math.max(correct - step, 0), correct + step * 2]).map(String);
    const id = hash(`seq:${seq.join(':')}:${missingIdx}`);
    return { id, chapter: 'Patterns', topic: 'Number Sequences', skill: 'Missing number', difficulty: 'easy', prompt, options, answer: String(correct) };
  });

  // Medium templates (two-step, borrowing, comparison)
  templates.push(() => {
    const a = randInt(30, 99);
    const b = randInt(10, Math.min(29, a - 1));
    const ans = a - b;
    const prompt = `Subtract ${b} from ${a}.`;
    const options = shuffle([ans, ans + randInt(1, 6), Math.max(ans - randInt(1, 3), 0), ans + randInt(7, 12)]).map(String);
    const id = hash(`sub:${a}:${b}`);
    return { id, chapter: 'Numbers', topic: 'Subtraction', skill: 'Borrowing', difficulty: 'medium', prompt, options, answer: String(ans) };
  });

  templates.push(() => {
    // Compare three numbers
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    const c = randInt(10, 99);
    const arr = [a, b, c];
    const prompt = `Which of these is the greatest number: ${arr.join(', ')}?`;
    const correct = String(Math.max(...arr));
    const options = shuffle([correct, String(Math.min(...arr)), String(arr[1]), String(arr[0])]);
    const id = hash(`max:${arr.join(':')}`);
    return { id, chapter: 'Numbers', topic: 'Comparison', skill: 'Greater/Less', difficulty: 'medium', prompt, options, answer: correct };
  });

  templates.push(() => {
    // Money word problem
    const rupees = randInt(5, 50);
    const buy = randInt(1, 5);
    const cost = buy * randInt(1, 10);
    const ans = rupees - cost;
    const prompt = `Asha has ${rupees} rupees. She buys ${buy} toys costing ${cost} rupees in total. How much money is left?`;
    const options = shuffle([ans, ans + randInt(1, 5), Math.max(ans - randInt(1, 3), 0), ans + randInt(6, 12)]).map(String);
    const id = hash(`money:${rupees}:${buy}:${cost}`);
    return { id, chapter: 'Word Problems', topic: 'Money', skill: 'Simple subtraction with money', difficulty: 'medium', prompt, options, answer: String(ans) };
  });

  // Hard templates (multi-step, multi-concept, ordering, place value with hundreds)
  templates.push(() => {
    const a = randInt(100, 499);
    const b = randInt(10, 99);
    const c = randInt(1, 9);
    const ans = a - b + c;
    const prompt = `A shop had ${a} pencils. They sold ${b} pencils and then received ${c} more. How many pencils are there now?`;
    const options = shuffle([ans, ans + randInt(2, 8), Math.max(ans - randInt(1, 5), 0), ans + randInt(9, 15)]).map(String);
    const id = hash(`pencils:${a}:${b}:${c}`);
    return { id, chapter: 'Word Problems', topic: 'Multi-step', skill: 'Add & subtract in sequence', difficulty: 'hard', prompt, options, answer: String(ans) };
  });

  templates.push(() => {
    // Ordering and place value twist
    const nums = [randInt(10, 99), randInt(100, 499), randInt(1, 9), randInt(50, 150)];
    const prompt = `Which number has the largest hundreds place value: ${nums.join(', ')}?`;
    const hundreds = nums.map((n) => Math.floor(n / 100));
    const idx = hundreds.indexOf(Math.max(...hundreds));
    const options = shuffle(nums.map(String));
    const id = hash(`hundreds:${nums.join(':')}`);
    return { id, chapter: 'Place Value', topic: 'Hundreds', skill: 'Hundreds place', difficulty: 'hard', prompt, options, answer: String(nums[idx]) };
  });

  templates.push(() => {
    // Master: multi-concept puzzle (mixed operations and ordering)
    const x = randInt(12, 98);
    const y = randInt(3, 11);
    const z = randInt(1, 9);
    const computed = x + y - z;
    const choices = shuffle([computed, computed + randInt(1, 6), computed - randInt(1, 4), computed + randInt(7, 12)]).map(String);
    const prompt = `Calculate: ${x} + ${y} - ${z}`;
    const id = hash(`calc:${x}:${y}:${z}`);
    return { id, chapter: 'Mixed', topic: 'Mixed Operations', skill: 'Order of operations (simple)', difficulty: 'master', prompt, options: choices, answer: String(computed) };
  });

  templates.push(() => {
    // Master: odd/even & grouping
    const arr = Array.from({ length: 5 }, () => randInt(1, 99));
    const evens = arr.filter((n) => n % 2 === 0).length;
    const prompt = `How many even numbers are in the list: ${arr.join(', ')}?`;
    const options = shuffle([evens, Math.max(evens - 1, 0), evens + 1, evens + 2]).map(String);
    const id = hash(`even:${arr.join(':')}`);
    return { id, chapter: 'Numbers', topic: 'Even & Odd', skill: 'Parity recognition', difficulty: 'master', prompt, options, answer: String(evens) };
  });

  // Select template based on difficulty but allow variability
  let attempts = 0;
  while (attempts < 200) {
    attempts++;
    // pick index pools by difficulty
    let pool: number[] = [];
    if (difficulty === 'easy') pool = [0, 1, 2];
    else if (difficulty === 'medium') pool = [3, 4, 5];
    else if (difficulty === 'hard') pool = [6, 7];
    else pool = [8, 9, 10];

    const idx = pool[Math.floor(Math.random() * pool.length)];
    const choice = templates[idx % templates.length];
    const q = choice();
    if (!usedHashes.has(q.id)) {
      usedHashes.add(q.id);
      return q;
    }
  }

  // fallback simple question
  const a = randInt(10, 99), b = randInt(1, 9), ans = a + b;
  const id = hash(`fallback:${a}:${b}`);
  return { id, chapter: 'Numbers', topic: 'Addition', skill: 'One-step', difficulty: 'easy', prompt: `What is ${a} + ${b}?`, options: shuffle([ans, ans + 2, ans - 1, ans + 5]).map(String), answer: String(ans) };
}
