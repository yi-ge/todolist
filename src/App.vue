<template>
  <v-app id="app">
    <v-content>
      <v-container id="container">
        <v-layout row
                  wrap>
          <v-flex text-xs-center>
            <!-- header -->
            <h1 class="primary--text display-3 font-weight-medium my-3">To-do List</h1>
            <v-card>
              <v-list class="pa-0">
                <v-list-tile>
                  <v-list-tile-action>
                    <v-checkbox :input-value="allChecked"
                                @change="toggleAll(!allChecked)"
                                color="primary"
                                v-if="todos.length > 0"></v-checkbox>
                    <v-icon color="primary"
                            v-else>check</v-icon>
                  </v-list-tile-action>
                  <v-text-field :label="'New todo input'"
                                @keydown.enter="addTodo"
                                autofocus
                                browser-autocomplete="off"
                                clearable
                                color="primary"
                                flat
                                hide-details
                                maxlength="1023"
                                placeholder="What needs to be done?"
                                solo
                                v-model="newTodo"></v-text-field>
                </v-list-tile>
              </v-list>
            </v-card>
            <!-- main -->
            <v-card class="mt-3"
                    v-show="todos.length">
              <v-progress-linear class="my-0"
                                 v-model="progressPercentage" />
              <v-card-actions class="px-3"
                              v-show="todos.length">
                <span class="primary--text">
                  {{ remaining }} {{ remaining | pluralize('item') }} left
                </span>
                <v-spacer></v-spacer>
                <v-btn-toggle class="elevation-0"
                              mandatory
                              v-model="visibility"
                              v-show="todos.length">
                  <v-btn :key="key"
                         :value="key"
                         class="mx-0"
                         color="primary"
                         flat
                         small
                         @click="filter(key)"
                         v-for="(val, key) in filters">
                    {{ key | capitalize }}
                  </v-btn>
                </v-btn-toggle>
              </v-card-actions>
              <v-list class="pa-0">
                <template v-for="todo in filteredTodos">
                  <v-divider :key="`${todo.uid}-divider`"></v-divider>
                  <div class="todo-item"
                       :key="todo.uid">
                    <v-list-tile class="todo-item"
                                 :class="{ 'editing': editing }">
                      <v-list-tile-action>
                        <v-checkbox :input-value="todo.done"
                                    @change="toggleTodo(todo)"
                                    color="primary"
                                    v-if="!editing"></v-checkbox>
                        <v-icon color="primary"
                                v-else>edit</v-icon>
                      </v-list-tile-action>
                      <template v-if="!editing">
                        <v-list-tile-content :class="{ 'primary--text': todo.done }"
                                             @dblclick="editing = true">
                          {{ todo.text }}
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn @click="removeTodo(todo)"
                                 color="red lighten-3"
                                 flat
                                 icon>
                            <v-icon>close</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </template>
                      <v-text-field :value="todo.text"
                                    @blur="doneEdit"
                                    @keyup.enter="doneEdit"
                                    @keyup.esc="cancelEdit"
                                    clearable
                                    color="primary"
                                    flat
                                    hide-details
                                    maxlength="1023"
                                    ref="input"
                                    solo
                                    v-else
                                    v-focus="editing"></v-text-field>
                    </v-list-tile>
                  </div>
                </template>
              </v-list>
            </v-card>
            <v-btn @click="clearCompleted"
                   block
                   class="mt-3"
                   color="primary"
                   depressed
                   round
                   v-show="todos.length > remaining">
              Clear completed
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      newTodo: '',
      filters: {
        all: todos => todos,
        active: todos => todos.filter(todo => !todo.done),
        completed: todos => todos.filter(todo => todo.done)
      },
      visibility: 'all',
      todos: JSON.parse(window.localStorage.getItem('todolist') || '[]'),
      editing: false
    }
  },
  watch: {
    todos (newVal) {
      window.localStorage.setItem('todolist', JSON.stringify(newVal))
    }
  },
  computed: {
    allChecked () {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos () {
      return this.filters[this.visibility](this.todos)
    },
    remaining () {
      return this.todos.filter(todo => !todo.done).length
    },
    progressPercentage () {
      const len = this.todos.length
      return ((len - this.remaining) * 100) / len
    }
  },
  directives: {
    focus (el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          context.$refs.input.focus()
        })
      }
    }
  },
  methods: {
    addTodo () {
      const text = this.newTodo.trim()
      if (text) {
        this.todos.push({
          uid: Date.now(),
          text,
          done: false
        })
      }
      this.newTodo = ''
    },
    removeTodo (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },
    toggleTodo (todo) {
      todo.done = !todo.done
    },
    editTodo (todo, value) {
      todo.text = value
    },
    toggleAll (done) {
      this.todos.forEach((todo) => {
        todo.done = done
      })
    },
    clearCompleted () {
      this.todos.filter(todo => todo.done)
        .forEach(todo => {
          this.todos.splice(this.todos.indexOf(todo), 1)
        })
    },
    doneEdit (e) {
      const value = e.target.value.trim()
      console.log(this)
      const { todo } = this
      if (!value) {
        this.removeTodo(todo)
      } else if (this.editing) {
        this.editTodo(todo, value)
        this.editing = false
      }
    },
    cancelEdit () {
      this.editing = false
    },
    filter (key) {
      console.log(key)
    }
  },
  filters: {
    pluralize: (n, w) => n === 1 ? w : (w + 's'),
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  }
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  background #f5f5f5

#container
  max-width 550px
  padding 8px

.todo-item
  .v-list__tile
    height auto
    padding-top 12px
    padding-bottom 12px

  &.editing .v-list__tile
    height 48px

h1
  opacity 0.3

.v-text-field .v-input__slot
  padding 0 !important
</style>
