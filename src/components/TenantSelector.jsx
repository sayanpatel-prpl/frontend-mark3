import { useState, useEffect } from 'react';
import { Select, theme } from 'antd';
import { Building2 } from 'lucide-react';
import { tenantApi } from '../services/api';

export default function TenantSelector({ activeTenantId, onTenantChange }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = theme.useToken();

  useEffect(() => {
    tenantApi.getAll()
      .then(data => setTenants(data))
      .catch(err => console.error('Failed to load tenants:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '0 12px 8px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
        color: token.colorTextSecondary,
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: '0 4px',
      }}>
        <Building2 size={12} />
        Tenant
      </div>
      <Select
        value={tenants.length ? activeTenantId : undefined}
        onChange={onTenantChange}
        loading={loading}
        placeholder="Select tenant"
        style={{ width: '100%' }}
        size="small"
        optionFilterProp="label"
        options={tenants.map(t => ({ label: t.name, value: t.id }))}
      />
    </div>
  );
}
