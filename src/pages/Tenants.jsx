import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, Popconfirm, Space, message } from 'antd';
import { Plus } from 'lucide-react';
import { tenantApi } from '../services/api';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [form] = Form.useForm();

  const fetchTenants = async () => {
    try {
      const data = await tenantApi.getAll(showInactive);
      setTenants(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(); }, [showInactive]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTenant) {
        await tenantApi.update(editingTenant.id, values);
        message.success('Tenant updated');
      } else {
        await tenantApi.create(values);
        message.success('Tenant created');
      }
      setModalOpen(false);
      setEditingTenant(null);
      form.resetFields();
      fetchTenants();
    } catch (err) {
      if (err.message) message.error(err.message);
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    form.setFieldsValue({
      name: tenant.name || '',
      website: tenant.website || '',
      industry: tenant.industry || '',
      headquarters: tenant.headquarters || '',
      employee_count: tenant.employee_count || null,
      founded_year: tenant.founded_year || null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await tenantApi.delete(id);
      message.success('Tenant deactivated');
      fetchTenants();
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      await tenantApi.restore(id);
      message.success('Tenant restored');
      fetchTenants();
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Website', dataIndex: 'website', key: 'website', render: (v) => v || '-' },
    { title: 'Industry', dataIndex: 'industry', key: 'industry', render: (v) => v || '-' },
    { title: 'Headquarters', dataIndex: 'headquarters', key: 'headquarters', render: (v) => v || '-' },
    { title: 'Employees', dataIndex: 'employee_count', key: 'employees', render: (v) => v || '-' },
    { title: 'Founded', dataIndex: 'founded_year', key: 'founded', render: (v) => v || '-' },
    {
      title: 'Status', dataIndex: 'is_active', key: 'status',
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Edit</Button>
          {record.is_active ? (
            <Popconfirm title="Deactivate this tenant?" onConfirm={() => handleDelete(record.id)}>
              <Button size="small" danger>Deactivate</Button>
            </Popconfirm>
          ) : (
            <Button size="small" type="primary" ghost onClick={() => handleRestore(record.id)}>Restore</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Tenants</h2>
        <Space>
          <span style={{ fontSize: 13, opacity: 0.5 }}>Show inactive</span>
          <Switch size="small" checked={showInactive} onChange={setShowInactive} />
          <Button type="primary" icon={<Plus size={14} />} onClick={() => {
            setEditingTenant(null);
            form.resetFields();
            setModalOpen(true);
          }}>
            Add Tenant
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tenants}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={false}
        rowClassName={(r) => !r.is_active ? 'ant-table-row-inactive' : ''}
      />

      <Modal
        title={editingTenant ? 'Edit Tenant' : 'Add Tenant'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); setEditingTenant(null); form.resetFields(); }}
        okText={editingTenant ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Website" name="website">
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="Industry" name="industry">
            <Input />
          </Form.Item>
          <Form.Item label="Headquarters" name="headquarters">
            <Input />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="Employee Count" name="employee_count" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Founded Year" name="founded_year" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={1800} max={new Date().getFullYear()} />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <style>{`.ant-table-row-inactive { opacity: 0.5; }`}</style>
    </div>
  );
}
