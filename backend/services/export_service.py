import os
import io
import csv
import json
import markdown
from typing import Dict, Any, List
from loguru import logger

from backend.core.config import settings


class ExportService:
    """
    Multi-format export engine supporting PDF, DOCX, Markdown, HTML, JSON, and CSV.
    """

    @staticmethod
    def export_markdown(report_title: str, full_markdown: str) -> bytes:
        """Export report as raw Markdown file."""
        return full_markdown.encode("utf-8")

    @staticmethod
    def export_html(report_title: str, full_markdown: str, metadata: Dict[str, Any]) -> bytes:
        """Export report as a standalone, styled HTML document."""
        html_body = markdown.markdown(
            full_markdown,
            extensions=["extra", "tables", "codehilite", "toc"]
        )

        html_document = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{report_title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg: #0b0f19;
            --surface: #111827;
            --border: #1f2937;
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --accent: #6366f1;
            --accent-light: #818cf8;
        }}
        body {{
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text-primary);
            line-height: 1.7;
            margin: 0;
            padding: 40px 20px;
        }}
        .container {{
            max-width: 880px;
            margin: 0 auto;
            background-color: var(--surface);
            padding: 48px;
            border-radius: 16px;
            border: 1px solid var(--border);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }}
        h1, h2, h3, h4 {{
            color: #ffffff;
            font-weight: 700;
            margin-top: 1.8em;
            margin-bottom: 0.6em;
            letter-spacing: -0.02em;
        }}
        h1 {{
            font-size: 2.2em;
            color: var(--accent-light);
            border-bottom: 2px solid var(--border);
            padding-bottom: 16px;
            margin-top: 0;
        }}
        h2 {{ font-size: 1.5em; border-bottom: 1px solid var(--border); padding-bottom: 8px; }}
        h3 {{ font-size: 1.25em; }}
        p {{ margin-bottom: 1.2em; color: #d1d5db; }}
        blockquote {{
            border-left: 4px solid var(--accent);
            margin: 20px 0;
            padding: 12px 20px;
            background-color: rgba(99, 102, 241, 0.1);
            border-radius: 4px;
            color: #e0e7ff;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            font-size: 0.95em;
        }}
        th, td {{
            border: 1px solid var(--border);
            padding: 12px 16px;
            text-align: left;
        }}
        th {{
            background-color: #1e293b;
            color: #f8fafc;
            font-weight: 600;
        }}
        tr:nth-child(even) {{
            background-color: rgba(30, 41, 59, 0.5);
        }}
        code {{
            font-family: 'JetBrains Mono', monospace;
            background-color: #1e293b;
            padding: 2px 6px;
            border-radius: 4px;
            color: #a5b4fc;
            font-size: 0.9em;
        }}
        hr {{
            border: 0;
            border-top: 1px solid var(--border);
            margin: 32px 0;
        }}
        ul, ol {{ padding-left: 24px; margin-bottom: 1.2em; }}
        li {{ margin-bottom: 0.4em; color: #d1d5db; }}
        .badge {{
            display: inline-block;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.8em;
            font-weight: 600;
            background-color: rgba(99, 102, 241, 0.2);
            color: #c7d2fe;
            border: 1px solid var(--accent);
        }}
        @media print {{
            body {{ background: #fff; color: #000; padding: 0; }}
            .container {{ border: none; box-shadow: none; padding: 0; }}
            h1, h2, h3 {{ color: #000; }}
            table, th, td {{ border-color: #ccc; }}
            th {{ background: #eee; color: #000; }}
            code {{ background: #eee; color: #000; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        {html_body}
    </div>
</body>
</html>
"""
        return html_document.encode("utf-8")

    @staticmethod
    def export_pdf(report_title: str, full_markdown: str, metadata: Dict[str, Any]) -> bytes:
        """Export report as a PDF using xhtml2pdf or styled HTML engine."""
        try:
            from xhtml2pdf import pisa
            html_content = markdown.markdown(full_markdown, extensions=["extra", "tables"])
            pdf_html = f"""
            <html>
            <head>
                <style>
                    @page {{
                        size: a4 portrait;
                        margin: 2cm;
                    }}
                    body {{ font-family: Helvetica, sans-serif; font-size: 10pt; line-height: 1.5; color: #222; }}
                    h1 {{ font-size: 18pt; color: #1e3a8a; border-bottom: 1px solid #1e3a8a; padding-bottom: 5px; }}
                    h2 {{ font-size: 13pt; color: #1e40af; margin-top: 15px; border-bottom: 0.5px solid #ccc; }}
                    h3 {{ font-size: 11pt; color: #374151; }}
                    table {{ width: 100%; border-collapse: collapse; margin: 10px 0; }}
                    th, td {{ border: 0.5pt solid #aaa; padding: 4pt 6pt; font-size: 8pt; }}
                    th {{ background-color: #e2e8f0; font-weight: bold; }}
                    blockquote {{ background-color: #f1f5f9; border-left: 3pt solid #3b82f6; padding: 5pt; margin: 5pt 0; }}
                </style>
            </head>
            <body>
                {html_content}
            </body>
            </html>
            """
            pdf_buffer = io.BytesIO()
            pisa_status = pisa.CreatePDF(pdf_html, dest=pdf_buffer)
            if not pisa_status.err:
                return pdf_buffer.getvalue()
        except Exception as e:
            logger.warning(f"xhtml2pdf generation failed ({e}). Falling back to clean text PDF.")

        # Text PDF fallback with ReportLab
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            buffer = io.BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            p.setFont("Helvetica-Bold", 16)
            p.drawString(50, 750, report_title[:60])
            p.setFont("Helvetica", 10)
            p.drawString(50, 730, f"Autonomous Research Report | Generated by Multi-Agent System")
            p.line(50, 720, 560, 720)
            
            y = 700
            for line in full_markdown.split("\n"):
                if y < 50:
                    p.showPage()
                    y = 750
                    p.setFont("Helvetica", 9)
                p.drawString(50, y, line[:90])
                y -= 13
            p.save()
            return buffer.getvalue()
        except Exception as e:
            logger.error(f"ReportLab PDF export failed: {e}")
            return full_markdown.encode("utf-8")

    @staticmethod
    def export_docx(report_title: str, full_markdown: str) -> bytes:
        """Export report as an executive Microsoft Word DOCX with styled tables, callouts, and typography."""
        try:
            import docx
            from docx.shared import Inches, Pt, RGBColor
            from docx.enum.text import WD_ALIGN_PARAGRAPH
            from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
            from docx.oxml import OxmlElement, parse_xml
            from docx.oxml.ns import nsdecls, qn

            doc = docx.Document()

            # Set standard margins (1 inch)
            for section in doc.sections:
                section.top_margin = Inches(1)
                section.bottom_margin = Inches(1)
                section.left_margin = Inches(1)
                section.right_margin = Inches(1)
                
                # Header & Footer
                header = section.header
                hp = header.paragraphs[0]
                hp.text = "NexusResearch AI | Autonomous Strategic Dossier"
                hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                if hp.runs:
                    hp.runs[0].font.size = Pt(8.5)
                    hp.runs[0].font.color.rgb = RGBColor(148, 163, 184)

                footer = section.footer
                fp = footer.paragraphs[0]
                fp.text = "Confidential & Autonomous Intelligence Synthesis • For Strategic Advisory Use Only"
                fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                if fp.runs:
                    fp.runs[0].font.size = Pt(8.5)
                    fp.runs[0].font.color.rgb = RGBColor(148, 163, 184)

            # Helpers for table styling
            def set_cell_background(cell, fill_hex: str):
                tcPr = cell._tc.get_or_add_tcPr()
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
                tcPr.append(shd)

            def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
                tcPr = cell._tc.get_or_add_tcPr()
                tcMar = OxmlElement('w:tcMar')
                for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
                    node = OxmlElement(f'w:{m}')
                    node.set(qn('w:w'), str(val))
                    node.set(qn('w:type'), 'dxa')
                    tcMar.append(node)
                tcPr.append(tcMar)

            # Title
            title_p = doc.add_paragraph()
            title_p.paragraph_format.space_before = Pt(0)
            title_p.paragraph_format.space_after = Pt(6)
            run = title_p.add_run(report_title)
            run.font.name = 'Calibri'
            run.font.size = Pt(24)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 41, 59) # Slate 800

            # Subtitle Banner
            sub_p = doc.add_paragraph()
            sub_p.paragraph_format.space_after = Pt(18)
            sub_run = sub_p.add_run("Autonomous Multi-Agent Empirical Research Dossier • Generated with Verified Evidence")
            sub_run.font.name = 'Calibri'
            sub_run.font.size = Pt(10.5)
            sub_run.font.italic = True
            sub_run.font.color.rgb = RGBColor(99, 102, 241) # Indigo 500

            # Divider line
            div_p = doc.add_paragraph()
            div_p.paragraph_format.space_after = Pt(14)
            div_run = div_p.add_run("―" * 48)
            div_run.font.color.rgb = RGBColor(226, 232, 240)

            # Line parser with table handling
            lines = full_markdown.split("\n")
            i = 0
            while i < len(lines):
                line = lines[i]
                stripped = line.strip()

                if not stripped:
                    i += 1
                    continue

                # Skip top header if duplicate
                if stripped.startswith("# ") and i < 3:
                    i += 1
                    continue

                # Markdown Tables
                if stripped.startswith("|") and stripped.endswith("|"):
                    table_lines = []
                    while i < len(lines) and lines[i].strip().startswith("|") and lines[i].strip().endswith("|"):
                        table_lines.append(lines[i].strip())
                        i += 1

                    if len(table_lines) >= 2:
                        # Parse header and data rows
                        header_cols = [c.strip() for c in table_lines[0].split("|")[1:-1]]
                        data_rows = []
                        for tl in table_lines[1:]:
                            if "---" in tl:
                                continue
                            row_cols = [c.strip() for c in tl.split("|")[1:-1]]
                            data_rows.append(row_cols)

                        if header_cols and data_rows:
                            col_count = len(header_cols)
                            table = doc.add_table(rows=len(data_rows) + 1, cols=col_count)
                            table.alignment = WD_TABLE_ALIGNMENT.CENTER
                            table.autofit = True

                            # Format Header Row
                            hdr_cells = table.rows[0].cells
                            for c_idx, title in enumerate(header_cols):
                                if c_idx < len(hdr_cells):
                                    hdr_cells[c_idx].text = title
                                    set_cell_background(hdr_cells[c_idx], "1E293B")
                                    set_cell_margins(hdr_cells[c_idx], top=140, bottom=140, left=160, right=160)
                                    p = hdr_cells[c_idx].paragraphs[0]
                                    if p.runs:
                                        p.runs[0].font.bold = True
                                        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)
                                        p.runs[0].font.size = Pt(9.5)

                            # Format Data Rows
                            for r_idx, row_data in enumerate(data_rows):
                                row_cells = table.rows[r_idx + 1].cells
                                bg_color = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
                                for c_idx, val in enumerate(row_data):
                                    if c_idx < len(row_cells):
                                        clean_val = val.replace("**", "")
                                        row_cells[c_idx].text = clean_val
                                        set_cell_background(row_cells[c_idx], bg_color)
                                        set_cell_margins(row_cells[c_idx], top=100, bottom=100, left=140, right=140)
                                        p = row_cells[c_idx].paragraphs[0]
                                        if p.runs:
                                            p.runs[0].font.size = Pt(9)
                                            p.runs[0].font.color.rgb = RGBColor(51, 65, 85)

                            doc.add_paragraph().paragraph_format.space_after = Pt(8)
                    continue

                # Headings
                if stripped.startswith("# "):
                    h = doc.add_heading(stripped[2:], level=1)
                    h.paragraph_format.space_before = Pt(16)
                    h.paragraph_format.space_after = Pt(6)
                    if h.runs:
                        h.runs[0].font.color.rgb = RGBColor(30, 41, 59)
                elif stripped.startswith("## "):
                    h = doc.add_heading(stripped[3:], level=2)
                    h.paragraph_format.space_before = Pt(14)
                    h.paragraph_format.space_after = Pt(4)
                    if h.runs:
                        h.runs[0].font.color.rgb = RGBColor(79, 70, 229) # Indigo
                elif stripped.startswith("### "):
                    h = doc.add_heading(stripped[4:], level=3)
                    h.paragraph_format.space_before = Pt(10)
                    h.paragraph_format.space_after = Pt(3)
                    if h.runs:
                        h.runs[0].font.color.rgb = RGBColor(15, 23, 42)
                
                # Blockquotes / Callout Boxes
                elif stripped.startswith("> "):
                    p = doc.add_paragraph()
                    p.paragraph_format.left_indent = Inches(0.25)
                    p.paragraph_format.space_before = Pt(4)
                    p.paragraph_format.space_after = Pt(6)
                    run = p.add_run(stripped[2:].replace("**", "").replace("`", ""))
                    run.font.italic = True
                    run.font.color.rgb = RGBColor(71, 85, 105)
                    run.font.size = Pt(9.5)

                # Bullet points
                elif stripped.startswith("- ") or stripped.startswith("* "):
                    p = doc.add_paragraph(style='List Bullet')
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    content = stripped[2:]
                    # Simple bold run parser
                    parts = content.split("**")
                    for p_idx, part in enumerate(parts):
                        if part:
                            r = p.add_run(part)
                            if p_idx % 2 == 1:
                                r.font.bold = True
                            r.font.size = Pt(10)
                            r.font.color.rgb = RGBColor(51, 65, 85)

                # Numbered list
                elif stripped[0].isdigit() and (stripped[1:3] == ". " or stripped[2:4] == ". "):
                    p = doc.add_paragraph(style='List Number')
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    dot_idx = stripped.find(". ")
                    content = stripped[dot_idx + 2:]
                    parts = content.split("**")
                    for p_idx, part in enumerate(parts):
                        if part:
                            r = p.add_run(part)
                            if p_idx % 2 == 1:
                                r.font.bold = True
                            r.font.size = Pt(10)
                            r.font.color.rgb = RGBColor(51, 65, 85)

                # Horizontal line
                elif stripped in ["---", "***", "___"]:
                    div_p = doc.add_paragraph()
                    div_p.paragraph_format.space_before = Pt(8)
                    div_p.paragraph_format.space_after = Pt(8)
                    div_run = div_p.add_run("―" * 48)
                    div_run.font.color.rgb = RGBColor(226, 232, 240)

                # Regular Paragraph
                else:
                    p = doc.add_paragraph()
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(6)
                    parts = stripped.split("**")
                    for p_idx, part in enumerate(parts):
                        if part:
                            r = p.add_run(part)
                            if p_idx % 2 == 1:
                                r.font.bold = True
                            r.font.size = Pt(10)
                            r.font.color.rgb = RGBColor(51, 65, 85)

                i += 1

            buffer = io.BytesIO()
            doc.save(buffer)
            return buffer.getvalue()
        except Exception as e:
            logger.error(f"DOCX export error: {e}", exc_info=True)
            return full_markdown.encode("utf-8")

    @staticmethod
    def export_json(report_data: Dict[str, Any]) -> bytes:
        """Export complete structured dossier as JSON."""
        return json.dumps(report_data, indent=2, default=str).encode("utf-8")

    @staticmethod
    def export_csv_citations(citations: List[Dict[str, Any]]) -> bytes:
        """Export citations list as a CSV."""
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Index", "Citation Text", "Source URL", "Domain"])
        for c in citations:
            writer.writerow([
                c.get("index_number", 0),
                c.get("formatted_text", ""),
                c.get("url", ""),
                c.get("domain", "")
            ])
        return output.getvalue().encode("utf-8")
