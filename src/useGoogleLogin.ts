import { useState, useCallback, useEffect } from "react";
import { loadScript } from "./utils/loadScript";

export interface GoogleUser {
  email: string;
  name: string;
  imageUrl: string;
  id: string;
}

export interface GoogleLoginResponse {
  accessToken: string;
  user: GoogleUser;
}

interface UseGoogleLoginProps {
  clientId: string;
  scope?: string;
}

interface GoogleAuthAPI {
  init: (params: { client_id: string; scope: string }) => void;
  signIn: () => Promise<any>;
  signOut: () => Promise<void>;
  currentUser: {
    get: () => {
      getBasicProfile: () => {
        getId: () => string;
        getName: () => string;
        getEmail: () => string;
        getImageUrl: () => string;
      };
      getAuthResponse: () => {
        access_token: string;
      };
    };
  };
}

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      auth2: GoogleAuthAPI;
    };
  }
}

export const useGoogleLogin = ({
  clientId,
  scope = "profile email",
}: UseGoogleLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const { cleanup } = loadScript(import.meta.env.VITE_GOOGLE_SDK_URL, {
      onInit: () => {
        window.gapi.load("auth2", () => {
          try {
            window.gapi.auth2.init({
              client_id: clientId,
              scope,
            });
            setIsInitialized(true);
          } catch (err) {
            const error =
              err instanceof Error
                ? err
                : new Error("Failed to initialize Google Sign-In");
            setError(error);
          }
        });
      },
    });

    return () => {
      cleanup();
      setIsInitialized(false);
    };
  }, [clientId, scope]);

  const signIn = useCallback(async () => {
    if (!isInitialized) {
      throw new Error("Google Sign-In is not initialized");
    }

    try {
      setIsLoading(true);
      setError(null);

      const googleUser = await window.gapi.auth2.signIn();
      const profile = googleUser.getBasicProfile();
      const authResponse = googleUser.getAuthResponse();

      const response: GoogleLoginResponse = {
        accessToken: authResponse.access_token,
        user: {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl(),
        },
      };

      return response;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Google Sign-In failed");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const signOut = useCallback(async () => {
    if (!isInitialized) {
      throw new Error("Google Sign-In is not initialized");
    }

    try {
      setIsLoading(true);
      setError(null);
      await window.gapi.auth2.signOut();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Google Sign-Out failed");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  return {
    signIn,
    signOut,
    isLoading,
    error,
    isInitialized,
  };
};

export default useGoogleLogin;
