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
}));

export default useProfileViewStore;