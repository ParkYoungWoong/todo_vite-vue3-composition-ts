<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodosStore } from '~/store/todos'
import TheIcon from '~/components/TheIcon.vue'
import TheBtn from '~/components/TheBtn.vue'

const route = useRoute()
const router = useRouter()
const todosStore = useTodosStore()

const editorEl = ref<HTMLElement | null>(null)
const updateLoading = ref(false)
const deleteLoading = ref(false)

const foundTodo = todosStore.todos.find((todo) => todo.id === route.params.id)
foundTodo
  ? (todosStore.currentTodo = { ...foundTodo }) // 복사(Shallow)
  : router.replace('/')

onMounted(() => {
  editorEl.value?.focus()
  window.addEventListener('keydown', escKeyHandler)
})
onUnmounted(() => {
  window.removeEventListener('keydown', escKeyHandler)
})

function escKeyHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    offModal()
  }
}
function offModal() {
  router.push('/')
}
function toggleDone() {
  todosStore.currentTodo.done = !todosStore.currentTodo.done
}
function onChange() {
  const title = editorEl.value?.textContent
  if (title && title.trim()) {
    todosStore.currentTodo.title = title
  }
}
async function updateTodo() {
  if (updateLoading.value) return
  updateLoading.value = true
  try {
    await todosStore.updateTodo({
      ...todosStore.currentTodo
    })
    offModal()
  } catch (error) {
    console.error('TodoItemModal/updateTodo')
  } finally {
    updateLoading.value = false
  }
}
async function deleteTodo() {
  if (updateLoading.value) return
  if (deleteLoading.value) return
  deleteLoading.value = true
  try {
    await todosStore.deleteTodo({
      id: todosStore.currentTodo.id
    })
    offModal()
  } catch (error) {
    console.error('TodoItemModal/deleteTodo')
  } finally {
    deleteLoading.value = false
  }
}
function formatDate(date: string) {
  return dayjs(date).format('YYYY년 M월 D일 H시 m분')
}
</script>

<template>
  <div class="modal">
    <div
      class="background"
      @click="offModal"></div>
    <div class="contents">
      <div class="todo-head">
        <TheIcon
          :active="todosStore.currentTodo.done"
          @click="toggleDone">
          check
        </TheIcon>
        <div class="btn-group">
          <TheBtn @click="offModal"> 취소 </TheBtn>
          <TheBtn
            danger
            :loading="deleteLoading"
            @click="deleteTodo">
            삭제
          </TheBtn>
          <TheBtn
            success
            :loading="updateLoading"
            @click="updateTodo">
            저장
          </TheBtn>
        </div>
      </div>
      <div class="date-group">
        <div class="date">
          생성일: {{ formatDate(todosStore.currentTodo.createdAt) }}
        </div>
        <div
          v-if="
            todosStore.currentTodo.createdAt !==
            todosStore.currentTodo.updatedAt
          "
          class="date">
          수정일: {{ formatDate(todosStore.currentTodo.updatedAt) }}
        </div>
      </div>
      <div
        ref="editorEl"
        class="editor"
        contenteditable
        @blur="onChange"
        @keydown.enter.prevent="onChange(), updateTodo()"
        v-text="todosStore.currentTodo.title"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(#000, 0.7);
  }
  .contents {
    margin: 0 20px;
    position: relative;
    width: 100%;
    max-width: 700px;
    max-height: calc(100vh - 40px);
    border-radius: 6px;
    background-color: #fff;
    overflow: auto;
    .date-group {
      padding: 30px 30px 0 30px;
      .date {
        color: #bbb;
        font-size: 14px;
        line-height: 1.4;
      }
    }
    .editor {
      padding: 30px;
      line-height: 1.5;
      outline: none;
    }
  }
}
</style>
