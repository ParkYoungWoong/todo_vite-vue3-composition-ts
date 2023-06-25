<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodosStore } from '~/store/todos'
import type { Todo } from '~/store/todos'
import TheIcon from '~/components/TheIcon.vue'
import TheBtn from '~/components/TheBtn.vue'

const route = useRoute()
const router = useRouter()
const todosStore = useTodosStore()

const editorEl = ref<HTMLElement | null>(null)
const updateLoading = ref(false)
const deleteLoading = ref(false)

const currentTodo = computed(() => todosStore.currentTodo as Todo)

if (route.params.id) {
  for (const todo of todosStore.todos) {
    if (todo.id === route.params.id) {
      todosStore.currentTodo = { ...todo } // 복사(Shallow)
      break
    }
  }
}

onMounted(() => {
  editorEl.value?.focus()
  window.addEventListener('keydown', escKeyHandler)
})

function escKeyHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    offModal()
  }
}
function offModal() {
  router.back()
  window.removeEventListener('keydown', escKeyHandler)
}
function toggleDone() {
  currentTodo.value.done = !currentTodo.value.done
}
function onChange() {
  const title = editorEl.value?.textContent
  if (title && title.trim()) {
    currentTodo.value.title = title
  }
}
async function updateTodo() {
  if (updateLoading.value) return
  updateLoading.value = true
  try {
    await todosStore.updateTodo({
      id: currentTodo.value.id,
      title: currentTodo.value.title,
      done: currentTodo.value.done
    })
    offModal()
  } catch (error) {
    console.error('TodoModal/updateTodo')
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
      id: currentTodo.value.id
    })
    offModal()
  } catch (error) {
    console.error('TodoModal/deleteTodo')
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
          :active="currentTodo?.done"
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
        <div class="date">생성일: {{ formatDate(currentTodo?.createdAt) }}</div>
        <div
          v-if="currentTodo?.createdAt !== currentTodo?.updatedAt"
          class="date">
          수정일: {{ formatDate(currentTodo?.updatedAt) }}
        </div>
      </div>
      <div
        ref="editorEl"
        class="editor"
        contenteditable
        @blur="onChange"
        @keydown.enter.prevent="onChange(), updateTodo()"
        v-text="currentTodo?.title"></div>
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
  padding: 20px;
  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(#000, 0.7);
  }
  .contents {
    position: relative;
    width: 100%;
    max-width: 700px;
    max-height: calc(100vh - 40px);
    border-radius: 6px;
    box-sizing: border-box;
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
