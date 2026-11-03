import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { M, Ln } from './ui.jsx'
import Lab from './Lab.jsx'
import Projects from './Projects.jsx'
gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'rahulsingh52203@gmail.com'
const stats = [['100,000+', 'records analysed with Pandas and NumPy at Novem Control'], ['85%', 'accuracy from regression models on operational data'], ['15%', 'less manual effort for a team of 3 analysts, through Python and SQL automation'], ['10%', 'improvement in process efficiency from the pattern analysis']]
const jobs = [
  { when: 'Dec 2025 – May 2026', role: 'Software Development Intern', co: 'BridgeLabz Solutions', pts: ['Contributed to The Practice App, an AI-powered learning and assessment platform with coding assessments, automated evaluation, adaptive feedback, leaderboards and mentor dashboards.', 'Supported backend assessment workflows that personalise learning paths from each user’s performance data and progress analytics.', 'Took part in code reviews and submitted weekly deliverables against a roadmap set by senior mentors.'] },
  { when: 'Dec 2024 – Jun 2025', role: 'AI Workflow & Data Analyst Intern', co: 'Novem Control', pts: ['Automated data processing with Python and SQL, cutting manual effort by 15% across a team of 3 analysts.', 'Analysed 100,000+ records with Pandas and NumPy, contributing to a 10% gain in process efficiency.', 'Built regression models at 85% accuracy and Tableau dashboards used by the team for daily reporting.', 'Tested ChatGPT and Claude for business reporting and refined prompts to improve accuracy and relevance.'] },
]
const skills = { 'AI and automation': ['ChatGPT, Claude, Groq LLaMA', 'Prompt engineering', 'n8n, Zapier, Make'], 'Programming and data': ['Python: Pandas, NumPy, Plotly', 'SQL', 'ETL, data warehousing, star schema', 'Excel, Google Sheets'], 'Visualisation and BI': ['Tableau', 'Power BI', 'Plotly, Streamlit'], 'APIs and delivery': ['REST APIs, Groq API', 'HubSpot CRM', 'GitHub CI/CD'] }

export default function App() {
  const root = useRef(null), [open, setOpen] = useState(false)
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis, tick
    if (!reduce) { lenis = new Lenis({ lerp: .09, anchors: true }); lenis.on('scroll', ScrollTrigger.update); tick = t => lenis.raf(t * 1000); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0) }
    const ctx = gsap.context(() => {
      const $ = s => gsap.utils.toArray(s)
      gsap.to('.bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } })
      if (reduce) return
      // Hero entrance: headline lines slide up in turn, photo settles in, then copy and buttons.
      gsap.timeline({ defaults: { ease: M.ease.out } })
        .from('.hero .ln>span', { yPercent: 115, duration: .8, stagger: .12 }, 0)
        .from('.photo-wrap', { opacity: 0, scale: .94, duration: .9 }, .3)
        .from('.hero .lead', { opacity: 0, duration: .8 }, .7)
        .from('.hero .cta', { opacity: 0, y: 12, duration: .8 }, .9)
      $('.rv').forEach(el => gsap.from(el.querySelectorAll('.ln>span'), { yPercent: 115, duration: M.dur.m, stagger: M.gap, ease: M.ease.out, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }))
      gsap.fromTo('.tl-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 65%', end: 'bottom 75%', scrub: true } })
      $('.job').forEach(el => gsap.from(el.querySelector('.dot'), { scale: 0, duration: M.dur.s, ease: 'back.out(3)', scrollTrigger: { trigger: el, start: 'top 70%', once: true } }))
    }, root)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
    return () => { ctx.revert(); if (tick) gsap.ticker.remove(tick); lenis?.destroy() }
  }, [])
  return (
    <div ref={root}>
      <div className="bar" />
      <nav><b>Rahul Singh</b>
        <ul id="navlinks" className={open ? 'open' : ''}>{['Impact', 'Lab', 'Experience', 'Projects', 'Skills', 'Contact'].map(s => <li key={s}><a href={'#' + s.toLowerCase()} onClick={() => setOpen(false)}>{s}</a></li>)}</ul>
        <a className="btn sm" href="#contact">Hire me</a>
        <button className="menu" aria-expanded={open} aria-controls="navlinks" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button></nav>
      <main>
        <header className="hero"><div className="wrap hero-in">
          <div className="hero-l">
            <h1><Ln>I turn raw data</Ln><Ln>into decisions</Ln><Ln>people can act on.</Ln></h1>
            <p className="lead">I’m Rahul, a data analyst and AI workflow builder in Chandigarh. I work with Python, SQL, Tableau and LLM tools, and I’m finishing my MCA at Chitkara University.</p>
            <div className="cta"><a className="btn amber" href="#projects">See my projects</a><a className="btn" href="/Rahul_Singh_Resume.pdf" download>Download résumé</a></div>
          </div>
          <div className="photo-wrap"><div className="photo"><img src="/profile.jpg" alt="Portrait of Rahul Singh seated at a table" /></div></div>
        </div></header>

        <section id="impact" className="sec dark"><div className="wrap split">
          <h2 className="rv"><Ln>What the work</Ln><Ln>has moved</Ln></h2>
          <div className="stats">{stats.map(([n, t]) => <div className="stat" key={t}><b>{n}</b><span>{t}</span></div>)}</div>
        </div></section>

        <Lab />

        <section id="experience" className="sec"><div className="wrap split">
          <h2 className="rv"><Ln>Where I’ve</Ln><Ln>worked</Ln></h2>
          <div className="tl"><i className="tl-line" />
            {jobs.map(j => <div className="job" key={j.role}><i className="dot" /><time>{j.when}</time><h3>{j.role}</h3><p className="co">{j.co}</p><ul>{j.pts.map(p => <li key={p}>{p}</li>)}</ul></div>)}</div>
        </div></section>

        <section id="projects" className="sec tint"><div className="wrap split">
          <h2 className="rv"><Ln>Things I’ve</Ln><Ln>built</Ln></h2>
          <Projects />
        </div></section>

        <section id="skills" className="sec"><div className="wrap split">
          <h2 className="rv"><Ln>Tools I use</Ln></h2>
          <div><div className="skills">{Object.entries(skills).map(([k, v]) => <div key={k}><h3>{k}</h3><ul>{v.map(i => <li key={i}>{i}</li>)}</ul></div>)}</div>
            <div className="edu"><div><h3>Education</h3><p>MCA, Computer Science<small>Chitkara University, 2025 – Present</small></p><p>BCA, Computer Science<small>Chitkara University, graduated Jun 2025</small></p></div>
              <div><h3>Certifications</h3><p>AI Fluency Framework & Foundations<small>Anthropic, Mar 2026</small></p><p>Introduction to Data Science<small>Cisco, Nov 2025</small></p><p>Data Analytics Professional<small>Deloitte, Mar 2025</small></p></div></div></div>
        </div></section>

        <section id="contact" className="sec contact"><div className="wrap split">
          <h2 className="rv"><Ln>Let’s work</Ln><Ln>together.</Ln></h2>
          <div><p className="open">Open to full-time data analyst and AI automation roles.</p><a className="mail" href={'mailto:' + EMAIL}>{EMAIL}</a>
            <div className="links"><a href="https://www.linkedin.com/in/rahul-singh-analyst" target="_blank" rel="noreferrer noopener">LinkedIn</a><a href="https://github.com/RahulAnalyzer" target="_blank" rel="noreferrer noopener">GitHub</a><a href="/Rahul_Singh_Resume.pdf" download>Résumé (PDF)</a></div></div>
        </div></section>
      </main>
      <footer><div className="wrap">© 2026 Rahul Singh</div></footer>
    </div>)
}
