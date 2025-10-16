import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PoemService } from '../services/poemService.js'

export const usePoemsStore = defineStore('poems', () => {
  // State
  const poems = ref([])
  const searchQuery = ref('')
  const selectedDynasty = ref('')
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const filteredPoems = computed(() => {
    let result = poems.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(poem => 
        poem.title.toLowerCase().includes(query) ||
        poem.authors?.name.toLowerCase().includes(query) ||
        poem.content.toLowerCase().includes(query)
      )
    }

    if (selectedDynasty.value) {
      result = result.filter(poem => poem.dynasty === selectedDynasty.value)
    }

    return result
  })

  const dynasties = computed(() => {
    const dynastySet = new Set(poems.value.map(poem => poem.dynasty))
    return Array.from(dynastySet)
  })

  const totalPoems = computed(() => poems.value.length)

  // Actions
  const fetchPoems = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await PoemService.getAllPoems()
      poems.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('获取诗词失败:', err)
    } finally {
      loading.value = false
    }
  }

  const addPoem = async (poemData) => {
    loading.value = true
    error.value = null
    try {
      const processedData = {
        title: poemData.title,
        author_name: poemData.author,
        dynasty: poemData.dynasty,
        content: poemData.content,
        category_id: poemData.category_id,
        tags: poemData.tags || []
      }

      await PoemService.addPoem(processedData)
      await fetchPoems() // 重新获取数据
      return true
    } catch (err) {
      error.value = err.message
      console.error('添加诗词失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const deletePoem = async (id) => {
    loading.value = true
    error.value = null
    try {
      await PoemService.deletePoem(id)
      await fetchPoems() // 重新获取数据
      return true
    } catch (err) {
      error.value = err.message
      console.error('删除诗词失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const searchPoems = async (query) => {
    loading.value = true
    error.value = null
    try {
      if (query.trim()) {
        const data = await PoemService.searchPoems(query)
        poems.value = data || []
      } else {
        await fetchPoems() // 如果搜索为空，显示所有诗词
      }
    } catch (err) {
      error.value = err.message
      console.error('搜索诗词失败:', err)
    } finally {
      loading.value = false
    }
  }

  const filterByDynasty = async (dynasty) => {
    loading.value = true
    error.value = null
    try {
      if (dynasty) {
        const data = await PoemService.getPoemsByDynasty(dynasty)
        poems.value = data || []
      } else {
        await fetchPoems() // 如果朝代为空，显示所有诗词
      }
    } catch (err) {
      error.value = err.message
      console.error('按朝代筛选失败:', err)
    } finally {
      loading.value = false
    }
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedDynasty.value = ''
    fetchPoems() // 重新获取所有数据
  }

  return {
    poems,
    searchQuery,
    selectedDynasty,
    loading,
    error,
    filteredPoems,
    dynasties,
    totalPoems,
    fetchPoems,
    addPoem,
    deletePoem,
    searchPoems,
    filterByDynasty,
    setSearchQuery,
    clearFilters
  }
})