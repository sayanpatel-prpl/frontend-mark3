import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, message, theme } from 'antd';
import { FileText, LayoutGrid } from 'lucide-react';
import { projectApi, companyApi } from '../services/api';

const statusMap = {
  idle: { color: 'default', label: 'Idle' },
  pending: { color: 'orange', label: 'Pending' },
  in_progress: { color: 'processing', label: 'In Progress' },
  summarizing: { color: 'orange', label: 'Building Mega Summary' },
  completed: { color: 'green', label: 'Completed' },
  completed_with_errors: { color: 'red', label: 'Completed (errors)' },
  failed: { color: 'red', label: 'Failed' },
};

export default function ReportProjectList({ reportType }) {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectApi.getAll(), companyApi.getAll()])
      .then(([proj, comp]) => { setProjects(proj); setCompanies(comp); })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getCompanyName = (id) => companies.find(c => c.id === id)?.name || `Company #${id}`;

  const handleView = (record) => {
    if (reportType === 'feature') {
      navigate(`/projects/${record.id}/feature-report`);
    } else {
      navigate(`/projects/${record.id}/report`);
    }
  };

  const columns = [
    { title: 'Project', dataIndex: 'name', key: 'name' },
    {
      title: 'Main Company', dataIndex: 'main_company_id', key: 'main',
      render: (id) => getCompanyName(id),
    },
    {
      title: 'Competitors', key: 'competitors',
      render: (_, record) => {
        const names = (record.competitors || []).map(c => c.name);
        if (!names.length) return <span style={{ color: token.colorTextQuaternary }}>-</span>;
        return <span style={{ color: token.colorTextSecondary }}>{names.join(', ')}</span>;
      },
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => {
        const info = statusMap[status] || statusMap.idle;
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: 'Created', dataIndex: 'created_at', key: 'created',
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: '', key: 'action', width: 140,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={reportType === 'feature' ? <LayoutGrid size={12} /> : <FileText size={12} />}
          onClick={(e) => { e.stopPropagation(); handleView(record); }}
        >
          View Report
        </Button>
      ),
    },
  ];

  const title = reportType === 'feature' ? 'Feature Listing' : 'Review Intelligence';

  return (
    <div style={{
      background: token.colorBgContainer,
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${token.colorBorderSecondary}`,
    }}>
      <h2 style={{ margin: '0 0 16px' }}>{title}</h2>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleView(record),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
}
