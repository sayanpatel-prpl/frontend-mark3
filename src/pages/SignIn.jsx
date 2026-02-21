import { useState } from 'react';
import { Card, Form, Input, Button, Alert } from 'antd';
import { authApi } from '../services/api';

export default function SignIn({ onLogin }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async ({ email: formEmail }) => {
    setLoading(true);
    setError('');
    try {
      await authApi.sendOtp(formEmail);
      setEmail(formEmail);
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
      <Card style={{ width: 400 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 4, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#C9A84C' }}>KO</span>MPETE
        </h1>
        <p style={{ textAlign: 'center', opacity: 0.5, marginBottom: 24 }}>Sign in to continue</p>

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
              <span style={{ color: '#C9A84C' }}>{email}</span>
            </Form.Item>

            <Alert
              type="success"
              message="OTP has been sent to your email"
              style={{ marginBottom: 16 }}
              showIcon
            />

            <Form.Item label="Enter 6-digit OTP" name="otp" rules={[{ required: true }]}>
              <Input placeholder="123456" maxLength={6} size="large" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Verify OTP
            </Button>
            <Button
              type="text"
              block
              style={{ marginTop: 8 }}
              onClick={() => setStep('email')}
            >
              Back
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
