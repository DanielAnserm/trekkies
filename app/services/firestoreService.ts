import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "~/config/firebase";

export const firestoreService = {
    // Créer/Mettre à jour un document
    setDocument: (collectionName: string, docId: string, data: any) => setDoc(doc(db, collectionName, docId), data),

    // Obtenir un document
    getDocument: (collectionName: string, docId: string) => getDoc(doc(db, collectionName, docId)),

    // Ajouter un document (ID auto-généré)
    addDocument: (collectionName: string, data: any) => addDoc(collection(db, collectionName), data),

    // Mettre à jour un document
    updateDocument: (collectionName: string, docId: string, data: any) => updateDoc(doc(db, collectionName, docId), data),

    // Supprimer un document
    deleteDocument: (collectionName: string, docId: string) => deleteDoc(doc(db, collectionName, docId)),

    // Requête avec condition
    queryDocuments: (collectionName: string, field: any, operator: any, value: unknown) => {
        const q = query(collection(db, collectionName), where(field, operator, value));
        return getDocs(q);
    },

    // Vérifier si un pseudonyme existe
    checkPseudonymExists: async (pseudonym: string) => {
        const q = query(collection(db, "userProfiles"), where("pseudonym", "==", pseudonym));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    },
};
