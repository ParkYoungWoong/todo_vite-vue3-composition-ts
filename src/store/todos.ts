import axios from 'axios'
import { defineStore } from 'pinia'

export type Todos = Todo[]
export interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}
type FilterStatus = 'all' | 'todo' | 'done'
type Filters = Filter[]
interface Filter {
  label: string
  name: FilterStatus
}
interface CreateTodoPayload {
  title: string
}
interface DeleteTodoPayload {
  id: string
}
interface ReorderTodosPayload {
  oldIndex: number
  newIndex: number
}

const filters: Filters = [
  { label: '전체', name: 'all' },
  { label: '할 일만', name: 'todo' },
  { label: '완료만', name: 'done' }
]
const currentTodo: Todo = {
  id: '',
  title: '',
  order: 0,
  done: false,
  createdAt: '',
  updatedAt: ''
}
export const useTodosStore = defineStore('todos', {
  state: () => ({
    loading: false,
    todos: [] as Todos,
    filterStatus: 'all' as FilterStatus,
    filters,
    currentTodo
  }),
  getters: {
    filteredTodos(state) {
      return state.todos.filter((todo) => {
        switch (state.filterStatus) {
          case 'todo':
            return !todo.done
          case 'done':
            return todo.done
          case 'all':
          default:
            return true
        }
      })
    }
  },
  actions: {
    async fetchTodos() {
      if (this.loading) return
      this.loading = true
      try {
        const { data } = await axios.post('/api/todos', {
          method: 'GET'
        })
        this.todos = data
      } catch (error) {
        console.error('fetchTodos:', error)
      } finally {
        this.loading = false
      }
    },
    async createTodo({ title }: CreateTodoPayload) {
      if (this.loading) return
      this.loading = true
      try {
        const { data: createdTodo } = await axios.post('/api/todos', {
          method: 'POST',
          data: {
            title
          }
        })
        this.todos.unshift(createdTodo)
      } catch (error) {
        console.error('createTodo:', error)
      } finally {
        this.loading = false
      }
    },
    async updateTodo(todo: Todo) {
      const foundTodo = this.todos.find((t) => t.id === todo.id)
      // 현재 목록에서 찾은 할 일이 없는 경우, 요청하지 않음
      if (!foundTodo) return

      const backedUpTodo = { ...foundTodo } // 복구를 위한 복사(Shallow)
      Object.assign(foundTodo, todo)
      try {
        const { id: path, title, done } = todo
        const { data: updatedTodo } = await axios.post('/api/todos', {
          method: 'PUT',
          path,
          data: {
            title,
            done
          }
        })
        // for .updatedAt
        foundTodo.updatedAt = updatedTodo.updatedAt
      } catch (error) {
        console.error('updateTodo:', error)
        // 업데이트가 실패한 경우, 해당 할 일을 복구
        Object.assign(foundTodo, backedUpTodo)
      }
    },
    updateCheckboxes(done: boolean) {
      this.todos.forEach((todo) => {
        this.updateTodo({
          ...todo,
          done
        })
      })
    },
    async deleteTodo({ id }: DeleteTodoPayload) {
      try {
        await axios.post('/api/todos', {
          method: 'DELETE',
          path: id
        })
        this.todos = this.todos.filter((todo) => todo.id !== id)
      } catch (error) {
        console.error('deleteTodo:', error)
      }
    },
    async deleteDoneTodos() {
      // 완료된 할 일 ID 목록을 요청 양식에 맞는 배열로 만들기
      const todoIds = this.todos
        .filter((todo) => todo.done)
        .map((todo) => todo.id)
      // 삭제할 할 일이 없는 경우, 요청하지 않음
      if (!todoIds.length) return

      this.loading = true
      try {
        // 완료된 할 일 삭제 요청
        await axios.post('/api/todos', {
          method: 'DELETE',
          path: 'deletions',
          data: {
            todoIds
          }
        })
        this.todos = this.todos.filter((todo) => !todoIds.includes(todo.id))
      } catch (error) {
        console.error('deleteDoneTodos:', error)
      } finally {
        this.loading = false
      }
    },
    async reorderTodos({ oldIndex, newIndex }: ReorderTodosPayload) {
      if (oldIndex === newIndex) return
      const movedTodo = this.todos.splice(oldIndex, 1)[0]
      this.todos.splice(newIndex, 0, movedTodo)
      const todoIds = this.todos.map((todo) => todo.id)

      this.loading = true
      try {
        await axios.post('/api/todos', {
          method: 'PUT',
          path: 'reorder',
          data: {
            todoIds
          }
        })
      } catch (error) {
        console.error('reorderTodos:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
