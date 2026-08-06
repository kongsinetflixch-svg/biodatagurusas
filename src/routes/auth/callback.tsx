import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
});

function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error during auth callback:', error);
      }
      window.location.href = '/';
    };
    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B5B]"></div>
    </div>
  );
}
