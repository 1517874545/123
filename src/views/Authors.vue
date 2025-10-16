<template>
  <div class="authors">
    <div class="page-header">
      <h1>作者管理</h1>
      <button @click="showAddForm = !showAddForm" class="btn">
        {{ showAddForm ? '取消' : '添加作者' }}
      </button>
    </div>

    <!-- 添加作者表单 -->
    <div v-if="showAddForm" class="card add-form">
      <h3>添加新作者</h3>
      <form @submit.prevent="addAuthor">
        <div class="form-group">
          <label class="form-label">姓名:</label>
          <input 
            v-model="newAuthor.name" 
            type="text" 
            class="form-input" 
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">朝代:</label>
          <input 
            v-model="newAuthor.dynasty" 
            type="text" 
            class="form-input" 
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">简介:</label>
          <textarea 
            v-model="newAuthor.description" 
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

    <!-- 作者列表 -->
    <div v-else class="authors-grid">
      <div v-for="author in authors" :key="author.id" class="author-card">
        <div class="author-avatar">
          {{ author.name.charAt(0) }}
        </div>
        <h3 class="author-name">{{ author.name }}</h3>
        <p class="author-dynasty">{{ author.dynasty }}</p>
        <p class="author-description">{{ author.description }}</p>
        <div class="author-stats">
          <span class="stat">诗词数量: {{ author.poem_count || 0 }}</span>
        </div>
        <div class="author-actions">
          <button @click="viewAuthorPoems(author.id)" class="btn btn-secondary">查看诗词</button>
          <button @click="deleteAuthor(author.id)" class="btn btn-danger" :disabled="loading">
            {{ loading ? '删除中...' : '删除' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && authors.length === 0" class="empty-state">
      <p>暂无作者信息，点击上方按钮添加第一位作者吧！</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useAuthorsStore } from '../stores/authors'

export default {
  name: 'Authors',
  setup() {
    const authorsStore = useAuthorsStore()
    const showAddForm = ref(false)
    const loading = ref(false)

    const newAuthor = reactive({
      name: '',
      dynasty: '',
      description: ''
    })

    onMounted(async () => {
      loading.value = true
      await authorsStore.fetchAuthors()
      loading.value = false
    })

    const addAuthor = async () => {
      if (!newAuthor.name || !newAuthor.dynasty || !newAuthor.description) {
        alert('请填写所有字段')
        return
      }

      loading.value = true
      try {
        await authorsStore.addAuthor(newAuthor)
        resetForm()
        showAddForm.value = false
      } catch (error) {
        console.error('添加作者失败:', error)
        alert('添加作者失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const deleteAuthor = async (id) => {
      if (confirm('确定要删除这位作者吗？')) {
        loading.value = true
        try {
          await authorsStore.deleteAuthor(id)
        } catch (error) {
          console.error('删除作者失败:', error)
          alert('删除作者失败，请重试')
        } finally {
          loading.value = false
        }
      }
    }

    const viewAuthorPoems = (authorId) => {
      // 跳转到诗词页面并筛选该作者的诗词
      window.location.href = `/poems?author=${authorId}`
    }

    const resetForm = () => {
      newAuthor.name = ''
      newAuthor.dynasty = ''
      newAuthor.description = ''
    }

    return {
      showAddForm,
      authors: authorsStore.authors,
      newAuthor,
      loading,
      addAuthor,
      deleteAuthor,
      viewAuthorPoems,
      resetForm
    }
  }
}
</script>

<style scoped>
.authors {
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

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.author-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 2rem;
  transition: all 0.4s ease;
  border: 1px solid rgba(44, 90, 160, 0.1);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.author-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #2c5aa0 0%, #4a7c59 100%);
}

.author-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c5aa0 0%, #4a7c59 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 20px rgba(44, 90, 160, 0.3);
}

.author-name {
  color: #2c5aa0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.author-dynasty {
  color: #c62f2f;
  margin-bottom: 1rem;
  font-style: italic;
  font-weight: 500;
  font-size: 1.1rem;
}

.author-description {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  text-align: left;
}

.author-stats {
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

.author-actions {
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
  
  .authors-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .author-card {
    padding: 1.5rem;
  }
  
  .author-avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
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