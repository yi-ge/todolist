<template lang="pug">
v-list-tile.todo-item(:class="{ 'editing': editing }")
  v-list-tile-action
    v-checkbox(:input-value='todo.done' @change='toggleTodo(todo)' color='primary' v-if='!editing')
    v-icon(color='primary' v-else) edit
  template(v-if='!editing')
    v-list-tile-content(:class="{ 'primary--text': todo.done }" @dblclick='editing = true')
      | {{ todo.text }}
    v-list-tile-action
      v-btn(@click='removeTodo(todo)' color='red lighten-3' flat icon)
        v-icon close
  v-text-field(:value='todo.text' @blur='doneEdit' @keyup.enter='doneEdit' @keyup.esc='cancelEdit' clearable color='primary' flat hide-details maxlength='1023' ref='input' solo v-else v-focus='editing')
</template>

<script>
export default {
  props: ['todo'],
  data () {
    return {
      editing: false
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
    editTodo (todo, value) {
      todo.text = value
      this.$emit('input', todo)
    },
    doneEdit (e) {
      const value = e.target.value.trim()
      const { todo } = this
      if (!value) {
        this.removeTodo(todo)
      } else if (this.editing) {
        this.editTodo(todo, value)
        this.editing = false
      }
    },
    removeTodo (todo) {
      this.$emit('removeTodo', todo)
    },
    toggleTodo (todo) {
      todo.done = !todo.done
      this.$emit('input', todo)
    },
    cancelEdit () {
      this.editing = false
    }
  }
}
</script>

<style lang="stylus">
.todo-item
  .v-list__tile
    height auto
    padding-top 12px
    padding-bottom 12px

  &.editing .v-list__tile
    height 48px
</style>
