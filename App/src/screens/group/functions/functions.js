import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, db, storage } from "../../../security/firebase";
import { serverTimestamp, addDoc, collection } from "firebase/firestore/lite";
export const postFeed = async (
  setLoading,
  setImage,
  setPostText,
  postText,
  image,
  postData,
  setPostData,
  groupCode
) => {
  setLoading(true);
  if (postText != "") {
    const ref1 = collection(db, "post");
    if (image == "") {
      const snap = await addDoc(ref1, {
        userId: auth.currentUser.uid,
        post: postText,
        timestamp: serverTimestamp(),
        profileImage: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        likes: 0,
        comments: null,
        likeList: [],
        groupCode,
      }).then((data) => {
        const arrTemp = postData;
        const arr = [
          {
            userId: auth.currentUser.uid,
            post: postText,
            timestamp: serverTimestamp(),
            profileImage: auth.currentUser.photoURL,
            username: auth.currentUser.displayName,
            likes: 0,
            comments: null,
            likeList: [],
            groupCode,
          },
          data.id,
        ];
        arrTemp.unshift(arr);
        setPostData(arrTemp);
      });
    } else {
      var desiredMaxLength = 24;
      var randomNumber = "";
      for (var i = 0; i < desiredMaxLength; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }
      const ref1 = collection(db, "post");
      const storageRef = ref(storage, "groupPostImage/" + randomNumber);
      const val = await fetch(image);
      const imageBlob = await val.blob();
      uploadBytes(storageRef, imageBlob).then((snapshot) => {
        getDownloadURL(storageRef).then(async (url) => {
          const snap = await addDoc(ref1, {
            userId: auth.currentUser.uid,
            post: postText,
            timestamp: serverTimestamp(),
            profileImage: auth.currentUser.photoURL,
            username: auth.currentUser.displayName,
            likes: 0,
            comments: null,
            url: url,
            likeList: [],
          }).then((data) => {
            const arrTemp = postData;
            const arr = [
              {
                userId: auth.currentUser.uid,
                post: postText,
                timestamp: serverTimestamp(),
                profileImage: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                likes: 0,
                comments: null,
                url: url,
                likeList: [],
              },
              data.id,
            ];
            arrTemp.unshift(arr);
            setPostData(arrTemp);
          });
        });
      });
    }
  }
  setImage("");
  setLoading(false);
  setPostText("");
};
