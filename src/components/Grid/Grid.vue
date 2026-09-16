<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch, onUnmounted } from 'vue'
import styles from './grid.module.css'

interface Props {
  items: T[]
  keyField?: keyof T
  columns?: number
  rowHeight?: number
  gap?: number
  overscanRows?: number
  isLoading?: boolean
  error?: string | null
  page?: number
  totalPages?: number
  hasNext?: boolean
  hasPrev?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  keyField: 'id' as keyof T,
  columns: 3,
  rowHeight: 360,
  gap: 16,
  overscanRows: 2,
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
})

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'selectPage', page: number): void
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(0)

// Virtualization Math
const totalRows = computed(() => Math.ceil(props.items.length / props.columns))
const totalContentHeight = computed(() => {
  if (totalRows.value === 0) return 0
  // total row heights plus gaps plus top/bottom padding (16px * 2)
  return totalRows.value * props.rowHeight + 32
})

const startRow = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.overscanRows)
})

const endRow = computed(() => {
  const visibleCount = Math.ceil((viewportHeight.value || 600) / props.rowHeight)
  return Math.min(totalRows.value, startRow.value + visibleCount + props.overscanRows * 2)
})

const visibleItems = computed(() => {
  const startIndex = startRow.value * props.columns
  const endIndex = endRow.value * props.columns
  return props.items.slice(startIndex, endIndex).map((item, offset) => ({
    data: item,
    index: startIndex + offset,
    key: (item[props.keyField] as string | number) ?? (startIndex + offset)
  }))
})

// Translate accounts for rowHeight directly
const translateY = computed(() => startRow.value * props.rowHeight)

const onScroll = (event: Event) => {
  const target = event.currentTarget as HTMLDivElement
  scrollTop.value = target.scrollTop
}

// Dynamically watch containerRef to safely bind ResizeObserver across v-if / v-else toggles
let resizeObserver: ResizeObserver | null = null

watch(
  containerRef,
  (el, oldEl) => {
    if (oldEl && resizeObserver) {
      resizeObserver.unobserve(oldEl)
    }
    if (el) {
      viewportHeight.value = el.clientHeight
      resizeObserver = new ResizeObserver(([entry]) => {
        viewportHeight.value = entry.contentRect.height
      })
      resizeObserver.observe(el)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watch(
  () => [props.page, props.items],
  () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
      scrollTop.value = 0
    }
  }
)
</script>

<template>
  <div :class="styles['grid-wrapper']">
    <!-- State banners -->
    <div v-if="isLoading" :class="styles['state-banner']">
      <slot name="loading"><span>Loading...</span></slot>
    </div>

    <div v-else-if="error" :class="[styles['state-banner'], styles.error]">
      <slot name="error" :error="error"><span>{{ error }}</span></slot>
    </div>

    <div v-else-if="!items.length" :class="styles['state-banner']">
      <slot name="empty"><span>No items found.</span></slot>
    </div>

    <!-- Virtual Viewport -->
    <div
      v-else
      ref="containerRef"
      :class="styles['virtual-viewport']"
      @scroll.passive="onScroll"
    >
      <div
        :class="styles['virtual-spacer']"
        :style="{ height: `${totalContentHeight}px` }"
      >
        <div
          :class="styles['virtual-grid']"
          :style="{
            transform: `translate3d(0, ${translateY}px, 0)`,
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap}px`
          }"
        >
          <div
            v-for="entry in visibleItems"
            :key="entry.key"
            :style="{ height: `${rowHeight - gap}px` }"
          >
            <slot name="item" :item="entry.data" :index="entry.index" />
          </div>
        </div>
      </div>
    </div>

    <footer :class="styles['pagination-bar']">
      <slot
        name="pagination"
        :page="page"
        :totalPages="totalPages"
        :hasNext="hasNext"
        :hasPrev="hasPrev"
      >
        <div :class="styles['page-status']">
          Page <strong>{{ page }}</strong> of <strong>{{ totalPages }}</strong>
        </div>

        <div :class="styles['btn-group']">
          <button
            type="button"
            :disabled="!hasPrev || isLoading"
            :class="styles['nav-btn']"
            @click="emit('prev')"
          >
            &larr; Previous
          </button>
          <button
            type="button"
            :disabled="!hasNext || isLoading"
            :class="styles['nav-btn']"
            @click="emit('next')"
          >
            Next &rarr;
          </button>
        </div>
      </slot>
    </footer>
  </div>
</template>