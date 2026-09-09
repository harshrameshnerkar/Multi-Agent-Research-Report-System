# Agents Specification & Responsibilities

The system deploys **9 specialized, independent intelligent agents** orchestrated via LangGraph.

---

## 1. Orchestrator Agent
* **Role**: Lead Research Planner & Graph Architect.
* **Input**: User research query, depth parameter (`quick`, `standard`, `deep`, `comprehensive`), focus areas.
* **Output**: Structured JSON research blueprint with 4 to 8 distinct, non-overlapping subtasks, assigned target domain categories, and optimized search query permutations.

---

## 2. Research Agent
* **Role**: Parallel Web & Document Harvester.
* **Input**: Subtask search queries, uploaded file collection IDs.
* **Output**: Raw evidence chunks, source URLs, publication timestamps, and snippets collected concurrently via Tavily API and ChromaDB vector retrieval.

---

## 3. Source Validation Agent
* **Role**: Domain Reputation & Trust Scorer.
* **Input**: Gathered web sources.
* **Output**: Trust score (0–100) per domain, categorization (`Government`, `Academic`, `News`, `Official Company`, `Community`, `Unknown`), and elimination of low-quality spam.

---

## 4. Analysis Agent
* **Role**: Quantitative & Qualitative Insight Synthesizer.
* **Input**: Validated multi-source evidence.
* **Output**: High-density key findings, quantitative metrics & statistics, CAGR market numbers, SWOT matrix, and benchmark comparisons.

---

## 5. Fact Checker Agent
* **Role**: Adversarial Claim Cross-Validator.
* **Input**: Extracted claims and findings.
* **Output**: Claim-by-claim verification report, detection of conflicting numbers, uncorroborated assertions flags, and overall evidentiary confidence score (0–100%).

---

## 6. Report Writer Agent
* **Role**: Technical Author & Strategic Report Synthesizer.
* **Input**: Synthesized findings, fact-checking confidence scores, user feedback directives.
* **Output**: Complete publication-grade 10-section Markdown report featuring executive summaries, benchmark tables, real-world case studies, and bracketed citation markers.

---

## 7. Citation Agent
* **Role**: Academic Reference Standardization.
* **Input**: Validated sources and report draft.
* **Output**: Standardized bibliography matching APA, MLA, Chicago, IEEE, or Markdown Links style with verified source links.

---

## 8. Reviewer Agent
* **Role**: Editorial Quality Auditor.
* **Input**: Final draft report.
* **Output**: Editorial quality score (0–100), grammatical and structural audit, citation completeness verification, and improvement recommendations.

---

## 9. Human Approval Node
* **Role**: Human-in-the-Loop Gate.
* **Input**: Draft preview, quality score, user action (`approve`, `rewrite`, `reject`).
* **Output**: Graph resumption, final report publishing, or conditional routing back to Report Writer for revision cycles.
