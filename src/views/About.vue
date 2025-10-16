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
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

.card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  padding: 3rem;
  border: 1px solid rgba(198, 47, 47, 0.1);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(135deg, #c62f2f 0%, #2c5aa0 50%, #4a7c59 100%);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 3rem;
  font-weight: 600;
  background: linear-gradient(45deg, #c62f2f, #2c5aa0, #4a7c59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 35%;
  width: 30%;
  height: 3px;
  background: linear-gradient(135deg, #c62f2f 0%, #2c5aa0 100%);
  border-radius: 2px;
}

h2 {
  color: #c62f2f;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: 2px solid #e8f4f8;
  padding-bottom: 0.75rem;
  position: relative;
}

h2::before {
  content: '✦';
  color: #d4af37;
  margin-right: 0.5rem;
}

section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255,255,255,0.7);
  border-radius: 12px;
  border-left: 4px solid #2c5aa0;
  transition: transform 0.3s ease;
}

section:hover {
  transform: translateX(5px);
}

.intro-section p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #2c3e50;
  font-weight: 400;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 1rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
  border-bottom: 1px solid #e8f4f8;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 2rem;
}

.features-list li::before {
  content: '🎯';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

.features-list li:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  padding-left: 2.5rem;
  border-radius: 8px;
}

.features-list li:last-child {
  border-bottom: none;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.tech-item {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  border: 1px solid rgba(198, 47, 47, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tech-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #c62f2f 0%, #2c5aa0 100%);
}

.tech-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.tech-item h3 {
  color: #c62f2f;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.tech-item p {
  color: #2c5aa0;
  font-weight: 500;
  font-size: 1.1rem;
}

.contact-info {
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  border-left: 4px solid #d4af37;
}

.contact-info p {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(198, 47, 47, 0.1);
}

.contact-info p:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

@media (max-width: 768px) {
  .card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  section {
    padding: 1.5rem;
    margin: 1rem 0;
  }
  
  .features-list li {
    padding: 0.75rem 0;
    padding-left: 1.5rem;
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