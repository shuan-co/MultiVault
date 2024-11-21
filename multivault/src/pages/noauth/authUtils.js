import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Password requirements constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export const ROLES = {
    ADMIN: 'admin',
    BUSINESS_OWNER: 'business_owner',
    STAFF: 'staff',
    CUSTOMER: 'customer'
};

export const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
        errors.push(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`);
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

export const getUserRole = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            return userDoc.data().role;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
};

export const isAccountLocked = async (email) => {
    const attemptsRef = doc(db, 'loginAttempts', email);
    
    try {
        const docSnap = await getDoc(attemptsRef);
        if (!docSnap.exists()) {
            return { locked: false };
        }

        const attempts = docSnap.data();
        if (attempts.lockedUntil) {
            const lockExpiry = new Date(attempts.lockedUntil);
            if (lockExpiry > new Date()) {
                const minutesLeft = Math.ceil((lockExpiry - new Date()) / (60 * 1000));
                return { locked: true, minutesLeft };
            }
        }
        return { locked: false };
    } catch (error) {
        console.error('Error checking account lock status:', error);
        throw error;
    }
};

export const trackLoginAttempt = async (email, success) => {
    const attemptsRef = doc(db, 'loginAttempts', email);
    const now = new Date();
    
    try {
        const docSnap = await getDoc(attemptsRef);
        let attempts = docSnap.exists() ? docSnap.data() : { count: 0 };

        if (success) {
            attempts = { count: 0, lastAttempt: now.toISOString() };
        } else {
            attempts.count = (attempts.count || 0) + 1;
            attempts.lastAttempt = now.toISOString();
            
            if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
                attempts.lockedUntil = new Date(now.getTime() + LOCKOUT_DURATION).toISOString();
            }
        }
        
        await setDoc(attemptsRef, attempts);
        return attempts;
    } catch (error) {
        console.error('Error tracking login attempt:', error);
        throw error;
    }
};

export const ROUTE_PERMISSIONS = {
    '/inventory': [ROLES.ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF],
    '/dashboard': [ROLES.ADMIN, ROLES.BUSINESS_OWNER],
    '/users': [ROLES.ADMIN],
    '/orders': [ROLES.CUSTOMER, ROLES.BUSINESS_OWNER, ROLES.STAFF],
    '/profile': [ROLES.ADMIN, ROLES.BUSINESS_OWNER, ROLES.CUSTOMER, ROLES.STAFF]
};

export const hasPermission = (userRole, route) => {
    const allowedRoles = ROUTE_PERMISSIONS[route];
    return allowedRoles ? allowedRoles.includes(userRole) : false;
};