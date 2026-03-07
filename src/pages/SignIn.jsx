import { useState, useRef } from 'react';
import { Card, Form, Input, Button, Alert } from 'antd';
import { authApi } from '../services/api';

export default function SignIn({ onLogin }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

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

  const handleVerifyOtp = async (otp) => {
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

  const handleOtpChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      const otp = otpDigits.join('');
      if (otp.length === 6) handleVerifyOtp(otp);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    // Focus last filled box or the next empty one
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
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
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, opacity: 0.6 }}>Email</span>
              <div style={{ color: '#C9A84C' }}>{email}</div>
            </div>

            <Alert
              type="success"
              message="OTP has been sent to your email"
              style={{ marginBottom: 16 }}
              showIcon
            />

            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 13, opacity: 0.6 }}>Enter 6-digit OTP</span>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  style={{
                    width: 48,
                    height: 56,
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                    border: '2px solid #d9d9d9',
                    borderRadius: 8,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    caretColor: '#C9A84C',
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = '#d9d9d9'}
                />
              ))}
            </div>

            <Button
              type="primary"
              loading={loading}
              block
              size="large"
              disabled={otpDigits.join('').length !== 6}
              onClick={() => handleVerifyOtp(otpDigits.join(''))}
            >
              Verify OTP
            </Button>
            <Button
              type="text"
              block
              style={{ marginTop: 8 }}
              onClick={() => { setStep('email'); setOtpDigits(['', '', '', '', '', '']); }}
            >
              Back
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
