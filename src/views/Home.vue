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