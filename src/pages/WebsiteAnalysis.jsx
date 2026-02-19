import { useState } from 'react';
import { Card, Form, Input, Button, Collapse, Descriptions, List, Tag, message } from 'antd';
import { Globe } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function WebsiteAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async ({ website_url, analysis_prompt }) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/website-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website_url: website_url.trim(),
          analysis_prompt: analysis_prompt?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResult(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const insightsItems = result?.competitive_insights ? [
    {
      key: 'insights',
      label: 'Competitive Insights',
      children: (
        <Descriptions column={1} size="small" bordered>
          {Object.entries(result.competitive_insights).map(([key, val]) => (
            <Descriptions.Item key={key} label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}>
              {val}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ),
    },
  ] : [];

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>Website Intelligence Agent</h2>
      <p style={{ color: '#888', marginBottom: 24, fontSize: 13 }}>
        Run a cost-efficient scrape + analysis on a competitor site. The agent will pick up to 5 high-intent pages,
        scrape them with Firecrawl, and generate product and buyer-intent insights.
      </p>

      <Card style={{ marginBottom: 24, background: '#1a1a1a', border: '1px solid #333' }}>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Website URL" name="website_url" rules={[{ required: true, type: 'url' }]}>
            <Input placeholder="https://www.anaplan.com" prefix={<Globe size={14} />} />
          </Form.Item>
          <Form.Item label="Analysis prompt (optional)" name="analysis_prompt">
            <Input.TextArea
              rows={3}
              placeholder="E.g. focus on FP&A planning automation, integrations with ERP, and enterprise pricing signals."
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Running analysis...' : 'Run analysis'}
          </Button>
        </Form>
      </Card>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Selected URLs" size="small" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
            <List
              dataSource={result.selected_urls || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>}
                    description={
                      <span>
                        <Tag color="blue">Score {item.priority_score}</Tag> {item.reason}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {insightsItems.length > 0 && <Collapse defaultActiveKey={['insights']} items={insightsItems} />}

          <Card title="Page Snapshots" size="small" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
            <List
              dataSource={result.scraped_content || []}
              renderItem={(page) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={page.url} target="_blank" rel="noreferrer">{page.title || page.url}</a>}
                    description={
                      <>
                        {page.key_headings && <p><strong>Headings:</strong> {page.key_headings}</p>}
                        {page.key_value_props && <p><strong>Value props:</strong> {page.key_value_props}</p>}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Raw JSON" size="small" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
            <pre style={{ fontSize: 11, maxHeight: 400, overflow: 'auto', color: '#aaa' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}
