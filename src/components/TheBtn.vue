<script setup lang="ts">
import TheLoading from '~/components/TheLoading.vue'

defineProps<{
  active?: boolean
  success?: boolean
  danger?: boolean
  loading?: boolean
}>()
</script>

<template>
  <button
    :class="{
      active: active,
      'btn-success': success,
      'btn-danger': danger
    }"
    class="btn">
    <TheLoading v-if="loading" />
    <slot v-else></slot>
  </button>
</template>

<style scoped lang="scss">
.btn {
  min-width: 72px;
  padding: 6px 20px;
  outline: none;
  border: none;
  border-left: 1px solid var(--border-color);
  background-color: #fff;
  color: #ddd;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #ddd;
    color: #fff;
  }
  &.active {
    color: royalblue;
  }
  &.btn-danger {
    color: rgba(red, 0.25);
    &:hover {
      background-color: red;
      color: #fff;
    }
  }
  &.btn-success {
    background-color: royalblue;
    color: #fff;
  }
}
</style>
