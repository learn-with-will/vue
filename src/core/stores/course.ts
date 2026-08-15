import { ref, computed } from 'vue';
import type { LessonLevel, LessonMeta } from '../models/lesson';
import { assetUrl } from '../services/asset';

// The course manifest is the single source of truth for which lessons exist.
// Adding a lesson is just a manifest entry plus a markdown file — no code change.
const raw = ref<LessonMeta[]>([]);
const loaded = ref(false);
let started = false;

async function load(): Promise<void> {
  if (started) return;
  started = true;
  try {
    const res = await fetch(assetUrl('content/course-manifest.json'));
    const data = res.ok ? ((await res.json()) as LessonMeta[]) : [];
    raw.value = data ?? [];
  } catch {
    raw.value = [];
  } finally {
    loaded.value = true;
  }
}

const lessons = computed(() => [...raw.value].sort((a, b) => a.order - b.order));

function lessonsByLevel(level: LessonLevel): LessonMeta[] {
  return lessons.value.filter((l) => l.level === level);
}
function getBySlug(slug: string): LessonMeta | undefined {
  return lessons.value.find((l) => l.slug === slug);
}
function getById(id: string): LessonMeta | undefined {
  return lessons.value.find((l) => l.id === id);
}
function neighbours(slug: string): { prev?: LessonMeta; next?: LessonMeta } {
  const list = lessons.value;
  const idx = list.findIndex((l) => l.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? list[idx - 1] : undefined,
    next: idx < list.length - 1 ? list[idx + 1] : undefined,
  };
}

export function useCourse() {
  void load();
  return { lessons, loaded, lessonsByLevel, getBySlug, getById, neighbours };
}
