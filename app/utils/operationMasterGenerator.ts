// Generator for Operation Master Arena (Class 5 hard set)
export type OMQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  difficulty: 'hard' | 'master';
};

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
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(36);
};

export function generateOperationQuestions(count = 6): OMQuestion[] {
  const out: OMQuestion[] = [];
  const used = new Set<string>();

  const pushUnique = (q: OMQuestion) => {
    if (used.has(q.id)) return false;
    used.add(q.id);
    out.push(q);
    return true;
  };

  // Templates
  const templates: Array<() => OMQuestion> = [
    // Multi-step word problem (Riya stickers)
    () => {
      const a = randInt(700, 999);
      const b = randInt(100, 400);
      const c = randInt(100, 300);
      const ans = a - b + c;
      const prompt = `Riya had ${a} stickers. She gave ${b} to her friend and bought ${c} more. How many stickers does she have now?`;
      const options = shuffle([ans, ans + randInt(5, 50), Math.max(ans - randInt(5, 50), 0), ans + randInt(51, 120)]).map(String);
      return { id: hash(prompt), prompt, options, answer: String(ans), difficulty: 'hard' };
    },

    // Missing number in subtraction
    () => {
      const left = randInt(4000, 9999);
      const right = randInt(1000, left - 100);
      const result = left - right;
      const prompt = `${left} − ___ = ${result}`;
      const correct = String(right);
      const options = shuffle([correct, String(right + randInt(1, 50)), String(Math.max(right - randInt(1, 30), 0)), String(right + randInt(51, 120))]);
      return { id: hash(prompt), prompt, options, answer: correct, difficulty: 'hard' };
    },

    // Missing addend
    () => {
      const sum = randInt(700, 999);
      const one = randInt(200, sum - 100);
      const other = sum - one;
      const prompt = `The sum of two numbers is ${sum}. One number is ${one}. Find the other number.`;
      const options = shuffle([String(other), String(other + randInt(1, 50)), String(Math.max(other - randInt(1, 30), 0)), String(other + randInt(51, 120))]);
      return { id: hash(prompt), prompt, options, answer: String(other), difficulty: 'hard' };
    },

    // Estimation + logic
    () => {
      const a = randInt(40, 60);
      const b = randInt(60, 80);
      const est = Math.round(a * b / 100) * 100; // rough nearest hundred heuristic
      const prompt = `Estimate ${a} × ${b} to the nearest hundred.`;
      const options = shuffle([String(est), String(est + 100), String(Math.max(est - 100, 0)), String(est + 200)]);
      return { id: hash(prompt), prompt, options, answer: String(est), difficulty: 'master' };
    },

    // Chained operations
    () => {
      const x = randInt(200, 999);
      const y = randInt(100, 499);
      const z = randInt(50, 299);
      const val = x - y + z;
      const prompt = `${x} − ${y} + ${z} = ?`;
      const options = shuffle([String(val), String(val + randInt(1, 50)), String(Math.max(val - randInt(1, 40), 0)), String(val + randInt(51, 120))]);
      return { id: hash(prompt), prompt, options, answer: String(val), difficulty: 'master' };
    },

    // Find unknown with mixed ops
    () => {
      const a = randInt(1000, 3000);
      const b = randInt(200, 900);
      const target = a + randInt(100, 900);
      // target = a + x - b  => x = target - a + b
      const x = target - a + b;
      const prompt = `${a} + ___ − ${b} = ${target}. Find ___`;
      const options = shuffle([String(x), String(x + randInt(1, 60)), String(Math.max(x - randInt(1, 40), 0)), String(x + randInt(61, 200))]);
      return { id: hash(prompt), prompt, options, answer: String(x), difficulty: 'master' };
    },
  ];

  // Fill out until count
  let tries = 0;
  while (out.length < count && tries < count * 10) {
    tries++;
    const t = templates[Math.floor(Math.random() * templates.length)];
    pushUnique(t());
  }

  return out;
}
