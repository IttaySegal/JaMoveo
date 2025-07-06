// src/utils/validation.js

export const ALLOWED_INSTRUMENTS = [
    "vocals", "guitar", "drums", "bass", "saxophone", "keyboard"
  ];
  
  export const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  export const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  