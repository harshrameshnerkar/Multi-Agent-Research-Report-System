# Prompt Engineering Architecture

## Philosophy & Guardrails

The system employs structured JSON-mode output constraints, few-shot schema enforcements, adversarial fact-checking instructions, and multi-layered system prompts to eliminate hallucinations.

---

## Agent Prompt Matrix

| Agent | Objective | Structural Constraint | Output Format |
| :--- | :--- | :--- | :--- |
| **Orchestrator** | Task decomposition | 4–8 subtasks with domain categories | Valid JSON |
| **Researcher** | Evidence extraction | Dense quotes, URL provenance | Structured Evidence list |
| **Validator** | Credibility evaluation | Domain scoring (0-100) & spam purge | Valid JSON |
| **Analyzer** | Statistical synthesis | Extract quantitative CAGR & SWOT | Valid JSON |
| **Fact Checker** | Adversarial verification | Disputed / Verified flags & Confidence % | Valid JSON |
| **Report Writer** | Publication synthesis | Exact 10-section report & data tables | Rich Markdown |
| **Citation** | Reference formatting | APA / MLA / Chicago / IEEE rules | Structured Citations list |
| **Reviewer** | Quality assurance | Grammar, structure, completeness score | Valid JSON |

---

## 10-Section Report Mandate

The **Report Writer Agent** adheres strictly to the following 10-section hierarchy:
1. `# Title & Executive Summary`
2. `## 1. Introduction & Contextual Background`
3. `## 2. Core Technological & Architectural Foundations`
4. `## 3. Market Dynamics, Capital Investment & Economic Impact`
5. `## 4. Detailed Empirical Findings & Key Evidence`
6. `## 5. Comparative Analysis & Industry Benchmarks` (Markdown Table)
7. `## 6. Case Studies & Real-World Deployments`
8. `## 7. Strategic Challenges, Security & Regulatory Vulnerabilities`
9. `## 8. Future Roadmap & Horizon 2026–2030`
10. `## 9. Strategic Recommendations & Conclusion`
11. `## 10. References & Source Attributions`
