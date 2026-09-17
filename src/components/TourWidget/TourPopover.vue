<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-vue-next';
import type { ElementRect, TourStep } from './types';
import { calculatePopoverPosition } from './utils/positioning';
import styles from './tour.module.css';

const props = defineProps<{
  step: TourStep;
  targetRect: ElementRect | null;
  stepIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'prev'): void;
  (e: 'close'): void;
}>();

const popoverRef = ref<HTMLDivElement | null>(null);
const popoverSize = ref({ width: 320, height: 180 });

onMounted(() => {
  if (popoverRef.value) {
    const rect = popoverRef.value.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      popoverSize.value = { width: rect.width, height: rect.height };
    }
  }
});

const coords = computed(() => {
  if (!props.targetRect) {
    return { top: window.innerHeight / 2 - 90, left: window.innerWidth / 2 - 160 };
  }

  return calculatePopoverPosition({
    targetRect: props.targetRect,
    popoverRect: popoverSize.value,
    preferredPlacement: props.step.placement || 'bottom',
    offset: props.step.offset ?? 14
  });
});
</script>

<template>
  <div
    ref="popoverRef"
    :class="styles.popover"
    :style="{
      top: `${coords.top}px`,
      left: `${coords.left}px`
    }"
    role="dialog"
    aria-modal="true"
  >
    <!-- Header -->
    <div :class="styles['popover-header']">
      <span :class="styles['step-badge']">
        Step {{ stepIndex + 1 }} of {{ totalSteps }}
      </span>
      <button
        type="button"
        :class="styles['close-btn']"
        aria-label="Close tour"
        @click="emit('close')"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Content -->
    <div :class="styles['popover-body']">
      <h4 :class="styles['popover-title']">{{ step.title }}</h4>
      <p :class="styles['popover-content']">{{ step.content }}</p>
    </div>

    <!-- Footer Controls -->
    <div :class="styles['popover-footer']">
      <button
        type="button"
        :class="styles['skip-btn']"
        data-tour-action="skip"
        @click="emit('close')"
      >
        Skip tour
      </button>

      <div :class="styles['nav-buttons']">
        <button
          v-if="!isFirst"
          type="button"
          :class="styles['btn-prev']"
          data-tour-action="prev"
          @click="emit('prev')"
        >
          <ArrowLeft :size="12" style="margin-right: 4px; display: inline;" />
          Back
        </button>

        <button
          type="button"
          :class="styles['btn-next']"
          data-tour-action="next"
          @click="emit('next')"
        >
          <span>{{ isLast ? 'Finish' : 'Next' }}</span>
          <component :is="isLast ? Check : ArrowRight" :size="12" style="margin-left: 4px; display: inline;" />
        </button>
      </div>
    </div>
  </div>
</template>
