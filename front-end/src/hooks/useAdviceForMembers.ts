import { useState } from 'react';

export const useAdviceForMembers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Gửi lời khuyên cho thành viên
  const sendAdvice = async (username: string, advice: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await fetch(`/api/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, advice }),
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      setError('Không thể gửi lời khuyên');
    }
    setLoading(false);
  };

  return { sendAdvice, loading, error, success };
}; 