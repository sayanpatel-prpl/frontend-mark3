import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import useProject from '../hooks/useProject';

export default function ProjectRedirect() {
  const { projectId, loading, error } = useProject();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !projectId) {
    return (
      <div style={{ padding: 32 }}>
        <div className="report-error">
          <div className="report-error-title">No project found</div>
          <div className="report-error-desc">{error || 'No projects available for this tenant.'}</div>
        </div>
      </div>
    );
  }

  return <Navigate to={`/projects/${projectId}/report`} replace />;
}
