import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';

export function ProposePlacementPage() {
  return (
    <form
      className="card max-w-xl space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await internshipsApi.propose({
          proposedOrgName: fd.get('org'),
          proposedOrgAddress: fd.get('addr'),
          proposedOrgContact: fd.get('contact'),
          proposedRole: fd.get('role'),
          coverNote: fd.get('note'),
        });
        alert('Proposal sent to the coordinator');
      }}
    >
      <h1 className="font-serif text-2xl">Propose a self-sourced placement</h1>
      <input name="org" className="w-full rounded border px-2 py-1" placeholder="Organisation name" />
      <input name="addr" className="w-full rounded border px-2 py-1" placeholder="Address" />
      <input name="contact" className="w-full rounded border px-2 py-1" placeholder="Contact" />
      <input name="role" className="w-full rounded border px-2 py-1" placeholder="Proposed role" />
      <textarea name="note" className="w-full rounded border px-2 py-1" placeholder="Cover note" />
      <Button type="submit">Submit proposal</Button>
    </form>
  );
}
