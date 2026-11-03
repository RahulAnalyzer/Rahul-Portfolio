// Motion system: one place for durations, easing and stagger.
// s = feedback, m = reveals, l = hero and scene transitions. out = entrances, io = drawing and travel.
export const M = { dur: { s: .4, m: .8, l: 1.2 }, ease: { out: 'power4.out', io: 'power3.inOut' }, gap: .08 }
export const Ln = ({ children }) => <span className="ln"><span>{children}</span></span>
