<script setup>
import TheLoader from '~/components/TheLoader.vue'

defineProps({
  active: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: false
  },
  danger: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :class="{
      active: active,
      'btn-success': success,
      'btn-danger': danger
    }"
    class="btn">
    <TheLoader v-if="loading" />
    <slot v-else></slot>
  </button>
</template>

<style scoped>
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
}
.btn:hover {
  background-color: #ddd;
  color: #fff;
}
.btn.active {
  color: royalblue;
}
.btn.btn-success {
  background-color: royalblue;
  color: #fff;
}
.btn.btn-danger {
  color: rgba(255, 0, 0, 0.25);
}
.btn.btn-danger:hover {
  background-color: rgb(255, 0, 0);
  color: #fff;
}
</style>
