/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
const mockFaker = {
  helpers: {
    arrayElement: <T>(array: T[]): T => {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    },
  },
  number: {
    int: (options: { min: number; max: number }): number =>
      Math.floor(Math.random() * (options.max - options.min + 1)) + options.min,
  },
  string: {
    numeric: (length: number): string => {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString();
      }
      return result;
    },
    uuid: (): string =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }),
  },
  datatype: {
    boolean: (): boolean => Math.random() < 0.5,
  },
  internet: {
    email: (): string => {
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const names = ['john', 'jane', 'mike', 'sarah', 'david', 'lisa'];
      const name = names[Math.floor(Math.random() * names.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const randomNum = Math.floor(Math.random() * 1000);
      return `${name}${randomNum}@${domain}`;
    },
  },
  company: {
    name: (): string => {
      const companyTypes = ['Ltda', 'S.A.', 'EIRELI', 'ME'];
      const companyNames = [
        'Tech Solutions',
        'Digital Corp',
        'Innovation Inc',
        'Future Systems',
        'Smart Solutions',
        'Global Tech',
        'Advanced Systems',
        'Modern Corp',
      ];
      const name =
        companyNames[Math.floor(Math.random() * companyNames.length)];
      const type =
        companyTypes[Math.floor(Math.random() * companyTypes.length)];
      return `${name} ${type}`;
    },
  },
  person: {
    fullName: (): string => {
      const firstNames = [
        'João',
        'Maria',
        'Pedro',
        'Ana',
        'Carlos',
        'Lucia',
        'Fernando',
        'Camila',
      ];
      const lastNames = [
        'Silva',
        'Santos',
        'Oliveira',
        'Souza',
        'Rodrigues',
        'Ferreira',
        'Alves',
        'Pereira',
      ];
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    },
  },
  date: {
    birthdate: (): Date => {
      const now = new Date();
      const minAge = 18;
      const maxAge = 80;
      const minDate = new Date(now.getFullYear() - maxAge, 0, 1);
      const maxDate = new Date(now.getFullYear() - minAge, 11, 31);
      return new Date(
        minDate.getTime() +
          Math.random() * (maxDate.getTime() - minDate.getTime()),
      );
    },
  },
};

export const faker = mockFaker;
