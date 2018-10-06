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
                  <v-expansion-panel-content class="main-input">
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
                    <v-card class="other-config">
                      <v-list-tile>
                        <v-flex xs7
                                sm7>
                          <v-menu ref="pickerDateMenu"
                                  v-model="template.pickerDateMenu"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  lazy
                                  transition="scale-transition"
                                  offset-y
                                  full-width
                                  max-width="290px"
                                  min-width="290px">
                            <v-combobox slot="activator"
                                        label="Picker Date"
                                        v-model="template.date"
                                        prepend-icon="event"
                                        clearable
                                        readonly
                                        flat
                                        hide-details
                                        solo
                                        persistent-hint></v-combobox>
                            <v-date-picker v-model="template.date"
                                           color="green"
                                           full-width
                                           no-title
                                           @input="template.pickerDateMenu = false" />
                          </v-menu>
                        </v-flex>
                        <v-flex xs5
                                sm5
                                style="margin-left: 5%;">
                          <v-dialog ref="pickerTimeMenu"
                                    v-model="template.pickerTimeMenu"
                                    :return-value.sync="template.time"
                                    persistent
                                    lazy
                                    full-width
                                    width="290px">
                            <v-combobox slot="activator"
                                        label="Picker Time"
                                        v-model="template.time"
                                        prepend-icon="access_time"
                                        clearable
                                        readonly
                                        flat
                                        solo></v-combobox>
                            <v-time-picker v-model="template.time"
                                           full-width
                                           color="green"
                                           format="24hr">
                              <v-spacer></v-spacer>
                              <v-btn flat
                                     color="primary"
                                     @click="template.pickerTimeMenu = false">Cancel</v-btn>
                              <v-btn flat
                                     color="primary"
                                     @click="$refs.pickerTimeMenu.save(template.time)">OK</v-btn>
                            </v-time-picker>
                          </v-dialog>
                        </v-flex>
                      </v-list-tile>
                      <v-list-tile class="other-config-item">
                        <v-flex md4 sm4 xs4>
                          <div :class="'type' + (template.type === 'feature' ? ' type-select' : '')" @click="template.type = 'feature'">Feature</div>
                          <div :class="'type' + (template.type === 'bug' ? ' type-select' : '')" @click="template.type = 'bug'">Bug</div>
                          <!-- <v-radio-group v-model="template.type"
                                          row>
                            <v-radio color="success"
                                      label="Feature"
                                      :value="'feature'"></v-radio>
                            <v-radio color="error"
                                      label="Bug"
                                      :value="'bug'"></v-radio>
                          </v-radio-group> -->
                        </v-flex>
                        <v-flex md8 sm8 xs8 class="important-select">
                          <v-rating v-model="template.rating">
                            <v-icon slot="item"
                                    slot-scope="props"
                                    :color="props.isFilled ? genColor(props.index) : 'grey lighten-1'"
                                    large
                                    @click="props.click">
                              {{ props.isFilled ? 'mdi-star-circle' : 'mdi-circle-outline' }}
                            </v-icon>
                          </v-rating>
                        </v-flex>
                      </v-list-tile>
                      <v-list-tile class="other-config-item">
                        <v-flex md12>
                          <div>
                            <div class="color-item"></div>
                          </div>
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
                  <Item :key="todo.uid"
                        :todo.sync="todo"
                        @removeTodo="removeTodo" />
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
        time: null,
        rating: 1,
        type: ''
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
    genColor (i) {
      const colors = ['green', 'purple', 'orange', 'indigo', 'red']
      return colors[i]
    },
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

.main-input
  .v-expansion-panel__body
    padding 3px 6px 10px 6px

.other-config
  padding-top 5px
  border-top 2px solid hsla(152, 44%, 52%, 0.28)

.other-config-item
  border-top 1px solid #f3f0f0
  padding-top 5px

.important-select
  text-align right

  .v-rating
    .v-icon
      font-size 24px !important

.type
  color rgba(0,0,0,.54)
  cursor pointer
  padding 4px
  float left

.type.type-select
  color #000
  font-weight 600
</style>
