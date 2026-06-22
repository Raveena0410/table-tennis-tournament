import os
from github import Github
from google import genai

TOKEN = os.environ.get("GH")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

g = Github(TOKEN)

client = genai.Client(
    api_key=GEMINI_API_KEY
)




for repo in g.get_user().get_repos():

    print(f"Checking {repo.name}")

    for pr in repo.get_pulls(state="open"):

        print(f"Checking PR #{pr.number}")

        already_reviewed = False

        for comment in pr.get_issue_comments():
            if "## Gemini Code Review" in comment.body:
                already_reviewed = True
                break

        if already_reviewed:
            print(f"PR #{pr.number} already reviewed. Skipping.")
            continue

        full_review = ""

        for file in pr.get_files():

            if not file.patch:
                continue

            print(f"Reviewing file: {file.filename}")

            history = []

            try:
                commits = repo.get_commits(path=file.filename)

                count = 0

                for commit in commits:

                    history.append(
                        f"""
Commit: {commit.sha[:7]}
Message: {commit.commit.message}
"""
                    )

                    count += 1

                    if count >= 5:
                        break

            except Exception as e:
                print(f"History Error: {e}")

            file_history = "\n".join(history)

            response = None

            for attempt in range(3):

                try:

                    response = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=f"""
You are a senior software engineer reviewing a GitHub Pull Request.

Repository:
{repo.name}

PR Title:
{pr.title}

PR Description:
{pr.body}

File:
{file.filename}

Current Changed Code:
{file.patch}

Recent History For This File:
{file_history}

Tasks:

1. Review the current patch.
2. Compare with recent changes to this file.
3. Detect repeated mistakes.
4. Detect reintroduced bugs.
5. Detect security issues.
6. Detect performance issues.
7. Give suggestions.

Provide:

- Summary
- Bugs
- Security Issues
- Performance Issues
- Suggestions

Keep the review concise.
"""
                    )

                    break

                except Exception as e:

                    print(f"Attempt {attempt + 1} failed")
                    print(e)

                    import time
                    time.sleep(10)

            if response:

                full_review += f"\n\n### File: {file.filename}\n\n"
                full_review += response.text

            else:

                full_review += f"\n\n### File: {file.filename}\n\n"
                full_review += "Gemini review failed after 3 attempts.\n"

        if full_review.strip():

            pr.create_issue_comment(
                f"""
## Gemini Code Review

{full_review}
"""
            )

            print(f"Review posted on PR #{pr.number}")