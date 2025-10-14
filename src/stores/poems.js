import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePoemsStore = defineStore('poems', () => {
  // State
  const poems = ref([
    {
      id: 1,
      title: '静夜思',
      author: '李白',
      dynasty: '唐',
      content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      tags: ['思乡', '月夜'],
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      title: '春晓',
      author: '孟浩然',
      dynasty: '唐',
      content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
      tags: ['春天', '自然'],
      createdAt: new Date('2024-01-02')
    }
  ])

  const searchQuery = ref('')
  const selectedDynasty = ref('')

  // Getters
  const filteredPoems = computed(() => {
    let result = poems.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(poem => 
        poem.title.toLowerCase().includes(query) ||
        poem.author.toLowerCase().includes(query) ||
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
  const addPoem = (poemData) => {
    const newPoem = {
      id: Date.now(),
      ...poemData,
      createdAt: new Date()
    }
    poems.value.push(newPoem)
    return newPoem
  }

  const deletePoem = (id) => {
    const index = poems.value.findIndex(poem => poem.id === id)
    if (index !== -1) {
      poems.value.splice(index, 1)
      return true
    }
    return false
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedDynasty.value = ''
  }

  return {
    poems,
    searchQuery,
    selectedDynasty,
    filteredPoems,
    dynasties,
    totalPoems,
    addPoem,
    deletePoem,
    setSearchQuery,
    clearFilters
  }
})