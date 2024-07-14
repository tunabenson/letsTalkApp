import { getDoc } from "firebase/firestore"

export const retrievePost=async(path)=>{
    const snapshot= await getDoc(doc(path));
    return {...snapshot.data(),path}
}