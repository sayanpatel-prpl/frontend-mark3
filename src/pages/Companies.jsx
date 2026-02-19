import { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Tag, Space, message } from 'antd';
import { Plus, RefreshCw } from 'lucide-react';
import { companyApi } from '../services/api';

const statusTag = (status) => {
  if (!status || status === 'none') return <Tag>-</Tag>;
  const map = {
    pending: 'orange', in_progress: 'orange', enriched: 'green', completed: 'green', failed: 'red',
    scraping: 'orange', analyzing: 'orange', success: 'green',
  };
  return <Tag color={map[status] || 'default'}>{status}</Tag>;
};

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [summaryProgress, setSummaryProgress] = useState({});
  const [websiteScrapeProgress, setWebsiteScrapeProgress] = useState({});
  const [form] = Form.useForm();
  const pollRef = useRef(null);
  const summaryPollRef = useRef(null);
  const websitePollRef = useRef(null);

  const fetchCompanies = async () => {
    try {
      const data = await companyApi.getAll(showInactive);
      setCompanies(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, [showInactive]);

  // Auto-poll while any company has in-progress status
  useEffect(() => {
    const hasPending = companies.some(c =>
      c.enrichment_status === 'pending' ||
      c.g2_status === 'in_progress' || c.gartner_status === 'in_progress' ||
      c.trustpilot_status === 'in_progress' || c.capterra_status === 'in_progress' ||
      c.summary_status === 'in_progress' ||
      c.website_scrape_status === 'scraping' || c.website_scrape_status === 'analyzing'
    );
    if (hasPending) {
      pollRef.current = setInterval(fetchCompanies, 3000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [companies, showInactive]);

  // Poll summary progress
  useEffect(() => {
    const inProgressIds = companies.filter(c => c.summary_status === 'in_progress').map(c => c.id);
    if (inProgressIds.length === 0) { clearInterval(summaryPollRef.current); return; }

    const pollProgress = async () => {
      const updates = {};
      for (const id of inProgressIds) {
        try { updates[id] = await companyApi.getSummaryProgress(id); } catch (_) {}
      }
      setSummaryProgress(prev => ({ ...prev, ...updates }));
    };
    pollProgress();
    summaryPollRef.current = setInterval(pollProgress, 3000);
    return () => clearInterval(summaryPollRef.current);
  }, [companies]);

  // Poll website scrape progress + fetch counts for completed scrapes
  useEffect(() => {
    const inProgressIds = companies
      .filter(c => c.website_scrape_status === 'scraping' || c.website_scrape_status === 'analyzing')
      .map(c => c.id);
    const successIds = companies
      .filter(c => c.website_scrape_status === 'success' && !websiteScrapeProgress[c.id])
      .map(c => c.id);

    // One-time fetch for completed scrapes to get success/failed counts
    if (successIds.length > 0) {
      (async () => {
        const updates = {};
        for (const id of successIds) {
          try { updates[id] = await companyApi.getWebsiteScrapeProgress(id); } catch (_) {}
        }
        setWebsiteScrapeProgress(prev => ({ ...prev, ...updates }));
      })();
    }

    if (inProgressIds.length === 0) { clearInterval(websitePollRef.current); return; }

    const pollProgress = async () => {
      const updates = {};
      for (const id of inProgressIds) {
        try { updates[id] = await companyApi.getWebsiteScrapeProgress(id); } catch (_) {}
      }
      setWebsiteScrapeProgress(prev => ({ ...prev, ...updates }));
    };
    pollProgress();
    websitePollRef.current = setInterval(pollProgress, 3000);
    return () => clearInterval(websitePollRef.current);
  }, [companies]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCompany) {
        await companyApi.update(editingCompany.id, values);
        message.success('Company updated');
      } else {
        await companyApi.create(values);
        message.success('Company created');
      }
      setModalOpen(false);
      setEditingCompany(null);
      form.resetFields();
      fetchCompanies();
    } catch (err) {
      if (err.message) message.error(err.message);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    form.setFieldsValue({
      name: company.name || '',
      website: company.website || '',
      g2_reviews_url: company.g2_reviews_url || '',
      gartner_reviews_url: company.gartner_reviews_url || '',
      capterra_reviews_url: company.capterra_reviews_url || '',
      product_website_url: company.product_website_url || '',
    });
    setModalOpen(true);
  };

  const refreshAction = (fn, id) => async () => {
    try { await fn(id); fetchCompanies(); } catch (err) { message.error(err.message); }
  };

  const reviewCol = (key, statusKey, urlKey, refreshFn) => ({
    title: key,
    key,
    width: 120,
    render: (_, company) => {
      const status = company[statusKey];
      const count = company.review_counts?.[key.toLowerCase()] || 0;
      const hasUrl = urlKey ? company[urlKey] : true;
      return (
        <Space size={4}>
          {status === 'in_progress' ? (
            statusTag('in_progress')
          ) : status === 'failed' ? (
            statusTag('failed')
          ) : (
            <Tag color={count > 0 ? 'green' : 'default'}>{count}</Tag>
          )}
          {hasUrl && status !== 'in_progress' && (
            <Button size="small" type="link" icon={<RefreshCw size={12} />}
              onClick={refreshAction(refreshFn, company.id)} />
          )}
        </Space>
      );
    },
  });

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left', width: 160 },
    { title: 'Website', dataIndex: 'website', key: 'website', width: 140, render: (v) => v || '-' },
    {
      title: 'LinkedIn', key: 'linkedin', width: 120,
      render: (_, c) => (
        <Space size={4}>
          {statusTag(c.enrichment_status)}
          <Button size="small" type="link" icon={<RefreshCw size={12} />}
            onClick={refreshAction(companyApi.refreshLinkedIn, c.id)} />
        </Space>
      ),
    },
    reviewCol('G2', 'g2_status', 'g2_reviews_url', companyApi.refreshG2),
    reviewCol('Gartner', 'gartner_status', 'gartner_reviews_url', companyApi.refreshGartner),
    reviewCol('Trustpilot', 'trustpilot_status', null, companyApi.refreshTrustpilot),
    reviewCol('Capterra', 'capterra_status', 'capterra_reviews_url', companyApi.refreshCapterra),
    {
      title: 'Website Scrape', key: 'website_scrape', width: 180,
      render: (_, c) => {
        const status = c.website_scrape_status;
        const prog = websiteScrapeProgress[c.id];
        const hasUrl = c.product_website_url;

        if (status === 'scraping') {
          return <Tag color="orange">Scraping...</Tag>;
        }
        if (status === 'analyzing') {
          const analyzed = prog?.pages_analyzed ?? c.website_pages_analyzed ?? 0;
          const total = prog?.pages_total ?? c.website_pages_total ?? 0;
          return <Tag color="orange">Analyzing {analyzed}/{total}</Tag>;
        }
        if (status === 'success') {
          const success = prog?.pages_success ?? c.website_pages_scraped ?? 0;
          const total = prog?.pages_total ?? c.website_pages_total ?? c.website_pages_scraped ?? 0;
          const failed = prog?.pages_failed ?? 0;
          return (
            <Space size={4} wrap>
              <Tag color={failed > 0 ? 'orange' : 'green'}>{success}/{total}</Tag>
              {failed > 0 && (
                <Button size="small" type="link"
                  onClick={refreshAction(companyApi.retryFailedWebsiteAnalysis, c.id)}>Retry {failed}</Button>
              )}
              <Button size="small" type="link" icon={<RefreshCw size={12} />}
                onClick={refreshAction(companyApi.refreshWebsiteScrape, c.id)} />
            </Space>
          );
        }
        if (status === 'failed') {
          return (
            <Space size={4}>
              <Tag color="red">failed</Tag>
              {hasUrl && (
                <Button size="small" type="link" onClick={refreshAction(companyApi.refreshWebsiteScrape, c.id)}>Retry</Button>
              )}
            </Space>
          );
        }
        if (hasUrl) {
          return <Button size="small" onClick={refreshAction(companyApi.refreshWebsiteScrape, c.id)}>Scrape</Button>;
        }
        return <Tag>-</Tag>;
      },
    },
    {
      title: 'Total', key: 'total', width: 80,
      render: (_, c) => {
        const rc = c.review_counts || {};
        return (rc.g2 || 0) + (rc.gartner || 0) + (rc.trustpilot || 0) + (rc.capterra || 0);
      },
    },
    {
      title: 'AI Summaries', key: 'summaries', width: 140,
      render: (_, c) => {
        const prog = summaryProgress[c.id];
        if (c.summary_status === 'in_progress') {
          return <Tag color="orange">{prog ? `${prog.summarized}/${prog.total}` : 'in_progress'}</Tag>;
        }
        if (c.summary_status === 'completed') {
          return (
            <Space size={4}>
              <Tag color="green">completed</Tag>
              <Button size="small" type="link" icon={<RefreshCw size={12} />}
                onClick={refreshAction(companyApi.generateSummaries, c.id)} />
            </Space>
          );
        }
        if (c.summary_status === 'failed') {
          return (
            <Space size={4}>
              <Tag color="red">failed</Tag>
              <Button size="small" type="link" onClick={refreshAction(companyApi.generateSummaries, c.id)}>Retry</Button>
            </Space>
          );
        }
        return <Button size="small" onClick={refreshAction(companyApi.generateSummaries, c.id)}>Generate</Button>;
      },
    },
    {
      title: 'Status', dataIndex: 'is_active', key: 'status', width: 80,
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions', key: 'actions', width: 160, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Edit</Button>
          {record.is_active ? (
            <Button size="small" danger onClick={async () => {
              try { await companyApi.delete(record.id); message.success('Deactivated'); fetchCompanies(); }
              catch (err) { message.error(err.message); }
            }}>Deactivate</Button>
          ) : (
            <Button size="small" type="primary" ghost onClick={async () => {
              try { await companyApi.restore(record.id); message.success('Restored'); fetchCompanies(); }
              catch (err) { message.error(err.message); }
            }}>Restore</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Companies</h2>
        <Space>
          <span style={{ color: '#888', fontSize: 13 }}>Show inactive</span>
          <Switch size="small" checked={showInactive} onChange={setShowInactive} />
          <Button type="primary" icon={<Plus size={14} />} onClick={() => {
            setEditingCompany(null); form.resetFields(); setModalOpen(true);
          }}>Add Company</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={companies}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={false}
        scroll={{ x: 1500 }}
        rowClassName={(r) => !r.is_active ? 'ant-table-row-inactive' : ''}
      />

      <Modal
        title={editingCompany ? 'Edit Company' : 'Add Company'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); setEditingCompany(null); form.resetFields(); }}
        okText={editingCompany ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Website" name="website" rules={[{ required: true }]}>
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="Product Website URL" name="product_website_url">
            <Input placeholder="https://www.example.com" />
          </Form.Item>
          <Form.Item label="G2 Reviews URL" name="g2_reviews_url">
            <Input placeholder="https://www.g2.com/products/company-slug/reviews" />
          </Form.Item>
          <Form.Item label="Gartner Reviews URL" name="gartner_reviews_url">
            <Input placeholder="https://www.gartner.com/reviews/market/.../vendor/.../product/..." />
          </Form.Item>
          <Form.Item label="Capterra Reviews URL" name="capterra_reviews_url">
            <Input placeholder="https://www.capterra.com/p/.../reviews/" />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`.ant-table-row-inactive { opacity: 0.5; }`}</style>
    </div>
  );
}
