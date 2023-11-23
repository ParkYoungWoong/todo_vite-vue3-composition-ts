<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTodosStore } from '~/store/todos'
import TheIcon from '~/components/TheIcon.vue'

const router = useRouter()
const todosStore = useTodosStore()

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const done = computed({
  get() {
    return props.todo.done
  },
  set(val) {
    todosStore.updateTodo({
      ...props.todo,
      done: val
    })
  }
})

function toggleDone() {
  done.value = !done.value
}
function onTodoModal() {
  todosStore.currentTodo = { ...props.todo } // 복사(Shallow)
  router.push(`/${props.todo.id}`)
}
</script>

<template>
  <div class="todo-item">
    <TheIcon
      :active="done"
      @click="toggleDone">
      check
    </TheIcon>
    <div
      class="title"
      @click="onTodoModal">
      {{ todo.title }}
    </div>
    <div
      v-if="todosStore.filterStatus === 'all'"
      class="drag-handle">
      <span class="material-symbols-outlined"> drag_indicator </span>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  height: var(--item-height);
  border-bottom: 1px solid var(--border-color);
  padding-left: var(--item-height);
  padding-right: 20px;
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}
.todo-item.sortable-chosen {
  opacity: 0.7;
}
:deep(.the-icon) {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 24px;
  z-index: 1;
}
.todo-item .title {
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.todo-item .title:hover {
  text-decoration: underline;
}
.todo-item .drag-handle {
  color: #ddd;
  cursor: move;
}
</style>
