import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export const VerificationEmailTemplate = ({username, otp }: EmailTemplateProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f2f2f2', margin: '0', padding: '0' }}>
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <h1 style={{ margin: '0', color: '#333333' }}>Email Verification</h1>
      </div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: '#333333' }}>Hello, <strong>{username}</strong>!</p>
        <p style={{ fontSize: '16px', color: '#333333' }}>Thank you for signing up to Maou Messenger. Please use the following verification code to complete your registration:</p>
        <div style={{ display: 'inline-block', margin: '20px 0', padding: '10px 20px', fontSize: '24px', color: '#ffffff', backgroundColor: '#007BFF', borderRadius: '4px', letterSpacing: '4px' }}>{otp}</div>
        <p style={{ fontSize: '16px', color: '#333333' }}>If you did not request this code, please ignore this email.</p>
      </div>
      <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '12px', color: '#777777' }}>
        <p>&copy; 2024 Maou Ltd. All rights reserved.</p>
      </div>
    </div>
  </div>
);
