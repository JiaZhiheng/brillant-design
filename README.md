# GitHub Activity Bot

这是一个自动化GitHub活动的Python脚本，可以帮助你：
- 自动创建每日提交
- 随机创建GitHub Issues
- 填充历史提交记录

## 设置步骤

### 方法1：使用 GitHub Actions（推荐）

1. Fork 此仓库到你的账号下

2. 设置 GitHub Secrets：
   - 访问你的仓库设置：Settings -> Secrets and variables -> Actions
   - 添加以下 Secrets：
     - `GIT_USERNAME`: 你的 GitHub 用户名
     - `GIT_EMAIL`: 你的 GitHub 邮箱

3. 启用 GitHub Actions：
   - 访问你的仓库的 Actions 标签页
   - 点击启用 "Daily GitHub Activity" workflow
   
4. （可选）调整运行时间：
   - 编辑 `.github/workflows/daily-activity.yml` 文件
   - 修改 `cron` 表达式来更改运行时间

### 方法2：本地运行

1. 克隆此仓库到本地
2. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

3. 获取GitHub个人访问令牌：
   - 访问 GitHub Settings -> Developer settings -> Personal access tokens
   - 生成新的令牌，确保勾选 `repo` 权限

4. 配置环境变量：
   ```bash
   export GITHUB_TOKEN="your_token_here"
   export REPO_NAME="username/repository"
   ```

## 使用方法

### 使用 GitHub Actions（推荐）
- 脚本会按照设定的时间自动运行（默认每天 UTC 2:00）
- 你可以在 Actions 标签页手动触发运行
- 所有活动都会在 Actions 日志中记录

### 本地运行
1. 设置定时任务（以Linux/Mac为例）：
   ```bash
   crontab -e
   ```
   
2. 添加以下内容（每天凌晨2点运行）：
   ```
   0 2 * * * export GITHUB_TOKEN="your_token_here" && export REPO_NAME="username/repository" && /usr/bin/python3 /path/to/github_activity_bot.py
   ```

### 填充历史提交
如果要填充历史提交记录，取消脚本末尾的注释：
```python
backfill_commits(365)  # 填充过去一年的提交
```

## 注意事项
- 请合理使用此脚本，避免过度频繁的自动提交
- 确保你的GitHub令牌安全，不要泄露
- 建议将 `activity.txt` 添加到 `.gitignore` 中
- 脚本默认每天只提交一次，可以根据需要修改频率
- 使用 GitHub Actions 时，确保仓库有足够的 Actions 分钟数配额 