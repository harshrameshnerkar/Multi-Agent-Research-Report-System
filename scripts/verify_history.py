import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8000') as client:
        res = await client.get('/api/reports')
        reports = res.json()
        print(f"=== TOTAL REPORTS IN DATABASE HISTORY: {len(reports)} ===")
        for i, r in enumerate(reports, 1):
            d_res = await client.get(f"/api/reports/{r['id']}/export/docx")
            print(f"{i}. [{r['created_at'][:10]}] {r['title']}")
            print(f"   - Report ID: {r['id']}")
            print(f"   - Metrics: Confidence={r['confidence_score']}%, Words={r['word_count']}, Sources={r['sources_count']}")
            print(f"   - DOCX Export: Status={d_res.status_code}, Size={len(d_res.content)} bytes, Valid Header={d_res.content[:2] == b'PK'}")
            print()

if __name__ == '__main__':
    asyncio.run(main())
