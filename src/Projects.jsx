import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { M } from './ui.jsx'
const S = { fill: 'none', stroke: '#12232B', strokeWidth: 2, pathLength: 1 }
const V = [
  <svg viewBox="0 0 320 120" role="img" aria-label="Box plot showing how the IQR rule flags outliers"><path className="d" stroke="#C2CED2" strokeWidth="2" fill="none" pathLength="1" d="M20 104H300" /><path className="d" {...S} d="M100 36H200V80H100Z" /><path className="d" {...S} d="M150 36V80" /><path className="d" {...S} d="M60 58H100M200 58H250" /><circle className="pop" cx="22" cy="58" r="6" fill="#E8A317" /><circle className="pop" cx="290" cy="58" r="6" fill="#E8A317" /><text x="22" y="86" fontSize="13" textAnchor="middle" fill="#4D6068">outlier</text><text x="290" y="86" fontSize="13" textAnchor="middle" fill="#4D6068">outlier</text><text x="150" y="26" fontSize="13" textAnchor="middle" fill="#4D6068">Q1 to Q3 (the IQR)</text></svg>,
  <svg viewBox="0 0 380 110" role="img" aria-label="Pipeline from ERP and CRM sources through Bronze, Silver and Gold layers"><path className="d" {...S} d="M8 30H88V76H8Z" /><path className="d" {...S} stroke="#C98A3B" d="M118 30H198V76H118Z" /><path className="d" {...S} stroke="#8FA3AB" d="M228 30H308V76H228Z" /><path className="d" {...S} stroke="#E8A317" d="M318 30H372V76H318Z" /><path className="d" {...S} d="M88 53H118M198 53H228M308 53H318" />{[['ERP + CRM', 48], ['Bronze', 158], ['Silver', 268], ['Gold', 345]].map(([t, x]) => <text key={t} x={x} y="58" fontSize="13" textAnchor="middle" fill="#12232B">{t}</text>)}<text x="190" y="102" fontSize="13" textAnchor="middle" fill="#4D6068">Automated ETL on SQL Server</text></svg>,
  <svg viewBox="0 0 240 130" role="img" aria-label="Gauge showing 85 percent accuracy"><path d="M30 110A90 90 0 0 1 210 110" fill="none" stroke="#C2CED2" strokeWidth="12" /><path className="gauge" d="M30 110A90 90 0 0 1 210 110" fill="none" stroke="#0E5A5C" strokeWidth="12" pathLength="1" strokeDasharray="1" strokeDashoffset=".15" /><text x="120" y="98" fontSize="34" fontWeight="800" textAnchor="middle" fill="#12232B">85%</text><text x="120" y="124" fontSize="13" textAnchor="middle" fill="#4D6068">30-day readmission accuracy</text></svg>,
]
const P = [
  { name: 'AI Data Analyst Dashboard', goal: 'Turn any CSV into KPIs, trend charts and an executive summary without manual reporting.', tools: 'Python, Pandas, Streamlit, Groq LLaMA 3.3 70B, Plotly', how: ['IQR outlier detection and missing-value heatmaps check data quality, and LLM suggestions guide the cleaning.', 'Plain-English questions are mapped to Pandas aggregations.', 'Deployed on Streamlit Cloud with GitHub CI/CD, with API keys kept in environment variables.'], res: 'Cuts manual reporting time by about 80%.', links: [['Open live app', 'https://ai-business-analysis.streamlit.app'], ['View code on GitHub', 'https://github.com/RahulAnalyzer/ai-business-analyst-dashboard']] },
  { name: 'Data Warehouse & Analytics Pipeline', goal: 'Bring ERP and CRM data into one warehouse that can be analysed.', tools: 'SQL Server, ETL, Medallion architecture, Draw.io', how: ['Designed Bronze, Silver and Gold layers fed by automated ETL pipelines.', 'Built a SQL analytics layer on top, and documented the whole architecture in Draw.io.'], res: 'A SQL analytics layer that tracks customer behaviour, product performance and sales trends.' },
  { name: 'Healthcare & Drug Analytics', goal: 'Predict whether a patient will be readmitted within 30 days.', tools: 'Python, machine learning, Tableau', how: ['Python ML models with feature engineering to reduce false positives.', 'Tableau dashboards for 1,000+ users.'], res: '85% accuracy, false positives down 15%, and flagged treatment inefficiencies estimated to save $5,000 a year.' },
]
export default function Projects() {
  const [a, setA] = useState(0), box = useRef(null), p = P[a]
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const q = s => box.current.querySelectorAll(s), tl = gsap.timeline({ defaults: { ease: M.ease.out } })
      tl.from(q('.pd-body>*'), { clipPath: 'inset(0 0 100% 0)', y: 10, duration: M.dur.m, stagger: M.gap })
      if (q('.pv .d').length) tl.fromTo(q('.pv .d'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: M.dur.m, stagger: .1, ease: M.ease.io }, 0)
      if (q('.pv .pop').length) tl.from(q('.pv .pop'), { scale: 0, transformOrigin: '50% 50%', duration: M.dur.s, stagger: .1, ease: 'back.out(3)' }, .6)
      if (q('.pv .gauge').length) tl.fromTo(q('.pv .gauge'), { strokeDashoffset: 1 }, { strokeDashoffset: .15, duration: M.dur.l, ease: M.ease.io }, 0)
    }, box)
    return () => ctx.revert()
  }, [a])
  return (<div ref={box}>
    <div className="ptabs" role="tablist">{P.map((x, i) => <button key={x.name} role="tab" aria-selected={i === a} onClick={() => setA(i)}>{x.name}</button>)}</div>
    <div className="pd" role="tabpanel"><div className="pv">{V[a]}</div>
      <div className="pd-body"><h3>{p.name}</h3>
        <dl><dt>Goal</dt><dd>{p.goal}</dd><dt>Built with</dt><dd>{p.tools}</dd><dt>How</dt><dd><ul>{p.how.map(h => <li key={h}>{h}</li>)}</ul></dd><dt>Result</dt><dd>{p.res}</dd></dl>
        {p.links && <div className="links">{p.links.map(([t, u]) => <a key={u} href={u} target="_blank" rel="noreferrer noopener">{t}</a>)}</div>}</div></div></div>)
}
