<template lang="pug">
v-app#app
  v-navigation-drawer(:clipped='$vuetify.breakpoint.lgAndUp' v-model='drawer' fixed app left clipped)
    v-list(dense)
      template(v-for='item in leftMenu')
        v-layout(v-if='item.heading' :key='item.heading' row align-center)
          v-flex(xs6)
            v-subheader(v-if='item.heading')
              | {{ item.heading }}
          v-flex.text-xs-center(xs6)
            a.body-2.black--text(href='#!') EDIT
        v-list-group(v-else-if='item.children' v-model='item.model' :key='item.text' :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon)
          v-list-tile(slot='activator')
            v-list-tile-content
              v-list-tile-title
                | {{ item.text }}
          v-list-tile(v-for='(child, i) in item.children' :key='i' @click='')
            v-list-tile-action(v-if='child.icon')
              v-icon {{ child.icon }}
            v-list-tile-content
              v-list-tile-title
                | {{ child.text }}
        v-list-tile(v-else :key='item.text' @click='')
          v-list-tile-action
            v-icon {{ item.icon }}
          v-list-tile-content
            v-list-tile-title
              | {{ item.text }}
  v-navigation-drawer(v-model='drawerRight' fixed app right clipped)
    v-list(dense)
      v-list-tile(@click.stop='')
        v-list-tile-action
          v-icon exit_to_app
        v-list-tile-content
          v-list-tile-title Open Temporary Drawer
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" app fixed clipped-left clipped-right)
    v-toolbar-side-icon(@click.stop="drawer = !drawer")
    v-toolbar-title To-do List
    v-spacer
    v-btn(v-if="mobileMode" icon)
      v-icon search
    v-text-field(v-else hide-details prepend-icon='search' single-line)
    v-toolbar-side-icon(@click.stop="drawerRight = !drawerRight")
  v-content
    v-container#container(fluid fill-height)
      v-layout(row wrap)
        v-flex(text-xs-center)
          // add-todo
          v-dialog(v-model="showAddTodo" width="400")
            v-card.add-todo
              v-list.pa-0
                //- v-expansion-panel(v-model="addTodoExpansion" expand)
                  //- v-expansion-panel-content.main-input
                //- div(slot='header')
                v-card.other-config
                  v-list-tile
                    v-text-field(:label="'New todo input'" @keydown.enter='addTodo' autofocus browser-autocomplete='off' clearable color='primary' flat hide-details maxlength='1023' placeholder='What needs to be done?' solo v-model='newTodo')
                  v-list-tile
                    v-flex(xs7 sm7)
                      v-menu(ref='pickerDateMenu' v-model='template.pickerDateMenu' :close-on-content-click='false' :nudge-right='40' lazy transition='scale-transition' offset-y full-width max-width='290px' min-width='290px')
                        v-combobox(slot='activator' label='Picker Date' v-model='template.date' prepend-icon='event' clearable readonly flat hide-details solo persistent-hint)
                        v-date-picker(v-model='template.date' color='green' full-width no-title @input='template.pickerDateMenu = false')
                    v-flex(xs5 sm5 style='margin-left: 5%;')
                      v-dialog(ref='pickerTimeMenu' v-model='template.pickerTimeMenu' :return-value.sync='template.time' persistent lazy full-width width='290px')
                        v-combobox(slot='activator' label='Picker Time' v-model='template.time' prepend-icon='access_time' clearable readonly flat solo)
                        v-time-picker(v-model='template.time' full-width color='green' format='24hr')
                          v-spacer
                          v-btn(flat color='primary' @click='template.pickerTimeMenu = false') Cancel
                          v-btn(flat color='primary' @click='$refs.pickerTimeMenu.save(template.time)') OK
                  v-list-tile.other-config-item
                    v-flex(md4 sm4 xs4)
                      div(:class="'type' + (template.type === 'feature' ? ' type-select' : '')" @click="template.type = 'feature'") Feature
                      div(:class="'type' + (template.type === 'bug' ? ' type-select' : '')" style='margin-left: 5px' @click="template.type = 'bug'") Bug
                    v-flex.important-select(md8 sm8 xs8)
                      v-rating(v-model='template.rating')
                        v-icon(slot='item' slot-scope='props' :color="props.isFilled ? genColor(props.index) : 'grey lighten-1'" large @click='props.click')
                          | {{ props.isFilled ? 'mdi-star-circle' : 'mdi-circle-outline' }}
                  v-list-tile.other-config-item
                    v-flex.colors(md12)
                      .color-item(v-for='(item, index) of colors' :key='index' :style='{backgroundColor: item}')
                  v-list-tile.other-config-item
                    v-flex
                      v-combobox(v-model='template.tags' :items='tagList' label='Tag' chips clearable flat solo multiple)
                        template(slot='selection' slot-scope='data')
                          v-chip(:selected='data.selected' close @input='removeTag(data.item)')
                            strong {{ data.item }}
                  v-list-tile.other-config-item(v-for="(item, index) in template.urls" :key="index")
                    v-flex
                      v-text-field(v-model='template.urls[index]' label='URL' @keydown="urlKeyDown($event, index)" solo flat clearable append-icon="close")
                  .other-config-item
                    .upload-drag
                      ol(v-if='template.files.length')
                        li(v-for='(file, index) in template.files' :key='file.id')
                          span(class="file-name") {{file.name}}
                          span(class="float-right") {{file.size | formatSize}}
                          span(v-if='file.error') {{file.error}}
                          span(v-else-if='file.success') success
                          span(v-else-if='file.active') active
                          span(v-else-if='file.active') active
                          span(v-else='')
                      .drop-active(v-show='$refs.upload && $refs.upload.dropActive')
                        h3 Drop files to upload
                      .upload-control
                        FileUpload(post-action='/upload/post' :multiple='true' :drop='true' :drop-directory='true' v-model='template.files' ref='upload')
                          v-btn Select files
                            v-icon(right) attach_file
                        span(v-if='!$refs.upload || !$refs.upload.active' class="float-right")
                          v-btn(color="success" @click.prevent='$refs.upload.active = true')
                            | Start Upload
                            v-icon(right dark) cloud_upload
                        span(v-else class="float-right")
                          v-btn(@click.prevent='$refs.upload.active = false')
                            | Stop Upload
          // main
          v-card.main(:style="{marginTop: (mobileMode ? '6px' : '16px')}" v-if='todos.length')
            v-progress-linear.my-0(v-model='progressPercentage')
            v-card-actions.px-3
              v-checkbox.toggle-all(:input-value='allChecked' @change='toggleAll(!allChecked)' color='primary')
              span.primary--text
                | {{ remaining }} {{ remaining | pluralize('item') }} left
              v-spacer
              v-btn-toggle.elevation-0(mandatory v-model='visibility')
                v-btn.mx-0(:key='key' :value='key' color='primary' flat small @click='filter(key)' v-for='(val, key) in filters')
                  | {{ key | capitalize }}
            v-list.pa-0
              template(v-for='todo in filteredTodos')
                v-divider(:key='`${todo.uid}-divider`')
                Item(:key='todo.uid' :todo.sync='todo' @removetodo='removeTodo')
          v-card(v-else style="padding: 20px")
            | No Content.
          v-btn.mt-3(@click='clearCompleted' block color='primary' depressed round v-show='todos.length > remaining')
            | Clear completed
  v-fab-transition(v-if='!showAddTodo')
    v-btn(color='pink' dark fixed bottom right fab style='bottom: 72px' @click='showAddTodoHander')
      v-icon add
  v-bottom-nav(:active.sync='bottomNav' :value='true' fixed app color='#fff')
    v-btn(color='teal' flat value='All')
      span All
      v-icon format_list_bulleted
    v-btn(color='teal' flat value='Today')
      span Today
      v-icon today
    v-btn(color='teal' flat value='Week')
      span Week
      v-icon insert_invitation
    v-btn(color='teal' flat value='Month')
      span Month
      v-icon date_range
</template>

<script>
import Item from './Item'
import FileUpload from 'vue-upload-component'

export default {
  name: 'app',
  components: {
    Item,
    FileUpload
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
        type: '',
        tags: [],
        urls: [''],
        files: []
      },
      tagList: [],
      colors: ['#fff', '#9e9e9e', '#795548', '#ff9800', '#ffeb3b', '#8bc34a', '#03a9f4', '#673ab7', '#f44336'],
      bottomNav: 'All',
      showAddTodo: false,
      addTodoExpansion: [true], // TODO:无效
      drawer: null,
      drawerRight: null,
      leftMenu: [
        { icon: 'contacts', text: 'Contacts' },
        { icon: 'history', text: 'Frequently contacted' },
        { icon: 'content_copy', text: 'Duplicates' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Labels',
          model: true,
          children: [
            { icon: 'add', text: 'Create label' }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'More',
          model: false,
          children: [
            { text: 'Import' },
            { text: 'Export' },
            { text: 'Print' },
            { text: 'Undo changes' },
            { text: 'Other contacts' }
          ]
        },
        { icon: 'settings', text: 'Settings' },
        { icon: 'chat_bubble', text: 'Send feedback' },
        { icon: 'help', text: 'Help' },
        { icon: 'phonelink', text: 'App downloads' },
        { icon: 'keyboard', text: 'Go to the old version' }
      ]
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
  created () {

  },
  mounted () {
    window.onresize = () => {
      this.mobileMode = (window.outerWidth <= 400)
    }
  },
  methods: {
    showAddTodoHander () {
      this.showAddTodo = true
      setTimeout(() => {
        if (this.$refs.input) this.$refs.input.focus()
      }, 50)
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
    },
    removeTag (item) {
      this.template.tag.splice(this.template.tag.indexOf(item), 1)
      this.template.tag = [...this.template.tag]
    },
    urlKeyDown (e, index) {
      if (e.keyCode === 13) {
        this.template.urls.push('')
      } else if (e.keyCode === 8) {
        if (this.template.urls[index] === '' && index > 0) {
          this.template.urls.splice(index, 1)
        }
      }
    }
  },
  filters: {
    pluralize: (n, w) => n === 1 ? w : (w + 's'),
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1),
    formatSize (bytes) {
      if (bytes === 0) return '0 B'
      const k = 1000 // or 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    }
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
  min-width 400px
  padding 8px 8px 80px 8px

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

.add-todo
  padding 0

.toggle-all
  .v-input__slot
    margin-bottom 8px !important

.upload-drag
  ol
    margin 10px
    li
      padding-right 10px
      height 21px
      color #6b6b6b

  .file-name
    width 280px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    display block
    float left

  .float-right
    float right

  .drop-active
    top 0
    bottom 0
    right 0
    left 0
    position fixed
    z-index 9999
    opacity 0.6
    text-align center
    background #000

    h3
      margin -0.5em 0 0
      position absolute
      top 50%
      left 0
      right 0
      -webkit-transform translateY(-50%)
      -ms-transform translateY(-50%)
      transform translateY(-50%)
      font-size 40px
      color #fff
      padding 0
</style>
