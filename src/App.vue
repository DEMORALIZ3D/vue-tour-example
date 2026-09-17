<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles } from 'lucide-vue-next';
import ECommerceMockup from './components/ECommerceMockup.vue';
import { TourWidget } from './components/TourWidget';
import { ecommerceTourSteps } from './components/TourWidget/ecommerceTour';

const isTourActive = ref(true);
</script>

<template>
  <ECommerceMockup />

  <!-- Tour Widget -->
  <TourWidget
    v-model:active="isTourActive"
    :steps="ecommerceTourSteps"
  />

  <!-- Floating Tour Launcher Pill (when tour is closed) -->
  <button
    v-if="!isTourActive"
    type="button"
    class="tour-launcher-btn"
    @click="isTourActive = true"
  >
    <Sparkles :size="16" />
    <span>Take Guided Tour</span>
  </button>
</template>

<style scoped>
.tour-launcher-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #334155;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
  transition: all 0.2s ease;
}

.tour-launcher-btn:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 14px 24px -5px rgba(15, 23, 42, 0.4);
}
</style>

