/**
 * Message Validator
 * Validates contact form data before submission
 */

export interface MessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate message data
 */
export const validateMessage = (data: MessageData): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters';
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Email is invalid';
    }
  }

  // Validate subject
  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = 'Subject is required';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  } else if (data.subject.trim().length > 200) {
    errors.subject = 'Subject must not exceed 200 characters';
  }

  // Validate message
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.trim().length > 5000) {
    errors.message = 'Message must not exceed 5000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize message data
 */
export const sanitizeMessageData = (data: MessageData): MessageData => {
  return {
    name: data.name.trim().replace(/[<>]/g, ''),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim().replace(/[<>]/g, ''),
    message: data.message.trim().replace(/[<>]/g, ''),
  };
};

/**
 * Check if message contains spam keywords
 */
export const isSpam = (data: MessageData): boolean => {
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'winner', 'free money',
    'click here', 'subscribe', 'unsubscribe', 'buy now',
    'limited time', 'act now', 'congratulations',
  ];

  const combinedText = `${data.name} ${data.subject} ${data.message}`.toLowerCase();
  
  return spamKeywords.some(keyword => combinedText.includes(keyword));
};