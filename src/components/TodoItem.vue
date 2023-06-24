<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTodosStore } from '~/store/todos'
import type { Todo } from '~/store/todos'
import TheIcon from '~/components/TheIcon.vue'

const router = useRouter()
const todosStore = useTodosStore()

const props = defineProps<{
  todo: Todo
}>()

const done = computed({
  get() {
    return props.todo.done
  },
  set(val) {
    todosStore.updateTodo({
      id: props.todo.id,
      title: props.todo.title,
      done: val
    })
  }
})

function toggleDone() {
  done.value = !done.value
}
function onTodoModal(id: string) {
  todosStore.currentTodo = cloneDeep(props.todo)
  router.push(`/${id}`)
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
      @click="onTodoModal(todo.id)">
      {{ todo.title }}
    </div>
    <div
      v-if="todosStore.filterStatus === 'all'"
      class="drag-handle">
      <span class="material-symbols-outlined"> drag_indicator </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  &.sortable-chosen {
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
  .title {
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .drag-handle {
    color: #ddd;
    cursor: move;
  }
}
</style>
