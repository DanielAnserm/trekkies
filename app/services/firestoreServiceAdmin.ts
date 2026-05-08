import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { dbAdmin } from "~/config/firebase";

export const firestoreServiceAdmin = {
    // Créer/Mettre à jour un document
    setDocument: (collectionName: string, docId: string, data: any) => setDoc(doc(dbAdmin, collectionName, docId), data),

    // Obtenir un document
    getDocument: (collectionName: string, docId: string) => getDoc(doc(dbAdmin, collectionName, docId)),

    // Mettre à jour un document
    updateDocument: (collectionName: string, docId: string, data: any) => updateDoc(doc(dbAdmin, collectionName, docId), data),

    // Supprimer un document
    deleteDocument: (collectionName: string, docId: string) => deleteDoc(doc(dbAdmin, collectionName, docId)),
};
