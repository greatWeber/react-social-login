import { FC } from 'react';

export interface SocialLoginProps {
  provider: 'google' | 'facebook' | 'twitter';
  clientId: string;
  className?: string;
}

export const SocialLogin: FC<SocialLoginProps> = () => {
  // TODO: Implement social login functionality
  return null;
};

export default SocialLogin;