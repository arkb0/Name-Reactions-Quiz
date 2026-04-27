<script setup lang="ts">
const props = defineProps<{
  totalReactions: number;
}>();

const emit = defineEmits<{
  start: [count: number, difficulty: number | null];
}>();
</script>

<template>
  <!--
    Clipboard / lab worksheet aesthetic.
    A single printed sheet clipped at the top, with a checklist
    of quiz options rendered as "tick the box" form items.
  -->
  <div class="w-full max-w-md mx-auto">

    <!-- Clipboard clip at the top -->
    <div class="flex justify-center mb-[-1px] relative z-10">
      <div
        class="w-16 h-5 rounded-t-full rounded-b"
        style="background: var(--color-bench-ink); box-shadow: 0 -2px 8px rgba(26,26,46,0.2);"
      />
    </div>

    <!-- The sheet itself -->
    <div
      style="
        background: var(--color-bench-surface);
        border: 1px solid var(--color-bench-ruled);
        box-shadow: 0 8px 32px rgba(26,26,46,0.12), 3px 3px 0 var(--color-bench-ruled);
      "
    >
      <!-- Sheet header -->
      <div
        class="px-6 pt-6 pb-4 border-b"
        style="border-color: var(--color-bench-ruled);"
      >
        <p
          class="font-typewriter text-[10px] uppercase tracking-[0.25em] mb-1"
          style="color: var(--color-bench-ink-faint);"
        >
          Assessment / Setup
        </p>
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚗️</span>
          <div>
            <h1
              class="font-typewriter text-xl font-bold leading-tight"
              style="color: var(--color-bench-ink);"
            >
              Name Reactions Quiz
            </h1>
            <p
              class="font-typewriter text-xs"
              style="color: var(--color-bench-ink-faint);"
            >
              Organic Chemistry · Identification exercise
            </p>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div
        class="px-6 py-3 border-b"
        style="border-color: var(--color-bench-ruled); background: rgba(91,33,182,0.03);"
      >
        <p
          class="font-typewriter text-xs leading-relaxed"
          style="color: var(--color-bench-ink-mid);"
        >
          You will be shown the reactants and conditions for a named organic reaction.
          Select the correct product from four options. Choose your session parameters below.
        </p>
      </div>

      <!-- Checklist section: question count -->
      <div class="px-6 pt-5 pb-2">
        <p
          class="font-typewriter text-[10px] uppercase tracking-[0.2em] mb-3"
          style="color: var(--color-bench-ink-faint);"
        >
          □ Number of questions
        </p>

        <div class="space-y-2 pl-4">
          <button
            @click="emit('start', 5, null)"
            class="w-full flex items-center gap-3 py-2.5 px-3 rounded transition-all duration-150 text-left"
            style="border: 1px solid var(--color-bench-ruled);"
            onmouseover="this.style.background='rgba(91,33,182,0.06)'; this.style.borderColor='var(--color-bench-plasma)';"
            onmouseout="this.style.background='transparent'; this.style.borderColor='var(--color-bench-ruled)';"
          >
            <span
              class="shrink-0 h-4 w-4 rounded-sm border-2 flex items-center justify-center"
              style="border-color: var(--color-bench-plasma);"
            />
            <div>
              <p class="font-typewriter text-sm font-bold" style="color: var(--color-bench-ink);">
                5 Questions
              </p>
              <p class="font-typewriter text-[10px]" style="color: var(--color-bench-ink-faint);">
                All difficulties · rapid-fire
              </p>
            </div>
          </button>

          <button
            @click="emit('start', 10, null)"
            class="w-full flex items-center gap-3 py-2.5 px-3 rounded transition-all duration-150 text-left"
            style="border: 1px solid var(--color-bench-ruled);"
            onmouseover="this.style.background='rgba(91,33,182,0.06)'; this.style.borderColor='var(--color-bench-plasma)';"
            onmouseout="this.style.background='transparent'; this.style.borderColor='var(--color-bench-ruled)';"
          >
            <span
              class="shrink-0 h-4 w-4 rounded-sm border-2 flex items-center justify-center"
              style="border-color: var(--color-bench-plasma);"
            />
            <div>
              <p class="font-typewriter text-sm font-bold" style="color: var(--color-bench-ink);">
                10 Questions
              </p>
              <p class="font-typewriter text-[10px]" style="color: var(--color-bench-ink-faint);">
                All difficulties · standard round
              </p>
            </div>
          </button>

          <button
            @click="emit('start', totalReactions, null)"
            class="w-full flex items-center gap-3 py-2.5 px-3 rounded transition-all duration-150 text-left"
            style="
              border: 1px solid var(--color-bench-plasma);
              background: rgba(91,33,182,0.04);
            "
            onmouseover="this.style.background='rgba(91,33,182,0.1)';"
            onmouseout="this.style.background='rgba(91,33,182,0.04)';"
          >
            <span
              class="shrink-0 h-4 w-4 rounded-sm border-2 flex items-center justify-center"
              style="border-color: var(--color-bench-plasma);"
            >
              <!-- pre-ticked for the "full" option -->
              <span
                class="h-2 w-2 rounded-sm"
                style="background: var(--color-bench-plasma);"
              />
            </span>
            <div>
              <p class="font-typewriter text-sm font-bold" style="color: var(--color-bench-ink);">
                Full Quiz
                <span
                  class="ml-1 font-lab text-xs px-1 rounded"
                  style="background: var(--color-bench-ink); color: var(--color-bench-bg);"
                >
                  {{ totalReactions }}
                </span>
              </p>
              <p class="font-typewriter text-[10px]" style="color: var(--color-bench-ink-faint);">
                All reactions in the database
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-6 border-t my-3" style="border-color: var(--color-bench-ruled); border-style: dashed;" />

      <!-- Checklist section: difficulty filter -->
      <div class="px-6 pb-6">
        <p
          class="font-typewriter text-[10px] uppercase tracking-[0.2em] mb-3"
          style="color: var(--color-bench-ink-faint);"
        >
          □ Filter by difficulty
        </p>
        <div class="grid grid-cols-3 gap-2 pl-4">
          <button
            v-for="{ d, label, emoji, accent } in [
              { d: 1, label: 'Beginner',     emoji: '🌱', accent: 'var(--color-bench-acid)'  },
              { d: 2, label: 'Intermediate', emoji: '🔬', accent: 'var(--color-bench-amber)' },
              { d: 3, label: 'Advanced',     emoji: '🧠', accent: 'var(--color-bench-burn)'  },
            ]"
            :key="d"
            @click="emit('start', totalReactions, d)"
            class="flex flex-col items-center gap-1.5 py-3 px-2 rounded transition-all duration-150"
            :style="`border: 1px solid var(--color-bench-ruled);`"
            @mouseover="(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = accent; el.style.background = accent + '11'; }"
            @mouseout="(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--color-bench-ruled)'; el.style.background = 'transparent'; }"
          >
            <span class="text-xl">{{ emoji }}</span>
            <p
              class="font-typewriter text-[10px] font-bold uppercase tracking-wide text-center"
              style="color: var(--color-bench-ink-mid);"
            >
              {{ label }}
            </p>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
