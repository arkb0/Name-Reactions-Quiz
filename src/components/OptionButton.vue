<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type Reaction } from "../data/reactions";

type State = "idle" | "correct" | "wrong" | "reveal";

const props = defineProps<{
  reaction: Reaction;
  state: State;
  disabled: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();

const stateStyles: Record<State, string> = {
  idle: "border-agrarian-blue/25 bg-white hover:border-agrarian-sky hover:bg-agrarian-sky/5 hover:shadow-md cursor-pointer",
  correct: "border-agrarian-green bg-agrarian-green/10 ring-2 ring-agrarian-green cursor-default",
  wrong: "border-rose-400 bg-rose-50 ring-2 ring-rose-400 cursor-default opacity-80",
  reveal: "border-agrarian-green bg-agrarian-green/8 cursor-default opacity-90",
};

const stateIcon: Record<State, string | null> = {
  idle: null,
  correct: "✓",
  wrong: "✗",
  reveal: "✓",
};

const nameColor = computed(() => {
  if (props.state === "correct" || props.state === "reveal") return "text-agrarian-green";
  if (props.state === "wrong") return "text-rose-700";
  return "text-agrarian-blue";
});

// --- Lazy product SVG resolution ---
const resolvedProductSvg = ref<string>("");

watch(
  () => props.reaction.svg.product,
  async (newPath) => {
    if (typeof newPath === "function") {
      // lazy glob returns a function → call it
      const url = await newPath(); // returns string directly with ?url
      resolvedProductSvg.value = url;
    } else {
      resolvedProductSvg.value = newPath as string;
    }
  },
  { immediate: true }
);

/*
  Vial-style button:
  - Tall and narrow (full col height, ~25% width each in a 4-col grid)
  - Rounded bottom like a test tube
  - SVG fills the "body" of the vial
  - Name is the "label" sticker at the bottom
*/
const vialBg = computed(() => {
  if (props.state === "correct") return "var(--color-bench-vial-correct)";
  if (props.state === "wrong")   return "var(--color-bench-vial-wrong)";
  if (props.state === "reveal")  return "var(--color-bench-vial-reveal)";
  return "var(--color-bench-surface)";
});

const vialBorder = computed(() => {
  if (props.state === "correct") return "2px solid var(--color-bench-acid)";
  if (props.state === "wrong")   return "2px solid var(--color-bench-burn)";
  if (props.state === "reveal")  return "2px solid var(--color-bench-acid)";
  return "1px solid var(--color-bench-ruled)";
});

const vialShadow = computed(() => {
  if (props.state === "correct") return "0 0 0 3px rgba(22,101,52,0.2), 0 4px 16px rgba(22,101,52,0.15)";
  if (props.state === "wrong")   return "0 0 0 3px rgba(153,27,27,0.2), 0 4px 16px rgba(153,27,27,0.15)";
  return "0 2px 8px rgba(26,26,46,0.08)";
});

const labelColor = computed(() => {
  if (props.state === "correct" || props.state === "reveal") return "var(--color-bench-acid)";
  if (props.state === "wrong") return "var(--color-bench-burn)";
  return "var(--color-bench-plasma)";
});
</script>

<template>
  <!--
    Vial: tall narrow button, rounded bottom, SVG in the "tube body",
    name on a label strip at the bottom.
    The stateStyles / nameColor / stateIcon bindings from the original
    logic are preserved for correctness — visual overrides come from
    the computed vial* styles below.
  -->
  <button
    @click="emit('click')"
    :disabled="disabled"
    class="relative flex flex-col items-center transition-all duration-200 outline-none"
    :class="[
      stateStyles[state],
      /* Just normal hover! The CSS above will 'mute' it on phones where hover is sticky by default */
      !disabled ? 'hover:border-agrarian-sky hover:bg-agrarian-sky/5 hover:shadow-md' : ''
    ]"
    :style="`
      background: ${vialBg};
      border: ${vialBorder};
      box-shadow: ${vialShadow};
      border-radius: 6px 6px 9999px 9999px;
      padding: 0;
      overflow: hidden;
      cursor: ${props.disabled ? 'default' : 'pointer'};
      width: 100%;
    `"
    @mouseover="(e) => {
      if (state === 'idle') {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--color-bench-plasma)';
        el.style.boxShadow = '0 4px 20px rgba(91,33,182,0.18)';
        el.style.transform = 'translateY(-3px)';
      }
    }"
    @mouseout="(e) => {
      if (state === 'idle') {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--color-bench-ruled)';
        el.style.boxShadow = '0 2px 8px rgba(26,26,46,0.08)';
        el.style.transform = 'translateY(0)';
      }
    }"
  >
    <!-- Tick / cross badge — floats at top of vial -->
    <span
      v-if="stateIcon[state]"
      class="absolute top-2 left-0 right-0 text-center text-sm font-bold z-10"
      :class="state === 'correct' || state === 'reveal' ? 'text-agrarian-green' : 'text-rose-500'"
      :style="`color: ${state === 'correct' || state === 'reveal' ? 'var(--color-bench-acid)' : 'var(--color-bench-burn)'};`"
    >
      {{ stateIcon[state] }}
    </span>

    <!-- Vial body: product SVG -->
    <div
      class="w-full flex items-center justify-center overflow-hidden"
      style="height: 190px; padding: 12px 8px 8px;"
    >
      <img
        v-if="resolvedProductSvg"
        :src="resolvedProductSvg"
        :alt="`The ${reaction.name} produces ${reaction.template.product_label}`"
        class="max-h-full max-w-full object-contain"
        @error="(e) => { const img = e.target as HTMLImageElement; if (img) img.style.display = 'none'; }"
      />
      <div
        v-else
        class="animate-pulse font-typewriter text-xs"
        style="color: var(--color-bench-ink-faint);"
      >
        …
      </div>
      <!-- Prevents the "broken image" icon from showing if path is wrong -->
    </div>

    <!-- Label strip at bottom -->
    <div
      class="w-full px-2 py-2 border-t text-center"
      :style="`
        border-color: ${props.state === 'idle' ? 'var(--color-bench-ruled)' : vialBorder.replace('2px solid ', '').replace('1px solid ', '')};
        background: rgba(26,26,46,0.04);
      `"
    >
      <!-- Reaction name -->
      <p
        class="font-typewriter text-[10px] font-bold leading-snug"
        :class="nameColor"
        :style="`color: ${labelColor};`"
      >
        {{ reaction.name }}
      </p>
      <!-- Product label -->
      <p
        class="font-typewriter text-[9px] italic mt-0.5"
        style="color: var(--color-bench-ink-faint);"
      >
        {{ reaction.template.product_label }}
      </p>
    </div>

  </button>
</template>
