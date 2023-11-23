<script setup>
import { useTodosStore } from '~/store/todos'
import TodoCreator from '~/components/TodoCreator.vue'
import TodoList from '~/components/TodoList.vue'
import TheMessage from '~/components/TheMessage.vue'

const todosStore = useTodosStore()
</script>

<template>
  <main>
    <TodoCreator />
    <TodoList />
    <TheMessage />
  </main>
  <Transition>
    <RouterView v-if="todosStore.todos.length" />
  </Transition>
</template>

<style scoped>
main {
  max-width: 700px;
  margin: 0 auto;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
