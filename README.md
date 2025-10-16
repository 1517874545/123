# 诗词管理系统

一个现代化的诗词管理系统，采用Vue 3 + Vite + Pinia + Supabase技术栈。

## 功能特色

### 🎨 现代化界面设计
- 采用中国传统色彩方案
- 响应式设计，支持移动端
- 流畅的动画效果

### 📚 完整的诗词管理
- **诗词收藏**: 浏览、搜索、收藏诗词作品
- **作者管理**: 查看诗人信息、生平介绍
- **分类管理**: 按朝代、体裁分类管理诗词
- **热门诗词**: 首页展示精选诗词作品

### 🔧 技术特性
- **前端**: Vue 3 + Vite + Pinia
- **后端**: Supabase (PostgreSQL + 实时API)
- **样式**: 现代化CSS设计
- **构建**: Vite快速构建工具

## 项目结构

```
poem/
├── src/
│   ├── components/     # 公共组件
│   ├── views/          # 页面组件
│   │   ├── Home.vue    # 首页
│   │   ├── Poems.vue   # 诗词列表
│   │   ├── Authors.vue # 作者管理
│   │   ├── Categories.vue # 分类管理
│   │   └── About.vue   # 关于页面
│   ├── stores/         # Pinia状态管理
│   ├── services/       # API服务
│   ├── router/         # 路由配置
│   └── supabase.js     # Supabase配置
├── supabase/
│   ├── migrations/     # 数据库迁移
│   └── seed_data.sql   # 示例数据
└── public/             # 静态资源
```

## 数据库设计

### 核心表结构
- **authors**: 作者信息表
- **poems**: 诗词作品表
- **categories**: 分类表

### 关系设计
- 诗词与作者：多对一关系
- 诗词与分类：多对一关系
- 支持标签系统

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 配置环境变量
复制 `.env.example` 为 `.env` 并填入你的Supabase配置：
```bash
cp .env.example .env
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 部署说明

### Vercel部署
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 自动部署

### Supabase配置
1. 创建Supabase项目
2. 执行数据库迁移
3. 导入示例数据
4. 配置API密钥

## 功能演示

### 首页功能
- 数据统计展示
- 热门诗词推荐
- 快速导航入口

### 诗词管理
- 诗词列表浏览
- 搜索和筛选功能
- 添加/删除诗词
- 收藏功能

### 作者管理
- 作者信息展示
- 诗词数量统计
- 作者详情查看

### 分类管理
- 分类颜色标记
- 诗词数量统计
- 分类筛选功能

## 技术亮点

1. **现代化架构**: Vue 3组合式API + Pinia状态管理
2. **实时数据**: Supabase提供实时数据库同步
3. **响应式设计**: 完美适配各种屏幕尺寸
4. **性能优化**: Vite快速构建，代码分割优化
5. **类型安全**: 完整的TypeScript支持

## 贡献指南

欢迎提交Issue和Pull Request来改进项目！

## 许可证

MIT License