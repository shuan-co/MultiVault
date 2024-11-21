// validationService.js
import { loggingService } from './LoggingService';

const VALIDATION_RULES = {
  name: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s-']+$/,
    message: 'Name must be between 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^\+?[\d\s-]{10,}$/,
    message: 'Please enter a valid phone number'
  },
  date: {
    min: '1900-01-01',
    max: new Date().toISOString().split('T')[0],
    message: 'Please enter a valid date'
  },
  quantity: {
    min: 0,
    max: 999999,
    message: 'Quantity must be between 0 and 999,999'
  },
  price: {
    min: 0,
    max: 999999.99,
    message: 'Price must be between 0 and 999,999.99'
  },
  description: {
    min: 0,
    max: 1000,
    message: 'Description must be less than 1000 characters'
  }
};

export const validationService = {
  validateField(fieldName, value, customRules = {}) {
    const rules = { ...VALIDATION_RULES[fieldName], ...customRules };
    const errors = [];

    if (value === undefined || value === null || value === '') {
      if (rules.required) {
        errors.push(`${fieldName} is required`);
      }
      return { isValid: errors.length === 0, errors };
    }

    if (rules.min !== undefined && value.length < rules.min) {
      errors.push(`${fieldName} must be at least ${rules.min} characters`);
    }
    if (rules.max !== undefined && value.length > rules.max) {
      errors.push(`${fieldName} must be less than ${rules.max} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || `Invalid ${fieldName} format`);
    }

    if (typeof value === 'number' || !isNaN(value)) {
      const numValue = Number(value);
      if (rules.min !== undefined && numValue < rules.min) {
        errors.push(`${fieldName} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && numValue > rules.max) {
        errors.push(`${fieldName} must be less than ${rules.max}`);
      }
    }

    if (rules.type === 'date') {
      const dateValue = new Date(value);
      const minDate = rules.min ? new Date(rules.min) : null;
      const maxDate = rules.max ? new Date(rules.max) : null;

      if (minDate && dateValue < minDate) {
        errors.push(`${fieldName} must be after ${rules.min}`);
      }
      if (maxDate && dateValue > maxDate) {
        errors.push(`${fieldName} must be before ${rules.max}`);
      }
    }

    // Log validation failures
    if (errors.length > 0) {
      loggingService.logValidationFailure(
        'data_validation',
        fieldName,
        errors.join(', ')
      );
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateForm(formData, rules) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, value] of Object.entries(formData)) {
      const validation = this.validateField(fieldName, value, rules[fieldName]);
      if (!validation.isValid) {
        errors[fieldName] = validation.errors;
        isValid = false;
      }
    }

    return {
      isValid,
      errors
    };
  },

  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }

    input = input.replace(/<[^>]*>/g, '');

    input = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return input;
  }
};