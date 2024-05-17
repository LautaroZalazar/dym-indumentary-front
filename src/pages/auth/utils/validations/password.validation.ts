export const validationPassword = (validatePassword: string) => {
    const validations = [
      { condition: validatePassword.length >= 8, message: 'Mínimo 8 caracteres' },
      { condition: /[a-z]/.test(validatePassword), message: 'Al menos una minúscula' },
      { condition: /[A-Z]/.test(validatePassword), message: 'Al menos una mayúscula' },
      { condition: /\d/.test(validatePassword), message: 'Al menos un número' },
      { condition: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(validatePassword), message: 'Al menos un carácter especial' },
    ];
    return validations;
  };