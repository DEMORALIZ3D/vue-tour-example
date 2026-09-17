<script setup lang="ts">
import { Github } from 'lucide-vue-next';
import MeshBG from '../meshBG/MeshBG.vue';
import Navigation from './Navigation.vue';
import Logo from './Logo.vue';
import styles from './styles.module.css';
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
                <a
                    href="https://github.com/DEMORALIZ3D/vue-tour-example"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="styles['github-link']"
                    title="View source code on GitHub"
                >
                    <Github :size="14" />
                    <span>View on GitHub</span>
                </a>
                <span>•</span>
                <span>{{ currentYear }}</span>
            </div>
        </footer>
    </MeshBG>
</template>