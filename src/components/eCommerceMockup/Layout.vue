<script setup lang="ts">
import MeshBG from '../meshBG/MeshBG.vue';
import Navigation from './Navigation.vue';
import Logo from './Logo.vue'

import './styles.module.css';
import CartPopover from './CartPopover.vue';

const currentYear = new Date().getFullYear();

</script>

<template>
    <MeshBG>
        <header id="app-header" data-tour="header">
            <div id="brand-logo" data-tour="brand-logo">
                <Logo />
            </div>
            <div>
                <Navigation />
                <CartPopover />
            </div>
        </header>
        <main>
            <slot />
        </main>
        <footer id="app-footer" data-tour="footer">
            <div>
                <span>&copy;</span>
                <strong>Aaron JS DEV</strong>
                <span>• Vue Demo Project</span>
            </div>
            <div>
                {{ currentYear }}
            </div>
        </footer>
    </MeshBG>
</template>