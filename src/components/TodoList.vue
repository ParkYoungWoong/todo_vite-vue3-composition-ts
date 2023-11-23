<script setup>
import { ref, computed, onMounted } from 'vue'
import Sortable from 'sortablejs'
import { debounce } from 'lodash'
import { useTodosStore } from '~/store/todos'
import TodoItem from '~/components/TodoItem.vue'
import TheIcon from '~/components/TheIcon.vue'
import TheBtn from '~/components/TheBtn.vue'

const todosStore = useTodosStore()
const todoListEl = (ref < HTMLElement) | (null > null)

const debounced = debounce((val) => {
  todosStore.updateCheckboxes(val)
}, 400)
const isAllChecked = computed({
  get() {
    return (
      !!todosStore.filteredTodos.length &&
      todosStore.filteredTodos.every((todo) => todo.done)
    )
  },
  set(val) {
    todosStore.todos.forEach((todo) => {
      todo.done = val
    })
    debounced(val)
  }
})

// 최초 요청!
todosStore.fetchTodos()

onMounted(() => {
  initSortable()
})

function toggleAllCheckboxes() {
  isAllChecked.value = !isAllChecked.value
}
function initSortable() {
  if (todoListEl.value) {
    new Sortable(todoListEl.value, {
      handle: '.drag-handle', // 드래그 핸들이 될 요소의 선택자를 입력
      animation: 0, // 정렬할 때 애니메이션 속도(ms)를 지정, default: 150
      forceFallback: true, // 다양한 환경의 일관된 Drag&Drop(DnD)을 위해 HTML5 기본 DnD 동작을 무시하고 내장 기능을 사용, default: false
      // 요소의 DnD가 종료되면 실행할 핸들러(함수)를 지정
      onEnd: (event) => {
        const { oldIndex, newIndex } = event
        todosStore.reorderTodos({
          oldIndex: oldIndex,
          newIndex: newIndex
        })
      }
    })
  }
}
</script>

<template>
  <div class="todos-wrap shadow">
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
    <div
      ref="todoListEl"
      class="todo-list">
      <TodoItem
        v-for="todo in todosStore.filteredTodos"
        :key="todo.id"
        :todo="todo" />
    </div>
  </div>
</template>

<style scoped>
.todos-wrap {
  border-radius: 6px;
  overflow: hidden;
}
</style>
