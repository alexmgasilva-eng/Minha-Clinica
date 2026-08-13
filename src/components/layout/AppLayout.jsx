import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { OrgProvider, useOrg } from "@/lib/orgContext";
import { base44 } from "@/api/base44Client";

function LayoutInner() {
  const { loading, orgId } = useOrg();
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    if (!orgId) return;
    const loadNotif = async () => {
      const notifs = await base44.entities.Notification.filter({ organization_id: orgId, status: 'pending' });
      setNotifications(notifs?.length || 0);
    };
    loadNotif();
  }, [orgId]);

  if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  if (!orgId) return <div className="fixed inset-0 flex items-center justify-center bg-background p-6"><div className="text-center max-w-md"><h2 className="text-lg font-semibold mb-2">Não foi possível carregar sua organização</h2><p className="text-sm text-muted-foreground">Verifique sua conexão e tente recarregar a página.</p></div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar notifications={notifications} />
      <main className="lg:ml-64 min-h-screen"><div className="p-4 lg:p-8 max-w-screen-2xl"><Outlet /></div></main>
    </div>
  );
}

export default function AppLayout() {
  return <OrgProvider><LayoutInner /></OrgProvider>;
}