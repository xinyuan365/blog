# 取消 Supabase 密码长度限制

## 在 Supabase 控制台修改密码策略

按照以下步骤取消或修改密码长度限制：

### 详细步骤

1. **登录 Supabase Dashboard**
   - 访问 [https://app.supabase.com](https://app.supabase.com)
   - 使用你的账号登录

2. **选择项目**
   - 在项目列表中选择你的项目（Project URL: `https://iistfncnfdrrrqkjivbj.supabase.co`）

3. **进入认证设置**
   - 在左侧菜单中，点击 **Authentication**（认证）
   - 然后点击 **Settings**（设置）标签页

4. **修改密码长度要求**
   - 在设置页面中找到 **Password**（密码）部分
   - 找到 **Minimum password length**（最小密码长度）选项
   - 将值从默认的 **6** 改为 **1**（或你想要的任何值）

5. **保存更改**
   - 点击页面底部的 **Save**（保存）按钮
   - 等待设置生效（通常立即生效）

### 路径总结

```
Supabase Dashboard 
  → 选择项目 
  → Authentication 
  → Settings 
  → Password 
  → Minimum password length: 改为 1
  → Save
```

## 注意事项

⚠️ **安全提醒**：
- 降低密码长度限制会降低账户安全性
- 建议仅在开发环境或测试环境中使用短密码
- 生产环境建议保持至少 6 个字符的限制
- 如果必须使用短密码，建议启用其他安全措施（如双因素认证）

## 验证修改

修改后，你可以尝试使用短密码（如 "123"）注册新账号来验证设置是否生效。

