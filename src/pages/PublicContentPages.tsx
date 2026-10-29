import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Radio } from 'lucide-react';
import { FormattedNews } from '../components/FormattedNews';
import { firebaseConfigured, firebaseInitializationError, missingFirebaseConfig } from '../lib/firebase';
import { getPublishedNews, getPublishedStaff, type NewsRecord, type StaffRecord } from '../lib/content';

type LoadState<T> = { status: 'loading' | 'ready' | 'error' | 'config'; items: T[]; error?: string };

function useContent<T>(load: () => Promise<T[]>) {
  const [state, setState] = useState<LoadState<T>>({ status: 'loading', items: [] });
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!firebaseConfigured) {
      setState({ status: 'config', items: [], error: firebaseInitializationError || `Missing Firebase configuration: ${missingFirebaseConfig.join(', ')}` });
      return;
    }
    let active = true;
    setState({ status: 'loading', items: [] });
    load()
      .then((items) => { if (active) setState({ status: 'ready', items }); })
      .catch((error) => { if (active) setState({ status: 'error', items: [], error: error instanceof Error ? error.message : 'Could not load content' }); });
    return () => { active = false; };
  }, [attempt, load]);

  return { ...state, reload };
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;
}

function Feedback({ state, reload, label }: { state: LoadState<unknown>; reload: () => void; label: string }) {
  if (state.status === 'loading') return <div className="empty-state"><div className="empty-icon"><Radio/></div><span className="eyebrow">LOADING</span><h2>Loading {label}…</h2><p>Connecting to Firebase.</p></div>;
  if (state.status === 'config') return <div className="empty-state"><div className="empty-icon"><Radio/></div><span className="eyebrow">FIREBASE SETUP REQUIRED</span><h2>{label} is not connected.</h2><p>{state.error}</p></div>;
  if (state.status === 'error') return <div className="empty-state" role="alert"><div className="empty-icon"><Radio/></div><span className="eyebrow">CONTENT UNAVAILABLE</span><h2>Could not load {label}.</h2><p>{state.error}</p><button className="button button-outline" onClick={reload}>Try again <ArrowRight size={15}/></button></div>;
  if (!state.items.length) return <div className="empty-state"><div className="empty-icon"><Radio/></div><span className="eyebrow">NO PUBLISHED CONTENT</span><h2>Nothing to show yet.</h2><p>There are currently no public {label} records in Firestore.</p></div>;
  return null;
}

export function NewsPage() {
  const load = useCallback(() => getPublishedNews(), []);
  const feed = useContent<NewsRecord>(load);
  const [broken, setBroken] = useState<string[]>([]);

  return <div className="page-shell">
    <PageIntro eyebrow="COMMUNITY BULLETIN" title="News & updates" description="Published announcements from the NYSRP community."/>
    {feed.status !== 'ready' || !feed.items.length ? <Feedback state={feed} reload={feed.reload} label="news"/> :
      <div className="news-grid">{feed.items.map((post) => <article className="news-card" key={post.id}>
        {post.image && !broken.includes(post.id) ? <img className="news-image" src={post.image} alt="" onError={() => setBroken((ids) => ids.includes(post.id) ? ids : [...ids, post.id])}/> : <div className="news-image-fallback"><Radio/></div>}
        <div className="news-card-copy">
          {post.author && <span className="news-author">{post.author}</span>}
          <time dateTime={post.publishedAt}>{post.publishedAt && !Number.isNaN(Date.parse(post.publishedAt)) ? new Date(post.publishedAt).toLocaleDateString() : 'Date unavailable'}</time>
          <h2>{post.title}</h2>
          <FormattedNews content={post.content}/>
        </div>
      </article>)}</div>}
  </div>;
}

export function StaffPage() {
  const load = useCallback(() => getPublishedStaff(), []);
  const feed = useContent<StaffRecord>(load);
  const [broken, setBroken] = useState<string[]>([]);

  return <div className="page-shell">
    <PageIntro eyebrow="MEET THE TEAM" title="Public staff roster" description="Publicly listed NYSRP team members."/>
    <div className="staff-portal-callout"><div><span className="eyebrow">STAFF TOOLS</span><p>Staff management is handled in the official dashboard.</p></div><a className="button button-outline" href="https://nysrpstaffdashboard.vercel.app/" target="_blank" rel="noreferrer">Open Staff Portal <ArrowUpRight size={15}/></a></div>
    {feed.status !== 'ready' || !feed.items.length ? <Feedback state={feed} reload={feed.reload} label="staff roster"/> :
      <div className="staff-grid">{feed.items.map((person) => <article className="staff-card" key={person.id}>
        {person.avatar && !broken.includes(person.id) ? <img src={person.avatar} alt="" onError={() => setBroken((ids) => ids.includes(person.id) ? ids : [...ids, person.id])}/> : <div className="staff-avatar" aria-hidden="true">{person.name.slice(0, 1).toUpperCase()}</div>}
        <h2>{person.name}</h2><p>{person.role}</p>{person.department && <span className="staff-department">{person.department}</span>}
      </article>)}</div>}
  </div>;
}
