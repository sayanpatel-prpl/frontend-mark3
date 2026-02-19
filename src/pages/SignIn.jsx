import { useState } from 'react';
import { Card, Form, Input, Button, Alert, message } from 'antd';
import { authApi } from '../services/api';

export default function SignIn({ onLogin }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const handleSendOtp = async ({ email: formEmail }) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.sendOtp(formEmail);
      setEmail(formEmail);
      if (data.otp_dev) setDevOtp(data.otp_dev);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async ({ otp }) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.verifyOtp(email, otp);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Card style={{ width: 400, background: '#1a1a1a', border: '1px solid #333' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 4, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#4A9EFF' }}>K</span>ompete
        </h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 24 }}>Sign in to continue</p>

        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

        {step === 'email' ? (
          <Form onFinish={handleSendOtp} layout="vertical">
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="you@example.com" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Send OTP
            </Button>
          </Form>
        ) : (
          <Form onFinish={handleVerifyOtp} layout="vertical">
            <Form.Item label="Email">
              <span style={{ color: '#4A9EFF' }}>{email}</span>
            </Form.Item>
            <Form.Item label="Enter 6-digit OTP" name="otp" rules={[{ required: true }]}>
              <Input placeholder="123456" maxLength={6} size="large" />
            </Form.Item>

            {devOtp && (
              <Alert
                type="info"
                message={<>Dev OTP: <strong>{devOtp}</strong></>}
                style={{ marginBottom: 16, background: '#2a2a2a', borderColor: '#4A9EFF', borderStyle: 'dashed' }}
              />
            )}

            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Verify OTP
            </Button>
            <Button
              type="text"
              block
              style={{ marginTop: 8 }}
              onClick={() => { setStep('email'); setDevOtp(''); }}
            >
              Back
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
