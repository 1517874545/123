<template>
  <div class="about">
    <div class="card">
      <h1>关于诗词管理系统</h1>
      
      <section class="intro-section">
        <h2>项目简介</h2>
        <p>
          诗词管理系统是一个基于Vue 3开发的现代化Web应用，旨在为诗词爱好者提供一个便捷的诗词收藏和管理平台。
          通过这个系统，用户可以轻松地添加、浏览和管理自己喜爱的诗词作品。
        </p>
      </section>

      <section class="features-section">
        <h2>主要功能</h2>
        <ul class="features-list">
          <li>✨ 诗词添加与编辑</li>
          <li>📚 诗词分类管理</li>
          <li>🔍 快速搜索功能</li>
          <li>💾 本地数据存储</li>
          <li>📱 响应式设计，支持移动端</li>
          <li>🎨 优雅的用户界面</li>
        </ul>
      </section>

      <section class="tech-section">
        <h2>技术栈</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <h3>前端框架</h3>
            <p>Vue 3 + Composition API</p>
          </div>
          <div class="tech-item">
            <h3>路由管理</h3>
            <p>Vue Router 4</p>
          </div>
          <div class="tech-item">
            <h3>状态管理</h3>
            <p>Pinia</p>
          </div>
          <div class="tech-item">
            <h3>构建工具</h3>
            <p>Vite</p>
          </div>
        </div>
      </section>

      <section class="contact-section">
        <h2>联系方式</h2>
        <p>如果您有任何问题或建议，欢迎联系我们：</p>
        <div class="contact-info">
          <p>📧 Email: contact@poem-app.com</p>
          <p>🌐 Website: https://poem-app.com</p>
          <p>📱 GitHub: https://github.com/poem-app</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2.5rem;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

section {
  margin-bottom: 2.5rem;
}

.intro-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 0.75rem 0;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid #eee;
}

.features-list li:last-child {
  border-bottom: none;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.tech-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.tech-item h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.tech-item p {
  color: #666;
  font-weight: 500;
}

.contact-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #333;
}

.contact-info p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>