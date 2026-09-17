import { ref, watch, onUnmounted, computed, type Ref } from 'vue';
import type { ElementRect } from './types';
import { smoothScrollToElement } from './utils/scrolling';

export function useElementPosition(targetSelector: Ref<string | null>, options: { autoScroll?: boolean } = {}) {
  const { autoScroll = true } = options;

  const targetElement = ref<HTMLElement | null>(null);
  const targetRect = ref<ElementRect | null>(null);
  const isTargetFound = computed(() => Boolean(targetElement.value && targetRect.value));
  const isScrolling = ref(false);

  let resizeObserver: ResizeObserver | null = null;

  const measureElement = () => {
    if (!targetElement.value) {
      targetRect.value = null;
      return;
    }
    const rect = targetElement.value.getBoundingClientRect();
    targetRect.value = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right
    };
  };

  const cleanupObservers = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  const setupTarget = async (selector: string | null) => {
    cleanupObservers();

    if (!selector) {
      targetElement.value = null;
      targetRect.value = null;
      return;
    }

    const el = document.querySelector<HTMLElement>(selector);
    if (!el) {
      targetElement.value = null;
      targetRect.value = null;
      return;
    }

    targetElement.value = el;
    measureElement();

    // Observe element size changes dynamically (e.g. accordion open, dynamic text)
    resizeObserver = new ResizeObserver(() => {
      measureElement();
    });
    resizeObserver.observe(el);

    if (autoScroll) {
      isScrolling.value = true;
      await smoothScrollToElement(el);
      measureElement();
      isScrolling.value = false;
    }

    // Keep measuring smoothly during any CSS transitions or layout shifts
    let frames = 0;
    const trackAnimation = () => {
      measureElement();
      frames++;
      if (frames < 25) {
        requestAnimationFrame(trackAnimation);
      }
    };
    requestAnimationFrame(trackAnimation);
  };

  // Keep rect synced when page is scrolled anywhere or resized
  const handleViewportChange = () => {
    measureElement();
  };

  window.addEventListener('scroll', handleViewportChange, { passive: true, capture: true });
  window.addEventListener('resize', handleViewportChange, { passive: true });

  watch(
    targetSelector,
    (newSelector) => {
      setupTarget(newSelector);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    cleanupObservers();
    window.removeEventListener('scroll', handleViewportChange, { capture: true });
    window.removeEventListener('resize', handleViewportChange);
  });

  return {
    targetElement,
    targetRect,
    isTargetFound,
    isScrolling,
    measureElement
  };
}
