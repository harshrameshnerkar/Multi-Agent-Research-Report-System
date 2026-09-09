import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chartDefinition?: string;
  activeNode?: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#0b0f19',
    primaryColor: '#1e293b',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#6366f1',
    lineColor: '#818cf8',
    secondaryColor: '#0f172a',
    tertiaryColor: '#111827',
  }
});

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chartDefinition, activeNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultChart = `graph TD
    START([🚀 Start]) --> Orchestrator["🎯 1. Orchestrator Agent"]
    Orchestrator --> Researcher["🔍 2. Research Agent (Parallel)"]
    Researcher --> Validator["🛡️ 3. Source Validator Agent"]
    Validator --> Analyzer["📊 4. Quantitative Analysis Agent"]
    Analyzer --> FactChecker["⚖️ 5. Adversarial Fact Checker"]
    FactChecker --> ReportWriter["✍️ 6. Report Writer Agent"]
    ReportWriter --> Citation["📚 7. Citation Standardization"]
    Citation --> Reviewer["🧐 8. Quality Reviewer Agent"]
    Reviewer --> HumanApproval{"👤 9. Human Approval Gate"}
    
    HumanApproval -->|Approve| END([🏁 Published Report])
    HumanApproval -->|Request Rewrite| ReportWriter
    HumanApproval -->|Reject| Abort([❌ Cancelled])
    
    classDef default fill:#0f172a,stroke:#334155,stroke-width:1.5px,color:#e2e8f0;
    classDef active fill:#312e81,stroke:#818cf8,stroke-width:2.5px,color:#ffffff;
    classDef completed fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#a7f3d0;
  `;

  useEffect(() => {
    const renderChart = async () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        try {
          const definition = chartDefinition || defaultChart;
          const { svg } = await mermaid.render(id, definition);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (e) {
          console.error('Mermaid render error:', e);
        }
      }
    };

    renderChart();
  }, [chartDefinition, activeNode]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-x-auto min-h-[360px]">
      <div 
        ref={containerRef} 
        className="mermaid-wrapper w-full flex justify-center scale-95 hover:scale-100 transition-transform duration-300"
      />
    </div>
  );
};
