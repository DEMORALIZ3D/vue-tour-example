<script setup lang="ts">
    import styles from './meshBG.module.css';
</script>

<template>
    <div :class="styles['mesh-container']">
    <div :class="styles['mesh-content']">
      <slot />
    </div>
  </div>
</template>