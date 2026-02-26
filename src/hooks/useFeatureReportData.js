import { useState, useEffect, useRef, useCallback } from 'react';
import { featureReportApi } from '../services/api';

const STATUS_LABELS = {
  classifying: 'Classifying product pages...',
  comparing: 'Comparing features across competitors...',
  generating: 'Generating report sections...',
};

export default function useFeatureReportData(projectId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef(null);

  const startPolling = useCallback(() => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const statusRes = await featureReportApi.getStatus(projectId);
        setStatus(statusRes.status);

        if (statusRes.status === 'success') {
          clearInterval(pollRef.current);
          const reportData = await featureReportApi.getData(projectId);
          setData(reportData);
        } else if (statusRes.status === 'failed') {
          clearInterval(pollRef.current);
          setError(statusRes.error_message || 'Report generation failed');
        }
      } catch (_) {}
    }, 3000);
  }, [projectId]);

  const loadReport = useCallback((refresh = false) => {
    if (!projectId) return;
    setLoading(true);
    setError('');

    featureReportApi.generate(projectId, refresh)
      .then((result) => {
        if (result.status === 'generating' || result.status === 'classifying' || result.status === 'comparing') {
          setStatus(result.status);
          setLoading(false);
          startPolling();
        } else if (result.feature_matrix) {
          setData(result);
          setStatus('success');
          setLoading(false);
        } else {
          setLoading(false);
          startPolling();
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [projectId, startPolling]);

  useEffect(() => {
    if (projectId) loadReport();
    return () => clearInterval(pollRef.current);
  }, [loadReport, projectId]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setData(null);
    setStatus(null);
    featureReportApi.generate(projectId, true)
      .then(() => {
        setRefreshing(false);
        startPolling();
      })
      .catch((err) => {
        setError(err.message);
        setRefreshing(false);
      });
  }, [projectId, startPolling]);

  return { data, loading, status, statusLabel: STATUS_LABELS[status], error, refreshing, refresh, loadReport };
}
