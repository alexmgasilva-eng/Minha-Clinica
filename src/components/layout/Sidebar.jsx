import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, FileText, DollarSign, CreditCard, Receipt, Building2, BarChart3, Menu, X, Heart, LogOut, Video, Sparkles, Link2, UserCog, Settings, FolderOpen, ClipboardList, Bell, ChevronDown, ChevronRight, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useOrg } from "@/lib/orgContext";
import { canAccess } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";

const NAV_GROUPS = [
  { label: "Clínica", items: [
    { label: "Visão Geral", icon: LayoutDashboard, path: "/" },
    { label: "Agenda", icon: Calendar, path: "/agenda", module: "agenda" },
    { label: "Pacientes", icon: Users, path: "/pacientes", module: "patients" },
    { label: "Prontuário", icon: FileText, path: "/prontuario", module: "clinical_notes" },
    { label: "Teleatendimento", icon: Video, path: "/videoconsulta", module: "video" },
  ]},
  { label: "Financeiro e Fiscal", items: [
    { label: "Financeiro", icon: DollarSign, path: "/financeiro", module: "financial" },
    { label: "Pagamentos", icon: CreditCard, path: "/pagamentos", module: "payments" },
    { label: "Receita Saúde", icon: Receipt, path: "/receita-saude", module: "receita_saude" },
    { label: "Contabilidade", icon: Building2, path: "/contabilidade", module: "accounting" },
    { label: "Documentos", icon: FolderOpen, path: "/documentos", module: "documents" },
  ]},
  { label: "Marketing", items: [{ label: "Minha Agência", icon: Sparkles, path: "/agencia-online", module: "agency" }] },
  { label: "Análise", items: [{ label: "Relatórios", icon: BarChart3, path: "/relatorios", module: "reports" }] },
  { label: "Configurações", items: [
    { label: "Integrações", icon: Link2, path: "/integracoes", module: "integrations" },
    { label: "Equipe", icon: UserCog, path: "/equipe", module: "team" },
    { label: "Configurações", icon: Settings, path: "/configuracoes", module: "settings" },
    { label: "Resumo da Impl.", icon: ClipboardList, path: "/resumo-implementacao", module: "settings" },
  ]},
];

const ADMIN_ITEMS = [
  { label: "Organizações", icon: Building2, path: "/admin/organizacoes" },
  { label: "Planos", icon: ClipboardList, path: "/admin/planos" },
  { label: "Auditoria", icon: Shield, path: "/admin/auditoria" },
];

export default function Sidebar({ notifications = 0 }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const { role } = useOrg();
  const handleLogout = () => { base44.auth.logout("/login"); };
  const toggleGroup = (label) => setCollapsed(c => ({ ...c, [label]: !c[label] }));
  const isActive = (path) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0"><Heart className="w-5 h-5 text-white" /></div><div className="min-w-0"><h1 className="font-bold text-base text-sidebar-foreground leading-tight truncate">Minha Clínica</h1><p className="text-[10px] text-muted-foreground">Gestão Clínica Integrada</p></div></div></div>
      <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(item => !item.module || canAccess(role, item.module));
          if (visibleItems.length === 0) return null;
          const isCollapsed = collapsed[group.label];
          return <div key={group.label} className="mb-1"><button onClick={() => toggleGroup(group.label)} className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors rounded-lg">{group.label}{isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</button>{!isCollapsed && visibleItems.map((item) => <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${isActive(item.path) ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}><item.icon className="w-4 h-4 flex-shrink-0" /><span className="truncate">{item.label}</span></Link>)}</div>;
        })}
        {role === 'platform_admin' && <div className="mb-1"><button onClick={() => toggleGroup('Admin')} className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-purple-500/70 hover:text-purple-500 transition-colors rounded-lg">Plataforma{collapsed['Admin'] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</button>{!collapsed['Admin'] && ADMIN_ITEMS.map(item => <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive(item.path) ? "bg-purple-600 text-white" : "text-purple-600/70 hover:bg-purple-50 hover:text-purple-700"}`}><item.icon className="w-4 h-4" />{item.label}</Link>)}</div>}
      </nav>
      <div className="p-3 border-t border-sidebar-border space-y-1"><Link to="/notificacoes" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent transition-all"><Bell className="w-4 h-4" /><span>Notificações</span>{notifications > 0 && <Badge className="ml-auto h-5 px-1.5 text-[10px] bg-destructive text-white">{notifications}</Badge>}</Link><button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"><LogOut className="w-4 h-4" />Sair</button></div>
    </div>
  );

  return <><button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-border"><Menu className="w-5 h-5" /></button>{mobileOpen && <div className="lg:hidden fixed inset-0 z-50"><div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} /><div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl"><button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 p-1.5 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button><NavContent /></div></div>}<aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border overflow-hidden"><NavContent /></aside></>;
}