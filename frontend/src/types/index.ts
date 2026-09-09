export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface ResearchOptions {
  depth: 'quick' | 'standard' | 'deep' | 'comprehensive';
  language: string;
  citation_style: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Markdown Links';
  model_provider: 'claude' | 'openai' | 'gemini' | 'deepseek' | 'simulation';
  model_name?: string;
  focus_areas: string[];
  include_uploaded_files?: boolean;
  uploaded_file_ids?: string[];
  temperature?: number;
  max_tokens?: number;
}

export interface Citation {
  id?: string;
  index_number: number;
  formatted_text: string;
  url: string;
}

export interface Source {
  id?: string;
  url: string;
  title: string;
  snippet?: string;
  domain: string;
  category: 'Government' | 'Academic' | 'News' | 'Official Company' | 'Community' | 'Web' | 'Unknown';
  trust_score: number;
  published_date?: string;
}

export interface Report {
  id: string;
  project_id: string;
  title: string;
  executive_summary: string;
  full_markdown: string;
  word_count: number;
  reading_time_minutes: number;
  confidence_score: number;
  fact_check_score: number;
  quality_score: number;
  sources_count: number;
  citation_style: string;
  is_public: boolean;
  share_token?: string;
  created_at: string;
  citations: Citation[];
}

export interface AgentExecution {
  id: string;
  agent_name: string;
  step_number: number;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'retrying' | 'human_approval';
  latency_ms: number;
  tokens_used: number;
  cost_estimate_usd: number;
  thought_log?: string;
  created_at: string;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  agent_name?: string;
  message: string;
  metadata_json?: Record<string, any>;
  created_at: string;
}

export interface ResearchProject {
  id: string;
  user_id?: string;
  title: string;
  topic: string;
  status: 'queued' | 'running' | 'human_approval' | 'completed' | 'failed' | 'cancelled' | 'rewriting';
  depth: string;
  language: string;
  citation_style: string;
  model_provider: string;
  model_name: string;
  focus_areas: string[];
  current_agent?: string;
  progress_percentage: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  report?: Report;
  agent_executions: AgentExecution[];
  sources: Source[];
  logs: SystemLog[];
}

export interface AnalyticsData {
  total_projects: number;
  completed_reports: number;
  total_agents_executed: number;
  total_tokens_processed: number;
  estimated_cost_saved_usd: number;
  average_completion_time_seconds: number;
  top_topics: Array<{ topic: string; count: number; avg_confidence: number }>;
  weekly_activity: Array<{ day: string; reports: number; queries: number; tokens_k: number }>;
  agent_latency_breakdown: Array<{ agent: string; avg_latency_ms: number; tokens: number; percentage: number }>;
}

export interface SystemSettings {
  default_provider: string;
  model_name: string;
  temperature: number;
  max_tokens: number;
  citation_style: string;
  available_providers: Array<{ id: string; name: string; icon: string }>;
  available_citation_styles: string[];
  has_anthropic_key: boolean;
  has_openai_key: boolean;
  has_gemini_key: boolean;
  has_tavily_key: boolean;
}
