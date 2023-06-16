<script setup lang="ts">
import { ref } from 'vue'
import { useTodosStore } from '~/store/todos'
import TheIcon from '~/components/TheIcon.vue'
import TheLoading from '~/components/TheLoading.vue'

const todosStore = useTodosStore()

const title = ref('')

async function createTodo(event: KeyboardEvent) {
  try {
    if (event.key !== 'Enter') return
    await todosStore.createTodo({
      title: title.value
    })
    title.value = ''
  } catch (error) {
    console.error('TodoCreator/createTodo')
  }
}
</script>

<template>
  <div class="todo-creator shadow">
    <TheLoading v-if="todosStore.loading" />
    <TheIcon
      v-else
      active
      @click="createTodo">
      add
    </TheIcon>
    <input
      v-model="title"
      placeholder="새로운 할 일을 작성하세요.."
      @keydown.enter="createTodo" />
  </div>
</template>

<style scoped lang="scss">
.todo-creator {
  height: var(--item-height);
  margin-bottom: 30px;
  position: relative;
  display: flex;
  align-items: center;
  color: royalblue;
  :deep(.the-icon),
  :deep(.the-loading) {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 24px;
    z-index: 1;
  }
  input {
    padding: 0 10px 0 80px;
    border-radius: 6px;
    border: 0;
    outline: 0;
    background-color: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    &::placeholder {
      color: #ccc;
    }
  }
}
</style>
