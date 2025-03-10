import { create } from 'zustand';

const useProfileViewStore = create((set) => ({
    imageUri: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png',
    setImageUri: (uri) => set({ imageUri: uri }),

    name: 'John Doe',
    setName: (userName) => set({ name: userName }),

    majorAndYear: 'Computer Science \'24',
    setMajorAndYear: (mAy) => set({ majorAndYear: mAy }),

    aboutMe: 'Short Description Here',
    setAboutMe: (description) => set({ aboutMe: description }),

    interests: [],
    setInterests: (interestList) => set({ interests: interestList }),

    currentClasses: [],
    setCurrentClasses: (classesList) => set({ currentClasses: classesList }),

    hasPreviousScreen: false,
    setHasPreviousScreen: (screen) => set({ hasPreviousScreen: screen }),

    posts: [{timestamp:"2 hours ago", image:"https://placehold.co/600x300/png", caption:"This is an example post with all props provided.", likes:34, comments:12}, {timestamp:"3 hours ago", image:"https://placehold.co/600x300/png", caption:"This is an example post with all props provided.", likes:34, comments:12}, {timestamp:"5 days ago", image:"https://placehold.co/600x300/png", caption:"This is an example post with all props provided.", likes:34, comments:12}],
    setPosts: (postList) => set({ posts: postList }),
}));

export default useProfileViewStore;