# 🎯 点击问号跳转测试指南

## 修复内容

### 1️⃣ 增强点击事件
- ✅ 从 `<div>` 改为 `<button>`（更好的点击支持）
- ✅ 增加 z-index 到 9999（确保在最上层）
- ✅ 增大点击区域到 48x48px（更容易点击）
- ✅ 添加详细的控制台日志
- ✅ 阻止事件冒泡（`e.stopPropagation()`）

### 2️⃣ 调试控制面板
- ✅ 开发模式下右上角显示调试按钮
- ✅ 点击"触发 conversing"可立即测试气泡点击

---

## 🧪 测试步骤

### 方法 1：使用调试面板（推荐）

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问生活层页面**：
   ```
   http://localhost:3000/train/life/test-session?carriage=tech
   ```

3. **点击右上角的调试按钮**：
   - 看到 "触发 conversing (测试点击)" 按钮
   - 点击后，前两个 Agent 会显示 `!` 气泡

4. **点击气泡**：
   - 应该看到控制台输出：
     ```
     🎯 点击气泡！Agent ID: agent_1
     🚀 准备跳转到: /terminal/agent_1
     ✅ router.push 成功
     ```
   - 页面跳转到 `/terminal/agent_1`

---

### 方法 2：等待自然触发

1. 启动服务器并访问生活层

2. 等待 Agents 移动并相遇
   - 大约 5-10 秒后会有 Agent 相遇
   - 控制台输出：
     ```
     💬 Agent 进入 conversing 状态: agent_2
     ✅ Agent agent_2 显示气泡
     ```

3. 点击跳动的 `!` 气泡

---

## 🐛 如果点击无效

### 检查清单

1. **检查浏览器控制台**：
   - 是否有 `🎯 点击气泡！` 日志？
   - 如果没有 → 点击事件没有触发
   - 如果有 → 跳转逻辑有问题

2. **检查气泡是否显示**：
   - 控制台应该有 `✅ Agent xxx 显示气泡`
   - 如果看到 `❌ Agent xxx 状态为 xxx，不显示气泡` → 状态错误

3. **检查图片加载**：
   - 应该看到 `✅ question.png 加载成功`
   - 如果看到 `❌ question.png 加载失败` → 文件路径错误

4. **检查 router.push**：
   - 应该看到 `✅ router.push 成功`
   - 如果看到 `❌ router.push 失败` → Next.js 路由问题

---

## 🔧 快速修复

### 问题：气泡没有显示
**解决**：使用调试面板强制触发 conversing 状态

### 问题：点击没反应
**解决**：
1. 检查是否有其他元素遮挡（z-index 问题）
2. 检查浏览器控制台是否有 JavaScript 错误
3. 尝试使用调试面板手动触发

### 问题：跳转失败
**解决**：
1. 确认 `/terminal/[agentId]` 路由存在
2. 检查控制台的 router.push 错误信息
3. 尝试手动访问 `/terminal/agent_1` 测试路由

---

## 📊 成功标志

点击气泡后应该看到：

```
🎯 点击气泡！Agent ID: agent_1
🚀 准备跳转到: /terminal/agent_1
✅ router.push 成功
```

并且页面跳转到终端页面。
