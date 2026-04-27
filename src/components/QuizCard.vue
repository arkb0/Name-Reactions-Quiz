<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type Reaction } from "../data/reactions";

const props = defineProps<{
  reaction: Reaction;
  questionNumber: number;
  totalQuestions: number;
}>();

// Handle lazy svg load
const resolvedSvgUrl = ref<string>("");

// This watcher handles the initial load AND when the user moves to the next question
watch(
  () => props.reaction.svg.reactants,
  async (newPath) => {
    // Clear immediately so the old image disappears
    resolvedSvgUrl.value = "";
    // Check if it's a function (lazy glob) or already a string
    if (typeof newPath === "function") {
      // Lazy glob returns a function → call it
      const url = await newPath(); // ?url returns string directly
      resolvedSvgUrl.value = url;
    } else {
      resolvedSvgUrl.value = newPath as string;
    }
  },
  { immediate: true }
);

const difficultyMeta: Record<number, { label: string; mark: string }> = {
  1: { label: "Beginner",     mark: "★☆☆" },
  2: { label: "Intermediate", mark: "★★☆" },
  3: { label: "Advanced",     mark: "★★★" },
};

const diff = computed(
  () => difficultyMeta[props.reaction.difficulty] ?? { label: "Unknown", mark: "—" }
);
</script>

<template>
  <!--
    The reaction bench: no card border — lives directly on the ruled surface.
    Layout is horizontal: [meta column] | [reaction SVG — centred, large] | [arrow → ?]
  -->
  <div class="w-full">

    <!-- ── Row 1: specimen label tape across top ── -->
    <div
      class="flex items-center justify-between mb-6 pb-2 border-b"
      style="border-color: var(--color-bench-ruled);"
    >
      <!-- Question counter — typewriter style -->
      <div class="font-lab">
        <span class="text-3xl font-bold" style="color: var(--color-bench-plasma);">
          {{ String(questionNumber).padStart(2, '0') }}
        </span>
        <span class="text-sm ml-1" style="color: var(--color-bench-ink-faint);">
          / {{ String(totalQuestions).padStart(2, '0') }}
        </span>
      </div>

      <!-- Difficulty stars + label -->
      <div class="text-right font-typewriter">
        <div class="text-xs" style="color: var(--color-bench-plasma);">{{ diff.mark }}</div>
        <div class="text-[10px] uppercase tracking-widest" style="color: var(--color-bench-ink-faint);">
          {{ diff.label }}
        </div>
      </div>
    </div>

    <!-- ── Row 2: prompt line ── -->
    <p
      class="font-typewriter text-sm mb-6 text-center"
      style="color: var(--color-bench-ink-mid);"
    >
      Identify the
      <span
        class="font-bold px-1.5 py-0.5 rounded mx-1"
        style="
          background: var(--color-bench-ink);
          color: var(--color-bench-bg);
          font-style: italic;
        "
      >
        product
      </span>
      of the following reaction:
    </p>

    <!-- ── Row 3: the reaction itself — open on the bench ── -->
    <div class="flex items-center gap-4">

      <!-- Meta sidebar: conditions + reactants, rotated label style -->
      <div
        class="shrink-0 w-24 flex flex-col gap-3 border-r pr-4"
        style="border-color: var(--color-bench-ruled);"
      >
        <div>
          <p
            class="font-typewriter text-[9px] uppercase tracking-widest mb-1"
            style="color: var(--color-bench-ink-faint);"
          >
            Conditions
          </p>
          <p
            class="font-lab text-xs font-bold leading-snug"
            style="color: var(--color-bench-amber);"
          >
            {{ reaction.template.conditions }}
          </p>
        </div>
        <div>
          <p
            class="font-typewriter text-[9px] uppercase tracking-widest mb-1"
            style="color: var(--color-bench-ink-faint);"
          >
            Reactants
          </p>
          <p
            class="font-typewriter text-[10px] leading-snug"
            style="color: var(--color-bench-ink-mid);"
          >
            {{ reaction.template.reactants_label }}
          </p>
        </div>
      </div>

      <!-- Reaction SVG — large, centred, floats on the ruled paper -->
      <div class="flex-1 flex items-center justify-center min-h-[220px]">
        <img
          v-if="resolvedSvgUrl"
          :src="resolvedSvgUrl"
          alt="Reaction Schematic"
          class="max-h-[220px] w-auto object-contain"
        />
        <div
          v-else
          class="animate-pulse font-typewriter text-sm"
          style="color: var(--color-bench-ink-faint);"
        >
          loading…
        </div>
      </div>

      <!-- Product target: a hand-drawn dashed box with a ? -->
      <div class="shrink-0 flex flex-col items-center gap-2">
        <div
          class="flex h-[90px] w-[90px] items-center justify-center rounded"
          style="
            border: 2px dashed var(--color-bench-ink-faint);
            background: rgba(91,33,182,0.04);
          "
        >
          <span
            class="font-lab text-4xl font-bold"
            style="color: var(--color-bench-plasma); opacity: 0.4;"
          >
            ?
          </span>
        </div>
        <p
          class="font-typewriter text-[9px] uppercase tracking-widest"
          style="color: var(--color-bench-ink-faint);"
        >
          Product(s)?
        </p>
      </div>

    </div>
  </div>
</template>
