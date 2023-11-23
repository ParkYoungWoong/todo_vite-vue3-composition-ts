<script setup>
import { ref } from 'vue'
import { useTodosStore } from '~/store/todos'
import TheIcon from '~/components/TheIcon.vue'
import TheLoader from '~/components/TheLoader.vue'

const todosStore = useTodosStore()

const title = ref('')

async function createTodo(event) {
  if (event.isComposing) return // 한글 중복 입력 방지
  if (!title.value.trim()) return
  try {
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
    <TheLoader v-if="todosStore.loading" />
    <TheIcon
      v-else
      active
      @click="createTodo">
      add
    </TheIcon>
    <input
      :value="title"
      placeholder="새로운 할 일을 작성하세요.."
      @input="title = $event.target.value"
      @keydown.enter="createTodo" />
  </div>
</template>

<style scoped>
.todo-creator {
  height: var(--item-height);
  margin-bottom: 30px;
  position: relative;
}
:deep(.the-icon),
:deep(.the-loader) {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 24px;
  margin: auto;
  z-index: 1;
}
.todo-creator input {
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
}
.todo-creator input::placeholder {
  color: #ccc;
}
</style>
