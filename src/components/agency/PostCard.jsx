import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Edit3, Trash2, Eye } from "lucide-react";

const STATUS_STYLES = { rascunho: "bg-gray-100 text-gray-600", agendado: "bg-amber-50 text-amber-600", publicado: "bg-emerald-50 text-emerald-600", erro: "bg-red-50 text-red-500" };
const PLATFORM_ICONS = { instagram: "📸", facebook: "👍", instagram_facebook: "📲" };

export default function PostCard({ post, onRefresh }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const handleDelete = async () => { await base44.entities.SocialPost.delete(post.id); onRefresh(); };
  const handleStatusChange = async (status) => { await base44.entities.SocialPost.update(post.id, { status }); onRefresh(); };
  const handleSaveEdit = async () => { setSaving(true); await base44.entities.SocialPost.update(post.id, { content: editContent }); setSaving(false); setPreviewOpen(false); onRefresh(); };
  return <>
    <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow group">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">{post.image_url ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" /> : <div className="text-5xl opacity-50">{PLATFORM_ICONS[post.platform] || "📄"}</div>}<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setPreviewOpen(true)} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-muted"><Eye className="w-3.5 h-3.5" /></button><button onClick={handleDelete} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button></div></div>
      <div className="p-4"><div className="flex items-start justify-between gap-2 mb-2"><p className="text-sm font-semibold line-clamp-1">{post.title || "Post sem título"}</p><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLES[post.status]}`}>{post.status}</span></div><p className="text-xs text-muted-foreground line-clamp-3">{post.content}</p>{post.hashtags && <p className="text-[10px] text-primary/70 mt-2 line-clamp-1">{post.hashtags.split(" ").slice(0, 5).join(" ")}...</p>}<div className="flex gap-1.5 mt-3">{post.status === "rascunho" && <Button size="sm" variant="outline" onClick={() => handleStatusChange("agendado")} className="flex-1 rounded-lg text-xs"><Clock className="w-3 h-3 mr-1" /> Agendar</Button>}{post.status === "agendado" && <Button size="sm" onClick={() => handleStatusChange("publicado")} className="flex-1 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Marcar publicado</Button>}<Button size="sm" variant="ghost" onClick={() => setPreviewOpen(true)} className="rounded-lg text-xs px-2"><Edit3 className="w-3.5 h-3.5" /></Button></div></div>
    </div>
    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}><DialogContent className="rounded-2xl max-w-lg"><DialogHeader><DialogTitle className="flex items-center gap-2">{PLATFORM_ICONS[post.platform]} {post.title || "Editar Post"}</DialogTitle></DialogHeader><div className="space-y-3 mt-2">{post.image_url && <img src={post.image_url} alt="" className="w-full rounded-xl object-cover max-h-52" />}<div><p className="text-xs font-medium text-muted-foreground mb-1">Texto</p><Textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="rounded-xl" rows={6} /></div>{post.hashtags && <div className="bg-muted/50 rounded-xl p-3"><p className="text-xs text-primary/80">{post.hashtags}</p></div>}<div className="flex gap-2 pt-2"><Button variant="outline" onClick={() => setPreviewOpen(false)} className="flex-1 rounded-xl">Cancelar</Button><Button onClick={handleSaveEdit} disabled={saving} className="flex-1 rounded-xl">{saving ? "Salvando..." : "Salvar alterações"}</Button></div></div></DialogContent></Dialog>
  </>;
}