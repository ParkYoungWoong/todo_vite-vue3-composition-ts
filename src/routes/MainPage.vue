<script setup lang="ts">
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
  <RouterView
    v-if="todosStore.todos.length"
    v-slot="{ Component: View }">
    <Transition name="fade">
      <Component :is="View" />
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss">
main {
  max-width: 700px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
