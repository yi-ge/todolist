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
                <v-expansion-panel>
                    <v-expansion-panel-content>
                      <div slot="header">
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
                      </div>
                      <v-card>
                        <v-list-tile>
                          <v-flex xs12 sm6>
                            <v-menu
                              ref="pickerDateMenu"
                              v-model="template.pickerDateMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              lazy
                              transition="scale-transition"
                              offset-y
                              full-width
                              max-width="290px"
                              min-width="290px"
                            >
                            <v-combobox
                              slot="activator"
                              label="Picker Date"
                              v-model="template.date"
                              prepend-icon="event"
                              clearable
                              readonly
                              flat
                              hide-details
                              solo
                              persistent-hint
                            ></v-combobox>
                            <v-date-picker v-model="template.date" color="green" full-width no-title @input="template.pickerDateMenu = false" />
                            </v-menu>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <v-dialog
                              ref="pickerTimeMenu"
                              v-model="template.pickerTimeMenu"
                              :return-value.sync="template.time"
                              persistent
                              lazy
                              full-width
                              width="290px"
                            >
                            <v-combobox
                              slot="activator"
                              label="Picker Time"
                              v-model="template.time"
                              prepend-icon="access_time"
                              clearable
                              readonly
                              flat
                              solo
                            ></v-combobox>
                            <v-time-picker v-model="template.time" full-width color="green" format="24hr">
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="template.pickerTimeMenu = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.pickerTimeMenu.save(template.time)">OK</v-btn>
                            </v-time-picker>
                            </v-dialog>
                          </v-flex>
                        </v-list-tile>
                        <v-list-tile>
                          <v-flex xs12>
                            <v-radio-group v-model="template.type" row>
                              <v-radio
                                color="success"
                                label="Feature"
                                :value="'fueature'"
                              ></v-radio>
                              <v-radio
                                color="error"
                                label="Bug"
                                :value="'bug'"
                              ></v-radio>
                            </v-radio-group>
                          </v-flex>
                        </v-list-tile>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
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
                  <Item
                    :key="todo.uid"
                    :todo.sync="todo"
                    @removeTodo="removeTodo"
                  />
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
import Item from './Item'

export default {
  name: 'app',
  components: {
    Item
  },
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
      template: {
        pickerDateMenu: false,
        date: null,
        pickerTimeMenu: false,
        time: null
      }
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

h1
  opacity 0.3

.v-text-field .v-input__slot
  padding 0 !important
</style>
