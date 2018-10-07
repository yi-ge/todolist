<template>
  <v-app id="app">
    <v-content>
      <v-container id="container">
        <v-layout row
                  wrap>
          <v-flex text-xs-center>
            <!-- header -->
            <h1 class="primary--text display-3 font-weight-medium" v-if="!mobileMode">To-do List</h1>
            <v-card class="add-todo" v-show="!mobileMode || showAddTodo">
              <v-list class="pa-0">
                <v-expansion-panel>
                  <v-expansion-panel-content class="main-input">
                    <div slot="header">
                      <v-list-tile>
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
                        <v-flex md4
                                sm4
                                xs4>
                          <div :class="'type' + (template.type === 'feature' ? ' type-select' : '')"
                              @click="template.type = 'feature'">Feature</div>
                          <div :class="'type' + (template.type === 'bug' ? ' type-select' : '')"
                              style="margin-left: 5px"
                              @click="template.type = 'bug'">Bug</div>
                        </v-flex>
                        <v-flex md8
                                sm8
                                xs8
                                class="important-select">
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
                        <v-flex md12
                                class="colors">
                          <div v-for="(item, index) of colors"
                              :key="index"
                              class="color-item"
                              :style="{backgroundColor: item}"></div>
                        </v-flex>
                      </v-list-tile>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-list>
            </v-card>
            <!-- main -->
            <v-card :style="{marginTop: (mobileMode ? '0' : '16px')}"
                    v-show="todos.length">
              <v-progress-linear class="my-0"
                                 v-model="progressPercentage" />
              <v-card-actions class="px-3"
                              v-show="todos.length">
                <v-checkbox :input-value="allChecked"
                            @change="toggleAll(!allChecked)"
                            class="toggle-all"
                            color="primary"></v-checkbox>
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
    <v-fab-transition v-show="!showAddTodo">
      <v-btn
        v-if="mobileMode"
        color="pink"
        dark
        fixed
        bottom
        right
        fab
        style="bottom: 72px"
        @click="showAddTodoHander"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-bottom-nav :active.sync="bottomNav"
                  :value="true"
                  fixed
                  color="#fff">
      <v-btn color="teal"
             flat
             value="All">
        <span>All</span>
        <v-icon>format_list_bulleted</v-icon>
      </v-btn>

      <v-btn color="teal"
             flat
             value="Today">
        <span>Today</span>
        <v-icon>today</v-icon>
      </v-btn>

      <v-btn color="teal"
             flat
             value="Week">
        <span>Week</span>
        <v-icon>insert_invitation</v-icon>
      </v-btn>

      <v-btn color="teal"
             flat
             value="Month">
        <span>Month</span>
        <v-icon>date_range</v-icon>
      </v-btn>
    </v-bottom-nav>
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
      mobileMode: window.outerWidth <= 400,
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
      },
      colors: ['#fff', '#9e9e9e', '#795548', '#ff9800', '#ffeb3b', '#8bc34a', '#03a9f4', '#673ab7', '#f44336'],
      bottomNav: 'All',
      showAddTodo: false
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
  mounted () {
    window.onresize = () => {
      this.mobileMode = (window.outerWidth <= 400)
    }
  },
  methods: {
    showAddTodoHander () {
      this.showAddTodo = true
    },
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
  max-width 400px
  padding 8px 8px 80px 8px

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

  .colors
    .color-item
      float left
      width 20px
      height 20px
      margin-left 16px
      box-shadow 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12)

      &:first-child
        margin-left 3px

.important-select
  text-align right

  .v-rating
    .v-icon
      font-size 24px !important

.type
  color rgba(0, 0, 0, 0.54)
  cursor pointer
  padding 4px
  float left

.type.type-select
  color #000
  font-weight 600

.toggle-all
  .v-input__slot
    margin-bottom 8px !important
</style>
