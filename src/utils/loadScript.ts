import { useState } from 'react';

interface LoadScriptOptions {
  onInit?: () => void;
  attributes?: Record<string, string>;
}

export const loadScript = (
  src: string,
  options: LoadScriptOptions = {}
): {
  scriptElement: HTMLScriptElement;
  cleanup: () => void;
  scriptPromise: Promise<void>;
} => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;

  // 应用自定义属性
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
  }

  const scriptPromise = new Promise<void>((resolve, reject) => {
    script.onload = () => {
      if (options.onInit) {
        try {
          options.onInit();
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Script initialization failed'));
          return;
        }
      }
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.head.appendChild(script);
  });

  const cleanup = () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };

  return {
    scriptElement: script,
    cleanup,
    scriptPromise
  };
};

export const useScript = (
  src: string,
  options: LoadScriptOptions = {}
) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loadScript(src, options).scriptPromise;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Script loading failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    load,
    error,
    isLoading
  };
};