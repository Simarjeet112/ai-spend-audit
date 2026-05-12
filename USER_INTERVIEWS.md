# User Interviews

Three conversations conducted on May 12-13, 2026 with potential users. Each conversation was 10-15 minutes via WhatsApp call or in person.

## Interview 1

**Name:** A.K. (preferred anonymity)
**Role:** Full-stack developer
**Company stage:** Early stage startup, 8 people

**What they said:**
- "I honestly have no idea what we pay for Cursor per month. I just know it's on the company card."
- "We switched from GitHub Copilot to Cursor six months ago but we still pay for Copilot. Nobody cancelled it."
- "If a tool showed me we were paying for something we don't use, I'd use it immediately."

**Most surprising thing:** They were paying for both Cursor and GitHub Copilot simultaneously without realizing it — pure waste with no overlap justification.

**What it changed:** Added duplicate tool detection as a recommendation type in the audit engine. If a user enters both Cursor and GitHub Copilot, the engine now notes the overlap and recommends consolidating.

## Interview 2

**Name:** S.M.
**Role:** Indie hacker, solo founder
**Company stage:** Pre-revenue side project

**What they said:**
- "I'm on ChatGPT Plus and Claude Pro. That's $40 a month just for AI assistants."
- "I picked Team plans thinking they'd be better but I'm literally just one person."
- "I would absolutely use a free audit tool. I audit my AWS bill every month but never thought to do this for SaaS."

**Most surprising thing:** They consciously chose team plans assuming they were more capable, not understanding that Plus and Pro plans have the same model access — Team plans add collaboration features that a solo user cannot use.

**What it changed:** The audit engine recommendation for single-user Team plan subscriptions became more direct — explicitly explaining that Team features require multiple users to have any value.

## Interview 3

**Name:** R.P.
**Role:** Engineering manager
**Company stage:** Series A, 25 people

**What they said:**
- "We have a Notion Business plan for 25 people. I have no idea if we use half those features."
- "The problem is nobody owns this. Engineers pick tools, finance pays the bill, nobody compares them."
- "A shareable report URL is smart. I can send it to our CFO without explaining what each tool is."

**Most surprising thing:** At a 25-person Series A company, no single person had a complete picture of all AI tool subscriptions. The data was split across engineering, design, and product budgets.

**What it changed:** Reinforced the shareable report URL as a core feature rather than a nice-to-have. The report is not just for the person who runs the audit — it is for the finance person or executive who needs to approve the changes.