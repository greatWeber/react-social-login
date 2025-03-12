# React Social Login Hooks

A lightweight and easy-to-use React hooks library for integrating social login functionality into your React applications. Currently supports Google, Facebook, and Apple login.

## Features

- 🎣 Custom hooks for each social login provider
- 🔒 TypeScript support with full type definitions
- 🚀 Easy to integrate and use
- ⚡ Built with modern React practices
- 📦 Lightweight with minimal dependencies

## Installation

```bash
npm install react-social-login
```

## Usage

### Google Login

```tsx
import { useGoogleLogin } from 'react-social-login';

const YourComponent = () => {
  const { signIn, signOut, isLoading, error, isInitialized } = useGoogleLogin({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    scope: 'profile email' // optional
  });

  const handleLogin = async () => {
    try {
      const response = await signIn();
      console.log('Logged in user:', response.user);
      console.log('Access token:', response.accessToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={!isInitialized || isLoading}>
      {isLoading ? 'Loading...' : 'Sign in with Google'}
    </button>
  );
};
```

### Facebook Login

```tsx
import { useFacebookLogin } from 'react-social-login';

const YourComponent = () => {
  const { signIn, signOut, isLoading, error, isInitialized } = useFacebookLogin({
    appId: 'YOUR_FACEBOOK_APP_ID',
    scope: 'public_profile,email' // optional
  });

  const handleLogin = async () => {
    try {
      const response = await signIn();
      console.log('Logged in user:', response.user);
      console.log('Access token:', response.accessToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={!isInitialized || isLoading}>
      {isLoading ? 'Loading...' : 'Sign in with Facebook'}
    </button>
  );
};
```

### Apple Login

```tsx
import { useAppleLogin } from 'react-social-login';

const YourComponent = () => {
  const { signIn, signOut, isLoading, error, isInitialized } = useAppleLogin({
    clientId: 'YOUR_APPLE_CLIENT_ID',
    scope: 'name email',
    redirectURI: 'https://your-app.com/auth/callback' // optional
  });

  const handleLogin = async () => {
    try {
      const response = await signIn();
      console.log('Logged in user:', response.user);
      console.log('Access token:', response.accessToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={!isInitialized || isLoading}>
      {isLoading ? 'Loading...' : 'Sign in with Apple'}
    </button>
  );
};
```

## API Reference

### useGoogleLogin

```typescript
function useGoogleLogin(options: {
  clientId: string;
  scope?: string; // default: 'profile email'
}): {
  signIn: () => Promise<GoogleLoginResponse>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
};

interface GoogleLoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  };
}
```

### useFacebookLogin

```typescript
function useFacebookLogin(options: {
  appId: string;
  scope?: string; // default: 'public_profile,email'
}): {
  signIn: () => Promise<FacebookLoginResponse>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
};

interface FacebookLoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  };
}
```

### useAppleLogin

```typescript
function useAppleLogin(options: {
  clientId: string;
  scope?: string; // default: 'name email'
  redirectURI?: string;
  state?: string;
  usePopup?: boolean;
}): {
  signIn: () => Promise<AppleLoginResponse>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
};

interface AppleLoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
```

## Configuration Guide

### Google

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to the Credentials page
5. Create an OAuth 2.0 Client ID
6. Add authorized JavaScript origins for your domain
7. Copy the Client ID and use it in your application

### Facebook

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add Facebook Login product to your app
4. Configure the OAuth settings
5. Add your domain to the allowed domains
6. Copy the App ID and use it in your application

### Apple

1. Go to the [Apple Developer Console](https://developer.apple.com/account/)
2. Register your app and enable Sign in with Apple
3. Configure the domains and redirect URLs
4. Create a Service ID and configure it
5. Copy the Client ID (Service ID) and use it in your application

## License

MIT
