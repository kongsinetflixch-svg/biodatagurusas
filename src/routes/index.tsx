import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Printer, 
  Download, 
  Edit2, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Briefcase, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Search, 
  FileText, 
  FileSpreadsheet,
  Image as ImageIcon,
  Camera
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Profil Guru Profesional 2026",
    meta: [
      { name: "description", content: "Portal Rasmi Profil Guru Profesional 2026 - KPM" },
      { property: "og:title", content: "Profil Guru Profesional 2026" },
    ],
  }),
  component: GuruProfile,
});

function GuruProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);
  
  // Teachers state for multi-profile support
  const [teachers, setTeachers] = useState<any[]>(() => {
    // Initial empty state if none
    return [];
  });

  // Derived state for current active teacher
  const currentTeacher = teachers.find(t => t.id === activeTeacherId) || null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handlers for switching and creating teachers
  const handleAddTeacher = () => {
    const newId = Math.random().toString(36).substring(7);
    const newTeacher = {
      id: newId,
      profileImage: null,
      profile: {
        nama: "Guru Baru",
        kp: "",
        tel: "",
        email: "",
        pengalaman: "",
        tempohSemasa: "",
        tarikhMula: "",
        opsyen: "",
        gred: "",
        mengajarOpsyen: "",
        alamat: "",
        sekolah: {
          nama: "",
          alamat: "",
          kod: "",
          tel: "",
          faks: "",
          jawatan: "",
          guruKhas: "",
          pemeriksaSPM: "",
          lain: ""
        }
      },
      kelulusan: [],
      subjek: [],
      sejarah: []
    };
    setTeachers([...teachers, newTeacher]);
    setActiveTeacherId(newId);
    setIsEditMode(true);
    toast.success("Profil guru baru telah dicipta.");
  };

  const handleSelectTeacher = (id: string) => {
    setActiveTeacherId(id);
    setIsEditMode(false);
  };

  const handleDeleteTeacher = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Adakah anda pasti mahu memadam profil ini?")) {
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      if (activeTeacherId === id) {
        setActiveTeacherId(updated.length > 0 ? updated[0].id : null);
      }
      toast.error("Profil guru telah dipadam.");
    }
  };

  // Helper to update current teacher's data
  const updateCurrentTeacher = (updates: any) => {
    if (!activeTeacherId) return;
    setTeachers(teachers.map(t => 
      t.id === activeTeacherId ? { ...t, ...updates } : t
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsEditMode(false);
    toast.success("Maklumat telah berjaya disimpan.");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeTeacherId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentTeacher({ profileImage: reader.result as string });
        toast.success("Gambar profil berjaya dikemaskini.");
      };
      reader.readAsDataURL(file);
    }
  };

  if (teachers.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden p-8 text-center space-y-6 bg-white animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#002B5B] rounded-3xl flex items-center justify-center mx-auto shadow-xl transform rotate-3">
             <span className="text-2xl font-black text-white">KPM</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#002B5B]">PROFIL GURU</h1>
            <p className="text-slate-500 font-medium">Tiada profil guru dijumpai. Sila tambah profil baru untuk bermula.</p>
          </div>
          <Button onClick={handleAddTeacher} className="w-full h-14 bg-[#002B5B] hover:bg-[#003B7B] rounded-2xl text-lg font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95">
            <Plus className="w-6 h-6 mr-2" /> Tambah Profil Guru
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentTeacher) {
    return null;
  }

  const { profile, profileImage, kelulusan, subjek, sejarah } = currentTeacher;

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans text-slate-900 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto print-container space-y-6">
        
        {/* PANITIA SELECTOR / TABS */}
        <div className="no-print flex flex-wrap gap-2 mb-4">
          {teachers.map(t => (
            <div key={t.id} className="relative group">
              <Button 
                variant={activeTeacherId === t.id ? "default" : "outline"}
                onClick={() => handleSelectTeacher(t.id)}
                className={`h-12 px-6 rounded-2xl font-bold transition-all ${activeTeacherId === t.id ? 'bg-[#002B5B] shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-[#002B5B]'}`}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 border border-white/20">
                    <AvatarImage src={t.profileImage || ""} />
                    <AvatarFallback className="text-[8px]">{t.profile.nama.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {t.profile.nama || "Tanpa Nama"}
                </div>
              </Button>
              {teachers.length > 1 && (
                <button 
                  onClick={(e) => handleDeleteTeacher(t.id, e)}
                  className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <Button 
            variant="outline" 
            onClick={handleAddTeacher}
            className="h-12 w-12 rounded-2xl border-dashed border-2 border-slate-300 hover:border-[#002B5B] hover:bg-slate-50 flex items-center justify-center p-0"
            title="Tambah Guru Baru"
          >
            <Plus className="w-6 h-6 text-slate-400" />
          </Button>
        </div>

        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between bg-[#002B5B] p-8 rounded-3xl shadow-xl border-b-4 border-[#D4AF37] relative overflow-hidden group animate-in slide-in-from-top duration-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-inner transform -rotate-3 hover:rotate-0 transition-transform duration-300">
               <span className="text-xl font-black text-[#002B5B]">KPM</span>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">{profile.nama || "PROFIL GURU"}</h1>
              <p className="text-blue-100/80 font-medium text-lg mt-1 flex items-center justify-center md:justify-start gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                Borang Profil Guru 2026
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4 mt-8 md:mt-0 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <Avatar className="w-36 h-36 border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-2">
                <AvatarImage src={profileImage || ""} alt={profile.nama} />
                <AvatarFallback className="bg-slate-100 text-[#002B5B] text-2xl font-bold">{profile.nama.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 right-2 no-print">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  size="icon" 
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full w-10 h-10 shadow-lg bg-[#D4AF37] hover:bg-[#B8962E] text-white border-2 border-white transition-transform hover:scale-110 active:scale-95"
                >
                   <Camera className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* SEARCH & ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 no-print sticky top-4 z-50">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#002B5B] transition-colors w-5 h-5" />
            <Input 
              placeholder="Cari nama, sekolah, subjek atau kelayakan..." 
              className="pl-12 h-14 bg-white/90 backdrop-blur-md border-white shadow-lg rounded-2xl focus:ring-2 focus:ring-[#002B5B] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 p-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white">
            {!isEditMode ? (
              <Button onClick={() => setIsEditMode(true)} className="h-10 bg-[#002B5B] hover:bg-[#003B7B] rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                <Edit2 className="w-4 h-4 mr-2" /> Edit Maklumat
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="h-10 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-md">
                  <Save className="w-4 h-4 mr-2" /> Simpan
                </Button>
                <Button variant="outline" onClick={() => setIsEditMode(false)} className="h-10 text-rose-600 border-rose-100 hover:bg-rose-50 rounded-xl font-bold">
                  <X className="w-4 h-4 mr-2" /> Batal
                </Button>
              </div>
            )}
            <div className="w-[1px] bg-slate-200 mx-1"></div>
            <Button variant="outline" onClick={handlePrint} className="h-10 rounded-xl border-slate-200 hover:bg-slate-50">
              <Printer className="w-4 h-4 mr-2" /> Cetak
            </Button>
            <Button variant="outline" className="h-10 rounded-xl border-slate-200 hover:bg-slate-50">
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Pengalaman Mengajar", value: profile.pengalaman || "-", icon: Briefcase, color: "text-[#002B5B]", bg: "bg-white" },
            { title: "Sekolah Semasa", value: profile.tempohSemasa || "-", icon: Clock, color: "text-[#002B5B]", bg: "bg-white" },
            { title: "Bidang Opsyen", value: profile.opsyen || "-", icon: BookOpen, color: "text-[#D4AF37]", bg: "bg-white" },
            { title: "Kelayakan", value: "Ijazah & Diploma", icon: GraduationCap, color: "text-[#D4AF37]", bg: "bg-white" },

          ].map((item, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 animate-in slide-up duration-500 rounded-2xl overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-0 flex items-stretch h-full">
                <div className={`w-2 ${i % 2 === 0 ? 'bg-[#002B5B]' : 'bg-[#D4AF37]'}`}></div>
                <div className="p-5 flex items-center gap-4 flex-1">
                  <div className="bg-slate-50 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
                    <p className="text-base font-bold text-[#002B5B] truncate">{item.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TWO COLUMNS DATA */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-lg rounded-3xl overflow-hidden animate-in slide-up duration-500 delay-200 bg-white">
            <div className="h-2 bg-[#002B5B]"></div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 py-6 px-8">
              <CardTitle className="text-xl font-black text-[#002B5B] flex items-center gap-3">
                <div className="bg-[#002B5B] p-2 rounded-lg"><FileText className="w-5 h-5 text-white" /></div>
                Maklumat Peribadi
              </CardTitle>
              {!isEditMode && <div className="text-[10px] px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold uppercase tracking-wider">Lengkap</div>}
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                {[
                  { label: "Nama Penuh", key: "nama", icon: "👤" },
                  { label: "No. Kad Pengenalan", key: "kp", icon: "🆔" },
                  { label: "No. Telefon", key: "tel", icon: "📞" },
                  { label: "E-mel", key: "email", icon: "✉️" },
                  { label: "Pengalaman Mengajar", key: "pengalaman", icon: "⏳" },
                  { label: "Tempoh Sekolah Semasa", key: "tempohSemasa", icon: "🏫" },
                  { label: "Tarikh Berkhidmat", key: "tarikhMula", icon: "📅" },
                  { label: "Gred Jawatan", key: "gred", icon: "🎗️" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2 group">
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-50">{item.icon}</span>
                      <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</Label>
                    </div>
                    {isEditMode ? (
                      <Input 
                        value={profile[item.key as keyof typeof profile] as string} 
                        onChange={(e) => updateCurrentTeacher({ profile: {...profile, [item.key]: e.target.value}})}
                        className="h-11 rounded-xl border-slate-100 focus:border-[#002B5B] focus:ring-[#002B5B]"
                      />
                    ) : (
                      <div className="min-h-[44px] flex items-center px-4 rounded-xl bg-slate-50 border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all">
                        <p className="font-bold text-slate-700">{profile[item.key as keyof typeof profile] as string || "-"}</p>
                      </div>
                    )}
                  </div>
                ))}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-50">🏠</span>
                    <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Alamat Kediaman</Label>
                  </div>
                  {isEditMode ? (
                    <Textarea 
                      value={profile.alamat} 
                      onChange={(e) => updateCurrentTeacher({ profile: {...profile, alamat: e.target.value}})}
                      className="min-h-[100px] rounded-xl border-slate-100"
                    />
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all">
                      <p className="font-bold text-slate-700 leading-relaxed">{profile.alamat || "-"}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-lg rounded-3xl overflow-hidden animate-in slide-up duration-500 delay-300 bg-white">
              <div className="h-2 bg-[#D4AF37]"></div>
              <CardHeader className="py-6 px-8 border-b border-slate-50">
                <CardTitle className="text-lg font-black text-[#002B5B] flex items-center gap-3">
                  <div className="bg-[#D4AF37] p-2 rounded-lg"><Briefcase className="w-5 h-5 text-white" /></div>
                  Sekolah
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  { label: "Nama Sekolah", key: "nama" },
                  { label: "Kod Sekolah", key: "kod" },
                  { label: "Jawatan", key: "jawatan" },
                  { label: "Pemeriksa SPM", key: "pemeriksaSPM" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</Label>
                    {isEditMode ? (
                      <Input 
                        value={profile.sekolah[item.key as keyof typeof profile.sekolah] as string} 
                        onChange={(e) => updateCurrentTeacher({ profile: {...profile, sekolah: {...profile.sekolah, [item.key]: e.target.value}} } )}
                        className="h-10 rounded-xl border-slate-100"
                      />
                    ) : (
                      <p className="font-bold text-slate-700">{profile.sekolah[item.key as keyof typeof profile.sekolah] as string || "-"}</p>
                    )}
                  </div>
                ))}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Alamat Sekolah</Label>
                  {isEditMode ? (
                    <Textarea 
                      value={profile.sekolah.alamat} 
                      onChange={(e) => updateCurrentTeacher({ profile: {...profile, sekolah: {...profile.sekolah, alamat: e.target.value}} } )}
                      className="min-h-[80px] rounded-xl border-slate-100"
                    />
                  ) : (
                    <p className="font-bold text-slate-700 text-sm leading-relaxed">{profile.sekolah.alamat || "-"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* TABLES SECTION */}
        <div className="space-y-6 animate-in slide-up duration-500 delay-400">
          
          {/* KELULUSAN ACADEMIK */}
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center">
              <h2 className="text-white text-lg font-black flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg"><GraduationCap className="w-5 h-5" /></div>
                Kelulusan Akademik & Ikhtisas
              </h2>
              {isEditMode && (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => {
                    const newId = Math.random();
                    updateCurrentTeacher({ kelulusan: [...kelulusan, {id: newId, kelayakan: "", institusi: "", bidang: "", tahun: ""}] });
                  }}
                  className="h-9 bg-[#D4AF37] hover:bg-[#B8962E] text-white border-none font-bold rounded-xl shadow-md"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tambah
                </Button>
              )}
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none">
                      <TableHead className="px-8 h-12 font-black text-slate-400 uppercase text-[10px] tracking-widest">Kelayakan</TableHead>
                      <TableHead className="h-12 font-black text-slate-400 uppercase text-[10px] tracking-widest">Institusi / Universiti</TableHead>
                      <TableHead className="h-12 font-black text-slate-400 uppercase text-[10px] tracking-widest">Bidang / Opsyen</TableHead>
                      <TableHead className="h-12 font-black text-slate-400 uppercase text-[10px] tracking-widest">Tahun</TableHead>
                      {isEditMode && <TableHead className="w-20 no-print"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kelulusan.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isEditMode ? 5 : 4} className="h-24 text-center text-slate-400 italic">Tiada rekod kelulusan</TableCell>
                      </TableRow>
                    ) : (kelulusan as any[]).map((row) => (
                      <TableRow key={row.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 font-bold text-slate-700">{row.kelayakan}</TableCell>
                        <TableCell className="text-slate-600">{row.institusi}</TableCell>
                        <TableCell className="text-slate-600 font-medium">{row.bidang}</TableCell>
                        <TableCell className="font-bold text-[#002B5B]">{row.tahun}</TableCell>
                        {isEditMode && (
                          <TableCell className="no-print pr-8 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateCurrentTeacher({ kelulusan: kelulusan.filter((k: any) => k.id !== row.id) })}
                              className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 h-9 w-9 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* SUBJEK DIAJAR */}
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center">
              <h2 className="text-white text-lg font-black flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                Subjek Semasa Diajar
              </h2>
              {isEditMode && (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => {
                    const newId = Math.random();
                    updateCurrentTeacher({ subjek: [...subjek, {id: newId, nama: "", kelas: "", murid: "", tov: "", etr: ""}] });
                  }}
                  className="h-9 bg-[#D4AF37] hover:bg-[#B8962E] text-white border-none font-bold rounded-xl shadow-md"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tambah
                </Button>
              )}
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none">
                      <TableHead className="w-16 text-center font-black text-slate-400 uppercase text-[10px] tracking-widest px-8">Bil.</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Subjek</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Tahun / Tingkatan</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Bil. Murid</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">TOV</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">ETR</TableHead>
                      {isEditMode && <TableHead className="w-20 no-print"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjek.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isEditMode ? 7 : 6} className="h-24 text-center text-slate-400 italic">Tiada rekod subjek</TableCell>
                      </TableRow>
                    ) : (subjek as any[]).map((row, idx) => (
                      <TableRow key={row.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="text-center font-black text-[#D4AF37] px-8">{idx + 1}</TableCell>
                        <TableCell className="font-bold text-slate-700">{row.nama}</TableCell>
                        <TableCell className="font-medium text-slate-500">{row.kelas}</TableCell>
                        <TableCell className="font-bold text-slate-700">{row.murid || "-"}</TableCell>
                        <TableCell className="text-center"><span className="px-2 py-1 bg-blue-50 text-[#002B5B] rounded-lg text-xs font-black">{row.tov || "-"}</span></TableCell>
                        <TableCell className="text-center"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black">{row.etr || "-"}</span></TableCell>
                        {isEditMode && (
                          <TableCell className="no-print pr-8 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateCurrentTeacher({ subjek: subjek.filter((s: any) => s.id !== row.id) })}
                              className="text-rose-500 hover:bg-rose-50 h-9 w-9 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>


          {/* SEJARAH PERKHIDMATAN */}
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center">
              <h2 className="text-white text-lg font-black flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg"><Clock className="w-5 h-5" /></div>
                Sejarah Perkhidmatan
              </h2>
              {isEditMode && (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => {
                    const newId = Math.random();
                    updateCurrentTeacher({ sejarah: [...sejarah, {id: newId, sekolah: "", tahun: "", subjek: ""}] });
                  }}
                  className="h-9 bg-[#D4AF37] hover:bg-[#B8962E] text-white border-none font-bold rounded-xl shadow-md"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tambah
                </Button>
              )}
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none">
                      <TableHead className="px-8 h-12 font-black text-slate-400 uppercase text-[10px] tracking-widest">Nama dan Alamat Sekolah</TableHead>
                      <TableHead className="h-12 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Tahun</TableHead>
                      <TableHead className="h-12 font-black text-slate-400 uppercase text-[10px] tracking-widest">Subjek yang Diajar</TableHead>
                      {isEditMode && <TableHead className="w-20 no-print"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sejarah.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isEditMode ? 4 : 3} className="h-24 text-center text-slate-400 italic">Tiada rekod sejarah perkhidmatan</TableCell>
                      </TableRow>
                    ) : sejarah.map((row) => (
                      <TableRow key={row.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 py-4">
                          <p className="font-bold text-slate-700">{row.sekolah}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="px-3 py-1 bg-[#002B5B] text-white rounded-full text-[10px] font-black">{row.tahun}</span>
                        </TableCell>
                        <TableCell className="font-medium text-slate-600">{row.subjek}</TableCell>
                        {isEditMode && (
                          <TableCell className="no-print pr-8 text-right">
                            <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50 h-9 w-9 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="grid md:grid-cols-2 gap-12 py-16 px-8 bg-white rounded-3xl shadow-lg border-t-4 border-[#002B5B]">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="font-black text-[#002B5B] uppercase tracking-widest text-xs">Tandatangan Guru</p>
              <div className="h-20 w-full border-b-2 border-slate-200 border-dashed"></div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Nama: ________________________</span>
                <span>Tarikh: ________________</span>
              </div>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="font-black text-[#002B5B] uppercase tracking-widest text-xs">Disahkan Oleh</p>
              <div className="h-20 w-full border-b-2 border-slate-200 border-dashed"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cap dan Tandatangan Pengetua / Guru Besar</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center py-12 space-y-2 no-print">
          <p className="text-[#002B5B] font-black text-sm">Profil Guru © 2026 | Kementerian Pendidikan Malaysia</p>
          <p className="text-slate-400 text-xs font-medium">Maklumat ini adalah untuk kegunaan rasmi sekolah sahaja.</p>
        </footer>
      </div>
    </div>
  );
}
