import { UserCog } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const members = [
  { name: 'Sarah Chen', email: 'sarah@company.com', role: 'Admin', lastActive: '2 hours ago', status: 'Active' },
  { name: 'Mark Johnson', email: 'mark@company.com', role: 'Editor', lastActive: '1 day ago', status: 'Active' },
  { name: 'Lisa Park', email: 'lisa@company.com', role: 'Viewer', lastActive: '3 days ago', status: 'Active' },
  { name: 'David Kim', email: 'david@company.com', role: 'Editor', lastActive: '1 week ago', status: 'Inactive' },
  { name: 'Rachel Green', email: 'rachel@company.com', role: 'Viewer', lastActive: 'Invited', status: 'Pending' },
];

const roleColors = { Admin: 'purple', Editor: 'blue', Viewer: 'green' };
const statusColors = { Active: 'green', Inactive: 'amber', Pending: 'blue' };

export default function TeamWorkspacePreview() {
  return (
    <ComingSoonPreview
      title="Team & Workspace"
      description="Manage team members, roles, and permissions. Control who can view, edit, and share competitive intelligence within your organization."
      icon={<UserCog size={28} />}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="preview-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Active</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>{m.email}</td>
                <td><span className={`preview-badge preview-badge-${roleColors[m.role]}`}>{m.role}</span></td>
                <td style={{ color: 'var(--gray-500)' }}>{m.lastActive}</td>
                <td><span className={`preview-badge preview-badge-${statusColors[m.status]}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComingSoonPreview>
  );
}
