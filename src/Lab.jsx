import { Fragment, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { M, Ln } from './ui.jsx'
gsap.registerPlugin(ScrollTrigger)
const E = M.ease, fmt = n => n.toLocaleString('en-US')
// One shared sample dataset: the Python, SQL, Excel and workflow panels all derive their output from it.
const rows = [['North', 12, 150], ['North', 8, 200], ['South', 10, 120], ['South', 15, 90], ['East', 20, 110], ['East', 9, 180], ['West', 14, 100], ['West', 6, 230]]
const rev = rows.map(r => r[1] * r[2]), by = {}
rows.forEach((r, i) => by[r[0]] = (by[r[0]] || 0) + rev[i])
const alpha = Object.entries(by).sort(), ranked = [...alpha].sort((a, b) => b[1] - a[1])
const total = rev.reduce((a, b) => a + b, 0), top = ranked[0], share = Math.round(top[1] / total * 100)
const outLines = ['region', ...alpha.map(([k, v]) => k.padEnd(9) + v), 'Name: revenue, dtype: int64']
const PY = ['import pandas as pd', '', 'df = pd.read_csv("sales.csv")', 'df["revenue"] = df["quantity"] * df["price"]', 'summary = df.groupby("region")["revenue"].sum()', '', 'print(summary)']
const SQL = ['SELECT', '  region,', '  SUM(revenue) AS total_revenue', 'FROM sales', 'GROUP BY region', 'ORDER BY total_revenue DESC;']
const TOK = /(#.*|--.*|"[^"]*"|\b\d+(?:\.\d+)?\b|\b(?:import|as|print|SELECT|FROM|GROUP|BY|ORDER|SUM|AS|DESC)\b)/, KW = /^(import|as|print|SELECT|FROM|GROUP|BY|ORDER|SUM|AS|DESC)$/
const hl = t => t.split(TOK).map((p, i) => { if (!p) return null
  const c = /^(#|--)/.test(p) ? 'c' : /^"/.test(p) ? 's' : /^\d/.test(p) ? 'n' : KW.test(p) ? 'k' : ''
  return c ? <span key={i} className={c}>{p}</span> : p })
const wf = [['Data source', 'A CSV upload, as in my dashboard project.'], ['Validation', 'Check types, missing values and outliers.'], ['Python transformation', 'Pandas groups the rows and computes revenue.'], ['AI-assisted analysis', 'An LLM drafts a plain-English summary.'], ['Business report', 'A short summary ready to share.']]

function seq(tl, el, gap) {
  const L = el.querySelectorAll('.cl'), bar = el.querySelector('.bar')
  L.forEach((l, k) => tl.fromTo(l, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .4 }, k * gap).set(bar, { opacity: 1, yPercent: k * 100 }, k * gap))
  tl.to(bar, { opacity: 0, duration: .3 }, L.length * gap); return L.length * gap + .2
}
const mk = () => gsap.timeline({ paused: true, defaults: { ease: E.out } })
const buildPy = el => { const tl = mk(), t = seq(tl, el, .4)
  tl.from(el.querySelectorAll('.rv-cell'), { opacity: 0, duration: .3, stagger: .07 }, 1.5)
    .from(el.querySelectorAll('.oline'), { opacity: 0, x: -8, duration: .35, stagger: .12 }, t); return tl }
const buildSql = el => { const tl = mk(), t = seq(tl, el, .3)
  tl.from(el.querySelector('.prog'), { scaleX: 0, transformOrigin: '0 50%', duration: .8, ease: E.io }, t)
    .to(el.querySelector('.s1'), { opacity: 0, duration: .2 })
    .fromTo(el.querySelector('.s2'), { opacity: 0 }, { opacity: 1, duration: .3 }, '<')
    .from(el.querySelectorAll('.rr'), { opacity: 0, y: 8, duration: .4, stagger: .12 })
    .to(el.querySelector('.rr'), { backgroundColor: 'rgba(232,163,23,.22)', duration: .5 })
    .from(el.querySelector('.insight'), { clipPath: 'inset(0 100% 0 0)', duration: .7, ease: E.io }, '<'); return tl }
const buildXl = el => { const tl = mk(), xc = el.querySelectorAll('.xc'), fx = el.querySelector('.fxv')
  xc.forEach((c, i) => tl.call(() => { fx.textContent = `=B${i + 2}*C${i + 2}` }, null, i * .3))
  tl.from(xc, { opacity: 0, backgroundColor: 'rgba(232,163,23,.7)', duration: .4, stagger: .3 }, 0)
    .to(el.querySelector('.raw'), { opacity: .3, duration: .5 }, '+=.3')
    .call(() => { fx.textContent = '=SUMIF(A2:A9,F2,D2:D9)' }, null, '<')
    .from(el.querySelectorAll('.sr'), { opacity: 0, y: 10, duration: .4, stagger: .12 }, '<')
    .from(el.querySelectorAll('.sr b'), { scaleX: 0, transformOrigin: '0 50%', duration: .8, stagger: .12 }, '<.2'); return tl }
const buildWf = el => { const tl = mk(), wn = el.querySelectorAll('.wn'), cn = el.querySelectorAll('.cn')
  wn.forEach((n, k) => {
    tl.to(n, { opacity: 1, backgroundColor: '#2A4653', duration: .4 }).from(n.querySelector('p'), { clipPath: 'inset(0 0 100% 0)', duration: .5 }, '<.1')
    if (k < cn.length) { const c = cn[k]
      tl.fromTo(c.querySelectorAll('path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .5, ease: E.io }, '>-.1')
        .fromTo(c, { '--t': 0 }, { '--t': 1, duration: .5, ease: 'none' }, '<')
        .set(c.querySelector('.pk'), { opacity: 1 }, '<').to(c.querySelector('.pk'), { opacity: 0, duration: .15 }, '<.35') } })
  tl.from(el.querySelector('.rep'), { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: E.io }, '+=.1'); return tl }

const Code = ({ lines, label }) => <pre className="code" aria-label={label}><i className="bar" />{lines.map((l, k) => <div className="cl" key={k}>{hl(l) || ' '}</div>)}</pre>
const Pn = ({ file, tag, title, light, children }) => <article data-ui className={'pn' + (light ? ' light' : '')}><header><b>{file}</b><span>{tag}</span></header><h3>{title}</h3>{children}</article>

export default function Lab() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current, mm = gsap.matchMedia()
    mm.add({ desk: '(min-width: 901px)', reduce: '(prefers-reduced-motion: reduce)', any: '(min-width: 1px)' }, c => {
      const { desk, reduce } = c.conditions, P = [...el.querySelectorAll('.pn')], T = [buildPy, buildSql, buildXl, buildWf].map((b, i) => b(P[i]).progress(1, true).progress(0, true))
      if (reduce) { T.forEach(t => t.progress(1, false)); return }
      if (desk) {
        const tr = el.querySelector('.track')
        const h = gsap.to(tr, { x: () => -(tr.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: el, pin: true, scrub: .6, start: 'top top', end: () => '+=' + Math.round((tr.scrollWidth - innerWidth) * .8), invalidateOnRefresh: true } })
        P.forEach((p, i) => ScrollTrigger.create(i ? { trigger: p, containerAnimation: h, start: 'left 72%', once: true, onEnter: () => T[i].play() } : { trigger: el, start: 'top 55%', once: true, onEnter: () => T[0].play() }))
      } else P.forEach((p, i) => ScrollTrigger.create({ trigger: p, start: 'top 78%', once: true, onEnter: () => T[i].play() }))
    }, el)
    return () => mm.revert()
  }, [])
  return (
    <section id="lab" ref={ref} className="lab"><div className="lab-in">
      <div className="wrap"><h2 className="rv"><Ln>How I work</Ln><Ln>with data</Ln></h2>
        <p className="note">Four short demos on one made-up sales table of 8 rows. The outputs are computed from it, so each result matches its code. Nothing here connects to a database or runs a model.</p></div>
      <div className="track">
        <Pn file="analysis.py" tag="Python · illustrative data" title="From a CSV to revenue by region">
          <div className="two"><Code lines={PY} label="Python script" />
            <div className="side"><table className="dtab"><caption>sales.csv, 8 rows</caption><thead><tr><th>region</th><th>quantity</th><th>price</th><th>revenue</th></tr></thead>
              <tbody>{rows.map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="rv-cell">{fmt(rev[i])}</td></tr>)}</tbody></table>
              <pre className="res"><code>{outLines.map(l => <span className="oline" key={l}>{l}</span>)}</code></pre></div></div></Pn>
        <Pn file="revenue_by_region.sql" tag="SQL · simulated" title="From a query to an insight">
          <Code lines={SQL} label="SQL query" />
          <div className="stat-line"><span className="s1">Running query…</span><span className="s2">4 rows returned · simulated, no database connected</span></div><i className="prog" />
          <table className="rtab"><tbody>{ranked.map(([k, v]) => <tr className="rr" key={k}><td>{k}</td><td>{fmt(v)}</td></tr>)}</tbody></table>
          <p className="insight">{top[0]} leads with {fmt(top[1])}, {share}% of total revenue ({fmt(total)}).</p></Pn>
        <Pn light file="regional_sales.xlsx" tag="Excel · illustrative data" title="From raw rows to a regional summary">
          <div className="fxbar"><em>fx</em><code className="fxv">=SUMIF(A2:A9,F2,D2:D9)</code></div>
          <div className="two"><table className="dtab raw"><thead><tr><th>Region</th><th>Qty</th><th>Price</th><th>Revenue</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="xc">{fmt(rev[i])}</td></tr>)}</tbody></table>
            <div className="sumtab">{ranked.map(([k, v]) => <div className="sr" key={k}><span>{k}</span><i><b style={{ width: v / top[1] * 100 + '%' }} /></i><em>{fmt(v)}</em></div>)}<small>Summed over D2:D9 by region.</small></div></div></Pn>
        <Pn file="ai_workflow" tag="AI automation · simulated" title="How a report gets made without manual work">
          <div className="flow">{wf.map(([t, d], k) => <Fragment key={t}><div className="wn"><b><i>{k + 1}</i>{t}</b><p>{d}</p></div>
            {k < 4 && <div className="cn"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="ph" d="M0 50H100" pathLength="1" /><path className="pv" d="M50 0V100" pathLength="1" /></svg><i className="pk" /></div>}</Fragment>)}</div>
          <div className="rep"><b>Sales summary (sample)</b><p>{top[0]} leads with {fmt(top[1])}, {share}% of {fmt(total)}. Then {ranked.slice(1).map(r => r[0] + ' ' + fmt(r[1])).join(', ')}.</p></div>
          <p className="sim">This is a demonstration. The working version of the idea is my <a href="https://ai-business-analysis.streamlit.app" target="_blank" rel="noreferrer noopener">AI Data Analyst Dashboard</a>.</p></Pn>
      </div></div></section>)
}
