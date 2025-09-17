// src/services/authService.ts
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';

export const loginWithEmail = (email: string, password: string) =>
  auth().signInWithEmailAndPassword(email, password);

export const registerWithEmail = (email: string, password: string) =>
  auth().createUserWithEmailAndPassword(email, password);

export const sendVerificationEmail = async () => {
  const user = auth().currentUser;
  if (user && !user.emailVerified) {
    await user.sendEmailVerification();
    return true;
  }
  return false;
};

export const resetPassword = (email: string) =>
  auth().sendPasswordResetEmail(email);

export const logoutFirebase = () => auth().signOut();

export const loginWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const googleResult = await GoogleSignin.signIn();

  if (!isSuccessResponse(googleResult)) return null;
  const { idToken } = googleResult.data || googleResult;

  if (!idToken) throw new Error('No ID token found');
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
};
