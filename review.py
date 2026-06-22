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
            related_prs = []

            try:

               for old_pr in repo.get_pulls(state="closed"):

                  if old_pr.number == pr.number:
                        continue

                        try:

                           for old_file in old_pr.get_files():

                               if old_file.filename == file.filename:

                                    related_prs.append(
                        f"""
PR #{old_pr.number}
Title: {old_pr.title}

Patch:
{old_file.patch}
"""
                    )

                           break

                        except Exception:
                          pass

                        if len(related_prs) >= 3:
                                  break

            except Exception as e:
                print(f"PR History Error: {e}")

                pr_history = "\n".join(related_prs)

                if not pr_history:
                  pr_history = "No previous PR history found"

            
            response = None
            last_error=""

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
{pr_history}

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

                    last_error = str(e)

                    print(f"Attempt {attempt + 1} failed")
                    print(last_error)

                    import time
                    time.sleep(10)

            if response:

                full_review += f"\n\n### File: {file.filename}\n\n"
                full_review += response.text

            else:

                full_review += f"\n\n### File: {file.filename}\n\n"
                full_review += f"""
Gemini review failed after 3 attempts.

Error:
{last_error}
"""

if full_review.strip():

            pr.create_issue_comment(
                f"""
## Gemini Code Review

{full_review}
"""
            )

            print(f"Review posted on PR #{pr.number}")