import { z } from 'zod';

const phoneTypeSchema = z.enum(['FIXED', 'MOBILE']);

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  number: z.string().min(1, 'Number is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

const phoneSchema = z.object({
  areaCode: z.string().min(1, 'Area code is required'),
  number: z.string().min(1, 'Phone number is required'),
  isWhatsapp: z.boolean().default(false),
  type: phoneTypeSchema,
});

const individualSchema = z.object({
  cpf: z.string().min(11, 'CPF must have at least 11 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  birthDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

const companySchema = z.object({
  cnpj: z.string().min(14, 'CNPJ must have at least 14 characters'),
  legalName: z.string().min(1, 'Legal name is required'),
  tradeName: z.string(),
  stateRegistration: z.string(),
});

export const createCustomerSchema = z.object({
  user: z
    .object({
      type: z.enum(['INDIVIDUAL', 'COMPANY']),
      email: z
        .string()
        .email('Invalid email format')
        .optional()
        .or(z.literal('')),
      individual: individualSchema.optional(),
      company: companySchema.optional(),
      address: addressSchema,
      phone: phoneSchema,
    })
    .refine(
      (data) => {
        if (data.type === 'INDIVIDUAL' && !data.individual) {
          return false;
        }
        if (data.type === 'COMPANY' && !data.company) {
          return false;
        }
        return true;
      },
      {
        message: 'Individual or Company data is required based on user type',
      },
    ),
});
