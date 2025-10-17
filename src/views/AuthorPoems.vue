<template>
  <div class="author-poems">
    <div class="page-header">
      <button @click="$router.back()" class="back-btn">
        ← 返回作者列表
      </button>
      <h1>{{ author?.name }}的诗词作品</h1>
      <div class="author-info">
        <span class="dynasty">{{ author?.dynasty }}</span>
        <span class="poem-count">共 {{ poems.length }} 首诗词</span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <!-- 诗词列表 -->
    <div v-else-if="poems.length > 0" class="poems-grid">
      <div v-for="poem in poems" :key="poem.id" class="poem-card">
        <h3 class="poem-title">{{ poem.title }}</h3>
        <p class="poem-dynasty">{{ poem.dynasty }}</p>
        <div class="poem-content">{{ poem.content }}</div>
        <div class="poem-actions">
          <button @click="viewPoemDetail(poem.id)" class="btn">查看详情</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>该作者暂无诗词作品</p>
      <button @click="$router.push('/poems')" class="btn">浏览所有诗词</button>
    </div>

    <!-- 分页控件 -->
    <div v-if="!loading && poems.length > 0" class="pagination">
      <div class="pagination-info">
        显示 {{ Math.min((currentPage - 1) * itemsPerPage + 1, poems.length) }}-{{ Math.min(currentPage * itemsPerPage, poems.length) }} 条，共 {{ poems.length }} 条
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
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemsStore } from '../stores/poems'
import { useAuthorsStore } from '../stores/authors'
import { PoemService } from '../services/poemService.js'

export default {
  name: 'AuthorPoems',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const poemsStore = usePoemsStore()
    const authorsStore = useAuthorsStore()
    
    const author = ref(null)
    const poems = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(6)

    // 分页计算属性
    const totalPages = computed(() => {
      return Math.ceil(poems.value.length / itemsPerPage.value)
    })

    const paginatedPoems = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value
      const endIndex = startIndex + itemsPerPage.value
      return poems.value.slice(startIndex, endIndex)
    })

    const fetchAuthorPoems = async (authorId) => {
      loading.value = true
      try {
        // 获取作者信息
        const authorData = await authorsStore.getAuthorById(authorId)
        author.value = authorData

        // 获取该作者的所有诗词
        const allPoems = await PoemService.getAllPoems()
        poems.value = allPoems.filter(poem => {
          const poemAuthorId = poem.author_id || poem.authors?.id
          return poemAuthorId == authorId  // 使用宽松相等比较，因为authorId可能是字符串
        })
      } catch (error) {
        console.error('获取作者诗词失败:', error)
        alert('获取作者诗词失败：' + error.message)
      } finally {
        loading.value = false
      }
    }

    const viewPoemDetail = (poemId) => {
      router.push(`/poems/${poemId}`)
    }

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

    onMounted(() => {
      const authorId = route.params.id
      if (authorId) {
        fetchAuthorPoems(authorId)
      }
    })

    return {
      author,
      poems: paginatedPoems,
      loading,
      currentPage,
      totalPages,
      itemsPerPage,
      viewPoemDetail,
      goToPage,
      nextPage,
      prevPage
    }
  }
}
</script>

<style scoped>
.author-poems {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

.page-header {
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 16px;
  border-left: 5px solid #4a7c59;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  text-align: center;
}

.back-btn {
  background: linear-gradient(135deg, #2c5aa0 0%, #4a7c59 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-5px);
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #4a7c59, #2c5aa0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.author-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.dynasty {
  color: #c62f2f;
  font-size: 1.2rem;
  font-weight: 500;
  font-style: italic;
}

.poem-count {
  color: #2c5aa0;
  font-size: 1.2rem;
  font-weight: 500;
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
  border: 1px solid rgba(74, 124, 89, 0.1);
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
  background: linear-gradient(135deg, #4a7c59 0%, #2c5aa0 100%);
}

.poem-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.poem-title {
  color: #4a7c59;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

.poem-dynasty {
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
  border-left: 4px solid #c62f2f;
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
  border: 2px dashed #4a7c59;
}

.empty-state p {
  font-size: 1.2rem;
  color: #4a7c59;
  font-weight: 500;
  margin-bottom: 1.5rem;
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
  border: 1px solid rgba(74, 124, 89, 0.1);
}

.pagination-info {
  color: #4a7c59;
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
  border: 2px solid #4a7c59;
  background: transparent;
  color: #4a7c59;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #4a7c59;
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
    padding: 1.5rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .author-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
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