import { watchEffect, type MaybeRefOrGetter, toValue } from 'vue';

/**
 * Sets document.title from a string, ref, or getter, and keeps it in sync while
 * the calling component is mounted. Accepts a getter so a title derived from
 * async-loaded data updates automatically once the data arrives.
 */
export function useDocumentTitle(title: MaybeRefOrGetter<string>): void {
  watchEffect(() => {
    document.title = toValue(title);
  });
}
