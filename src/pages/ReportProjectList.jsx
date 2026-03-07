import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, message, theme } from 'antd';
import { FileText, LayoutGrid, Loader2 } from 'lucide-react';
import { projectApi, companyApi, reportApi, featureReportApi } from '../services/api';

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
  const [generatingMap, setGeneratingMap] = useState({}); // { [projectId]: { status, type } }
  const pollIntervals = useRef({});

  useEffect(() => {
    Promise.all([projectApi.getAll(), companyApi.getAll()])
      .then(([proj, comp]) => { setProjects(proj); setCompanies(comp); })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Cleanup all poll intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(pollIntervals.current).forEach(clearInterval);
    };
  }, []);

  const getCompanyName = (id) => companies.find(c => c.id === id)?.name || `Company #${id}`;

  const startPolling = useCallback((projectId, type) => {
    // Clear any existing interval for this project
    if (pollIntervals.current[projectId]) {
      clearInterval(pollIntervals.current[projectId]);
    }

    const api = type === 'feature' ? featureReportApi : reportApi;
    const reportPath = type === 'feature'
      ? `/projects/${projectId}/feature-report`
      : `/projects/${projectId}/report`;

    pollIntervals.current[projectId] = setInterval(async () => {
      try {
        const result = await api.getStatus(projectId);
        if (result.status === 'success') {
          clearInterval(pollIntervals.current[projectId]);
          delete pollIntervals.current[projectId];
          setGeneratingMap((prev) => { const next = { ...prev }; delete next[projectId]; return next; });
          navigate(reportPath);
        } else if (result.status === 'failed') {
          clearInterval(pollIntervals.current[projectId]);
          delete pollIntervals.current[projectId];
          setGeneratingMap((prev) => { const next = { ...prev }; delete next[projectId]; return next; });
          message.error(`Report generation failed: ${result.error_message || 'Unknown error'}`);
        }
        // else still 'generating' — keep polling
      } catch (err) {
        clearInterval(pollIntervals.current[projectId]);
        delete pollIntervals.current[projectId];
        setGeneratingMap((prev) => { const next = { ...prev }; delete next[projectId]; return next; });
        message.error(`Polling error: ${err.message}`);
      }
    }, 3000);
  }, [navigate]);

  const handleView = useCallback(async (record) => {
    const projectId = record.id;
    const type = reportType;

    // Already generating? Do nothing
    if (generatingMap[projectId]) return;

    try {
      const api = type === 'feature' ? featureReportApi : reportApi;
      const result = await api.generate(projectId);
      const reportPath = type === 'feature'
        ? `/projects/${projectId}/feature-report`
        : `/projects/${projectId}/report`;

      // Check if still generating (both report types return status: 'generating')
      if (result.status === 'generating') {
        setGeneratingMap((prev) => ({ ...prev, [projectId]: { status: 'generating', type } }));
        startPolling(projectId, type);
      } else {
        // Cache hit — review report returns { status: 'ready' },
        // feature report returns raw data. Either way, navigate.
        navigate(reportPath);
      }
    } catch (err) {
      message.error(`Failed to start report: ${err.message}`);
    }
  }, [reportType, generatingMap, navigate, startPolling]);

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
      title: '', key: 'action', width: 160,
      render: (_, record) => {
        const isGenerating = !!generatingMap[record.id];
        return (
          <Button
            type="primary"
            size="small"
            disabled={isGenerating}
            icon={isGenerating
              ? <Loader2 size={12} className="spinning" />
              : reportType === 'feature' ? <LayoutGrid size={12} /> : <FileText size={12} />
            }
            onClick={(e) => { e.stopPropagation(); handleView(record); }}
          >
            {isGenerating ? 'Generating...' : 'View Report'}
          </Button>
        );
      },
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
          style: { cursor: generatingMap[record.id] ? 'default' : 'pointer' },
        })}
      />
    </div>
  );
}
