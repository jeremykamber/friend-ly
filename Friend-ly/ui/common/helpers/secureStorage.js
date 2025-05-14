import * as SecureStore from 'expo-secure-store';

const EMAIL_KEY = 'user_email';
const EMAIL_EXPIRE_DATE = 'user_email_expiry';

export async function storeEmail(email) {
    try {
        await SecureStore.setItemAsync(EMAIL_KEY, email);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        await SecureStore.setItemAsync(EMAIL_EXPIRE_DATE, expiryDate.toISOString());
        return true;
    } catch (error) {
        console.error('Error storing email:', error);
        return false;
    }
}

export async function getEmailIfValid() {
    try {
        const expiryDateStr = await SecureStore.getItemAsync(EMAIL_EXPIRE_DATE);
        if (!expiryDateStr) return '';
        const expiryDate = new Date(expiryDateStr);
        const now = new Date();
        if (now > expiryDate) {
            await SecureStore.deleteItemAsync(EMAIL_KEY);
            await SecureStore.deleteItemAsync(EMAIL_EXPIRE_DATE);
            return '';
        }
        return await SecureStore.getItemAsync(EMAIL_KEY) || '';
    } catch (error) {
        console.error('Error retrieving email:', error);
        return '';
    }
}

export async function clearEmail() {
    try {
        await SecureStore.deleteItemAsync(EMAIL_KEY);
        await SecureStore.deleteItemAsync(EMAIL_EXPIRE_DATE);
        return true;
    } catch (error) {
        console.error('Error clearing email:', error);
        return false;
    }
}
