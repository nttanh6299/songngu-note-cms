import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@strapi/strapi/admin';

export const useVoice = () => {
  const token = useAuth('voicer', (state) => state.token);
  const [loading, setLoading] = useState(false);

  const convertToVoice = async (body: { slug: string; text: string }) => {
    try {
      setLoading(true);
      const { data } = await axios.post<string>(`/voicer`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    convertToVoice,
  };
};
