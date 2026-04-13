import os
import random
from datetime import datetime, timedelta
from github import Github
import git
from pathlib import Path
import time

# GitHub配置
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")  # 从环境变量获取
REPO_NAME = os.environ.get("REPO_NAME")        # 从环境变量获取
REPO_PATH = Path(__file__).parent

def setup_git_config():
    """设置Git配置"""
    # Git配置已在GitHub Actions workflow中设置
    pass

def create_commit(date=None):
    """创建提交"""
    repo = git.Repo(REPO_PATH)
    
    # 创建或更新活动文件
    activity_file = REPO_PATH / "activity.txt"
    with open(activity_file, "a") as f:
        f.write(f"Activity on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # 添加文件到暂存区
    repo.index.add(["activity.txt"])
    
    # 创建提交
    if date:
        # 设置特定日期的提交
        commit_date = date.strftime("%Y-%m-%d %H:%M:%S")
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = commit_date
        env["GIT_COMMITTER_DATE"] = commit_date
        repo.index.commit(f"Activity update for {commit_date}", author_date=commit_date, commit_date=commit_date)
    else:
        # 使用当前日期提交
        repo.index.commit("Daily activity update")

def create_issue():
    """创建GitHub Issue"""
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPO_NAME)
    
    titles = [
        "Daily Progress Update",
        "New Feature Ideas",
        "Project Enhancement",
        "Weekly Review",
        "Bug Report Template"
    ]
    
    bodies = [
        "Working on improving the codebase",
        "Brainstorming new features",
        "Reviewing project structure",
        "Planning next steps",
        "Documentation updates needed"
    ]
    
    title = random.choice(titles)
    body = random.choice(bodies)
    repo.create_issue(title=title, body=body)

def push_changes():
    """推送更改到GitHub"""
    repo = git.Repo(REPO_PATH)
    origin = repo.remote(name="origin")
    origin.push()

def backfill_commits(days=365):
    """填充过去指定天数的提交"""
    today = datetime.now()
    for i in range(days):
        past_date = today - timedelta(days=i)
        create_commit(past_date)
        time.sleep(1)  # 避免过快提交
    push_changes()

def main():
    """主函数"""
    if not GITHUB_TOKEN or not REPO_NAME:
        raise ValueError("Missing required environment variables: GITHUB_TOKEN or REPO_NAME")
    
    # 创建今天的提交
    create_commit()
    
    # 创建随机issue
    if random.random() < 0.3:  # 30%的概率创建issue
        create_issue()
    
    # 推送更改
    push_changes()

if __name__ == "__main__":
    main()
    # 如果需要填充历史提交，取消下面的注释
    # backfill_commits(365)  # 填充过去一年的提交 