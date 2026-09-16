<script setup lang="ts">
import styles from './styles.module.css';
</script>

<template>
  <nav id="header-nav" data-tour="navigation">
    <ul>
      <li>
        <a href="#" :class="[styles['nav-link'], styles.active]" data-tour="nav-products">
          Products
        </a>
      </li>
      <li>
        <a href="#" :class="styles['nav-link']" data-tour="nav-deals">
          Featured
        </a>
      </li>
      <li>
        <a href="#" :class="styles['nav-link']" data-tour="nav-about">
          About
        </a>
      </li>
    </ul>
  </nav>
</template>