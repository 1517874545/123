<template>
  <div class="categories">
    <div class="page-header">
      <h1>分类管理</h1>
      <button @click="showAddForm = !showAddForm" class="btn">
        {{ showAddForm ? '取消' : '添加分类' }}
      </button>
    </div>

    <!-- 添加分类表单 -->
    <div v-if="showAddForm" class="card add-form">
      <h3>添加新分类</h3>
      <form @submit.prevent="addCategory">
        <div class="form-group">
          <label class="form-label">分类名称:</label>
          <input 
            v-model="newCategory.name" 
            type="text" 
            class="form-input" 
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">描述:</label>
          <textarea 
            v-model="newCategory.description" 
            class="form-input" 
            rows="4" 
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">颜色:</label>
          <div class="color-picker">
            <div 
              v-for="color in colorOptions" 
              :key="color"
              :class="['color-option', { active: newCategory.color === color }]"
              :style="{ backgroundColor: color }"
              @click="newCategory.color = color"
            ></div>
          </div>
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

    <!-- 分类列表 -->
    <div v-else class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="category-card"
        :style="{ borderLeftColor: category.color || '#2c5aa0' }"
      >
        <div class="category-header">
          <div class="category-color" :style="{ backgroundColor: category.color || '#2c5aa0' }"></div>
          <h3 class="category-name">{{ category.name }}</h3>
        </div>
        <p class="category-description">{{ category.description }}</p>
        <div class="category-stats">
          <span class="stat">诗词数量: {{ category.poem_count || 0 }}</span>
        </div>
        <div class="category-actions">
          <button @click="viewCategoryPoems(category.id)" class="btn btn-secondary">查看诗词</button>
          <button @click="deleteCategory(category.id)" class="btn btn-danger" :disabled="loading">
            {{ loading ? '删除中...' : '删除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div v-if="!loading && categoriesStore.categories.length > 0" class="pagination">
      <div class="pagination-info">
        显示 {{ Math.min((currentPage - 1) * itemsPerPage + 1, categoriesStore.categories.length) }}-{{ Math.min(currentPage * itemsPerPage, categoriesStore.categories.length) }} 条，共 {{ categoriesStore.categories.length }} 条
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

    <div v-if="!loading && categoriesStore.categories.length === 0" class="empty-state">
      <p>暂无分类信息，点击上方按钮添加第一个分类吧！</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useCategoriesStore } from '../stores/categories'

export default {
  name: 'Categories',
  setup() {
    const categoriesStore = useCategoriesStore()
    const showAddForm = ref(false)
    const loading = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(6)

    const colorOptions = [
      '#2c5aa0', '#4a7c59', '#d4af37', '#c62f2f', 
      '#8e44ad', '#16a085', '#e67e22', '#34495e'
    ]

    const newCategory = reactive({
      name: '',
      description: '',
      color: colorOptions[0]
    })

    // 分页计算属性
    const totalPages = computed(() => {
      return Math.ceil(categoriesStore.categories.length / itemsPerPage.value)
    })

    const paginatedCategories = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value
      const endIndex = startIndex + itemsPerPage.value
      return categoriesStore.categories.slice(startIndex, endIndex)
    })

    onMounted(async () => {
      loading.value = true
      await categoriesStore.fetchCategories()
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

    const addCategory = async () => {
      if (!newCategory.name || !newCategory.description) {
        alert('请填写所有字段')
        return
      }

      loading.value = true
      try {
        await categoriesStore.addCategory(newCategory)
        resetForm()
        showAddForm.value = false
      } catch (error) {
        console.error('添加分类失败:', error)
        alert('添加分类失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const deleteCategory = async (id) => {
      if (confirm('确定要删除这个分类吗？')) {
        loading.value = true
        try {
          await categoriesStore.deleteCategory(id)
        } catch (error) {
          console.error('删除分类失败:', error)
          alert('删除分类失败，请重试')
        } finally {
          loading.value = false
        }
      }
    }

    const viewCategoryPoems = (categoryId) => {
      // 跳转到诗词页面并筛选该分类的诗词
      window.location.href = `/poems?category=${categoryId}`
    }

    const resetForm = () => {
      newCategory.name = ''
      newCategory.description = ''
      newCategory.color = colorOptions[0]
    }

    return {
      showAddForm,
      categories: paginatedCategories,
      newCategory,
      colorOptions,
      loading,
      currentPage,
      totalPages,
      itemsPerPage,
      addCategory,
      deleteCategory,
      viewCategoryPoems,
      resetForm,
      goToPage,
      nextPage,
      prevPage
    }
  }
}
</script>

<style scoped>
.categories {
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
  border-left: 5px solid #2c5aa0;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #2c5aa0, #4a7c59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.add-form {
  margin-bottom: 3rem;
  border: 2px solid rgba(44, 90, 160, 0.1);
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.add-form h3 {
  margin-bottom: 2rem;
  color: #2c5aa0;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #e8f4f8;
  padding-bottom: 1rem;
}

.color-picker {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.color-option.active {
  border-color: #2c3e50;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.color-option:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.category-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 2rem;
  transition: all 0.4s ease;
  border-left: 5px solid;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, currentColor 0%, rgba(255,255,255,0.3) 100%);
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.category-name {
  color: #2c5aa0;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.category-description {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.category-stats {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 8px;
  border-left: 3px solid #d4af37;
}

.stat {
  color: #2c5aa0;
  font-weight: 500;
  font-size: 1rem;
}

.category-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-danger {
  background: linear-gradient(135deg, #c62f2f 0%, #e74c3c 100%);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #e74c3c 0%, #c62f2f 100%);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 16px;
  margin: 2rem 0;
  border: 2px dashed #2c5aa0;
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
  border: 1px solid rgba(44, 90, 160, 0.1);
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
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .category-card {
    padding: 1.5rem;
  }
  
  .color-picker {
    justify-content: center;
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