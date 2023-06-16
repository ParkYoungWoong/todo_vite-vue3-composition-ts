<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div
    :class="{ active }"
    class="the-icon">
    <span class="material-symbols-outlined">
      <slot></slot>
    </span>
  </div>
</template>

<style scoped lang="scss">
.the-icon {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .material-symbols-outlined {
    opacity: 0;
  }
  &.active {
    background-color: royalblue;
    border: 1px solid royalblue;
    .material-symbols-outlined {
      opacity: 1;
      color: #fff;
    }
  }
}
</style>
