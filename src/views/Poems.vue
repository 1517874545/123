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
          <label class="form-label">title:</label>
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
          <button type="submit" class="btn">添加</button>
          <button type="button" @click="resetForm" class="btn btn-secondary">重置</button>
        </div>
      </form>
    </div>

    <!-- 诗词列表 -->
    <div class="poems-grid">
      <div v-for="poem in poems" :key="poem.id" class="poem-card">
        <h3 class="poem-title">{{ poem.title }}</h3>
        <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
        <div class="poem-content">{{ poem.content }}</div>
        <div class="poem-actions">
          <button @click="deletePoem(poem.id)" class="btn btn-secondary">删除</button>
        </div>
      </div>
    </div>

    <div v-if="poems.length === 0" class="empty-state">
      <p>暂无诗词，点击上方按钮添加第一首诗词吧！</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'Poems',
  setup() {
    const showAddForm = ref(false)
    const poems = ref([
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐',
        content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。'
      },
      {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐',
        content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。'
      }
    ])

    const newPoem = reactive({
      title: '',
      author: '',
      dynasty: '',
      content: ''
    })

    const addPoem = () => {
      const poem = {
        id: Date.now(),
        title: newPoem.title,
        author: newPoem.author,
        dynasty: newPoem.dynasty,
        content: newPoem.content
      }
      poems.value.push(poem)
      resetForm()
      showAddForm.value = false
    }

    const deletePoem = (id) => {
      if (confirm('确定要删除这首诗词吗？')) {
        const index = poems.value.findIndex(poem => poem.id === id)
        if (index > -1) {
          poems.value.splice(index, 1)
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
      poems,
      newPoem,
      addPoem,
      deletePoem,
      resetForm
    }
  }
}
</script>

<style scoped>
.poems {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
}

.add-form {
  margin-bottom: 2rem;
}

.add-form h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.poem-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.poem-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.poem-author {
  color: #666;
  margin-bottom: 1rem;
  font-style: italic;
}

.poem-content {
  white-space: pre-line;
  line-height: 1.8;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.1rem;
}

.poem-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>