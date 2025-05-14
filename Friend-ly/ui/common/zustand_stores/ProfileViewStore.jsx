import { create } from 'zustand';
import React, {useEffect, useState} from 'react'
import * as SecureStore from 'expo-secure-store'

const useProfileViewStore = create((set) => ({

    fetchData: async () => {
        try {
            const token = await SecureStore.getItemAsync("JWT") // jwt token
            if (!token) {
                console.log("No token found!");
                return;
            }
            const response = await fetch("http://localhost:8000/users/info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token })
            });
            if (response.ok) {
                const data = await response.json();
                useProfileViewStore.getState().setProfileData(data[0])
            }
        } catch (err) {
            throw(err);
        }
    },

    imageUri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png',
    setImageUri: (uri) => set({ imageUri: uri }),

    name: 'John Doe',
    setName: (userName) => set({ name: userName }),

    majorAndYear: 'Computer Science \'24',
    setMajorAndYear: (mAy) => set({ majorAndYear: mAy }),

    aboutMe: "Short description here.",
    setAboutMe: (description) => set({ aboutMe: description }),

    interests: [],
    setInterests: (interestList) => set({ interests: interestList }),

    currentClasses: [],
    setCurrentClasses: (classesList) => set({ currentClasses: classesList }),

    hasPreviousScreen: false,
    setHasPreviousScreen: (screen) => set({ hasPreviousScreen: screen }),

    posts: [{timestamp:"2 hours ago", image:"https://placehold.co/600x300/png", caption:"This is an example post with all props provided.", likes:34, comments:12}, {timestamp:"3 hours ago", image:"https://placehold.co/600x300/png", caption:"This is an example post with all props provided.", likes:34, comments:12}, {timestamp:"5 days ago", image:"https://placehold.co/600x300/png", caption:"This is an example post with all props provided.", likes:34, comments:12}],
    setPosts: (postList) => set({ posts: postList }),

    setProfileData: (data) => set({name: data.username, aboutMe: data.bio})
}));

export default useProfileViewStore;