import { useState, useEffect } from 'react';
import { projectApi } from '../services/api';

export default function useProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    projectApi.getAll()
      .then((projects) => {
        const first = projects[0] || null;
        setProject(first);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { project, projectId: project?.id ?? null, loading, error };
}
