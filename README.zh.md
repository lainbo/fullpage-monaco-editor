# 全屏 Monaco Editor

一个轻量级的全屏 Monaco Editor 实现，支持通过 URL 参数配置编辑器。可以显示普通编辑器或差异（对比）编辑器。

## 功能特点

- 快速加载 Monaco Editor
- 全屏显示
- 通过 URL 参数配置编辑器
- 支持普通编辑器和差异编辑器两种模式
- 轻量、快速

## 支持的 URL 参数

### 通用参数

以下参数在两种编辑器模式下都有效：

- `theme`: 编辑器主题 ('vs', 'vs-dark', 'hc-black', 'hc-light')
- `fontSize`: 字体大小 (数字)
- `editorType`: 编辑器类型 ('normal' 或 'diff')
- `language`: 编辑器语言 (如 'javascript', 'typescript', 'html' 等)
- `wordWrap`: 自动换行 ('on', 'off', 'wordWrapColumn', 'bounded')
- `minimap`: 是否显示小地图 ('true', 'false')

### 差异编辑器特有参数

当 `editorType=diff` 时，以下参数有效：

- `originalEditable`: 是否允许编辑原始文本 ('true', 'false')
- `renderSideBySide`: 是否并排显示 ('true', 'false')，为 false 时显示为内联模式

## 使用示例

### 普通编辑器

```
http://localhost:5173/?theme=vs-dark&fontSize=18&editorType=normal&wordWrap=on&minimap=false&language=javascript
```

### 差异编辑器

```
http://localhost:5173/?theme=vs-dark&fontSize=18&editorType=diff&originalEditable=true&renderSideBySide=true&language=javascript
```

## 特殊说明

- `fontSize`、`theme` 和 `language` 参数始终会显示在 URL 中，即使用户没有指定它们
- `language` 参数始终位于 URL 的最末尾
- 所有参数都不区分大小写

## 技术栈

- TypeScript
- Vite
- Monaco Editor

## 开发

```bash
# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
``` 
