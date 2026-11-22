import { useState } from 'react';
import { projectsApi } from '../../api/projects.api';
import { aiApi } from '../../api/ai.api';
import { Button } from '../../components/ui/Button';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function TitleSubmitPage() {
  const [hits, setHits] = useState<{ title: string; score: number; advisory: string }[]>([]);
  return (
    <form
      className="card max-w-2xl space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const title = String(fd.get('title'));
        const created = (await projectsApi.create({
          title,
          problem: fd.get('problem'),
          objectives: fd.get('objectives'),
          tools: fd.get('tools'),
          mode: 'individual',
        })) as { project: { id: string }; similarity: { items: typeof hits } };
        setHits(created.similarity.items);
        await projectsApi.submitTitle(created.project.id);
      }}
    >
      <h1 className="font-serif text-3xl">Submit project title</h1>
      <AdvisoryBanner>
        Similarity scores are TF-IDF cosine overlap. They are not a plagiarism verdict and do not auto-reject.
      </AdvisoryBanner>
      <input name="title" className="w-full rounded border px-2 py-1" placeholder="Title" required />
      <textarea name="problem" className="w-full rounded border px-2 py-1" placeholder="Problem / abstract" required />
      <textarea name="objectives" className="w-full rounded border px-2 py-1" placeholder="Objectives" required />
      <input name="tools" className="w-full rounded border px-2 py-1" placeholder="Tools" />
      <Button
        type="button"
        onClick={async () => {
          const title = (document.querySelector('[name=title]') as HTMLInputElement)?.value;
          const r = (await aiApi.titleSimilarity(title)) as { items: typeof hits };
          setHits(r.items);
        }}
      >
        Check similar titles
      </Button>
      <Button type="submit">Submit for advisor review</Button>
      {hits.length > 0 && (
        <ul className="text-sm">
          {hits.map((h) => (
            <li key={h.title}>
              {h.title} — {(h.score * 100).toFixed(0)}% · {h.advisory}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
