import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export class LoggingService {
    constructor() {
        this.logsCollection = collection(db, 'logs');
    }

    async logEvent(eventType, data, userId = null, severity = 'info') {
        try {
            const logEntry = {
                eventType,
                data,
                userId,
                severity,
                timestamp: serverTimestamp()
            };

            await addDoc(this.logsCollection, logEntry);
        } catch (error) {
            console.error('Error logging event:', error);
        }
    }

    async logAuthenticationAttempt(userId, success, details) {
        await this.logEvent(
            'authentication_attempt',
            {
                success,
                details,
                timestamp: new Date().toISOString()
            },
            userId,
            success ? 'info' : 'warning'
        );
    }

    async logValidationFailure(component, field, reason, userId = null) {
        await this.logEvent(
            'validation_failure',
            {
                component,
                field,
                reason
            },
            userId,
            'warning'
        );
    }

    async getLogs(filters = {}, userId = null) {
        try {
            const querySnapshot = await getDocs(this.logsCollection);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching logs:', error);
            return [];
        }
    }
}

export const loggingService = new LoggingService();