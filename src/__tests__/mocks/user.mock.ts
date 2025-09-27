import { addYears } from 'date-fns';
import { faker } from './faker';
import { createPhoneMock } from './phone.mock';
import { UserDomain } from '../../modules/users/domain/user.interface';

const generateRandomCpf = () => {
  const random = (n: number) => Math.floor(Math.random() * n);

  const n1 = random(10);
  const n2 = random(10);
  const n3 = random(10);
  const n4 = random(10);
  const n5 = random(10);
  const n6 = random(10);
  const n7 = random(10);
  const n8 = random(10);
  const n9 = random(10);

  let d1 =
    11 -
    ((n1 * 10 +
      n2 * 9 +
      n3 * 8 +
      n4 * 7 +
      n5 * 6 +
      n6 * 5 +
      n7 * 4 +
      n8 * 3 +
      n9 * 2) %
      11);
  if (d1 >= 10) d1 = 0;

  let d2 =
    11 -
    ((n1 * 11 +
      n2 * 10 +
      n3 * 9 +
      n4 * 8 +
      n5 * 7 +
      n6 * 6 +
      n7 * 5 +
      n8 * 4 +
      n9 * 3 +
      d1 * 2) %
      11);
  if (d2 >= 10) d2 = 0;

  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
};

const generateRandomState = () => {
  const estados = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  const index = Math.floor(Math.random() * estados.length);
  return estados[index];
};

const generateRandomCnpj = () => {
  const random = (n: number) => Math.floor(Math.random() * n);

  const n1 = random(10);
  const n2 = random(10);
  const n3 = random(10);
  const n4 = random(10);
  const n5 = random(10);
  const n6 = random(10);
  const n7 = random(10);
  const n8 = random(10);
  const n9 = 0;
  const n10 = 0;
  const n11 = 0;
  const n12 = 1;

  const calcDv = (nums: number[]) => {
    let pos = nums.length - 7;
    let soma = 0;

    for (let i = nums.length; i >= 1; i -= 1) {
      soma += nums[nums.length - i] * (pos -= 1);
      if (pos < 2) pos = 9;
    }

    const resultado = 11 - (soma % 11);
    return resultado > 9 ? 0 : resultado;
  };

  const dv1 = calcDv([n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12]);
  const dv2 = calcDv([n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, dv1]);

  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}/${n10}${n11}${n12}${dv1}${dv2}`;
};

export function createUserMock(options?: Partial<UserDomain>) {
  const userId = options?.id ?? faker.string.uuid();
  const dateNow = new Date();
  const createdAt = addYears(dateNow, -2);
  const type =
    options?.type ?? faker.helpers.arrayElement(['INDIVIDUAL', 'COMPANY']);
  if (type === 'COMPANY') {
    return {
      id: userId,
      createdAt: options?.createdAt ?? createdAt,
      deletedAt: options?.deletedAt ?? null,
      individual: undefined,
      type: options?.type ?? 'INDIVIDUAL',
      email: options?.email ?? faker.internet.email(),
      company: {
        deletedAt: options?.company?.deletedAt ?? null,
        tradeName: options?.company?.tradeName ?? faker.company.name(),
        legalName: options?.company?.tradeName ?? faker.company.name(),
        stateRegistration:
          options?.company?.stateRegistration ?? generateRandomState(),
        cnpj: options?.company?.cnpj ?? generateRandomCnpj(),
      },
      addresses: options?.addresses ?? [],
      phones: options?.phones ?? [
        createPhoneMock({ isPrimary: true }),
        createPhoneMock({ isPrimary: false }),
      ],
    };
  }
  return {
    id: userId,
    createdAt: options?.createdAt ?? createdAt,
    deletedAt: options?.deletedAt ?? null,
    individual: {
      cpf: options?.individual?.cpf ?? generateRandomCpf(),
      deletedAt: options?.individual?.deletedAt ?? null,
      fullName: options?.individual?.fullName ?? faker.person.fullName(),
      birthDate: options?.individual?.birthDate ?? faker.date.birthdate(),
    },
    type: options?.type ?? 'INDIVIDUAL',
    email: options?.email ?? faker.internet.email(),
    company: undefined,
    addresses: options?.addresses ?? [],
    phones: options?.phones ?? [
      createPhoneMock({ isPrimary: true }),
      createPhoneMock({ isPrimary: false }),
    ],
  };
}
