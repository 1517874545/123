-- 添加著名诗词数据到数据库

-- 首先添加作者
INSERT INTO authors (name, dynasty, description) VALUES
('李白', '唐代', '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。'),
('杜甫', '唐代', '唐代伟大的现实主义诗人，被后人誉为"诗圣"。'),
('苏轼', '宋代', '北宋文学家、书画家，唐宋八大家之一。'),
('李清照', '宋代', '宋代著名女词人，婉约派代表。'),
('王维', '唐代', '唐代著名诗人、画家，被誉为"诗佛"。'),
('白居易', '唐代', '唐代伟大的现实主义诗人，新乐府运动倡导者。'),
('孟浩然', '唐代', '唐代著名的山水田园诗人。'),
('杜牧', '唐代', '晚唐著名诗人，与李商隐并称"小李杜"。'),
('李商隐', '唐代', '晚唐著名诗人，诗歌风格独特。'),
('王安石', '宋代', '北宋著名政治家、文学家，唐宋八大家之一。'),
('王之涣', '唐代', '唐代著名边塞诗人，代表作《登鹳雀楼》。'),
('柳宗元', '唐代', '唐代文学家、哲学家，唐宋八大家之一。'),
('孟郊', '唐代', '唐代诗人，以苦吟著称。'),
('张继', '唐代', '唐代诗人，代表作《枫桥夜泊》。'),
('王昌龄', '唐代', '唐代著名边塞诗人。'),
('李绅', '唐代', '唐代诗人，新乐府运动参与者。');

-- 添加分类
INSERT INTO categories (name, description, color) VALUES
('唐诗', '唐代诗歌作品', '#2c5aa0'),
('宋词', '宋代词作品', '#c62f2f'),
('山水田园', '描写自然风光的诗歌', '#4a7c59'),
('边塞诗', '描写边塞生活和战争的诗歌', '#d4af37'),
('爱情诗', '描写爱情的诗歌', '#8e44ad'),
('咏物诗', '描写物品的诗歌', '#16a085'),
('送别诗', '送别友人的诗歌', '#e67e22'),
('怀古诗', '怀念古代人事的诗歌', '#34495e');

-- 添加著名诗词
INSERT INTO poems (title, content, author_id, category_id, dynasty, tags) VALUES
('静夜思', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', 
 (SELECT id FROM authors WHERE name = '李白'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"思乡", "明月", "夜晚"}'),

('春晓', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', 
 (SELECT id FROM authors WHERE name = '孟浩然'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"春天", "自然", "清晨"}'),

('登鹳雀楼', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。', 
 (SELECT id FROM authors WHERE name = '王之涣'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"登高", "壮丽", "哲理"}'),

('水调歌头·明月几时有', '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。', 
 (SELECT id FROM authors WHERE name = '苏轼'), 
 (SELECT id FROM categories WHERE name = '宋词'), 
 '宋代', '{"中秋", "明月", "思念"}'),

('声声慢·寻寻觅觅', '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。', 
 (SELECT id FROM authors WHERE name = '李清照'), 
 (SELECT id FROM categories WHERE name = '宋词'), 
 '宋代', '{"忧愁", "思念", "秋天"}'),

('相思', '红豆生南国，春来发几枝。愿君多采撷，此物最相思。', 
 (SELECT id FROM authors WHERE name = '王维'), 
 (SELECT id FROM categories WHERE name = '爱情诗'), 
 '唐代', '{"相思", "爱情", "红豆"}'),

('春望', '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。', 
 (SELECT id FROM authors WHERE name = '杜甫'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"忧国", "思乡", "战争"}'),

('赋得古原草送别', '离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。远芳侵古道，晴翠接荒城。又送王孙去，萋萋满别情。', 
 (SELECT id FROM authors WHERE name = '白居易'), 
 (SELECT id FROM categories WHERE name = '送别诗'), 
 '唐代', '{"送别", "自然", "生命"}'),

('清明', '清明时节雨纷纷，路上行人欲断魂。借问酒家何处有？牧童遥指杏花村。', 
 (SELECT id FROM authors WHERE name = '杜牧'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"清明", "春天", "酒家"}'),

('无题', '相见时难别亦难，东风无力百花残。春蚕到死丝方尽，蜡炬成灰泪始干。', 
 (SELECT id FROM authors WHERE name = '李商隐'), 
 (SELECT id FROM categories WHERE name = '爱情诗'), 
 '唐代', '{"爱情", "离别", "思念"}'),

('泊船瓜洲', '京口瓜洲一水间，钟山只隔数重山。春风又绿江南岸，明月何时照我还？', 
 (SELECT id FROM authors WHERE name = '王安石'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '宋代', '{"思乡", "江南", "春天"}'),

('望庐山瀑布', '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。', 
 (SELECT id FROM authors WHERE name = '李白'), 
 (SELECT id FROM categories WHERE name = '山水田园'), 
 '唐代', '{"瀑布", "自然", "壮丽"}'),

('江雪', '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。', 
 (SELECT id FROM authors WHERE name = '柳宗元'), 
 (SELECT id FROM categories WHERE name = '山水田园'), 
 '唐代', '{"冬天", "孤独", "自然"}'),

('游子吟', '慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。', 
 (SELECT id FROM authors WHERE name = '孟郊'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"母爱", "亲情", "感恩"}'),

('枫桥夜泊', '月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。', 
 (SELECT id FROM authors WHERE name = '张继'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"夜晚", "忧愁", "苏州"}'),

('黄鹤楼送孟浩然之广陵', '故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。', 
 (SELECT id FROM authors WHERE name = '李白'), 
 (SELECT id FROM categories WHERE name = '送别诗'), 
 '唐代', '{"送别", "友情", "长江"}'),

('题西林壁', '横看成岭侧成峰，远近高低各不同。不识庐山真面目，只缘身在此山中。', 
 (SELECT id FROM authors WHERE name = '苏轼'), 
 (SELECT id FROM categories WHERE name = '山水田园'), 
 '宋代', '{"哲理", "庐山", "观察"}'),

('出塞', '秦时明月汉时关，万里长征人未还。但使龙城飞将在，不教胡马度阴山。', 
 (SELECT id FROM authors WHERE name = '王昌龄'), 
 (SELECT id FROM categories WHERE name = '边塞诗'), 
 '唐代', '{"边塞", "战争", "爱国"}'),

('悯农', '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。', 
 (SELECT id FROM authors WHERE name = '李绅'), 
 (SELECT id FROM categories WHERE name = '唐诗'), 
 '唐代', '{"农民", "劳动", "珍惜"}'),

('鹿柴', '空山不见人，但闻人语响。返景入深林，复照青苔上。', 
 (SELECT id FROM authors WHERE name = '王维'), 
 (SELECT id FROM categories WHERE name = '山水田园'), 
 '唐代', '{"自然", "寂静", "山林"}');