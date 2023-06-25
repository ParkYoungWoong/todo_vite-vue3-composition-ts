import axios from 'axios'
import { cloneDeep } from 'lodash'
import { defineStore } from 'pinia'

export type Todos = Todo[]
export interface Todo {
  id: string // 할 일 ID
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}
type FilterStatus = 'all' | 'todo' | 'done'
interface Filter {
  label: string
  name: FilterStatus
}
interface CreateTodoPayload {
  title: string
}
interface UpdateTodoPayload {
  id: string
  title: string
  done: boolean
}
interface DeleteTodoPayload {
  id: string
}
interface ReorderTodosPayload {
  oldIndex: number
  newIndex: number
}

export const useTodosStore = defineStore('todos', {
  state: () => ({
    loading: false,
    todos: [] as Todos,
    currentTodo: null as Todo | null,
    filterStatus: 'all' as FilterStatus,
    filters: [
      { label: '전체', name: 'all' },
      { label: '할 일만', name: 'todo' },
      { label: '완료만', name: 'done' }
    ] as Filter[]
  }),
  getters: {
    filteredTodos(state) {
      return state.todos.filter((todo) => {
        switch (state.filterStatus) {
          case 'all':
            return true
          case 'todo':
            return !todo.done
          case 'done':
            return todo.done
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
      if (!title.trim()) return
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
    async updateTodo({ id, title, done }: UpdateTodoPayload) {
      let todoRef = {} as Todo
      let backedUpTodo = {} as Todo
      const foundTodo = this.todos.find((todo) => todo.id === id)
      if (foundTodo) {
        todoRef = foundTodo
        backedUpTodo = cloneDeep(foundTodo)
        Object.assign(foundTodo, { id, title, done })
      }
      try {
        const { data: updatedTodo } = await axios.post('/api/todos', {
          method: 'PUT',
          path: id,
          data: {
            title,
            done
          }
        })
        todoRef.updatedAt = (updatedTodo as Todo).updatedAt
      } catch (error) {
        console.error('updateTodo:', error)
        // 업데이트가 실패한 경우, 해당 할 일을 복구
        Object.assign(todoRef, backedUpTodo)
      }
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
      this.loading = true
      // 완료된 할 일 ID 목록을 요청 양식에 맞는 배열로 만들기
      const todoIds = this.todos
        .filter((todo) => todo.done)
        .map((todo) => todo.id)
      // 삭제할 할 일이 없는 경우, 요청하지 않음
      if (!todoIds.length) {
        this.loading = false
        return
      }
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
      this.loading = true
      const movedTodo = this.todos.splice(oldIndex, 1)[0]
      this.todos.splice(newIndex, 0, movedTodo)
      const todoIds = this.todos.map((todo) => todo.id)
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
