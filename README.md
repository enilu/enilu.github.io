# enilu的blog

- 评论系统采用Disqus

## AI Agent Guide（统一入口）

维护文章时沿用 `_posts/年份/YYYY-MM-DD-标题.md`、Jekyll front matter、`<!--break-->` 摘要分隔及现有分类、标签约定。

### 中英文写作

- 写作入口使用聚合工作区 `doc/ai/skills/common/blog-bilingual-writing/SKILL.md`。新文章默认同时完成中文原稿和完整英文译文；修改已有双语文章时同步英文，不等用户另行提醒。用户明确只要中文或仅讨论提纲时按本次范围执行。
- 中文保留在 `_posts/`，原地址不变；英文保存到 `_english/<英文标识>.md`，设 `lang: en`、`date` 及明确的 `/en/YYYY/MM/DD/<英文标识>/` permalink。
- 一组译文共享唯一的 `translation_key`。中文显式设 `lang: zh-CN`；历史文章不必批量修改，默认中文。导航优先跳转对应译文，无译文则进入另一语言首页。
- 新文章先完成中文，再翻译正文、摘要和必要的解释性注释；命令、代码、路径和配置键保持原样。仅介绍英文版本已支持的能力，不编造原文没有的结论。
- 英文稿记录 `source_sha256`。完成译文校对后运行 `python scripts/check_translations.py --mark-reviewed _english/<英文标识>.md`；日常运行 `python scripts/check_translations.py` 检查配对、重复标识和译文是否落后于中文。不得为通过检查而未校对就刷新指纹。
- 中文更新时同步英文并重新校对；也可以暂留旧译文，但检查会报告过期。不要自动发布未完成的译文。
- `/`、`/archive`、`/atom.xml`、`/rss.xml` 只包含中文文章；英文分别使用 `/en/`、`/en/archive/`、`/en/atom.xml`、`/en/rss.xml`。两种语言评论按各自 URL 分开，中文历史评论标识不变。
- 构建前执行译文检查；然后在本地验证两版正文、代码、互链、canonical、hreflang、订阅源和站点地图。

### 同步微信公众号

用户说“将文章发布到公众号”时，使用聚合工作区 Skill `wechat-blog-draft`，默认仅创建或更新公众号草稿箱，不正式发表或群发。目标优先使用当前会话正在维护的文章；无法唯一确定时再询问。

双语文章默认按 `translation_key` 选择中文原稿，同一篇文章继续使用原草稿映射；除非用户明确要求，不向公众号发送英文译文。

Skill 入口位于聚合工作区的 `doc/ai/skills/common/wechat-blog-draft/SKILL.md`。固定私有配置为聚合工作区内的 `config/wechat-blog.local/config.json`，草稿映射为同目录 `state.json`；该配置目录已加入 Git 忽略。脚本读取密钥，不将配置内容输出或放进博客仓库。

同步前生成排版预览，同步后回读验证标题、正文、代码行、缩进和列表编号。同一文章复用原草稿；接口异常时先核实结果，避免重复创建。排版转换及已遇问题的处理详见该 Skill 的 `SKILL.md` 和 `references/pitfalls.md`。
