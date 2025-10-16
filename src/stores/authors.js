import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    authors: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchAuthors() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('authors')
          .select(`
            *,
            poems(count)
          `)
          .order('name')

        if (error) throw error

        this.authors = data.map(author => ({
          ...author,
          poem_count: author.poems[0]?.count || 0
        }))
      } catch (error) {
        console.error('获取作者列表失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async addAuthor(authorData) {
      try {
        const { data, error } = await supabase
          .from('authors')
          .insert([authorData])
          .select()

        if (error) throw error

        if (data && data.length > 0) {
          this.authors.push({
            ...data[0],
            poem_count: 0
          })
        }
        return data
      } catch (error) {
        console.error('添加作者失败:', error)
        throw error
      }
    },

    async deleteAuthor(id) {
      try {
        // 先检查该作者是否有诗词
        const { data: poems } = await supabase
          .from('poems')
          .select('id')
          .eq('author_id', id)

        if (poems && poems.length > 0) {
          throw new Error('该作者还有诗词作品，无法删除')
        }

        const { error } = await supabase
          .from('authors')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.authors = this.authors.filter(author => author.id !== id)
      } catch (error) {
        console.error('删除作者失败:', error)
        throw error
      }
    },

    async updateAuthor(id, updates) {
      try {
        const { data, error } = await supabase
          .from('authors')
          .update(updates)
          .eq('id', id)
          .select()

        if (error) throw error

        if (data && data.length > 0) {
          const index = this.authors.findIndex(author => author.id === id)
          if (index !== -1) {
            this.authors[index] = { ...this.authors[index], ...data[0] }
          }
        }
        return data
      } catch (error) {
        console.error('更新作者失败:', error)
        throw error
      }
    },

    async getAuthorById(id) {
      try {
        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error('获取作者详情失败:', error)
        throw error
      }
    }
  },

  getters: {
    getAuthorsByDynasty: (state) => {
      return (dynasty) => state.authors.filter(author => author.dynasty === dynasty)
    },
    
    getPopularAuthors: (state) => {
      return state.authors
        .filter(author => author.poem_count > 0)
        .sort((a, b) => b.poem_count - a.poem_count)
        .slice(0, 10)
    }
  }
})