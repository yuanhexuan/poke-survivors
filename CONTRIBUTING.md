# 为 Poké World Survivors 做贡献

感谢你愿意贡献！本指南将帮助你快速上手。

## 本地环境搭建

```bash
# 1. Fork 并克隆

git clone https://github.com/SEU_USUARIO/poke-survivors.git
cd poke-survivors

# 2. 安装依赖

npm install

# 3. 启动开发服务器

npm run dev
# 访问 http://localhost:8080

# 4.（可选）通过 Tauri 运行桌面版 —— 需要 Rust

npm run tauri:dev
```

## 项目结构

```
src/
├── attacks/       # 每个攻击一个文件（implements Attack interface）
├── audio/         # 程序化音效（Web Audio API）
├── data/          # 攻击、敌人、物品、精灵的配置
├── entities/      # Player、Enemy、Boss、Pickup
├── scenes/        # Boot、Title、Select、Game、UI
├── systems/       # Collision、Spawn、Pickup、SpatialHashGrid
├── config.ts      # 全局常量
└── types.ts       # TypeScript 类型

public/assets/     # 精灵、立绘、物品等静态资源
```

## 如何贡献

### 1. 报告 Bug

提交一个 [issue](https://github.com/giovanneluna/poke-survivors/issues/new?template=bug_report.md)，包含：

- 实际发生了什么 vs 应该发生什么
- 复现步骤
- 如有可能，附上截图/GIF

### 2. 建议新功能

提交一个 [issue](https://github.com/giovanneluna/poke-survivors/issues/new?template=feature_request.md)，描述你的想法。

### 3. 贡献代码

```bash
# 创建分支

git checkout -b feat/minha-feature

# 进行修改...

# 检查类型

npx tsc --noEmit

# 提交并推送

git add .
git commit -m "feat: descrição curta"
git push origin feat/minha-feature
```

然后在 GitHub 上发起 Pull Request。

### 4. 贡献美术/精灵

宝可梦精灵必须遵循 PMDCollab 格式（行走精灵表，8 方向）。详见下方[添加新宝可梦](#添加新宝可梦)。

## 专项指南

### 添加新攻击

1. 在 `src/data/attacks/attack-registry.ts` 中**注册**
2. 在 `src/attacks/MeuAtaque.ts` 中**创建**文件（implements `Attack`）
3. 在 `src/systems/AttackFactory.ts` 中**注册**
4. 在 `src/data/items/upgrade-defs.ts` 中**添加**为升级项
5. 在 `src/scenes/BootScene.ts` 中**加载**精灵

共有 6 种攻击模板，选择最相似的作为起点：

- **弹道**：`Ember.ts`、`WaterGun.ts`
- **锥形/近战**：`Scratch.ts`、`DragonBreath.ts`
- **环绕**：`FireSpin.ts`、`RapidSpin.ts`
- **光环/被动**：`Smokescreen.ts`、`Growl.ts`
- **冲刺**：`FlameCharge.ts`、`AquaJet.ts`
- **范围/终极**：`Hurricane.ts`、`FrenzyPlant.ts`

### 添加新宝可梦（敌人）

1. **下载精灵：**

   ```bash
   # 查找图鉴编号（例如皮卡丘 = 0025）
   curl -o public/assets/pokemon/pikachu-walk.png \
     "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/0025/Walk-Anim.png"

   # 必须：下载 AnimData.xml 以获取正确尺寸
   curl "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/0025/AnimData.xml"
   ```

2. 在 `src/data/sprites/enemies.ts` 中**注册**精灵
3. 在 `src/scenes/BootScene.ts` 中**加载**
4. 在 `src/data/enemies/pikachu.ts` 中**创建**配置
5. 在 `src/data/enemies/phases/` 的对应阶段中**添加**

> **绝不要**通过手动除以图片尺寸来计算帧大小。始终使用 `AnimData.xml`。

### 添加新阶段

在 `src/data/enemies/phases/phase5.ts` 创建文件，遵循以下模式：

```typescript
import type { PhaseConfig } from '../../../types';

export const PHASE5: PhaseConfig = {
  waves: [
    {
      enemies: [
        { type: 'pikachu', weight: 3 },
        { type: 'jigglypuff', weight: 1 },
      ],
      spawnRate: 300,
      maxEnemies: 25,
    },
    // ... 更多波次
  ],
  bosses: [
    { type: 'raichu', timeSeconds: 180 },
  ],
};
```

## 代码规范

### TypeScript 严格模式

- **零 `any`** —— 使用 `unknown` + 类型守卫
- 返回值和参数**显式标注类型**
- 提交前**始终**运行 `npx tsc --noEmit`

### 强制模式

```typescript
// 粒子 —— 始终使用 safeExplode（防止泄漏）
import { safeExplode } from '../utils/particles';
safeExplode(scene, x, y, 'fire-particle', { quantity: 10, lifespan: 300 });

// Body 空安全 —— 始终检查
const body = enemy.body as Phaser.Physics.Arcade.Body | null;
if (body) body.setVelocity(0, 0);

// 敌人查询 —— 绝不要遍历 getChildren()，应使用 SpatialHashGrid
import { getSpatialGrid } from '../systems/SpatialHashGrid';
const nearby = getSpatialGrid().queryRadius(x, y, radius);

// VFX —— 始终遵守画质设置
import { shouldShowVfx } from '../systems/GraphicsSettings';
if (shouldShowVfx()) { /* 粒子、拖尾 */ }

// 弹道池 —— 复用时必须设置纹理
const proj = enemyProjectiles.get(x, y);
proj.setTexture('minha-textura');
(proj.body as Phaser.Physics.Arcade.Body).reset(x, y);
```

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: novo ataque Thunder Shock
fix: projétil ficando preso na parede
art: sprite do Pikachu walk
balance: ajustar dano do Ember level 5-8
docs: atualizar README com nova fase
```

## 有疑问？

- 发起一个 [Discussion](https://github.com/giovanneluna/poke-survivors/discussions)
- 加入 [Discord](https://discord.gg/pFqPHV5zZ2)
