import './style.css'
import * as monaco from 'monaco-editor'

// 确保 Monaco 加载完成后初始化编辑器
window.onload = () => {
  // 1. 定义默认配置
  const defaultConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
    language: 'plaintext',
    theme: 'vs', // 默认亮色主题
    fontSize: 20,
    wordWrap: 'on',
    automaticLayout: true, // 自动适应容器大小
    fontFamily: '"JetBrains Mono","HarmonyOS Sans SC","Cascadia Code","Consolas","Menlo","Twemoji Mozilla","monospace"',
    minimap: {
      enabled: true
    },
    scrollBeyondLastLine: true
  }

  // 定义差异编辑器特有的配置
  const defaultDiffConfig: monaco.editor.IDiffEditorOptions = {
    originalEditable: true, // 允许编辑原始文本
    renderSideBySide: true  // 并排显示
  }

  // 2. 读取 URL 参数
  const urlParams = new URLSearchParams(window.location.search)
  const urlConfig: Partial<monaco.editor.IStandaloneEditorConstructionOptions> = {} // 使用 Partial 允许部分覆盖
  const urlDiffConfig: Partial<monaco.editor.IDiffEditorOptions> = {} // diff编辑器配置

  // 保存language参数值，稍后会添加到URL末尾
  let languageValue = urlParams.get('language') || defaultConfig.language!.toString()
  // 先从URL中移除language参数（如果存在）
  urlParams.delete('language')

  // 检查editorType参数（控制是普通编辑器还是diff编辑器）
  let editorType = urlParams.get('editorType') || 'normal'
  if (editorType !== 'normal' && editorType !== 'diff') {
    editorType = 'normal' // 如果值无效，默认为普通编辑器
  }
  urlParams.delete('editorType') // 先移除，后面再添加到合适位置
  
  // 确保关键参数始终在URL中
  let needsUrlUpdate = false;

  // 检查并设置theme参数
  if (urlParams.has('theme')) {
    const theme = urlParams.get('theme')
    if (theme === 'vs' || theme === 'vs-dark' || theme === 'hc-black' || theme === 'hc-light') {
      urlConfig.theme = theme
    }
  } else {
    urlParams.set('theme', defaultConfig.theme!.toString())
    needsUrlUpdate = true
  }

  // 检查并设置fontSize参数
  if (urlParams.has('fontSize')) {
    const fontSize = parseInt(urlParams.get('fontSize')!, 10)
    if (!isNaN(fontSize) && fontSize > 0) {
      urlConfig.fontSize = fontSize
    }
  } else {
    urlParams.set('fontSize', defaultConfig.fontSize!.toString())
    needsUrlUpdate = true
  }

  if (urlParams.has('wordWrap')) {
    const wordWrap = urlParams.get('wordWrap')
    if (wordWrap === 'on' || wordWrap === 'off' || wordWrap === 'wordWrapColumn' || wordWrap === 'bounded') {
      urlConfig.wordWrap = wordWrap as monaco.editor.IEditorOptions['wordWrap']
    }
  }

  if (urlParams.has('minimap')) {
    const minimap = urlParams.get('minimap')
    if (minimap === 'true' || minimap === 'false') {
      urlConfig.minimap = {
        enabled: minimap === 'true'
      }
    }
  }

  // 检查diff编辑器特有的参数
  if (urlParams.has('originalEditable')) {
    const originalEditable = urlParams.get('originalEditable')
    if (originalEditable === 'true' || originalEditable === 'false') {
      urlDiffConfig.originalEditable = originalEditable === 'true'
    }
  }

  if (urlParams.has('renderSideBySide')) {
    const renderSideBySide = urlParams.get('renderSideBySide')
    if (renderSideBySide === 'true' || renderSideBySide === 'false') {
      urlDiffConfig.renderSideBySide = renderSideBySide === 'true'
    }
  }

  // 添加editorType参数（放在中间）
  urlParams.set('editorType', editorType)

  // 设置language参数值（放在最后）
  urlParams.set('language', languageValue)
  urlConfig.language = languageValue
  
  // 如果需要更新URL，添加参数但不刷新页面
  if (needsUrlUpdate) {
    const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`
    window.history.replaceState({}, '', newUrl)
  }

  // 3. 合并配置 (URL 参数优先)
  const finalConfig = { ...defaultConfig, ...urlConfig }
  const finalDiffConfig = { ...defaultDiffConfig }

  // 4. 初始化 Monaco Editor
  const editorContainer = document.getElementById('editor-main')
  if (editorContainer) {
    if (editorType === 'diff') {
      // 创建差异编辑器
      const diffEditor = monaco.editor.createDiffEditor(editorContainer, {
        ...finalConfig,
        ...finalDiffConfig
      })
      
      // 设置初始模型
      diffEditor.setModel({
        original: monaco.editor.createModel('', languageValue),
        modified: monaco.editor.createModel('', languageValue)
      })
      
      // 监听配置变更
      const modifiedEditor = diffEditor.getModifiedEditor()
      modifiedEditor.onDidChangeConfiguration(() => {
        updateUrlParams(modifiedEditor, editorType, languageValue)
      })
      
      // 监听语言变更
      modifiedEditor.onDidChangeModelLanguage((e) => {
        updateUrlParamsLanguage(e.newLanguage)
      })
    } else {
      // 创建普通编辑器
      const editor = monaco.editor.create(editorContainer, finalConfig)
      
      // 监听配置变更
      editor.onDidChangeConfiguration(() => {
        const currentOptions = editor.getOptions()
        updateUrlParams(editor, editorType, languageValue, currentOptions)
      })
      
      // 监听语言变更
      editor.onDidChangeModelLanguage((e) => {
        updateUrlParamsLanguage(e.newLanguage)
      })
    }
  }
}

// 更新URL参数（除了language）
function updateUrlParams(
  editor: monaco.editor.IStandaloneCodeEditor,
  editorType: string,
  languageValue: string,
  currentOptions?: monaco.editor.IComputedEditorOptions
) {
  // 获取当前URL参数
  const params = new URLSearchParams(window.location.search)
  
  // 保存当前language参数，然后删除它，稍后会添加到末尾
  params.delete('language')
  params.delete('editorType')
  
  // 更新其他关键参数
  const theme = params.get('theme') || 'vs'
  params.set('theme', theme)
  
  if (currentOptions) {
    params.set('fontSize', currentOptions.get(monaco.editor.EditorOption.fontSize).toString())
    
    // 添加可选参数
    const defaultWordWrap = 'on'
    if (currentOptions.get(monaco.editor.EditorOption.wordWrap) !== defaultWordWrap) {
      params.set('wordWrap', currentOptions.get(monaco.editor.EditorOption.wordWrap).toString())
    }
    
    const defaultMinimapEnabled = true
    if (currentOptions.get(monaco.editor.EditorOption.minimap).enabled !== defaultMinimapEnabled) {
      params.set('minimap', currentOptions.get(monaco.editor.EditorOption.minimap).enabled.toString())
    }
  }
  
  // 添加editorType参数
  params.set('editorType', editorType)
  
  // 最后设置language参数（确保它在URL的最末尾）
  params.set('language', editor.getModel()?.getLanguageId() || languageValue)
  
  // 更新URL但不刷新页面
  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  window.history.replaceState({}, '', newUrl)
}

// 更新URL中的language参数
function updateUrlParamsLanguage(newLanguage: string) {
  const params = new URLSearchParams(window.location.search)
  
  // 保存当前所有参数（除了language）
  const paramsObj: Record<string, string> = {}
  params.forEach((value, key) => {
    if (key !== 'language') {
      paramsObj[key] = value
    }
  })
  
  // 清空当前参数
  params.forEach((_, key) => {
    params.delete(key)
  })
  
  // 按原顺序添加回非language参数
  Object.keys(paramsObj).forEach(key => {
    params.set(key, paramsObj[key])
  })
  
  // 最后添加language参数
  params.set('language', newLanguage)
  
  // 更新URL但不刷新页面
  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  window.history.replaceState({}, '', newUrl)
}
