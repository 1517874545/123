-- 创建诗词管理系统数据库表

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 作者表
CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    dynasty VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 诗词分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 诗词表
CREATE TABLE IF NOT EXISTS poems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    dynasty VARCHAR(50),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_title ON poems(title);
CREATE INDEX IF NOT EXISTS idx_poems_author_id ON poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_category_id ON poems(category_id);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_created_at ON poems(created_at DESC);

-- 启用行级安全策略
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取数据
CREATE POLICY "允许所有人读取作者" ON authors FOR SELECT USING (true);
CREATE POLICY "允许所有人读取分类" ON categories FOR SELECT USING (true);
CREATE POLICY "允许所有人读取诗词" ON poems FOR SELECT USING (true);

-- 创建策略：允许认证用户插入、更新、删除数据
CREATE POLICY "允许认证用户管理作者" ON authors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "允许认证用户管理分类" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "允许认证用户管理诗词" ON poems FOR ALL USING (auth.role() = 'authenticated');

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表创建触发器
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据
INSERT INTO authors (name, dynasty, description) VALUES
('李白', '唐', '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。'),
('杜甫', '唐', '唐代伟大的现实主义诗人，被后人誉为"诗圣"。'),
('苏轼', '宋', '北宋文学家、书画家，唐宋八大家之一。'),
('李清照', '宋', '宋代著名女词人，婉约派代表。');

INSERT INTO categories (name, description) VALUES
('唐诗', '唐代诗歌作品'),
('宋词', '宋代词作品'),
('元曲', '元代曲作品'),
('古诗', '古代诗歌作品');

INSERT INTO poems (title, content, author_id, category_id, dynasty, tags) VALUES
('静夜思', '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。', 
 (SELECT id FROM authors WHERE name = '李白'),
 (SELECT id FROM categories WHERE name = '唐诗'),
 '唐', '{"思乡", "月亮"}'),

('春晓', '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。', 
 (SELECT id FROM authors WHERE name = '孟浩然'),
 (SELECT id FROM categories WHERE name = '唐诗'),
 '唐', '{"春天", "自然"}'),

('水调歌头', '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。', 
 (SELECT id FROM authors WHERE name = '苏轼'),
 (SELECT id FROM categories WHERE name = '宋词'),
 '宋', '{"月亮", "思念"}');

-- 创建用于搜索的全文搜索索引
CREATE INDEX IF NOT EXISTS idx_poems_content_search ON poems USING gin(to_tsvector('chinese', content));
CREATE INDEX IF NOT EXISTS idx_poems_title_search ON poems USING gin(to_tsvector('chinese', title));