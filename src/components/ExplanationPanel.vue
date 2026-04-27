<script setup lang="ts">
import { type Reaction } from "../data/reactions";

const props = defineProps<{
  reaction: Reaction;
  wasCorrect: boolean;
  isLast: boolean;
}>();

const emit = defineEmits<{
  next: [];
}>();
</script>

<template>
  <!--
    Notebook annotation panel: slides up from below like a lab-notebook
    page being flipped open. Looks like a hand-annotated section with
    a left red margin line and typewriter text.
  -->
  <div
    class="mt-6 w-full rounded-lg drawer-enter"
    style="
      background: var(--color-bench-surface);
      border: 1px solid var(--color-bench-ruled);
      box-shadow: 0 -4px 24px rgba(26,26,46,0.08), 0 4px 16px rgba(26,26,46,0.06);
      overflow: hidden;
    "
  >
    <!-- Red margin line + annotation area -->
    <div class="flex">

      <!-- Left margin — red line like a notebook -->
      <div
        class="shrink-0 w-8 border-r-2 flex flex-col items-center pt-4"
        style="border-color: #e57373; background: rgba(229,115,115,0.04);"
      >
        <!-- Result indicator dot -->
        <div
          class="h-3 w-3 rounded-full mt-1"
          :style="wasCorrect
            ? 'background: var(--color-bench-acid);'
            : 'background: var(--color-bench-burn);'"
        />
      </div>

      <!-- Main annotation content -->
      <div class="flex-1 p-4">

        <!-- Result banner — typewriter result stamp -->
        <div class="flex items-start gap-3 mb-4">
          <span class="text-xl">{{ wasCorrect ? "✅" : "❌" }}</span>
          <p
            class="font-typewriter text-sm font-bold"
            :style="wasCorrect
              ? 'color: var(--color-bench-acid);'
              : 'color: var(--color-bench-burn);'"
          >
            {{ wasCorrect ? "Correct!" : `Incorrect — the answer is: ${reaction.name}` }}
          </p>
        </div>

        <!-- Details + Mechanism + tags — notebook entry style -->
        <div class="space-y-2 font-typewriter text-sm">
          <!-- The `substrate` entry in the JSON contains spoilers! -->
          <div class="flex gap-2">
            <span
              class="shrink-0 text-[10px] uppercase tracking-widest font-bold w-28 pt-0.5"
              style="color: var(--color-bench-ink-faint);"
            >
              Substrate:
            </span>
            <span class="italic" style="color: var(--color-bench-ink-mid);">
              {{ reaction.template.display_label }}
            </span>
          </div>
          <div class="flex gap-2">
            <span
              class="shrink-0 text-[10px] uppercase tracking-widest font-bold w-28 pt-0.5"
              style="color: var(--color-bench-ink-faint);"
            >
              Mechanism:
            </span>
            <span style="color: var(--color-bench-ink-mid);">{{ reaction.metadata.mechanism }}</span>
          </div>
          <div class="flex gap-2">
            <span
              class="shrink-0 text-[10px] uppercase tracking-widest font-bold w-28 pt-0.5"
              style="color: var(--color-bench-ink-faint);"
            >
              Retro cue:
            </span>
            <span style="color: var(--color-bench-ink-mid);">{{ reaction.metadata.retrosynthetic_cue }}</span>
          </div>
          <!-- Summary as a handwritten-style note -->
          <div
            class="mt-2 pl-3 border-l-2 italic text-xs leading-relaxed"
            style="border-color: var(--color-bench-plasma); color: var(--color-bench-ink-faint);"
          >
            {{ reaction.metadata.summary }}
          </div>
        </div>

        <!-- Tags — look like small sticky-tape labels -->
        <div class="mt-4 flex flex-wrap gap-1.5">
          <span
            v-for="t in reaction.metadata.tags"
            :key="t"
            class="font-typewriter text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm"
            style="
              background: var(--color-bench-ink);
              color: var(--color-bench-bg);
              opacity: 0.75;
            "
          >
            {{ t }}
          </span>
        </div>

      </div>
    </div>

    <!-- Next button — full-width footer bar of the panel -->
    <button
      @click="emit('next')"
      class="w-full py-3 font-typewriter text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.99]"
      style="
        background: var(--color-bench-ink);
        color: var(--color-bench-bg);
        letter-spacing: 0.15em;
      "
      onmouseover="this.style.background='var(--color-bench-plasma)';"
      onmouseout="this.style.background='var(--color-bench-ink)';"
    >
      {{ isLast ? "→ Final Results" : "→ Next Specimen" }}
    </button>

  </div>
</template>
