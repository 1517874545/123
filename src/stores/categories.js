import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('categories')
          .select(`
            *,
            poems(count)
          `)
          .order('name')

        if (error) throw error

        this.categories = data.map(category => ({
          ...category,
          poem_count: category.poems[0]?.count || 0
        }))
      } catch (error) {
        console.error('获取分类列表失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async addCategory(categoryData) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([categoryData])
          .select()

        if (error) throw error

        if (data && data.length > 0) {
          this.categories.push({
            ...data[0],
            poem_count: 0
          })
        }
        return data
      } catch (error) {
        console.error('添加分类失败:', error)
        throw error
      }
    },

    async deleteCategory(id) {
      try {
        // 先检查该分类是否有诗词
        const { data: poems } = await supabase
          .from('poems')
          .select('id')
          .eq('category_id', id)

        if (poems && poems.length > 0) {
          throw new Error('该分类还有诗词作品，无法删除')
        }

        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.categories = this.categories.filter(category => category.id !== id)
      } catch (error) {
        console.error('删除分类失败:', error)
        throw error
      }
    },

    async updateCategory(id, updates) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .update(updates)
          .eq('id', id)
          .select()

        if (error) throw error

        if (data && data.length > 0) {
          const index = this.categories.findIndex(category => category.id === id)
          if (index !== -1) {
            this.categories[index] = { ...this.categories[index], ...data[0] }
          }
        }
        return data
      } catch (error) {
        console.error('更新分类失败:', error)
        throw error
      }
    }
  },

  getters: {
    getCategoryById: (state) => {
      return (id) => state.categories.find(category => category.id === id)
    },
    
    getPopularCategories: (state) => {
      return state.categories
        .filter(category => category.poem_count > 0)
        .sort((a, b) => b.poem_count - a.poem_count)
        .slice(0, 5)
    }
  }
})