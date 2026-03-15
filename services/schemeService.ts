
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Scheme } from '../types';

const SCHEMES_COLLECTION = 'schemes';

export const fetchAllSchemes = async (): Promise<Scheme[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, SCHEMES_COLLECTION));
    return querySnapshot.docs.map(doc => doc.data() as Scheme);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }
};

export const fetchSchemeById = async (id: string): Promise<Scheme | null> => {
  try {
    const docRef = doc(db, SCHEMES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Scheme;
    }
    return null;
  } catch (error) {
    console.error("Error fetching scheme by id:", error);
    return null;
  }
};
