import { reportsApi } from '../../api/reports.api';
import { Button } from '../../components/ui/Button';

export function ReportsPage() {
  async function open(kind: string) {
    const res = await reportsApi.pdf(kind);
    const blob = await res.blob();
    window.open(URL.createObjectURL(blob));
  }
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Reports</h1>
      <p className="text-sm">CBTP progress, internship activity, project status, delayed work. PDFs include institution name and timestamp.</p>
      <div className="flex flex-wrap gap-2">
        {['cbtp', 'internship', 'project', 'delayed'].map((k) => (
          <Button key={k} onClick={() => open(k)}>
            {k} PDF
          </Button>
        ))}
      </div>
    </div>
  );
}
