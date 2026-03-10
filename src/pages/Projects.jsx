import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, Select, Tag, Progress, Space, Card as AntCard, Popconfirm, message, theme } from 'antd';
import { Plus, FileText, LayoutGrid } from 'lucide-react';
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

function CompanyCard({ projectId, companyId, companyName, isMain, progress, onGenerate }) {
  const { token } = theme.useToken();
  const chunkInfo = progress?.chunks;
  const megaInfo = progress?.mega_summary;
  const isWorking = megaInfo?.status === 'in_progress' || megaInfo?.status === 'summarizing';

  const pct = chunkInfo?.total > 0 ? Math.round((chunkInfo.completed / chunkInfo.total) * 100) : 0;
  const statusInfo = statusMap[megaInfo?.status] || statusMap.idle;

  return (
    <AntCard size="small" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Space>
          <strong>{companyName}</strong>
          {isMain && <Tag color="blue" style={{ fontSize: 10 }}>MAIN</Tag>}
        </Space>
        <Space>
          {megaInfo && <Tag color={statusInfo.color}>{statusInfo.label}</Tag>}
          <Button
            size="small"
            onClick={(e) => { e.stopPropagation(); onGenerate(projectId, companyId); }}
            disabled={isWorking}
          >
            {megaInfo?.status === 'completed' ? 'Regenerate' : megaInfo?.status === 'failed' ? 'Retry' : 'Generate'}
          </Button>
        </Space>
      </div>

      {chunkInfo && chunkInfo.total > 0 && (
        <div style={{ marginBottom: 8 }}>
          <Progress
            percent={pct}
            size="small"
            format={() => `${chunkInfo.completed}/${chunkInfo.total} chunks`}
          />
          {chunkInfo.failed > 0 && (
            <span style={{ fontSize: 12, color: '#ef4444' }}>{chunkInfo.failed} failed</span>
          )}
        </div>
      )}

      {megaInfo?.text && megaInfo.status === 'completed' && (
        <div style={{
          whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6, color: token.colorTextSecondary,
          padding: 12, background: token.colorBgLayout, borderRadius: 4,
          border: `1px solid ${token.colorBorderSecondary}`,
          maxHeight: 400, overflowY: 'auto',
        }}>
          {megaInfo.text}
        </div>
      )}
      {megaInfo?.status === 'summarizing' && (
        <div style={{ fontSize: 13, color: '#f59e0b', fontStyle: 'italic' }}>
          All chunks processed. Generating mega summary...
        </div>
      )}
    </AntCard>
  );
}

const versionStatusMap = {
  generating: { color: 'processing', label: 'Generating' },
  classifying: { color: 'orange', label: 'Classifying' },
  comparing: { color: 'orange', label: 'Comparing' },
  success: { color: 'green', label: 'Success' },
  failed: { color: 'red', label: 'Failed' },
};

function ReportVersionsTable({ versions, loading, onActivate, activatingId }) {
  if (!versions?.length && !loading) return <div style={{ color: '#999', fontSize: 13 }}>No versions yet</div>;

  const cols = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Date', dataIndex: 'created_at', key: 'date', width: 170,
      render: (v) => new Date(v).toLocaleString(),
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 120,
      render: (status) => {
        const info = versionStatusMap[status] || { color: 'default', label: status };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: 'Active', dataIndex: 'is_active', key: 'active', width: 80,
      render: (active) => active ? <Tag color="green">Active</Tag> : '—',
    },
    {
      title: '', key: 'actions', width: 100,
      render: (_, record) => (
        record.status === 'success' && !record.is_active ? (
          <Button
            size="small"
            type="primary"
            ghost
            loading={activatingId === record.id}
            onClick={(e) => { e.stopPropagation(); onActivate(record.id); }}
          >
            Activate
          </Button>
        ) : null
      ),
    },
  ];

  return (
    <Table
      columns={cols}
      dataSource={versions}
      rowKey="id"
      loading={loading}
      size="small"
      pagination={false}
      style={{ marginBottom: 8 }}
    />
  );
}

export default function Projects() {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [projectProgress, setProjectProgress] = useState({});
  const [form] = Form.useForm();
  const [reviewVersions, setReviewVersions] = useState({});
  const [featureVersions, setFeatureVersions] = useState({});
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [activatingId, setActivatingId] = useState(null);
  const pollRef = useRef(null);
  const progressPollRef = useRef(null);

  const fetchVersions = async (projectId) => {
    setVersionsLoading(true);
    try {
      const [rv, fv] = await Promise.all([
        reportApi.getVersions(projectId),
        featureReportApi.getVersions(projectId),
      ]);
      setReviewVersions(prev => ({ ...prev, [projectId]: rv }));
      setFeatureVersions(prev => ({ ...prev, [projectId]: fv }));
    } catch (_) {}
    setVersionsLoading(false);
  };

  const handleActivateReviewVersion = async (projectId, versionId) => {
    setActivatingId(versionId);
    try {
      await reportApi.activateVersion(projectId, versionId);
      message.success('Review report version activated');
      fetchVersions(projectId);
    } catch (err) { message.error(err.message); }
    setActivatingId(null);
  };

  const handleActivateFeatureVersion = async (projectId, versionId) => {
    setActivatingId(versionId);
    try {
      await featureReportApi.activateVersion(projectId, versionId);
      message.success('Feature report version activated');
      fetchVersions(projectId);
    } catch (err) { message.error(err.message); }
    setActivatingId(null);
  };

  const fetchProjects = async () => {
    try {
      const data = await projectApi.getAll();
      setProjects(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await companyApi.getAll();
      setCompanies(data);
    } catch (_) {}
  };

  useEffect(() => { fetchProjects(); fetchCompanies(); }, []);

  // Auto-poll projects list when any project is in_progress
  useEffect(() => {
    const hasInProgress = projects.some(p => p.status === 'in_progress');
    if (hasInProgress) {
      pollRef.current = setInterval(fetchProjects, 5000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [projects]);

  // Fetch project details when expanded
  useEffect(() => {
    if (!expandedKey) { setExpandedProject(null); return; }
    projectApi.getById(expandedKey)
      .then(data => {
        setExpandedProject(data);
        fetchProjectProgress(expandedKey);
        fetchVersions(expandedKey);
      })
      .catch(err => message.error(err.message));
  }, [expandedKey]);

  const fetchProjectProgress = async (projectId) => {
    try {
      const data = await projectApi.getProjectProgress(projectId);
      setProjectProgress(prev => ({ ...prev, [projectId]: data }));
    } catch (_) {}
  };

  // Auto-poll progress when expanded project is in_progress
  useEffect(() => {
    clearInterval(progressPollRef.current);
    if (!expandedKey) return;

    const progress = projectProgress[expandedKey];
    const project = projects.find(p => p.id === expandedKey);
    const isActive = project?.status === 'in_progress' ||
      (progress && Object.values(progress.companies || {}).some(c =>
        c.mega_summary?.status === 'in_progress' || c.mega_summary?.status === 'summarizing'
      ));

    if (isActive) {
      progressPollRef.current = setInterval(() => fetchProjectProgress(expandedKey), 3000);
    }
    return () => clearInterval(progressPollRef.current);
  }, [expandedKey, projectProgress, projects]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = await projectApi.create(values);
      setModalOpen(false);
      form.resetFields();
      fetchProjects();
      setExpandedKey(data.id);
    } catch (err) {
      if (err.message) message.error(err.message);
    }
  };

  const handleGenerate = async (projectId, companyId) => {
    try {
      await projectApi.generateSummary(projectId, companyId);
      fetchProjectProgress(projectId);
      fetchProjects();
    } catch (err) {
      message.error(err.message);
    }
  };

  const getCompanyName = (id) => companies.find(c => c.id === id)?.name || `Company #${id}`;

  const mainCompanyId = form.getFieldValue('main_company_id');

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Main Company', dataIndex: 'main_company_id', key: 'main',
      render: (id) => getCompanyName(id),
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
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<FileText size={12} />}
            onClick={(e) => { e.stopPropagation(); navigate(`/projects/${record.id}/report`); }}
          >
            Report
          </Button>
          <Button
            size="small"
            icon={<LayoutGrid size={12} />}
            onClick={(e) => { e.stopPropagation(); navigate(`/projects/${record.id}/feature-report`); }}
          >
            Feature Report
          </Button>
          <Popconfirm title="Deactivate this project?" onConfirm={async () => {
            try {
              await projectApi.delete(record.id);
              if (expandedKey === record.id) setExpandedKey(null);
              fetchProjects();
            } catch (err) { message.error(err.message); }
          }}>
            <Button size="small" danger onClick={e => e.stopPropagation()}>Deactivate</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{
      background: token.colorBgContainer,
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${token.colorBorderSecondary}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Projects</h2>
        <Button type="primary" icon={<Plus size={14} />} onClick={() => {
          form.resetFields();
          setModalOpen(true);
        }}>
          Create Project
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKey ? [expandedKey] : [],
          onExpand: (expanded, record) => setExpandedKey(expanded ? record.id : null),
          expandedRowRender: (record) => {
            if (!expandedProject) return <div style={{ padding: 16 }}>Loading...</div>;
            const progress = projectProgress[record.id];
            return (
              <div style={{ padding: '8px 0' }}>
                <h4 style={{ margin: '0 0 12px' }}>Main Company</h4>
                <CompanyCard
                  projectId={record.id}
                  companyId={record.main_company_id}
                  companyName={getCompanyName(record.main_company_id)}
                  isMain
                  progress={progress?.companies?.[record.main_company_id]}
                  onGenerate={handleGenerate}
                />
                {expandedProject.competitors?.length > 0 && (
                  <>
                    <h4 style={{ margin: '16px 0 12px' }}>Competitors ({expandedProject.competitors.length})</h4>
                    {expandedProject.competitors.map(comp => (
                      <CompanyCard
                        key={comp.id}
                        projectId={record.id}
                        companyId={comp.id}
                        companyName={comp.name}
                        isMain={false}
                        progress={progress?.companies?.[comp.id]}
                        onGenerate={handleGenerate}
                      />
                    ))}
                  </>
                )}

                <h4 style={{ margin: '24px 0 12px' }}>Report Versions</h4>
                <div style={{ marginBottom: 16 }}>
                  <h5 style={{ margin: '0 0 8px', fontWeight: 500 }}>Review Report</h5>
                  <ReportVersionsTable
                    versions={reviewVersions[record.id]}
                    loading={versionsLoading}
                    onActivate={(versionId) => handleActivateReviewVersion(record.id, versionId)}
                    activatingId={activatingId}
                  />
                </div>
                <div>
                  <h5 style={{ margin: '0 0 8px', fontWeight: 500 }}>Feature Report</h5>
                  <ReportVersionsTable
                    versions={featureVersions[record.id]}
                    loading={versionsLoading}
                    onActivate={(versionId) => handleActivateFeatureVersion(record.id, versionId)}
                    activatingId={activatingId}
                  />
                </div>
              </div>
            );
          },
        }}
        onRow={(record) => ({
          onClick: () => setExpandedKey(expandedKey === record.id ? null : record.id),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title="Create Project"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okText="Create"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Project Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Main Company" name="main_company_id" rules={[{ required: true }]}>
            <Select
              placeholder="Select a company..."
              options={companies.map(c => ({ value: c.id, label: c.name }))}
              showSearch
              filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.main_company_id !== cur.main_company_id}
          >
            {({ getFieldValue }) => {
              const mainId = getFieldValue('main_company_id');
              if (!mainId) return null;
              return (
                <Form.Item label="Competitors" name="competitor_ids">
                  <Select
                    mode="multiple"
                    placeholder="Select competitors..."
                    options={companies
                      .filter(c => c.id !== mainId)
                      .map(c => ({ value: c.id, label: c.name }))}
                    showSearch
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
