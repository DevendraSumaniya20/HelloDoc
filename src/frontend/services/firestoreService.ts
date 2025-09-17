import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

// Get a document
export const getUserDoc = (uid: string) =>
  firestore().collection('users').doc(uid).get();

// Set/merge a document
export const setUserDoc = (uid: string, data: any) =>
  firestore().collection('users').doc(uid).set(data, { merge: true });

// Update document
export const updateUserDoc = (uid: string, data: any) =>
  firestore().collection('users').doc(uid).update(data);

// Listen to document changes
export const listenToUserDoc = (
  uid: string,
  onUpdate: (data: FirebaseFirestoreTypes.DocumentData | null) => void,
  onError?: (error: Error) => void,
) => {
  return firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(
      snapshot => {
        const data = snapshot.data() || null;
        onUpdate(data);
      },
      error => {
        if (onError) {
          onError(error);
        }
      },
    );
};
