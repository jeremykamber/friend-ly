import { format, isValid, parseISO } from 'date-fns';

const formatMessageTime = (timestamp) => {
    // Guard against invalid timestamps
    if (!timestamp) return '';

    let date;
    try {
        // Handle different timestamp formats
        if (timestamp instanceof Date) {
            date = timestamp;
        } else if (typeof timestamp === 'string') {
            date = parseISO(timestamp);
        } else if (typeof timestamp === 'number') {
            date = new Date(timestamp);
        } else {
            return '';
        }

        // Verify we have a valid date
        if (!isValid(date)) {
            console.warn('Invalid date:', timestamp);
            return '';
        }

        const now = new Date();

        // If message is from today, show time only
        if (date.toDateString() === now.toDateString()) {
            return format(date, 'h:mm a'); // e.g., "3:30 PM"
        }

        // If message is from this week, show day and time
        const isWithinLastWeek = now - date < 7 * 24 * 60 * 60 * 1000;
        if (isWithinLastWeek) {
            return format(date, 'EEE h:mm a'); // e.g., "Wed 3:30 PM"
        }

        // Otherwise show date and time
        return format(date, 'MMM d, yyyy h:mm a'); // e.g., "Jan 15, 2023 3:30 PM"
    } catch (error) {
        console.error('Error formatting date:', error, timestamp);
        return '';
    }
};

export default formatMessageTime