import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { cbtpApi } from '../../api/cbtp.api';
import { Button } from '../../components/ui/Button';

export function GroupAssignPage() {
  const { id } = useParams();
  const [studentId, setStudentId] = useState('');
  return (
    <div className="card space-y-3">
      <h1 className="font-serif text-2xl">Assign student to group</h1>
      <p className="text-sm">Paste the student’s TrackBridge user id (from Users admin) or seed a known student.</p>
      <input className="w-full rounded border px-2 py-1" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student user id" />
      <Button
        onClick={async () => {
          if (id) await cbtpApi.addMember(id, studentId);
          alert('Assigned (or already a member).');
        }}
      >
        Assign
      </Button>
    </div>
  );
}
