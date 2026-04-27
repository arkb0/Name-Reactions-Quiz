<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  score: number;
  total: number;
  wrongAnswers: { question: string; correct: string }[];
}>();

const emit = defineEmits<{
  restart: [];
}>();

function medal(pct: number) {
  if (pct >= 90) return { icon: "🥇", msg: "Outstanding!", color: "text-amber-500", grade: "A+", gradeColor: "#16a34a" };
  if (pct >= 70) return { icon: "🥈", msg: "Well done!", color: "text-slate-400", grade: "B", gradeColor: "#0e7490" };
  if (pct >= 50) return { icon: "🥉", msg: "Good effort!", color: "text-amber-700", grade: "C", gradeColor: "#92400e" };
  return { icon: "📚", msg: "Don't panic, it's organic. Keep studying!", color: "text-rose-500", grade: "F", gradeColor: "#991b1b" };
}

const pct = computed(() =>
  props.total > 0 ? Math.round((props.score / props.total) * 100) : 0
);
const result = computed(() => medal(pct.value));
</script>

<template>
  <!--
    Printed lab report aesthetic.
    A single "sheet" with a printed header, ruled data rows, and a
    stamped grade in the corner.
  -->
  <div
    class="w-full max-w-xl mx-auto"
    style="
      background: var(--color-bench-surface);
      border: 1px solid var(--color-bench-ruled);
      box-shadow: 0 4px 32px rgba(26,26,46,0.12), 4px 4px 0 var(--color-bench-ruled);
    "
  >
    <!-- Report header -->
    <div
      class="px-6 py-4 border-b"
      style="border-color: var(--color-bench-ruled);"
    >
      <div class="flex items-start justify-between">
        <div>
          <p
            class="font-typewriter text-[10px] uppercase tracking-[0.25em]"
            style="color: var(--color-bench-ink-faint);"
          >
            Lab Report / Assessment
          </p>
          <h2
            class="font-typewriter text-xl font-bold mt-0.5"
            style="color: var(--color-bench-ink);"
          >
            Name Reactions — Results
          </h2>
        </div>

        <!-- Stamped grade -->
        <div
          class="stamp-drop shrink-0 ml-4 flex h-16 w-16 items-center justify-center rounded-full border-4 font-lab font-black text-2xl"
          :style="`
            border-color: ${result.gradeColor};
            color: ${result.gradeColor};
            opacity: 0.85;
            transform: rotate(-8deg);
          `"
        >
          {{ result.grade }}
        </div>
      </div>
    </div>

    <!-- Data rows: ruled lines -->
    <div class="px-6">

      <!-- Score row -->
      <div
        class="flex items-center justify-between py-4 border-b"
        style="border-color: var(--color-bench-ruled);"
      >
        <span
          class="font-typewriter text-xs uppercase tracking-widest"
          style="color: var(--color-bench-ink-faint);"
        >
          Score
        </span>
        <span class="font-lab text-3xl font-bold" style="color: var(--color-bench-ink);">
          {{ score }}
          <span class="text-base font-normal" style="color: var(--color-bench-ink-faint);">
            / {{ total }}
          </span>
        </span>
      </div>

      <!-- Percentage row + mini bar -->
      <div
        class="py-4 border-b"
        style="border-color: var(--color-bench-ruled);"
      >
        <div class="flex items-center justify-between mb-2">
          <span
            class="font-typewriter text-xs uppercase tracking-widest"
            style="color: var(--color-bench-ink-faint);"
          >
            Accuracy
          </span>
          <span
            class="font-lab text-sm font-bold"
            :style="`color: ${result.gradeColor};`"
          >
            {{ pct }}%
          </span>
        </div>
        <!-- Score bar -->
        <div
          class="w-full h-2 rounded-full overflow-hidden"
          style="background: var(--color-bench-ruled);"
        >
          <div
            class="h-2 rounded-full transition-all duration-700"
            :style="`width: ${pct}%; background: ${result.gradeColor};`"
          />
        </div>
      </div>

      <!-- Verdict row -->
      <div
        class="flex items-center justify-between py-4 border-b"
        style="border-color: var(--color-bench-ruled);"
      >
        <span
          class="font-typewriter text-xs uppercase tracking-widest"
          style="color: var(--color-bench-ink-faint);"
        >
          Verdict
        </span>
        <span class="text-xl mr-1">{{ result.icon }}</span>
        <span
          class="font-typewriter text-sm font-bold italic"
          :style="`color: ${result.gradeColor};`"
        >
          "{{ result.msg }}"
        </span>
      </div>

    </div>

    <!-- Wrong answers review — annotated like marked paper -->
    <div
      v-if="wrongAnswers.length > 0"
      class="mx-6 my-4 rounded"
      style="
        border: 1px solid rgba(153,27,27,0.25);
        background: rgba(153,27,27,0.03);
      "
    >
      <p
        class="font-typewriter text-[10px] uppercase tracking-widest px-4 py-2 border-b font-bold"
        style="
          color: var(--color-bench-burn);
          border-color: rgba(153,27,27,0.2);
        "
      >
        ✗ Missed — review required
      </p>
      <ul class="divide-y" style="--tw-divide-opacity: 1; border-color: rgba(153,27,27,0.1);">
        <li
          v-for="(w, i) in wrongAnswers"
          :key="i"
          class="px-4 py-2.5"
        >
          <p
            class="font-typewriter text-xs"
            style="color: var(--color-bench-ink-faint);"
          >
            {{ w.question }}
          </p>
          <p
            class="font-typewriter text-xs font-bold mt-0.5"
            style="color: var(--color-bench-acid);"
          >
            ✓ {{ w.correct }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Restart — looks like a "sign here" line at the bottom of a form -->
    <div
      class="mx-6 mb-6 mt-2 border-t-2 border-dashed pt-4 flex flex-col items-center gap-3"
      style="border-color: var(--color-bench-ruled);"
    >
      <p
        class="font-typewriter text-[10px] uppercase tracking-widest"
        style="color: var(--color-bench-ink-faint);"
      >
        Questions are randomised each round — give it another go!
      </p>
      <button
        @click="emit('restart')"
        class="font-typewriter text-sm font-bold uppercase tracking-[0.2em] px-10 py-3 rounded transition-all duration-200 active:scale-95"
        style="
          background: var(--color-bench-ink);
          color: var(--color-bench-bg);
        "
        onmouseover="this.style.background='var(--color-bench-plasma)';"
        onmouseout="this.style.background='var(--color-bench-ink)';"
      >
        → New Attempt
      </button>
    </div>

  </div>
</template>
