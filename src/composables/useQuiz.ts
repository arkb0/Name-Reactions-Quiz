import { ref, computed } from "vue";
import allReactions, { type Reaction } from "../data/reactions";

export type QuizPhase = "start" | "playing" | "result";
export type AnswerState = "idle" | "correct" | "wrong" | "reveal";

export interface QuizQuestion {
  reaction: Reaction;          // the correct reaction
  options: Reaction[];          // 4 options (shuffled), including correct
  correctIndex: number;         // index in options[] that is correct
}

// The Fisher-Yates shuffle a.k.a. Knuth shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; // 1. Defensive copy (Immutability)
  for (let i = a.length - 1; i > 0; i--) { // 2. Iterate backwards
    const j = Math.floor(Math.random() * (i + 1)); // 3. Pick a random preceding index
    [a[i], a[j]] = [a[j], a[i]]; // 4. Swap
  }
  return a;
}

function buildQuestions(pool: Reaction[], count: number): QuizQuestion[] {
  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((reaction) => {
    // Pick 3 wrong options from the rest
    const others = shuffle(pool.filter((r) => r.id !== reaction.id)).slice(0, 3);
    const optionsRaw = shuffle([reaction, ...others]);
    const correctIndex = optionsRaw.indexOf(reaction);
    return { reaction, options: optionsRaw, correctIndex };
  });
}

export function useQuiz() {
  const phase = ref<QuizPhase>("start");
  const questions = ref<QuizQuestion[]>([]);
  const currentIdx = ref(0);
  const score = ref(0);
  const selectedOption = ref<number | null>(null);
  const answerStates = ref<AnswerState[]>([]);
  const wrongAnswers = ref<{ question: string; correct: string }[]>([]);

  function startQuiz(count: number, difficulty: number | null) {
    const pool = difficulty
      ? allReactions.filter((r) => r.difficulty === difficulty)
      : allReactions;

    // Fallback if pool smaller than count
    const effectivePool = pool.length >= 4 ? pool : allReactions;
    const qs = buildQuestions(effectivePool, count);

    questions.value = qs;
    currentIdx.value = 0;
    score.value = 0;
    selectedOption.value = null;
    answerStates.value = [];
    wrongAnswers.value = [];
    phase.value = "playing";
  }

  function selectAnswer(optionIndex: number) {
    if (selectedOption.value !== null) return; // already answered
    const q = questions.value[currentIdx.value];
    const isCorrect = optionIndex === q.correctIndex;

    // Build answer state array for the 4 options
    const states: AnswerState[] = q.options.map((_, i) => {
      if (i === optionIndex && isCorrect) return "correct";
      if (i === optionIndex && !isCorrect) return "wrong";
      if (i === q.correctIndex && !isCorrect) return "reveal";
      return "idle";
    });

    answerStates.value = states;
    selectedOption.value = optionIndex;

    if (isCorrect) {
      score.value += 1;
    } else {
      wrongAnswers.value = [
        ...wrongAnswers.value,
        {
          question: `Q${currentIdx.value + 1}: Identify the product(s) of '${q.reaction.name}'`,
          correct: q.reaction.name,
        },
      ];
    }
  }

  function nextQuestion() {
    if (currentIdx.value + 1 >= questions.value.length) {
      phase.value = "result";
    } else {
      currentIdx.value += 1;
      selectedOption.value = null;
      answerStates.value = [];
    }
  }

  function restart() {
    phase.value = "start";
    questions.value = [];
    currentIdx.value = 0;
    score.value = 0;
    selectedOption.value = null;
    answerStates.value = [];
    wrongAnswers.value = [];
  }

  const current = computed(() => questions.value[currentIdx.value] ?? null);
  const isAnswered = computed(() => selectedOption.value !== null);
  const isLast = computed(() => currentIdx.value + 1 >= questions.value.length);

  return {
    phase,
    current,
    currentIdx,
    totalQuestions: computed(() => questions.value.length),
    score,
    isAnswered,
    isLast,
    answerStates,
    wrongAnswers,
    startQuiz,
    selectAnswer,
    nextQuestion,
    restart,
    totalReactions: allReactions.length,
  };
}
