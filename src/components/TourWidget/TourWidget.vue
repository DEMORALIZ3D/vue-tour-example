<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TourStep } from './types';
import { useElementPosition } from './useElementPosition';
import TourSpotlight from './TourSpotlight.vue';
import TourPopover from './TourPopover.vue';
import styles from './tour.module.css';

const props = withDefaults(
  defineProps<{
    steps: TourStep[];
    active?: boolean;
    initialStep?: number;
  }>(),
  {
    active: true,
    initialStep: 0
  }
);

const emit = defineEmits<{
  (e: 'complete'): void;
  (e: 'change', stepIndex: number): void;
  (e: 'update:active', val: boolean): void;
}>();

const currentStepIndex = ref(props.initialStep);

const currentStep = computed(() => {
  if (currentStepIndex.value < 0 || currentStepIndex.value >= props.steps.length) {
    return null;
  }
  return props.steps[currentStepIndex.value];
});

const targetSelector = computed(() => currentStep.value?.target ?? null);

const { targetRect } = useElementPosition(targetSelector, {
  autoScroll: true
});

const next = () => {
  if (currentStepIndex.value < props.steps.length - 1) {
    currentStepIndex.value++;
    emit('change', currentStepIndex.value);
  } else {
    emit('complete');
    emit('update:active', false);
  }
};

const prev = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    emit('change', currentStepIndex.value);
  }
};

const close = () => {
  emit('complete');
  emit('update:active', false);
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="active && currentStep"
      :class="styles['overlay-root']"
      data-tour-root="true"
    >
      <!-- Spotlight highlight cut-out -->
      <TourSpotlight :target-rect="targetRect" />

      <!-- Floating popover card -->
      <TourPopover
        :step="currentStep"
        :target-rect="targetRect"
        :step-index="currentStepIndex"
        :total-steps="steps.length"
        :is-first="currentStepIndex === 0"
        :is-last="currentStepIndex === steps.length - 1"
        @next="next"
        @prev="prev"
        @close="close"
      />
    </div>
  </Teleport>
</template>
