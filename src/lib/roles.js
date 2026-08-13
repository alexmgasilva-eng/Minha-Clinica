// Role definitions and permission helpers

export const ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  ORGANIZATION_OWNER: 'organization_owner',
  PSYCHOLOGIST: 'psychologist',
  SECRETARY: 'secretary',
  FINANCIAL: 'financial',
  ACCOUNTANT: 'accountant',
  ACCOUNTING_ASSISTANT: 'accounting_assistant',
};

export const ROLE_LABELS = {
  platform_admin: 'Administrador da Plataforma',
  organization_owner: 'Proprietário',
  psychologist: 'Psicólogo(a)',
  secretary: 'Secretária',
  financial: 'Financeiro',
  accountant: 'Contador',
  accounting_assistant: 'Assistente Contábil',
};

export const ROLE_COLORS = {
  platform_admin: 'bg-purple-100 text-purple-700',
  organization_owner: 'bg-blue-100 text-blue-700',
  psychologist: 'bg-teal-100 text-teal-700',
  secretary: 'bg-green-100 text-green-700',
  financial: 'bg-amber-100 text-amber-700',
  accountant: 'bg-slate-100 text-slate-700',
  accounting_assistant: 'bg-gray-100 text-gray-600',
};

export const MODULE_ACCESS = {
  dashboard: ['platform_admin', 'organization_owner', 'psychologist', 'secretary', 'financial', 'accountant', 'accounting_assistant'],
  agenda: ['platform_admin', 'organization_owner', 'psychologist', 'secretary'],
  patients: ['platform_admin', 'organization_owner', 'psychologist', 'secretary'],
  clinical_notes: ['platform_admin', 'organization_owner', 'psychologist'],
  financial: ['platform_admin', 'organization_owner', 'psychologist', 'secretary', 'financial'],
  payments: ['platform_admin', 'organization_owner', 'psychologist', 'secretary', 'financial'],
  receita_saude: ['platform_admin', 'organization_owner', 'psychologist', 'financial'],
  accounting: ['platform_admin', 'organization_owner', 'accountant', 'accounting_assistant', 'financial'],
  documents: ['platform_admin', 'organization_owner', 'psychologist', 'secretary', 'financial', 'accountant', 'accounting_assistant'],
  video: ['platform_admin', 'organization_owner', 'psychologist', 'secretary'],
  agency: ['platform_admin', 'organization_owner', 'psychologist'],
  reports: ['platform_admin', 'organization_owner', 'psychologist', 'financial', 'accountant'],
  integrations: ['platform_admin', 'organization_owner'],
  team: ['platform_admin', 'organization_owner'],
  settings: ['platform_admin', 'organization_owner'],
  admin: ['platform_admin'],
};

export function canAccess(role, module) {
  if (!role) return false;
  const allowed = MODULE_ACCESS[module] || [];
  return allowed.includes(role);
}

export function hasRole(role, ...allowedRoles) {
  return allowedRoles.includes(role);
}