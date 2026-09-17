<script setup lang="ts">
import { computed } from 'vue';
import type { ElementRect } from './types';
import styles from './tour.module.css';

const props = withDefaults(
  defineProps<{
    targetRect: ElementRect | null;
    padding?: number;
  }>(),
  {
    padding: 6
  }
);

const spotlightStyle = computed(() => {
  if (!props.targetRect) return { display: 'none' };

  return {
    top: `${props.targetRect.top - props.padding}px`,
    left: `${props.targetRect.left - props.padding}px`,
    width: `${props.targetRect.width + props.padding * 2}px`,
    height: `${props.targetRect.height + props.padding * 2}px`
  };
});
</script>

<template>
  <div
    v-if="targetRect"
    :class="styles.spotlight"
    :style="spotlightStyle"
  >
    <div :class="styles['spotlight-pulse']" />
  </div>
</template>
