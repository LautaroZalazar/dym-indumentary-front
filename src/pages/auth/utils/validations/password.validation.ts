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

  export const validationName = (name: string) => {
    const validations = [
      { condition: /^[a-zA-Z\s]+$/.test(name), message: 'Solo se permiten letras'},
      { condition: name.length >= 3, message: 'Mínimo 3 caracteres'},
    ]
    return validations;
  }

  export const validationEmail = ( email: string ) => {
    const validations = [
      { condition: /@/.test(email), message: 'Debe contener un @' },
      { condition: /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email), message: 'Luego del punto, mminimo 2 caracteres y maximo 4' },
    ]
    return validations;
  }