<script setup lang="ts">
import { computed } from 'vue'
import { useTodosStore } from '~/store/todos'
import TodoItem from '~/components/TodoItem.vue'
import TheIcon from '~/components/TheIcon.vue'
import TheBtn from '~/components/TheBtn.vue'

const todosStore = useTodosStore()

const isAllChecked = computed({
  get() {
    return (
      !!todosStore.filteredTodos.length &&
      todosStore.filteredTodos.every((todo) => todo.done)
    )
  },
  set(value: boolean) {
    todosStore.todos.forEach((todo) => {
      todo.done = value
    })
  }
})

// 최초 요청!
todosStore.fetchTodos()

function toggleAllCheckboxes() {
  isAllChecked.value = !isAllChecked.value
}
</script>

<template>
  <div class="todo-list shadow">
    <div class="todo-head">
      <TheIcon
        :active="isAllChecked"
        @click="toggleAllCheckboxes">
        done_all
      </TheIcon>
      <div class="btn-group">
        <TheBtn
          v-for="filter in todosStore.filters"
          :key="filter.name"
          :active="todosStore.filterStatus === filter.name"
          @click="todosStore.filterStatus = filter.name">
          {{ filter.label }}
        </TheBtn>
        <TheBtn
          danger
          @click="todosStore.deleteDoneTodos">
          완료만 삭제
        </TheBtn>
      </div>
    </div>
    <TodoItem
      v-for="todo in todosStore.filteredTodos"
      :key="todo.id"
      :todo="todo" />
  </div>
</template>

<style scoped lang="scss">
.todo-list {
  border-radius: 6px;
  overflow: hidden;
}
</style>
