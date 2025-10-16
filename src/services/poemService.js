import { supabase, TABLES, handleSupabaseError } from '../config/supabase.js'

export class PoemService {
  // 获取所有诗词
  static async getAllPoems() {
    try {
      const { data, error } = await supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          authors (name, dynasty),
          categories (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 根据ID获取诗词
  static async getPoemById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          authors (*),
          categories (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 添加新诗词
  static async addPoem(poemData) {
    try {
      // 首先检查作者是否存在，不存在则创建
      let authorId = poemData.author_id
      if (!authorId && poemData.author_name) {
        const author = await this.findOrCreateAuthor(poemData.author_name, poemData.dynasty)
        authorId = author.id
      }

      const { data, error } = await supabase
        .from(TABLES.POEMS)
        .insert({
          title: poemData.title,
          content: poemData.content,
          author_id: authorId,
          category_id: poemData.category_id,
          dynasty: poemData.dynasty,
          tags: poemData.tags || []
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 更新诗词
  static async updatePoem(id, poemData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.POEMS)
        .update({
          title: poemData.title,
          content: poemData.content,
          category_id: poemData.category_id,
          dynasty: poemData.dynasty,
          tags: poemData.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 删除诗词
  static async deletePoem(id) {
    try {
      const { error } = await supabase
        .from(TABLES.POEMS)
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 搜索诗词
  static async searchPoems(query) {
    try {
      const { data, error } = await supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          authors (name, dynasty),
          categories (name)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 根据朝代筛选诗词
  static async getPoemsByDynasty(dynasty) {
    try {
      const { data, error } = await supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          authors (name, dynasty),
          categories (name)
        `)
        .eq('dynasty', dynasty)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 查找或创建作者
  static async findOrCreateAuthor(name, dynasty) {
    try {
      // 先查找作者
      const { data: existingAuthor } = await supabase
        .from(TABLES.AUTHORS)
        .select('*')
        .eq('name', name)
        .single()

      if (existingAuthor) return existingAuthor

      // 创建新作者
      const { data: newAuthor, error } = await supabase
        .from(TABLES.AUTHORS)
        .insert({
          name: name,
          dynasty: dynasty
        })
        .select()
        .single()

      if (error) throw error
      return newAuthor
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 获取所有作者
  static async getAllAuthors() {
    try {
      const { data, error } = await supabase
        .from(TABLES.AUTHORS)
        .select('*')
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }

  // 获取所有分类
  static async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
    }
  }
}