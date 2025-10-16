<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">欢迎来到诗词管理系统</h1>
      <p class="hero-subtitle">探索中华诗词之美</p>
      <router-link to="/poems" class="btn btn-primary">开始浏览</router-link>
    </div>
    
    <!-- 数据统计 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ poemsCount }}</h3>
            <p>诗词总数</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-content">
            <h3>{{ authorsCount }}</h3>
            <p>作者数量</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div class="stat-content">
            <h3>{{ categoriesCount }}</h3>
            <p>分类数量</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 热门诗词 -->
    <div class="featured-section">
      <h2 class="section-title">热门诗词</h2>
      <div class="poems-grid">
        <div v-for="poem in featuredPoems" :key="poem.id" class="poem-card">
          <h3 class="poem-title">{{ poem.title }}</h3>
          <p class="poem-author">{{ poem.authors?.name || poem.author_name || '未知作者' }} · {{ poem.dynasty }}</p>
          <p class="poem-content">{{ poem.content.substring(0, 100) }}...</p>
          <div class="poem-actions">
            <button @click="viewPoem(poem.id)" class="btn btn-secondary">查看详情</button>
            <button @click="toggleFavorite(poem)" class="btn" :class="{ 'btn-favorite': poem.is_favorite }">
              {{ poem.is_favorite ? '已收藏' : '收藏' }}
            </button>
          </div>
        </div>
      </div>
      <div class="view-all">
        <router-link to="/poems" class="btn btn-outline">查看全部诗词</router-link>
      </div>
    </div>
    
    <!-- 功能特色 -->
    <div class="features-section">
      <h2 class="section-title">功能特色</h2>
      <div class="features-grid">
        <router-link to="/poems" class="feature-card">
          <div class="feature-icon">📖</div>
          <h3>诗词收藏</h3>
          <p>收藏您喜爱的诗词作品，建立个人诗词库</p>
        </router-link>
        <router-link to="/authors" class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>作者信息</h3>
          <p>了解诗人的生平和创作背景</p>
        </router-link>
        <router-link to="/categories" class="feature-card">
          <div class="feature-icon">🏷️</div>
          <h3>分类管理</h3>
          <p>按朝代、体裁等方式分类管理</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { usePoemsStore } from '../stores/poems'
import { useAuthorsStore } from '../stores/authors'
import { useCategoriesStore } from '../stores/categories'

export default {
  name: 'Home',
  setup() {
    const poemsStore = usePoemsStore()
    const authorsStore = useAuthorsStore()
    const categoriesStore = useCategoriesStore()
    
    const poemsCount = ref(0)
    const authorsCount = ref(0)
    const categoriesCount = ref(0)
    const featuredPoems = ref([])
    const loading = ref(false)

    onMounted(async () => {
      loading.value = true
      try {
        // 获取统计数据
        await Promise.all([
          poemsStore.fetchPoems(),
          authorsStore.fetchAuthors(),
          categoriesStore.fetchCategories()
        ])
        
        poemsCount.value = poemsStore.poems.length
        authorsCount.value = authorsStore.authors.length
        categoriesCount.value = categoriesStore.categories.length
        
        // 获取热门诗词（前6首）
        featuredPoems.value = poemsStore.poems.slice(0, 6).map(poem => ({
          ...poem,
          is_favorite: false
        }))
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        loading.value = false
      }
    })

    const viewPoem = (poemId) => {
      window.location.href = `/poems/${poemId}`
    }

    const toggleFavorite = (poem) => {
      poem.is_favorite = !poem.is_favorite
      // 这里可以添加收藏功能的实际实现
      console.log('收藏状态变更:', poem.title, poem.is_favorite)
    }

    return {
      poemsCount,
      authorsCount,
      categoriesCount,
      featuredPoems,
      loading,
      viewPoem,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.home {
  padding: 2rem 0;
  animation: fadeInUp 0.8s ease-out;
}

.hero-section {
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #c62f2f 0%, #2c5aa0 50%, #4a7c59 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(198, 47, 47, 0.2);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #fff, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  font-weight: 300;
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #f1c40f 100%);
  color: #2c3e50;
  font-weight: 600;
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 30px rgba(212, 175, 55, 0.4);
}

.stats-section {
  margin: 4rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(44, 90, 160, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.12);
}

.stat-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.stat-content h3 {
  font-size: 2.5rem;
  color: #2c5aa0;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.stat-content p {
  color: #666;
  margin: 0;
  font-size: 1.1rem;
}

.featured-section {
  margin: 4rem 0;
  padding: 3rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  border-radius: 20px;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.poem-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #2c5aa0;
}

.poem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.poem-title {
  color: #2c5aa0;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.poem-author {
  color: #c62f2f;
  margin-bottom: 1rem;
  font-style: italic;
  font-weight: 500;
}

.poem-content {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.poem-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.btn-favorite {
  background: linear-gradient(135deg, #d4af37 0%, #f1c40f 100%);
  color: #2c3e50;
}

.btn-outline {
  background: transparent;
  border: 2px solid #2c5aa0;
  color: #2c5aa0;
}

.btn-outline:hover {
  background: #2c5aa0;
  color: white;
}

.view-all {
  text-align: center;
  margin-top: 2rem;
}

.features-section {
  margin-top: 4rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(135deg, #c62f2f 0%, #2c5aa0 100%);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
  transition: all 0.4s ease;
  border: 1px solid rgba(198, 47, 47, 0.1);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: block;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(198, 47, 47, 0.05), transparent);
  transition: left 0.6s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  text-decoration: none;
  color: inherit;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.feature-card h3 {
  color: #c62f2f;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.feature-card p {
  color: #5d6d7e;
  line-height: 1.8;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-section {
    padding: 4rem 1.5rem;
    margin-bottom: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .feature-card {
    padding: 2rem;
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