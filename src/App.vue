<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuiz } from "./composables/useQuiz";
import StartScreen from "./components/StartScreen.vue";
import QuizCard from "./components/QuizCard.vue";
import OptionButton from "./components/OptionButton.vue";
import ExplanationPanel from "./components/ExplanationPanel.vue";
import ResultScreen from "./components/ResultScreen.vue";

const {
  phase,
  current,
  currentIdx,
  totalQuestions,
  score,
  isAnswered,
  isLast,
  answerStates,
  wrongAnswers,
  startQuiz,
  selectAnswer,
  nextQuestion,
  restart,
  totalReactions,
} = useQuiz();

const progressPct = computed(() =>
  phase.value === "playing"
    ? ((currentIdx.value + (isAnswered.value ? 1 : 0)) / totalQuestions.value) * 100
    : 0
);
</script>

<template>
  <!--
    Outermost shell: parchment background, full viewport height.
    Everything sits on the "bench" — a ruled-paper surface.
  -->
  <div
    class="min-h-screen bench-ruled"
    style="background-color: var(--color-bench-bg); color: var(--color-bench-ink);"
  >

    <!-- ── TOP STRIP: thin lab-tape header ── -->
    <header
      class="sticky top-0 z-20"
      style="background: var(--color-bench-ink); color: var(--color-bench-bg);"
    >
      <div class="mx-auto flex max-w-3xl items-center justify-between px-5 py-2">

        <!-- Identity: stencil-style lab label -->
        <div class="flex items-center gap-3">
          <span class="text-lg">⚗️</span>
          <div class="font-typewriter">
            <span
              class="text-[10px] uppercase tracking-[0.25em] opacity-60"
              style="color: var(--color-bench-bg);"
            >
              Organic Chemistry /
            </span>
            <span class="text-sm font-bold" style="color: var(--color-bench-bg);">
              Name Reactions Quiz
            </span>
          </div>
        </div>

        <!-- Right controls -->
        <div class="flex items-center gap-4">
          <template v-if="phase === 'playing'">
            <!-- Score as a handwritten-style fraction -->
            <div class="font-lab text-center leading-none">
              <span class="text-lg font-bold" style="color: var(--color-bench-vial-correct);">
                {{ score }}
              </span>
              <span class="text-xs opacity-40 mx-0.5">/</span>
              <span class="text-sm opacity-60">
                {{ currentIdx + (isAnswered ? 1 : 0) }}
              </span>
            </div>

            <button
              @click="restart"
              class="font-typewriter text-xs uppercase tracking-widest px-3 py-1 rounded transition"
              style="
                border: 1px solid rgba(245,240,232,0.25);
                color: rgba(245,240,232,0.5);
              "
              onmouseover="this.style.color='#fca5a5'; this.style.borderColor='#fca5a5';"
              onmouseout="this.style.color='rgba(245,240,232,0.5)'; this.style.borderColor='rgba(245,240,232,0.25)';"
            >
              ✕ abort
            </button>
          </template>
        </div>
      </div>

      <!-- Progress bar — thin line across bottom of header -->
      <div v-if="phase === 'playing'" style="height: 3px; background: rgba(255,255,255,0.1);">
        <div
          class="transition-all duration-500"
          style="height: 3px; background: linear-gradient(90deg, #a78bfa, #67e8f9);"
          :style="{ width: `${progressPct}%` }"
        />
      </div>
    </header>

    <!-- Colour stripe — Agrarian brand colours -->
    <div class="h-0.5 w-full flex">
      <div class="flex-1 bg-agrarian-blue" />
      <div class="flex-1 bg-agrarian-sky" />
      <div class="flex-1 bg-agrarian-yellow" />
      <div class="flex-1 bg-agrarian-green" />
    </div>

    <!-- ── MAIN BENCH AREA ── -->
    <main class="mx-auto max-w-3xl px-4 py-6">

      <!-- ── START ── -->
      <StartScreen
        v-if="phase === 'start'"
        :total-reactions="totalReactions"
        @start="startQuiz"
      />

      <!-- ── PLAYING ── -->
      <div v-else-if="phase === 'playing' && current" class="w-full">

        <!--
          The reaction zone: floats openly on the ruled bench.
          No enclosing card box — the bench texture IS the surface.
        -->
        <QuizCard
          :reaction="current.reaction"
          :question-number="currentIdx + 1"
          :total-questions="totalQuestions"
        />

        <!--
          Vial rack: four tall narrow option buttons side-by-side,
          like sample vials in a test-tube rack.
        -->
        <div class="mt-8">
          <!-- Rack label -->
          <p
            class="font-typewriter text-[10px] uppercase tracking-[0.2em] mb-3"
            style="color: var(--color-bench-ink-faint);"
          >
            — Select product —
          </p>
          <div class="grid grid-cols-4 gap-3">
            <OptionButton
              v-for="(opt, i) in current.options"
              :key="opt.id"
              :reaction="opt"
              :state="answerStates[i] ?? 'idle'"
              :disabled="isAnswered"
              @click="selectAnswer(i)"
            />
          </div>
        </div>

        <!-- Explanation panel (shown after answering) -->
        <ExplanationPanel
          v-if="isAnswered"
          :reaction="current.reaction"
          :was-correct="answerStates[current.correctIndex] === 'correct'"
          :is-last="isLast"
          @next="nextQuestion"
        />
      </div>

      <!-- ── RESULT ── -->
      <ResultScreen
        v-else-if="phase === 'result'"
        :score="score"
        :total="totalQuestions"
        :wrong-answers="wrongAnswers"
        @restart="restart"
      />
    </main>

    <!-- Footer -->
    <footer
      class="mt-8 py-5 text-center border-t"
      style="border-color: var(--color-bench-ruled);"
    >
      <!-- Agrarian colour bar -->
      <div class="flex justify-center gap-2 mb-3">
        <div
          v-for="c in [
            { color: '#403F84', /* label: 'Dark Blue' */ },
            { color: '#2F9FD9', /* label: 'Sky Blue' */ },
            { color: '#F8D727', /* label: 'Golden Yellow' */ },
            { color: '#005C45', /* label: 'Dark Green' */ },
          ]"
          :key="c.color"
          class="flex flex-col items-center gap-1"
        >
          <div
            class="h-1.5 w-8 rounded-full"
            :style="{ backgroundColor: c.color }"
          />
          <!-- <span class="text-[9px] text-slate-400">{{ c.label }}</span> -->
        </div>
      </div>
      <p class="font-typewriter text-[11px]" style="color: var(--color-bench-ink-faint);">
        Unofficial student project
      </p>
    </footer>

  </div>
</template>
