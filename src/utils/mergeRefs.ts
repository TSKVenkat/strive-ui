import React from 'react';

/**
 * Merges multiple refs into a single ref callback.
 * This utility allows you to use multiple refs on the same element.
 * 
 * @param refs - Array of refs to merge
 * @returns A ref callback that will apply all provided refs
 */
export function mergeRefs<T = any>(
  ...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export default mergeRefs; 