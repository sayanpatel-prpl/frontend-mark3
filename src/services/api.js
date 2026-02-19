const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const authApi = {
  sendOtp: (email) => request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (email, otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

export const tenantApi = {
  getAll: (includeInactive = false) => request(`/tenants?includeInactive=${includeInactive}`),
  getById: (id) => request(`/tenants/${id}`),
  create: (data) => request('/tenants', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/tenants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/tenants/${id}`, { method: 'DELETE' }),
  restore: (id) => request(`/tenants/${id}/restore`, { method: 'POST' }),
};

export const companyApi = {
  getAll: (includeInactive = false) => request(`/companies?includeInactive=${includeInactive}`),
  getById: (id) => request(`/companies/${id}`),
  create: (data) => request('/companies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/companies/${id}`, { method: 'DELETE' }),
  restore: (id) => request(`/companies/${id}/restore`, { method: 'POST' }),
  enrich: (id) => request(`/companies/${id}/enrich`, { method: 'POST' }),
  refreshLinkedIn: (id) => request(`/companies/${id}/refresh-linkedin`, { method: 'POST' }),
  refreshG2: (id) => request(`/companies/${id}/refresh-g2`, { method: 'POST' }),
  refreshGartner: (id) => request(`/companies/${id}/refresh-gartner`, { method: 'POST' }),
  refreshTrustpilot: (id) => request(`/companies/${id}/refresh-trustpilot`, { method: 'POST' }),
  refreshCapterra: (id) => request(`/companies/${id}/refresh-capterra`, { method: 'POST' }),
  refreshAllLogos: () => request('/companies/refresh-logos', { method: 'POST' }),
  generateSummaries: (id) => request(`/companies/${id}/generate-summaries`, { method: 'POST' }),
  getSummaryProgress: (id) => request(`/companies/${id}/summary-progress`),
  refreshWebsiteScrape: (id) => request(`/companies/${id}/refresh-website-scrape`, { method: 'POST' }),
  retryFailedWebsiteAnalysis: (id) => request(`/companies/${id}/retry-failed-website-analysis`, { method: 'POST' }),
  getWebsiteScrapeProgress: (id) => request(`/companies/${id}/website-scrape-progress`),
};

export const projectApi = {
  getAll: () => request('/projects'),
  getById: (id) => request(`/projects/${id}`),
  create: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  generateSummary: (projectId, companyId) =>
    request(`/projects/${projectId}/companies/${companyId}/generate-summary`, { method: 'POST' }),
  getSummaryProgress: (projectId, companyId) =>
    request(`/projects/${projectId}/companies/${companyId}/summary-progress`),
  getProjectProgress: (id) => request(`/projects/${id}/progress`),
};

export const featureReportApi = {
  generate: (projectId, refresh = false) =>
    request(`/projects/${projectId}/feature-report/generate${refresh ? '?refresh=true' : ''}`, { method: 'POST' }),
  getStatus: (projectId) => request(`/projects/${projectId}/feature-report/status`),
  getData: (projectId) => request(`/projects/${projectId}/feature-report/data`),
};

export const reportApi = {
  getMarketOverview: (projectId, { refresh = false } = {}) =>
    request(`/projects/${projectId}/report-data.json${refresh ? '?refresh=true' : ''}`),
  getBattlecard: (projectId, companyId, threatData, { refresh = false } = {}) =>
    request(`/projects/${projectId}/battlecard/${companyId}.json${refresh ? '?refresh=true' : ''}`, {
      method: 'POST',
      body: JSON.stringify({ threatData }),
    }),
  getSelfAssessment: (projectId, { refresh = false } = {}) =>
    request(`/projects/${projectId}/self-assessment.json${refresh ? '?refresh=true' : ''}`),
  getReportUrl: (projectId) => `${BASE_URL}/projects/${projectId}/report`,
};
