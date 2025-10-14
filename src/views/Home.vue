<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">欢迎来到诗词管理系统</h1>
      <p class="hero-subtitle">探索中华诗词之美</p>
      <router-link to="/poems" class="btn btn-primary">开始浏览</router-link>
    </div>
    
    <div class="features-section">
      <h2 class="section-title">功能特色</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>诗词收藏</h3>
          <p>收藏您喜爱的诗词作品</p>
        </div>
        <div class="feature-card">
          <h3>作者信息</h3>
          <p>了解诗人的生平和创作背景</p>
        </div>
        <div class="feature-card">
          <h3>分类管理</h3>
          <p>按朝代、体裁等方式分类管理</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero-section {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-primary {
  background-color: #fff;
  color: #667eea;
  font-weight: 500;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn-primary:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.features-section {
  margin-top: 3rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>