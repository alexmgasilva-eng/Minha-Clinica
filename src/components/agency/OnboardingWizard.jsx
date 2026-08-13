import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Building2,
  Target, Palette, Calendar, Share2
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Seu Perfil", icon: Building2, desc: "Informações básicas da clínica" },
  { id: 2, label: "Público-alvo", icon: Target, desc: "Para quem você comunica" },
  { id: 3, label: "Estilo", icon: Palette, desc: "Tom e pilares de conteúdo" },
  { id: 4, label: "Frequência", icon: Calendar, desc: "Calendário editorial" },
  { id: 5, label: "Redes Sociais", icon: Share2, desc: "Suas plataformas" },
];

export default function OnboardingWizard({ existing, onComplete }) {
  const [step, setStep] = useState(existing?.step_completed || 0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    clinic_name: existing?.clinic_name || "",
    specialty: existing?.specialty || "",
    target_audience: existing?.target_audience || "",
    content_pillars: existing?.content_pillars || "",
    posting_frequency: existing?.posting_frequency || "3x_semana",
    preferred_tone: existing?.preferred_tone || "acolhedor",
    instagram_handle: existing?.instagram_handle || "",
    facebook_page: existing?.facebook_page || "",
    meta_connected: existing?.meta_connected || false,
  });

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleFinish = async () => {
    setSaving(true);
    const payload = { ...data, step_completed: STEPS.length, completed: true };
    let result;
    if (existing?.id) {
      result = await base44.entities.AgencyOnboarding.update(existing.id, payload);
    } else {
      result = await base44.entities.AgencyOnboarding.create(payload);
    }
    setSaving(false);
    onComplete(result);
  };

  const progress = ((step) / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Configurar Agência Online</h1>
        <p className="text-muted-foreground mt-2">Configure seu perfil para geração automática de posts personalizados</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > i ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" :
                step === i ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-[10px] text-muted-foreground hidden sm:block text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4"><Building2 className="w-5 h-5 text-purple-500" /><h2 className="font-semibold text-lg">Sobre sua clínica</h2></div>
            <div><Label>Nome da Clínica / Profissional *</Label><Input value={data.clinic_name} onChange={e => set("clinic_name", e.target.value)} className="rounded-xl mt-1" placeholder="Ex: Dra. Ana Santos - Psicóloga" /></div>
            <div><Label>Especialidade *</Label><Input value={data.specialty} onChange={e => set("specialty", e.target.value)} className="rounded-xl mt-1" placeholder="Ex: Psicoterapia, TCC, Ansiedade, Depressão..." /></div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4"><div className="flex items-center gap-3 mb-4"><Target className="w-5 h-5 text-purple-500" /><h2 className="font-semibold text-lg">Público-alvo</h2></div><div><Label>Descreva seu público ideal</Label><Textarea value={data.target_audience} onChange={e => set("target_audience", e.target.value)} className="rounded-xl mt-1" rows={4} placeholder="Ex: Adultos entre 25-45 anos com ansiedade, profissionais com burnout, mulheres em transições de vida..." /></div></div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4"><Palette className="w-5 h-5 text-purple-500" /><h2 className="font-semibold text-lg">Tom e conteúdo</h2></div>
            <div><Label>Tom de comunicação</Label><Select value={data.preferred_tone} onValueChange={v => set("preferred_tone", v)}><SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="acolhedor">🤗 Acolhedor — empático, humano</SelectItem><SelectItem value="profissional">💼 Profissional — sério, técnico</SelectItem><SelectItem value="educativo">📚 Educativo — ensina, informa</SelectItem><SelectItem value="motivacional">🔥 Motivacional — inspira, engaja</SelectItem><SelectItem value="informativo">ℹ️ Informativo — neutro, direto</SelectItem></SelectContent></Select></div>
            <div><Label>Pilares de conteúdo</Label><Textarea value={data.content_pillars} onChange={e => set("content_pillars", e.target.value)} className="rounded-xl mt-1" rows={3} placeholder="Ex: Saúde mental no trabalho, Técnicas de ansiedade, Autoconhecimento, Relacionamentos saudáveis..." /></div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4"><Calendar className="w-5 h-5 text-purple-500" /><h2 className="font-semibold text-lg">Frequência de posts</h2></div>
            <div className="grid grid-cols-1 gap-3">{[
              { value: "3x_semana", label: "3x por semana", desc: "Segunda, Quarta e Sexta", icon: "📅" },
              { value: "5x_semana", label: "5x por semana", desc: "Segunda a Sexta", icon: "🗓️" },
              { value: "diario", label: "Diário", desc: "Todos os dias", icon: "⚡" },
            ].map(opt => <button key={opt.value} onClick={() => set("posting_frequency", opt.value)} className={`p-4 rounded-xl border-2 text-left transition-all ${data.posting_frequency === opt.value ? "border-purple-500 bg-purple-50" : "border-border hover:border-muted-foreground/30"}`}><div className="flex items-center gap-3"><span className="text-2xl">{opt.icon}</span><div><p className="font-medium">{opt.label}</p><p className="text-xs text-muted-foreground">{opt.desc}</p></div></div></button>)}</div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4"><Share2 className="w-5 h-5 text-purple-500" /><h2 className="font-semibold text-lg">Suas redes sociais</h2></div>
            <div><Label>Instagram @</Label><div className="flex mt-1"><span className="flex items-center px-3 bg-muted rounded-l-xl border border-r-0 border-input text-muted-foreground text-sm">@</span><Input value={data.instagram_handle} onChange={e => set("instagram_handle", e.target.value)} className="rounded-r-xl rounded-l-none" placeholder="seuperfil" /></div></div>
            <div><Label>Página do Facebook</Label><Input value={data.facebook_page} onChange={e => set("facebook_page", e.target.value)} className="rounded-xl mt-1" placeholder="Nome da sua página" /></div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4"><p className="text-sm font-medium text-blue-800">📣 Integração com Meta (Instagram/Facebook)</p><p className="text-xs text-blue-600 mt-1">A publicação automática direta no Instagram/Facebook requer a API do Meta Business. Por enquanto, os posts são gerados com IA e você pode publicar manualmente.</p></div>
          </div>
        )}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleBack} disabled={step === 0} className="rounded-xl gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
          {step < STEPS.length - 1 ? <Button onClick={handleNext} disabled={step === 0 && !data.clinic_name} className="rounded-xl gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">Próximo <ArrowRight className="w-4 h-4" /></Button> : <Button onClick={handleFinish} disabled={saving} className="rounded-xl gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">{saving ? "Salvando..." : <><CheckCircle2 className="w-4 h-4" /> Concluir configuração</>}</Button>}
        </div>
      </div>
    </div>
  );
}