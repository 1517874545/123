<template>
  <div class="poem-detail" v-if="poem">
    <div class="detail-header">
      <button @click="$router.back()" class="back-btn">
        ← 返回列表
      </button>
      <h1 class="poem-title">{{ poem.title }}</h1>
    </div>

    <div class="poem-content">
      <div class="poem-meta">
        <div class="author-info">
          <div class="author-avatar">{{ poem.authors?.name?.charAt(0) || poem.author_name?.charAt(0) || '作' }}</div>
          <div class="author-details">
            <h3 class="author-name">{{ poem.authors?.name || poem.author_name || '未知作者' }}</h3>
            <p class="author-dynasty">{{ poem.authors?.dynasty || poem.dynasty || '未知朝代' }}</p>
          </div>
        </div>
        <div class="poem-stats">
          <div class="stat-item">
            <span class="stat-label">字数</span>
            <span class="stat-value">{{ poem.content?.length || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">行数</span>
            <span class="stat-value">{{ (poem.content?.split('\n') || []).length }}</span>
          </div>
        </div>
      </div>

      <div class="poem-text">
        <pre>{{ poem.content }}</pre>
      </div>

      <div class="poem-tags" v-if="poem.tags && poem.tags.length > 0">
        <span class="tag-label">标签：</span>
        <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <div class="poem-actions">
        <button @click="toggleFavorite" class="btn" :class="{ 'btn-favorite': isFavorite }">
          {{ isFavorite ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
        <button @click="sharePoem" class="btn btn-secondary">分享</button>
      </div>
    </div>

    <!-- 相关诗词 -->
    <div class="related-poems" v-if="relatedPoems.length > 0">
      <h3>相关诗词</h3>
      <div class="related-list">
        <div 
          v-for="related in relatedPoems" 
          :key="related.id" 
          class="related-item"
          @click="viewPoem(related.id)"
        >
          <h4>{{ related.title }}</h4>
          <p>{{ related.authors?.name || related.author_name || '未知作者' }} · {{ related.authors?.dynasty || related.dynasty || '未知朝代' }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="loading-state">
    <p>加载中...</p>
  </div>

  <div v-else class="error-state">
    <p>诗词不存在或加载失败</p>
    <button @click="$router.push('/poems')" class="btn">返回诗词列表</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemsStore } from '../stores/poems'
import { PoemService } from '../services/poemService.js'

export default {
  name: 'PoemDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const poemStore = usePoemsStore()
    
    const poem = ref(null)
    const loading = ref(false)
    const isFavorite = ref(false)
    const relatedPoems = ref([])

    const fetchPoemDetail = async (id) => {
      loading.value = true
      try {
        // 直接从API获取诗词详情
        const poemData = await PoemService.getPoemById(id)
        if (poemData) {
          poem.value = {
            ...poemData,
            author_name: poemData.authors?.name || poemData.author_name,
            dynasty: poemData.authors?.dynasty || poemData.dynasty
          }
          
          // 获取相关诗词（同一作者的其他作品）
          const allPoemsData = await PoemService.getAllPoems()
          relatedPoems.value = allPoemsData
            .filter(p => {
              const authorName = p.authors?.name || p.author_name
              return authorName === poem.value.author_name && p.id !== poem.value.id
            })
            .slice(0, 3)
            .map(p => ({
              id: p.id,
              title: p.title,
              author_name: p.authors?.name || p.author_name,
              dynasty: p.authors?.dynasty || p.dynasty
            }))
        } else {
          throw new Error('诗词不存在')
        }
      } catch (error) {
        console.error('获取诗词详情失败:', error)
        alert('获取诗词详情失败：' + error.message)
      } finally {
        loading.value = false
      }
    }

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value
      // 这里可以添加收藏功能的实现
    }

    const sharePoem = () => {
      if (navigator.share) {
        navigator.share({
          title: poem.value.title,
          text: `${poem.value.title} - ${poem.value.author_name}`,
          url: window.location.href
        })
      } else {
        // 复制到剪贴板
        const text = `${poem.value.title}\n${poem.value.author_name} · ${poem.value.dynasty}\n\n${poem.value.content}`
        navigator.clipboard.writeText(text)
        alert('诗词内容已复制到剪贴板')
      }
    }

    const viewPoem = (id) => {
      // 使用完整的URL路径进行跳转
      const baseUrl = window.location.origin
      window.location.href = `${baseUrl}/poems/${id}`
    }

    onMounted(() => {
      const poemId = route.params.id
      if (poemId) {
        fetchPoemDetail(poemId)
      }
    })

    return {
      poem,
      loading,
      isFavorite,
      relatedPoems,
      toggleFavorite,
      sharePoem,
      viewPoem
    }
  }
}
</script>

<style scoped>
.poem-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeInUp 0.8s ease-out;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e8f4f8;
}

.back-btn {
  background: linear-gradient(135deg, #2c5aa0 0%, #4a7c59 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 2rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-5px);
}

.poem-title {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #c62f2f, #2c5aa0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.poem-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid rgba(198, 47, 47, 0.1);
}

.poem-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e8f4f8;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c5aa0 0%, #4a7c59 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.author-name {
  color: #2c5aa0;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.author-dynasty {
  color: #c62f2f;
  margin: 0.5rem 0 0 0;
  font-style: italic;
}

.poem-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  color: #2c5aa0;
  font-size: 1.2rem;
  font-weight: 600;
}

.poem-text {
  margin: 2rem 0;
}

.poem-text pre {
  white-space: pre-wrap;
  font-family: 'SimSun', '宋体', serif;
  font-size: 1.3rem;
  line-height: 2.5;
  color: #2c3e50;
  text-align: center;
  margin: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #d4af37;
}

.poem-tags {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 8px;
  border-left: 3px solid #4a7c59;
}

.tag-label {
  color: #2c5aa0;
  font-weight: 500;
  margin-right: 1rem;
}

.tag {
  display: inline-block;
  background: linear-gradient(135deg, #2c5aa0 0%, #4a7c59 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin: 0.3rem;
}

.poem-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.btn-favorite {
  background: linear-gradient(135deg, #c62f2f 0%, #e74c3c 100%) !important;
}

.related-poems {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 16px;
  border: 1px solid rgba(44, 90, 160, 0.1);
}

.related-poems h3 {
  color: #2c5aa0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.related-list {
  display: grid;
  gap: 1rem;
}

.related-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer !important;
  transition: all 0.3s ease;
  border-left: 3px solid #d4af37;
  position: relative;
  z-index: 1;
}

.related-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
}

.related-item:active {
  transform: translateX(5px) scale(0.98);
}

.related-item h4 {
  color: #2c5aa0;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.related-item p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #2c5aa0;
  font-size: 1.2rem;
}

.error-state {
  color: #c62f2f;
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

@media (max-width: 768px) {
  .poem-detail {
    padding: 1rem;
  }
  
  .detail-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .back-btn {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .poem-title {
    font-size: 2rem;
  }
  
  .poem-content {
    padding: 1.5rem;
  }
  
  .poem-meta {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .poem-stats {
    justify-content: center;
  }
  
  .poem-text pre {
    font-size: 1.1rem;
    padding: 1rem;
  }
  
  .poem-actions {
    flex-direction: column;
  }
}
</style>