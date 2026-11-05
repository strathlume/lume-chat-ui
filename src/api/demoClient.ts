import type { ChatClient, ChatMessage, Source } from "./types";

interface CannedAnswer {
  keywords: string[];
  answer: string;
  sources: Source[];
}

const answers: CannedAnswer[] = [
  {
    keywords: ["tariff", "price", "rate", "standing charge"],
    answer:
      "This is the public demo, so this answer is canned. Signed in, LUME gives you the current tariff for the customer's region and meter type, with the unit rate, the standing charge and the date it last changed.",
    sources: [{ title: "Tariff guide 2026" }],
  },
  {
    keywords: ["account", "customer", "bill", "balance", "payment"],
    answer:
      "This is the public demo, so this answer is canned. Signed in, LUME looks up the customer account you name and sums up the balance, recent payments and any open complaints, without leaving the chat.",
    sources: [{ title: "Customer accounts handbook" }],
  },
  {
    keywords: ["runbook", "inverter", "turbine", "fault", "maintenance", "site visit"],
    answer:
      "This is the public demo, so this answer is canned. For field teams, LUME finds the right maintenance runbook and walks through it step by step, for example an inverter fault reset: isolate, read the fault code, reset, then log the visit.",
    sources: [{ title: "Field runbook FR-112: inverter fault reset" }],
  },
];

const fallback =
  "This is the public demo of LUME's chat front end, so the answers are canned. Try a question about a tariff, a customer account or a field runbook. Strathlume staff use the real assistant after signing in.";

export function pickAnswer(question: string): CannedAnswer {
  const text = question.toLowerCase();
  return (
    answers.find((entry) => entry.keywords.some((word) => text.includes(word))) ?? { keywords: [], answer: fallback, sources: [] }
  );
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

/** Canned answers streamed word by word, so the public demo needs no backend and no sign-in. */
export function createDemoClient(delayMs = 35): ChatClient {
  return {
    async send(history: ChatMessage[], onDelta: (text: string) => void, signal?: AbortSignal) {
      const question = history.filter((message) => message.role === "user").at(-1)?.content ?? "";
      const { answer, sources } = pickAnswer(question);
      for (const word of answer.split(/(?<= )/)) {
        await wait(delayMs, signal);
        onDelta(word);
      }
      return sources;
    },
  };
}
