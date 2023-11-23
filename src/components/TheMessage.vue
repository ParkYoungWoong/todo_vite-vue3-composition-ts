<script setup>
import { computed } from 'vue'
import { useTodosStore } from '~/store/todos'

const todosStore = useTodosStore()

const message = computed(() => {
  if (!todosStore.todos.length) {
    return '당신의 할 일을 작성해 보세요!'
  }
  if (!todosStore.filteredTodos.length) {
    return '필터링된 항목이 없어요..'
  }
  if (todosStore.filterStatus === 'all') {
    return '목록을 재정렬하려면, 드래그 앤 드롭을 하세요~'
  }
  return '매일 할 일을 확인하세요!'
})
</script>

<template>
  <div class="the-message">
    {{ message }}
  </div>
</template>

<style scoped>
.the-message {
  margin-top: 40px;
  text-align: center;
  color: rgba(#fff, 0.25);
}
</style>
