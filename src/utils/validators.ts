// Validadores para formularios

// Validar DNI español
export const validateDNI = (dni: string): boolean => {
  const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  if (!dniRegex.test(dni)) return false;
  
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const number = parseInt(dni.substring(0, 8), 10);
  const letter = dni.charAt(8).toUpperCase();
  
  return letters.charAt(number % 23) === letter;
};

// Validar NIE español
export const validateNIE = (nie: string): boolean => {
  const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  if (!nieRegex.test(nie)) return false;
  
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  let number = nie.substring(1, 8);
  
  // Convertir primera letra a número
  const firstLetter = nie.charAt(0).toUpperCase();
  if (firstLetter === 'X') number = '0' + number;
  else if (firstLetter === 'Y') number = '1' + number;
  else if (firstLetter === 'Z') number = '2' + number;
  
  const calculatedLetter = letters.charAt(parseInt(number, 10) % 23);
  return calculatedLetter === nie.charAt(8).toUpperCase();
};

// Validar DNI o NIE
export const validateDNIOrNIE = (value: string): boolean => {
  return validateDNI(value) || validateNIE(value);
};

// Validar IBAN español
export const validateSpanishIBAN = (iban: string): boolean => {
  // Remover espacios y convertir a mayúsculas
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Verificar formato español
  const spanishIbanRegex = /^ES\d{22}$/;
  if (!spanishIbanRegex.test(cleanIban)) return false;
  
  // Algoritmo de validación IBAN
  const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (char) => 
    (char.charCodeAt(0) - 55).toString()
  );
  
  // Calcular módulo 97
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }
  
  return remainder === 1;
};

// Obtener nombre del banco por IBAN
export const getBankNameFromIBAN = (iban: string): string => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (!cleanIban.startsWith('ES')) return '';
  
  const bankCode = cleanIban.substring(4, 8);
  
  const bankCodes: { [key: string]: string } = {
    '0049': 'Banco Santander',
    '0075': 'Banco Popular',
    '0081': 'Banco de Sabadell',
    '0128': 'Bankinter',
    '0182': 'BBVA',
    '0238': 'Banco Pastor',
    '0487': 'Banco Mare Nostrum',
    '1465': 'ING Direct',
    '2038': 'Bankia',
    '2080': 'Abanca',
    '2085': 'Ibercaja',
    '2095': 'Kutxabank',
    '2100': 'CaixaBank',
    '3025': 'Caja de Ingenieros',
    '3058': 'Cajamar',
    '3076': 'Caja Rural Central',
    '3081': 'Caja Rural de Navarra',
    '3187': 'Caja Rural de Castilla-La Mancha'
  };
  
  return bankCodes[bankCode] || 'Banco no identificado';
};

// Validar teléfono español
export const validateSpanishPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Formatear IBAN para mostrar
export const formatIBAN = (iban: string): string => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
};