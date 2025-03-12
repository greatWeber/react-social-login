import { useState, useCallback, useEffect } from "react";

interface FacebookUser {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      url: string;
    };
  };
}

interface FacebookLoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  };
}

interface UseFacebookLoginProps {
  appId: string;
  scope?: string;
}

interface FacebookSDK {
  init: (params: { appId: string; version: string }) => void;
  login: (callback: (response: any) => void, params: { scope: string }) => void;
  logout: (callback: (response: any) => void) => void;
  api: (path: string, callback: (response: any) => void) => void;
}

declare global {
  interface Window {
    FB: FacebookSDK;
    fbAsyncInit: () => void;
  }
}

export const useFacebookLogin = ({
  appId,
  scope = "public_profile,email",
}: UseFacebookLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadFacebookScript = () => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      window.fbAsyncInit = () => {
        try {
          window.FB.init({
            appId,
            version: "v18.0",
          });
          setIsInitialized(true);
        } catch (err) {
          const error =
            err instanceof Error
              ? err
              : new Error("Failed to initialize Facebook SDK");
          setError(error);
        }
      };

      script.onerror = () => {
        const err = new Error("Failed to load Facebook SDK script");
        setError(err);
      };

      document.head.appendChild(script);
    };

    loadFacebookScript();

    return () => {
      const script = document.querySelector(
        'script[src*="connect.facebook.net/en_US/sdk.js"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
      setIsInitialized(false);
    };
  }, [appId]);

  const signIn = useCallback(async () => {
    if (!isInitialized) {
      throw new Error("Facebook SDK is not initialized");
    }

    try {
      setIsLoading(true);
      setError(null);

      const loginResponse = await new Promise((resolve, reject) => {
        window.FB.login(
          (response) => {
            if (response.authResponse) {
              resolve(response);
            } else {
              reject(new Error("Facebook login failed"));
            }
          },
          { scope }
        );
      });

      const userResponse: FacebookUser = await new Promise(
        (resolve, reject) => {
          window.FB.api("/me?fields=id,name,email,picture", (response) => {
            if (response && !response.error) {
              resolve(response);
            } else {
              reject(new Error("Failed to fetch user data"));
            }
          });
        }
      );

      const response: FacebookLoginResponse = {
        accessToken: (loginResponse as any).authResponse.accessToken,
        user: {
          id: userResponse.id,
          name: userResponse.name,
          email: userResponse.email,
          imageUrl: userResponse.picture.data.url,
        },
      };

      return response;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Facebook Sign-In failed");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, scope]);

  const signOut = useCallback(async () => {
    if (!isInitialized) {
      throw new Error("Facebook SDK is not initialized");
    }

    try {
      setIsLoading(true);
      setError(null);

      await new Promise<void>((resolve, reject) => {
        window.FB.logout((response) => {
          if (response.status === "unknown") {
            resolve();
          } else {
            reject(new Error("Facebook logout failed"));
          }
        });
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Facebook Sign-Out failed");
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

export default useFacebookLogin;
