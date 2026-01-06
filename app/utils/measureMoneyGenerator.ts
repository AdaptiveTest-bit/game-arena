export type MMQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = <T,>(arr: T[]) => arr.sort(() => Math.random() - 0.5);

const hash = (s: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(36);
};

export function generateMeasureMoney(count = 6): MMQuestion[] {
  const out: MMQuestion[] = [];
  const used = new Set<string>();

  const push = (q: MMQuestion) => {
    if (used.has(q.id)) return;
    used.add(q.id);
    out.push(q);
  };

  // templates
  const templates: Array<() => MMQuestion> = [
    () => {
      // Length compare (m and cm)
      const a_m = randInt(1, 9);
      const a_cm = randInt(0, 99);
      const b_cm = randInt(100, 999);
      const a_total_cm = a_m * 100 + a_cm;
      const prompt = `A rope is ${a_m} m ${a_cm} cm long. Another rope is ${b_cm} cm long. Which rope is longer and by how much?`;
      const diff = Math.abs(a_total_cm - b_cm);
      const ans = `${a_total_cm > b_cm ? `${a_m} m ${a_cm} cm` : `${Math.floor(b_cm/100)} m ${b_cm%100} cm`} by ${Math.floor(diff/100)} m ${diff%100} cm`;
      const options = shuffle([
        ans,
        `${Math.floor(diff/100)} m ${diff%100} cm`,
        `${Math.floor(diff/100)} m ${Math.max((diff%100)-1,0)} cm`,
        `${Math.floor(diff/100)} m ${Math.min((diff%100)+2,99)} cm`,
      ]);
      return { id: hash(prompt), prompt, options, answer: ans, difficulty: 'medium' };
    },

    () => {
      // Money change
      const price1 = randInt(50, 300);
      const price2 = randInt(10, 150);
      const paid = pick([200, 500, 1000]);
      const total = price1 + price2;
      const change = paid - total;
      const prompt = `A shopkeeper sold a book for ₹${price1} and a pen for ₹${price2}. If the customer gave ₹${paid}, how much change did he get?`;
      const options = shuffle([String(change), String(change + randInt(1,50)), String(Math.max(change - randInt(1,30),0)), String(change + randInt(51,120))]);
      return { id: hash(prompt), prompt, options, answer: String(change), difficulty: 'easy' };
    },

    () => {
      // Weight compare
      const a_g = randInt(1500, 3000);
      const b_kg = randInt(1, 2);
      const b_g = b_kg * 1000 + randInt(0, 500);
      const prompt = `Which is heavier: ${Math.floor(a_g/1000)} kg ${a_g%1000} g or ${b_g} g?`;
      const ans = a_g > b_g ? `${Math.floor(a_g/1000)} kg ${a_g%1000} g` : `${Math.floor(b_g/1000)} kg ${b_g%1000} g`;
      const options = shuffle([ans, a_g > b_g ? `${Math.floor(b_g/1000)} kg ${b_g%1000} g` : `${Math.floor(a_g/1000)} kg ${a_g%1000} g`, `${Math.floor(Math.abs(a_g-b_g)/1000)} kg ${Math.abs(a_g-b_g)%1000} g`, `${Math.max(0, Math.floor((a_g-b_g)/1000))} kg ${Math.abs(a_g-b_g)%1000} g`]);
      return { id: hash(prompt), prompt, options, answer: ans, difficulty: 'medium' };
    },

    () => {
      // Capacity / volume comparison simple
      const a_ml = randInt(250, 2000);
      const b_l = randInt(1, 2);
      const b_ml = b_l * 1000 + randInt(0, 500);
      const prompt = `Container A holds ${a_ml} ml. Container B holds ${b_l} L ${b_ml % 1000} ml. Which holds more and by how much (in ml)?`;
      const diff = Math.abs(a_ml - b_ml);
      const ans = a_ml > b_ml ? `A by ${diff} ml` : `B by ${diff} ml`;
      const options = shuffle([ans, `A by ${Math.max(diff-10,0)} ml`, `B by ${Math.max(diff-5,0)} ml`, `${diff} ml`]);
      return { id: hash(prompt), prompt, options, answer: ans, difficulty: 'medium' };
    },

    () => {
      // Real-life shopping multi-item
      const items = [randInt(20,150), randInt(30,200), randInt(10,120)];
      const total = items.reduce((s,n)=>s+n,0);
      const paid = pick([500,1000]);
      const change = paid - total;
      const prompt = `You buy items costing ₹${items.join(', ')}. If you pay ₹${paid}, how much change should you get?`;
      const options = shuffle([String(change), String(change + randInt(1,40)), String(Math.max(change - randInt(1,25),0)), String(change + randInt(41,100))]);
      return { id: hash(prompt), prompt, options, answer: String(change), difficulty: 'hard' };
    },
  ];

  // helper pick
  function pick<T>(arr: T[]) { return arr[Math.floor(Math.random()*arr.length)]; }

  let tries = 0;
  while (out.length < count && tries < count*10) {
    tries++;
    const t = templates[Math.floor(Math.random() * templates.length)];
    push(t());
  }

  return out;
}
