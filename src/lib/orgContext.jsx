import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const OrgContext = createContext(null);

export function OrgProvider({ children }) {
  const [org, setOrg] = useState(null);
  const [member, setMember] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrg();
  }, []);

  const loadOrg = async () => {
    try {
      const currentUser = await base44.auth.me();
      const members = await base44.entities.OrganizationMember.filter({ user_id: currentUser.id });
      if (members && members.length > 0) {
        const m = members[0];
        setMember(m);
        const orgData = await base44.entities.Organization.get(m.organization_id);
        setOrg(orgData);
        const profiles = await base44.entities.ProfessionalProfile.filter({ organization_id: orgData.id });
        if (profiles && profiles.length > 0) setProfile(profiles[0]);
      } else {
        const orgs = await base44.entities.Organization.list('-created_date', 1);
        if (orgs && orgs.length > 0) {
          const existingOrg = orgs[0];
          const newMember = await base44.entities.OrganizationMember.create({
            organization_id: existingOrg.id,
            user_id: currentUser.id,
            full_name: currentUser.full_name || currentUser.email,
            email: currentUser.email,
            role: 'organization_owner',
            status: 'active',
          });
          setOrg(existingOrg);
          setMember(newMember);
          const profiles = await base44.entities.ProfessionalProfile.filter({ organization_id: existingOrg.id });
          if (profiles && profiles.length > 0) setProfile(profiles[0]);
        } else {
          const newOrg = await base44.entities.Organization.create({
            name: currentUser.full_name || 'Minha Clínica',
            organization_type: 'pf',
            document_type: 'cpf',
            tax_profile: 'pf_autonomo',
            status: 'active',
            owner_user_id: currentUser.id,
            onboarding_completed: false,
            onboarding_step: 0,
          });
          const newMember = await base44.entities.OrganizationMember.create({
            organization_id: newOrg.id,
            user_id: currentUser.id,
            full_name: currentUser.full_name || currentUser.email,
            email: currentUser.email,
            role: 'organization_owner',
            status: 'active',
          });
          setOrg(newOrg);
          setMember(newMember);
        }
      }
    } catch (e) {
    }
    setLoading(false);
  };

  const orgId = org?.id || null;
  const role = member?.role || 'organization_owner';

  return (
    <OrgContext.Provider value={{ org, member, profile, loading, orgId, role, reload: loadOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  return useContext(OrgContext);
}