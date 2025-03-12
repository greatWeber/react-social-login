import React, { useState } from "react";
import {
  useGoogleLogin,
  useFacebookLogin,
  useAppleLogin,
} from "react-social-login";
import styles from "./SocialLoginDemo.module.css";

interface UserInfo {
  id: string;
  name: string;
  email?: string;
  imageUrl?: string;
}

const SocialLoginDemo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const {
    signIn: googleSignIn,
    signOut: googleSignOut,
    isLoading: googleLoading,
    error: googleError,
  } = useGoogleLogin({
    clientId: "YOUR_GOOGLE_CLIENT_ID",
  });

  const {
    signIn: facebookSignIn,
    signOut: facebookSignOut,
    isLoading: facebookLoading,
    error: facebookError,
  } = useFacebookLogin({
    appId: "YOUR_FACEBOOK_APP_ID",
  });

  const {
    signIn: appleSignIn,
    isLoading: appleLoading,
    error: appleError,
  } = useAppleLogin({
    clientId: "YOUR_APPLE_CLIENT_ID",
    redirectURI: "https://your-app.com/auth/apple/callback",
    usePopup: true,
  });

  const handleGoogleLogin = async () => {
    try {
      const response = await googleSignIn();
      setUserInfo(response.user);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const response = await facebookSignIn();
      setUserInfo(response.user);
    } catch (error) {
      console.error("Facebook login failed:", error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const response = await appleSignIn();
      if (response.user) {
        setUserInfo({
          id: response.authorization.state,
          name: `${response.user.name?.firstName} ${response.user.name?.lastName}`,
          email: response.user.email,
        });
      }
    } catch (error) {
      console.error("Apple login failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      await facebookSignOut();
      setUserInfo(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className={styles["social-login-demo"]}>
      <h2>Social Login Demo</h2>

      {!userInfo ? (
        <div className={styles["login-buttons"]}>
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className={styles["google-button"]}
          >
            {googleLoading ? "Loading..." : "Sign in with Google"}
          </button>

          <button
            onClick={handleFacebookLogin}
            disabled={facebookLoading}
            className={styles["facebook-button"]}
          >
            {facebookLoading ? "Loading..." : "Sign in with Facebook"}
          </button>

          <button
            onClick={handleAppleLogin}
            disabled={appleLoading}
            className={styles["apple-button"]}
          >
            {appleLoading ? "Loading..." : "Sign in with Apple"}
          </button>
        </div>
      ) : (
        <div className={styles["user-info"]}>
          <h3>Welcome, {userInfo.name}!</h3>
          {userInfo.imageUrl && (
            <img
              src={userInfo.imageUrl}
              alt="Profile"
              className={styles["profile-image"]}
            />
          )}
          {userInfo.email && <p>Email: {userInfo.email}</p>}
          <button onClick={handleSignOut} className={styles["sign-out-button"]}>
            Sign Out
          </button>
        </div>
      )}

      {(googleError || facebookError || appleError) && (
        <div className={styles["error-message"]}>
          {googleError?.message ||
            facebookError?.message ||
            appleError?.message}
        </div>
      )}
    </div>
  );
};

export default SocialLoginDemo;
