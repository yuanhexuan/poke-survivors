# Poké World Survivors

## 项目

《吸血鬼幸存者》（Vampire Survivors）的宝可梦主题克隆版。技术栈：Phaser 3.90 + TypeScript + Vite。

## 绝对规则：永不提交

- **绝不**执行 `git commit`、`git add`、`git push` 或任何破坏性 git 操作。
- 所有提交均由用户手动完成。本规则适用于所有智能体，包括 Ralph。

## 必备技能

- 处理本项目时始终使用 `/game-development` 技能
- 视觉素材请参考记忆文件 `pokemon-resources.md`

## Ralph（自主开发）

- **创建 PRD：** `/prd` → 回答问题 → 保存为 `tasks/prd-[nome].md`
- **转换为 Ralph 格式：** `/ralph` → 将 PRD 转换为 `scripts/ralph/prd.json`
- **运行：** `npm run ralph`（10 轮迭代）或 `npm run ralph:20`（20 轮迭代）
- **会话内运行：** `/ralph-loop` 在当前会话中运行
- **质量门：** 每轮迭代自动运行 `npx tsc --noEmit`
- **PRD 存放位置：** `tasks/prd-[feature-name].md`

## 架构

- `BootScene` → 加载全部资源 → `TitleScene` → `SelectScene` → `GameScene` + `UIScene`
- 攻击实现 `Attack` 接口（type、level、update、upgrade、destroy）
- 配置集中在 `src/config.ts`，类型定义在 `src/types.ts`
- 精灵拆分：`src/data/sprites/starters.ts`（可玩角色）与 `src/data/sprites/enemies.ts`（野生/Boss）
- 敌人组织在 `src/data/enemies/`，包含独立配置 + `phases/phase1.ts`（20 波，10 分钟）
- Boss：`src/entities/Boss.ts` 继承 `Enemy`，拥有特殊攻击（charge、fan、aoe-tremor、aoe-land）
- 接触中毒系统（阿柏蛇 Ekans）在 `Player.ts` 中实现
- 扭蛋箱：Boss 掉落 → UIScene 覆盖层 → 随机奖励
- 程序化 SFX 通过 Web Audio API（`src/audio/SoundManager.ts`）
- **共享池 `enemyProjectiles`**：Phaser Group（maxSize 60），在所有敌人/Boss 之间复用。`Group.get()` 回收精灵，**不会**切换纹理。**必须**：在每个获取精灵的位置调用 `setTexture(key)` + `body.reset(x,y)` + `play(animKey)`。

## 规则

- 不使用 `any` —— TypeScript 严格模式
- 不使用需要 CORS 代理的外部素材
- 物品与升级必须使用真实宝可梦游戏中的物品精灵（PokeAPI），而非通用表情符号
- 保持与宝可梦宇宙一致：招式名、物品名和机制应忠实于原作
- 程序化纹理（`graphics.generateTexture()`）用于地图瓦片、XP 宝石、拾取物和较小特效

---

## 素材来源

### 1. 宝可梦精灵（行走/待机）—— PMDCollab/SpriteCollab

- **仓库：** https://github.com/PMDCollab/SpriteCollab
- **网站：** https://sprites.pmdcollab.org/
- **格式：** PNG 精灵表，8 方向行走，每个方向为一行
- **直链：** `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/{DEX_NUMBER}/Walk-Anim.png`
- **图鉴编号：** 妙蛙种子=0001、小火龙=0004、杰尼龟=0007、波波=0016、小拉达=0019、烈雀=0021、阿柏蛇=0023、尼多王=0034、胖丁=0039、超音蝠=0041、大嘴蝠=0042、走路草=0043、猴怪=0056、凯西=0063、腕力=0066、小拳石=0074、鬼斯=0092、鬼斯通=0093、伊布=0133、鲤鱼王=0129、卡比兽=0143、梦幻=0151
- **本地文件夹：** `public/assets/pokemon/`
- **文件：**
  - `charmander-walk.png`（32x32，4 帧，8 方向）
  - `charmeleon-walk.png`（24x32，4 帧，8 方向）
  - `charizard-walk.png`（40x48，4 帧，8 方向）
  - `bulbasaur-walk.png`（40x40，6 帧，8 方向）
  - `squirtle-walk.png`（32x32，4 帧，8 方向）
  - `rattata-walk.png`（48x40，7 帧，8 方向）
  - `pidgey-walk.png`（32x32，5 帧，8 方向）
  - `zubat-walk.png`（32x56，8 帧，8 方向）
  - `geodude-walk.png`（32x32，4 帧，8 方向）
  - `gastly-walk.png`（48x64，12 帧，8 方向）
  - `caterpie-walk.png`（32x32，4 帧，8 方向）
  - `weedle-walk.png`（32x32，4 帧，8 方向）
  - `spearow-walk.png`（32x40，5 帧，8 方向）
  - `ekans-walk.png`（40x48，6 帧，8 方向）
  - `oddish-walk.png`（24x40，8 帧，8 方向）
  - `mankey-walk.png`（32x56，8 帧，8 方向）
  - `haunter-walk.png`（32x56，10 帧，8 方向）
  - `machop-walk.png`（24x32，4 帧，8 方向）
  - `golbat-walk.png`（40x64，8 帧，8 方向）
  - `raticate-walk.png`（40x48，6 帧，8 方向）
  - `arbok-walk.png`（40x56，6 帧，8 方向）
  - `nidoking-walk.png`（40x48，4 帧，8 方向）
  - `snorlax-walk.png`（32x48，4 帧，8 方向）
- **添加新宝可梦：**
  1. 查找图鉴编号（例如皮卡丘 = 0025）
  2. 下载：`https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/0025/Walk-Anim.png`
  3. **必须：** 下载 AnimData.xml：`curl "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/{DEX}/AnimData.xml"`，并使用 Walk 段落中的 FrameWidth/FrameHeight/Duration count（**不要**通过图片手动计算 —— 帧可能带 padding）
  4. 添加到 `config.ts` 中的 `SPRITES`，并在 `BootScene` 中加载

### 2. 官方立绘（标题画面）—— PokeAPI

- **仓库：** https://github.com/PokeAPI/sprites
- **URL：** `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{ID}.png`
- **ID：** 妙蛙种子=1、小火龙=4、杰尼龟=7、皮卡丘=25 等
- **本地文件夹：** `public/assets/artwork/`
- **文件：** `charmander.png`、`squirtle.png`、`bulbasaur.png`
- **下载新图片：** `curl -o artwork/{nome}.png "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{ID}.png"`

### 3. 物品精灵（升级/UI）—— PokeAPI

- **URL：** `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/{nome-do-item}.png`
- **尺寸：** 约 30x30px（在 Phaser 中使用 `setScale(2)`）
- **本地文件夹：** `public/assets/items/`
- **文件及用途：**
  - `flame-orb.png` → “新火系攻击”图标（newFireSpin、newFlamethrower）
  - `pp-up.png` → “攻击升级”图标（upgradeEmber、upgradeFireSpin、upgradeFlame）
  - `leftovers.png` → “+最大 HP”图标（maxHpUp）
  - `quick-claw.png` → “+速度”图标（speedUp）
  - `magnet.png` → “+XP 吸附范围”图标（magnetUp）
  - `charcoal.png` → 持有道具木炭（+火属性伤害）
  - `wide-lens.png` → 持有道具广角镜（+范围）
  - `choice-specs.png` → 持有道具讲究眼镜（+特攻）
  - `fire-stone.png` → “攻击进化”图标（evolveInferno、evolveFireBlast、evolveBlastBurn）
- **下载新物品：** `curl -o items/{nome}.png "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/{nome}.png"`
- **完整物品列表：** https://pokeapi.co/api/v2/item/（名称使用 kebab-case）
- **高清替代（32x32）：** https://github.com/msikma/pokesprite → `items/hold-item/{nome}.png`

### 4. 攻击精灵（弹道/特效）—— pokemonAutoChess

- **仓库：** https://github.com/keldaanCommunity/pokemonAutoChess
- **Abilities（特定招式）：** `app/public/src/assets/abilities{tps}/{NOME_ATAQUE}/`
  - 每个招式一个文件夹，内含独立帧：`000.png`、`001.png`、`002.png`...
  - **URL：** `https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/main/app/public/src/assets/abilities%7Btps%7D/{NOME_ATAQUE}/{NNN}.png`
  - **注意：** URL 中的 `{tps}` 需编码为 `%7Btps%7D`
- **Attacks（按属性分类的通用特效）：** `app/public/src/assets/attacks{tps}/{TIPO}/{subtipo}/`
  - 子类型：`cell`（地面）、`hit`（命中）、`melee`（近战）、`range`（弹道）
  - **URL：** `https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/main/app/public/src/assets/attacks%7Btps%7D/{TIPO}/{subtipo}/{NNN}.png`
- **本地文件夹：** `public/assets/attacks/`
- **已拼合的精灵表（水平帧）：**
  - `ember-sheet.png` — 9 帧，26x26（火花/炼狱弹道）
  - `fire-range-sheet.png` — 16 帧，40x40（火焰旋涡/大字爆炎的火球）
  - `fire-hit-sheet.png` — 4 帧，32x32（火焰命中特效）
  - `flamethrower-sheet.png` — 16 帧，80x96（喷射火焰柱）
  - `fire-blast-sheet.png` — 12 帧，72x73（大字爆炎星形）
  - `blast-burn-sheet.png` — 15 帧，80x80（爆炸烈焰爆炸）
  - `bite-sheet.png` — 12 帧，32x48（Boss 拉达 — 必杀门牙/BITE）
  - `venoshock-sheet.png` — 13 帧，32x80（通用毒液冲击 VENOSHOCK）
  - `thrash-sheet.png` — 7 帧，48x32（Boss 尼多王 — 暴乱/THRASH）
  - `stomp-sheet.png` — 10 帧，16x16（Boss 卡比兽 — 泰山压顶/STOMP）
  - `wave-splash-sheet.png` — 9 帧，32x32（泡泡 — WAVE_SPLASH）
  - `sparkling-aria-sheet.png` — 44 帧，64x64（泡沫光线 — SPARKLING_ARIA）
  - `water-melee-sheet.png` — 8 帧，56x56（热水 — WATER/melee）
  - `origin-pulse-sheet.png` — 4 帧，128x32（喷水 — ORIGIN_PULSE）
  - `water-cell-sheet.png` — 7 帧，64x32（WATER/cell — 可用但未使用）
- **`poison-dark/` 文件夹**（毒/恶属性精灵，可直接使用）：
  - `gunk-shot-sheet.png` — 45 帧，32x32（Boss 阿柏怪 — 垃圾射击）
  - `cross-poison-sheet.png` — 6 帧，32x32
  - `sludge-wave-sheet.png` — 8 帧，32x32
  - `smog-sheet.png` — 9 帧，50x50
  - `screech-sheet.png` — 7 帧，32x32
  - `iron-tail-sheet.png` — 7 帧，40x40
  - `acid-spray-sheet.png` — 32 帧，80x80
  - `night-slash-sheet.png` — 15 帧，56x64
  - `poison-hit-sheet.png` — 5 帧，32x32
  - `poison-melee-sheet.png` — 11 帧，56x64
  - `poison-range-sheet.png` — 4 帧，16x16
  - `dark-hit-sheet.png` — 13 帧，64x62
  - `dark-melee-sheet.png` — 7 帧，64x64
  - `dark-range-sheet.png` — 6 帧，32x32
- **添加新攻击：**
  1. 在仓库中查找名称（例如 `WATER_GUN`、`THUNDER_SHOCK`、`RAZOR_LEAF`）
  2. 下载帧：`for i in $(seq 0 N); do f=$(printf "%03d" $i); curl -o "${f}.png" "https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/main/app/public/src/assets/abilities%7Btps%7D/{NOME}/${f}.png"; done`
  3. 使用 `sharp` 拼合水平精灵表（临时安装：`npm i -D sharp`）
  4. 在 `BootScene` 中作为精灵表加载并创建动画
- **340+ 可用招式**，包括：WATER_GUN、HYDRO_PUMP、THUNDER、THUNDERBOLT、RAZOR_LEAF、SOLAR_BEAM、ICE_BEAM、PSYCHIC、SHADOW_BALL 等。

### 5. 程序化纹理（运行时生成）

在 `BootScene.generateTextures()` 中生成 —— 不需要外部文件：

- 地图瓦片：`tile-grass-1`、`tile-grass-2`、`tile-flowers`、`tile-dirt`、`tile-rock`、`tile-water`、`tile-tree`
- 粒子：`fire-particle`
- 经验值：`xp-gem`
- 阴影：`shadow`
- 可破坏物：`dest-tall-grass`、`dest-berry-bush`、`dest-rock`、`dest-chest`
- 拾取物：`pickup-oran`、`pickup-magnet`、`pickup-candy`、`pickup-bomb`
- 持有道具（HUD 缩略图）：`held-charcoal`、`held-wide-lens`、`held-choice-specs`
- Boss 掉落：`gacha-box`（金色精灵球 32x32）
- 碎片（标题画面）：`shard-fire`、`shard-water`、`shard-grass`、`shard-gold`

### 6. 精灵参考网站

- **The Spriters Resource：** https://www.spriters-resource.com/ —— 海量官方游戏 rip 精灵库。搜索 “Pokémon” 可找到各世代的精灵，包括大地图、战斗、菜单、物品等。
- **PMDCollab Sprite Explorer：** https://sprites.pmdcollab.org/#/ —— 可视化浏览全部 PMDCollab（宝可梦不可思议迷宫）精灵。支持按名称/图鉴搜索、查看动画（Walk、Idle、Attack 等）、检查Alternate形态（mega、shiny、gender）并下载精灵表。**尝试通过 URL 下载前，先用此网站确认精灵是否存在。**

### 7. SFX（程序化 —— 无文件）

通过 `SoundManager`（`src/audio/SoundManager.ts`）使用 Web Audio API 生成。
没有音频文件 —— 所有音效均在运行时使用 `OscillatorNode` + `GainNode` 合成。
