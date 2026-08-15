<script setup lang="ts">
import { computed } from 'vue';
import type {
  AnswerValue,
  QuestionResult,
  QuizQuestion as QuizQuestionModel,
} from '../../core/models/quiz';

/**
 * Renders one quiz question of any supported type and emits answer changes.
 * The parent owns the answer state; this component is otherwise presentational.
 */
const props = defineProps<{
  question: QuizQuestionModel;
  index: number;
  answer?: AnswerValue;
  /** When provided (review mode), renders correct/incorrect styling. */
  result?: QuestionResult;
}>();

const emit = defineEmits<{ answerChange: [value: AnswerValue] }>();

const reviewing = computed(() => props.result !== undefined);

// ---- single-choice ---------------------------------------------------------
function selectSingle(optionId: string): void {
  if (reviewing.value) return;
  emit('answerChange', optionId);
}
function isSingleSelected(optionId: string): boolean {
  return props.answer === optionId;
}

// ---- multiple-choice -------------------------------------------------------
function toggleMultiple(optionId: string): void {
  if (reviewing.value) return;
  const current = Array.isArray(props.answer) ? [...props.answer] : [];
  const idx = current.indexOf(optionId);
  if (idx === -1) current.push(optionId);
  else current.splice(idx, 1);
  emit('answerChange', current);
}
function isMultipleSelected(optionId: string): boolean {
  return Array.isArray(props.answer) && props.answer.includes(optionId);
}

// ---- fill-blank ------------------------------------------------------------
function fillValue(): string {
  return typeof props.answer === 'string' ? props.answer : '';
}
function onFillInput(e: Event): void {
  emit('answerChange', (e.target as HTMLInputElement).value);
}

// ---- ordering --------------------------------------------------------------
function orderedIds(): string[] {
  const q = props.question;
  if (q.type !== 'ordering') return [];
  const current = Array.isArray(props.answer) ? props.answer : [];
  return current.length ? current : q.items.map((i) => i.id);
}
function orderedItemText(id: string): string {
  const q = props.question;
  if (q.type !== 'ordering') return '';
  return q.items.find((i) => i.id === id)?.text ?? '';
}
function move(id: string, dir: -1 | 1): void {
  if (reviewing.value) return;
  const ids = [...orderedIds()];
  const i = ids.indexOf(id);
  const j = i + dir;
  if (j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  emit('answerChange', ids);
}

// ---- match-pair ------------------------------------------------------------
function matchOptions(): string[] {
  const q = props.question;
  if (q.type !== 'match-pair') return [];
  return [...q.pairs.map((p) => p.right)].sort((a, b) => a.localeCompare(b));
}
function matchValue(left: string): string {
  const a = props.answer;
  return a && typeof a === 'object' && !Array.isArray(a) ? (a[left] ?? '') : '';
}
function onMatchSelect(left: string, e: Event): void {
  const a = props.answer;
  const current = a && typeof a === 'object' && !Array.isArray(a) ? { ...a } : {};
  current[left] = (e.target as HTMLSelectElement).value;
  emit('answerChange', current);
}
</script>

<template>
  <div
    class="rounded-2xl border p-5 transition duration-200"
    :class="
      reviewing
        ? result?.correct
          ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30'
          : 'border-rose-300 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/30'
        : 'border-ink-200 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900'
    "
  >
    <div class="mb-4 flex items-start gap-3">
      <span
        class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold"
        :class="
          reviewing
            ? result?.correct
              ? 'bg-emerald-500 text-white'
              : 'bg-rose-500 text-white'
            : 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
        "
      >
        <template v-if="reviewing">
          <template v-if="result?.correct">
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3.5"
            >
              <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="sr-only">Correct. Question {{ index + 1 }}</span>
          </template>
          <template v-else>
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3.5"
            >
              <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
            </svg>
            <span class="sr-only">Incorrect. Question {{ index + 1 }}</span>
          </template>
        </template>
        <template v-else>{{ index + 1 }}</template>
      </span>
      <p class="pt-1 font-bold text-ink-900 dark:text-white">{{ question.prompt }}</p>
    </div>

    <!-- single-choice -->
    <div v-if="question.type === 'single-choice'" class="space-y-2 sm:pl-11">
      <label
        v-for="opt in question.options"
        :key="opt.id"
        class="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 transition duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500"
        :class="
          isSingleSelected(opt.id) && !reviewing
            ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-950/60'
            : 'border-ink-200 hover:border-brand-300 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800'
        "
      >
        <input
          type="radio"
          :name="question.id"
          class="h-4 w-4 shrink-0 accent-brand-600"
          :checked="isSingleSelected(opt.id)"
          :disabled="reviewing"
          @change="selectSingle(opt.id)"
        />
        <span class="text-ink-700 dark:text-ink-200">{{ opt.text }}</span>
        <span
          v-if="reviewing && opt.id === question.answer"
          class="ml-auto flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          correct
        </span>
      </label>
    </div>

    <!-- multiple-choice -->
    <div v-else-if="question.type === 'multiple-choice'" class="space-y-2 sm:pl-11">
      <label
        v-for="opt in question.options"
        :key="opt.id"
        class="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 transition duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500"
        :class="
          isMultipleSelected(opt.id) && !reviewing
            ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-950/60'
            : 'border-ink-200 hover:border-brand-300 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800'
        "
      >
        <input
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-brand-600"
          :checked="isMultipleSelected(opt.id)"
          :disabled="reviewing"
          @change="toggleMultiple(opt.id)"
        />
        <span class="text-ink-700 dark:text-ink-200">{{ opt.text }}</span>
        <span
          v-if="reviewing && question.answer.includes(opt.id)"
          class="ml-auto flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          correct
        </span>
      </label>
    </div>

    <!-- fill-blank -->
    <div v-else-if="question.type === 'fill-blank'" class="sm:pl-11">
      <input
        type="text"
        :value="fillValue()"
        :disabled="reviewing"
        placeholder="Type your answer…"
        :aria-label="question.prompt"
        class="input-field max-w-md disabled:opacity-60"
        @input="onFillInput"
      />
      <p v-if="reviewing" class="prose-muted mt-2 text-sm">
        Accepted:
        <span class="font-bold text-ink-700 dark:text-ink-200">{{ question.answer.join(', ') }}</span>
      </p>
    </div>

    <!-- ordering -->
    <template v-else-if="question.type === 'ordering'">
      <ol class="space-y-2 sm:pl-11">
        <li
          v-for="(id, i) in orderedIds()"
          :key="id"
          class="flex items-center gap-3 rounded-xl border border-ink-200 px-4 py-2 dark:border-ink-700"
        >
          <span class="w-5 shrink-0 font-mono text-sm font-bold text-ink-400 tabular-nums">
            {{ i + 1 }}.
          </span>
          <span class="min-w-0 text-ink-700 dark:text-ink-200">{{ orderedItemText(id) }}</span>
          <span class="ml-auto flex shrink-0 gap-1">
            <button
              type="button"
              :disabled="reviewing || i === 0"
              class="focusable grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-ink-800"
              :aria-label="`Move ${orderedItemText(id)} up`"
              @click="move(id, -1)"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="m6 15 6-6 6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              :disabled="reviewing || i === orderedIds().length - 1"
              class="focusable grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-ink-800"
              :aria-label="`Move ${orderedItemText(id)} down`"
              @click="move(id, 1)"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </span>
        </li>
      </ol>
      <p v-if="reviewing" class="prose-muted mt-3 text-sm sm:pl-11">
        Correct order:
        <span class="font-bold text-ink-700 dark:text-ink-200">
          <template v-for="(id, i) in question.answer" :key="id">
            {{ orderedItemText(id) }}{{ i === question.answer.length - 1 ? '' : ' → ' }}
          </template>
        </span>
      </p>
    </template>

    <!-- match-pair -->
    <div v-else-if="question.type === 'match-pair'" class="space-y-2 sm:pl-11">
      <div
        v-for="pair in question.pairs"
        :key="pair.left"
        class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-ink-200 px-4 py-2.5 dark:border-ink-700"
      >
        <span class="min-w-32 font-bold text-ink-700 dark:text-ink-200">{{ pair.left }}</span>
        <svg
          class="h-4 w-4 shrink-0 text-ink-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <select
          :value="matchValue(pair.left)"
          :disabled="reviewing"
          :aria-label="`Match for ${pair.left}`"
          class="focusable min-h-11 flex-1 cursor-pointer rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-ink-800 transition focus:border-brand-500 disabled:opacity-60 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100"
          @change="onMatchSelect(pair.left, $event)"
        >
          <option value="">— choose —</option>
          <option v-for="opt in matchOptions()" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <span v-if="reviewing" class="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400">
          = {{ pair.right }}
        </span>
      </div>
    </div>

    <div
      v-if="reviewing && question.explanation"
      class="mt-4 flex gap-2.5 rounded-xl bg-ink-100 p-3.5 text-sm text-ink-600 dark:bg-ink-800 dark:text-ink-300"
    >
      <svg
        class="h-4 w-4 shrink-0 translate-y-0.5 text-brand-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M12 16v-4M12 8.5v.5" stroke-linecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      <span><span class="font-bold">Explanation:</span> {{ question.explanation }}</span>
    </div>
  </div>
</template>
