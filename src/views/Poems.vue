<template>
  <div class="poems">
    <div class="page-header">
      <h1>诗词列表</h1>
      <button @click="showAddForm = !showAddForm" class="btn">
        {{ showAddForm ? '取消' : '添加诗词' }}
      </button>
    </div>

    <!-- 添加诗词表单 -->
    <div v-if="showAddForm" class="card add-form">
      <h3>添加新诗词</h3>
      <form @submit.prevent="addPoem">
        <div class="form-group">
          <label class="form-label">标题:</label>
          <input 
            v-model="newPoem.title" 
            type="text" 
            class="form-input" 
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">作者:</label>
          <input 
            v-model="newPoem.author" 
            type="text" 
            class="form-input" 
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">朝代:</label>
          <input 
            v-model="newPoem.dynasty" 
            type="text" 
            class="form-input" 
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">内容:</label>
          <textarea 
            v-model="newPoem.content" 
            class="form-input" 
            rows="4" 
            required
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn" :disabled="loading">
            {{ loading ? '添加中...' : '添加' }}
          </button>
          <button type="button" @click="resetForm" class="btn btn-secondary">重置</button>
        </div>
      </form>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <!-- 诗词列表 -->
    <div v-else class="poems-grid">
      <div v-for="poem in poems" :key="poem.id" class="poem-card">
        <h3 class="poem-title">{{ poem.title }}</h3>
        <p class="poem-author">{{ poem.authors?.name || poem.author_name || '未知作者' }} · {{ poem.dynasty }}</p>
        <div class="poem-content">{{ poem.content }}</div>
        <div class="poem-actions">
          <button @click="viewPoemDetail(poem.id)" class="btn">查看详情</button>
          <button @click="deletePoem(poem.id)" class="btn btn-danger" :disabled="loading">
            {{ loading ? '删除中...' : '删除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div v-if="!loading && poemStore.poems.length > 0" class="pagination">
      <div class="pagination-info">
        显示 {{ Math.min((currentPage - 1) * itemsPerPage + 1, poemStore.poems.length) }}-{{ Math.min(currentPage * itemsPerPage, poemStore.poems.length) }} 条，共 {{ poemStore.poems.length }} 条
      </div>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
          上一页
        </button>
        <div class="pagination-pages">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="goToPage(page)"
            :class="['pagination-page', { active: page === currentPage }]"
          >
            {{ page }}
          </button>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
          下一页
        </button>
      </div>
    </div>

    <div v-if="!loading && poemStore.poems.length === 0" class="empty-state">
      <p>暂无诗词，点击上方按钮添加第一首诗词吧！</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemsStore } from '../stores/poems'

export default {
  name: 'Poems',
  setup() {
    const router = useRouter()
    const poemStore = usePoemsStore()
    const showAddForm = ref(false)
    const loading = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(6)

    const newPoem = reactive({
      title: '',
      author: '',
      dynasty: '',
      content: ''
    })

    // 分页计算属性
    const totalPages = computed(() => {
      return Math.ceil(poemStore.poems.length / itemsPerPage.value)
    })

    const paginatedPoems = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value
      const endIndex = startIndex + itemsPerPage.value
      return poemStore.poems.slice(startIndex, endIndex)
    })

    onMounted(async () => {
      loading.value = true
      await poemStore.fetchPoems()
      loading.value = false
    })

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const addPoem = async () => {
      if (!newPoem.title || !newPoem.author || !newPoem.dynasty || !newPoem.content) {
        alert('请填写所有字段')
        return
      }

      loading.value = true
      try {
        await poemStore.addPoem(newPoem)
        resetForm()
        showAddForm.value = false
      } catch (error) {
        console.error('添加诗词失败:', error)
        alert('添加诗词失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const viewPoemDetail = (id) => {
      router.push(`/poems/${id}`)
    }

    const deletePoem = async (id) => {
      if (confirm('确定要删除这首诗词吗？')) {
        loading.value = true
        try {
          await poemStore.deletePoem(id)
        } catch (error) {
          console.error('删除诗词失败:', error)
          alert('删除诗词失败，请重试')
        } finally {
          loading.value = false
        }
      }
    }

    const resetForm = () => {
      newPoem.title = ''
      newPoem.author = ''
      newPoem.dynasty = ''
      newPoem.content = ''
    }

    return {
      showAddForm,
      poems: paginatedPoems,
      poemStore,
      newPoem,
      loading,
      currentPage,
      totalPages,
      itemsPerPage,
      addPoem,
      viewPoemDetail,
      deletePoem,
      resetForm,
      goToPage,
      nextPage,
      prevPage
    }
  }
}
</script>

<style scoped>
.poems {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 16px;
  border-left: 5px solid #c62f2f;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #c62f2f, #2c5aa0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.add-form {
  margin-bottom: 3rem;
  border: 2px solid rgba(198, 47, 47, 0.1);
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.add-form h3 {
  margin-bottom: 2rem;
  color: #c62f2f;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #e8f4f8;
  padding-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #2c5aa0;
  font-size: 1.2rem;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
}

.poem-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 2rem;
  transition: all 0.4s ease;
  border: 1px solid rgba(198, 47, 47, 0.1);
  position: relative;
  overflow: hidden;
}

.poem-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #c62f2f 0%, #2c5aa0 100%);
}

.poem-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.poem-title {
  color: #c62f2f;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

.poem-author {
  color: #2c5aa0;
  margin-bottom: 1.5rem;
  font-style: italic;
  font-weight: 500;
  font-size: 1.1rem;
  border-left: 3px solid #d4af37;
  padding-left: 1rem;
}

.poem-content {
  white-space: pre-line;
  line-height: 2;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 400;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #4a7c59;
}

.poem-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 16px;
  margin: 2rem 0;
  border: 2px dashed #c62f2f;
}

.empty-state p {
  font-size: 1.2rem;
  color: #2c5aa0;
  font-weight: 500;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 12px;
  border: 1px solid rgba(198, 47, 47, 0.1);
}

.pagination-info {
  color: #2c5aa0;
  font-weight: 500;
  font-size: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  padding: 0.8rem 1.5rem;
  border: 2px solid #2c5aa0;
  background: transparent;
  color: #2c5aa0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #2c5aa0;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.pagination-pages {
  display: flex;
  gap: 0.5rem;
}

.pagination-page {
  padding: 0.8rem 1.2rem;
  border: 2px solid #d4af37;
  background: transparent;
  color: #2c3e50;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-page:hover {
  background: #d4af37;
  color: white;
  transform: translateY(-2px);
}

.pagination-page.active {
  background: linear-gradient(135deg, #d4af37 0%, #f1c40f 100%);
  color: white;
  border-color: #d4af37;
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination-pages {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .poem-card {
    padding: 1.5rem;
  }
  
  .poem-content {
    padding: 1rem;
    font-size: 1.1rem;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>