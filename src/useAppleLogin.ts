import { useState, useCallback, useEffect } from 'react';

interface AppleLoginResponse {
  authorization: {
    code: string;
    id_token: string;
    state: string;
  };
  user?: {
    email?: string;
    name?: {
      firstName: string;
      lastName: string;
    };
  };
}

interface UseAppleLoginProps {
  clientId: string;
  scope?: string;
  redirectURI?: string;
  state?: string;
  usePopup?: boolean;
}

interface AppleIDAPI {
  auth: {
    init: (config: {
      clientId: string;
      scope: string;
      redirectURI?: string;
      state?: string;
      usePopup?: boolean;
    }) => void;
    signIn: () => Promise<AppleLoginResponse>;
  };
}

declare global {
  interface Window {
    AppleID: AppleIDAPI;
  }
}

export const useAppleLogin = ({
  clientId,
  scope = 'name email',
  redirectURI,
  state,
  usePopup = false
}: UseAppleLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAppleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.onload = () => {
        try {
          window.AppleID.auth.init({
            clientId,
            scope,
            redirectURI,
            state,
            usePopup
          });
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to initialize Apple Sign-In'));
        }
      };
      script.onerror = () => {
        const err = new Error('Failed to load Apple Sign-In script');
        setError(err);
      };
      document.head.appendChild(script);
    };

    loadAppleScript();

    return () => {
      const script = document.querySelector('script[src*="appleid.auth.js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [clientId, scope, redirectURI, state]);

  const signIn = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await window.AppleID.auth.signIn();
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Apple Sign-In failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    signIn,
    isLoading,
    error
  };
};

export default useAppleLogin;