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
        <header>
            <Logo />
            <div>
                <Navigation />
                <CartPopover />
            </div>
        </header>
        <main>
            <slot />
        </main>
    <footer>
        <div>
            <span>&copy;</span>
            Aaron JS DEV
        </div>
        <div>
            {{ currentYear }}
        </div>
    </footer>
        </MeshBG>
</template>