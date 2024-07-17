import { doc, getDoc } from "firebase/firestore"
import { db } from "../../api/firebaseConfig";

export const retrievePost=async(path)=>{
    const snapshot= await getDoc(doc(db, path));
    return {...snapshot.data(), path}
}