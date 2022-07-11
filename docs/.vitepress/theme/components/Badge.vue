<script setup lang="ts">
import { toRefs } from 'vue'
import type { DefaultTheme } from '../config'

const props = withDefaults(
    defineProps<{
        text?: string,
        type?: 'warning' | 'tip' | 'error'
        vertical?: 'top' | 'middle'
    }>(), {
        text: '',
        type: 'tip',
        vertical: 'top',
    }
);
</script>

<template>
    <span
        class='badge'
        :class="[ `badge-type-${props.type}` ]"
        :style="{ 'vertical-align': props.vertical }"
    >
        <slot>{{ props.text }}</slot>
    </span>
</template>

<style scoped>
.badge {
    display: inline-block;
    font-size: 14px;
    height: 18px;
    line-height: 18px;
    border-radius: 3px;
    padding: 0 6px;
    color: #fff;
}

.badge.badge-type-warning {
    background-color: #e7c000;
}

.badge.badge-type-tip {
    background-color: #42b983;
}

.badge.badge-type-error {
    background-color: #da5961;
}
</style>
