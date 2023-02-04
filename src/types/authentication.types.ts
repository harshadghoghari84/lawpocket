import { LoadingState } from 'src/types/global.types';

export interface LoginFormProps {
  email: string;
  password: string;
}
export interface ForgotPasswordProps {
  email: string;
}
export interface UpdateEmailProps {
  email: string;
}
export interface ChangePasswordFormProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface NewPasswordFormProps {
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface EditProfileFormProps {
  firstName: string;
  lastName: string;
}
export interface EditProfileStudentFormProps {
  firstName: string;
  lastName: string;
  // studentEmail: string;
}
export interface EditProfileAtrFormProps {
  firstName: string;
  lastName: string;
  associationNumber: string;
}
export interface EditProfileLfFormProps {
  firstName: string;
  lastName: string;
}

export interface AssociationNumProps {
  associationNumber: string;
}

export interface AuthenticationState {
  loading: LoadingState;
  oAuthLoading: 'facebook' | 'linkedin' | 'apple';
}

export type TokenPayload = {
  token: string;
  missingEmail: boolean;
};

export interface AuthTokenPayload {
  JWT: string;
  expiry: string;
  connectUrl?: string | false | null;
}
