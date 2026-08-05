import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  Image as ImageIcon
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
  
  // Data State
  const [profile, setProfile] = useState({
    nama: "",
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
  });

  const [kelulusan, setKelulusan] = useState<{id: number, kelayakan: string, institusi: string, bidang: string, tahun: string}[]>([]);

  const [subjek, setSubjek] = useState<{id: number, nama: string, kelas: string, murid: string, tov: string, etr: string}[]>([]);

  const [sejarah, setSejarah] = useState<{id: number, sekolah: string, tahun: string, subjek: string}[]>([]);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsEditMode(false);
    toast.success("Maklumat telah berjaya disimpan.");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans text-slate-900 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto print-container space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between bg-[#002B5B] p-8 rounded-3xl shadow-xl border-b-4 border-[#D4AF37] relative overflow-hidden group animate-in slide-in-from-top duration-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-inner transform -rotate-3 hover:rotate-0 transition-transform duration-300">
               <span className="text-xl font-black text-[#002B5B]">KPM</span>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">PROFIL GURU</h1>
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
                <AvatarImage src="" alt="kemaskini design. nampak x tersusun" />
                <AvatarFallback className="bg-slate-100 text-[#002B5B] text-2xl font-bold">?</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 right-2 no-print">
                <Button size="icon" className="rounded-full w-10 h-10 shadow-lg bg-[#D4AF37] hover:bg-[#B8962E] text-white border-2 border-white">
                   <ImageIcon className="w-5 h-5" />
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
          <div className="flex gap-2 p-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white">
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
                        onChange={(e) => setProfile({...profile, [item.key]: e.target.value})}
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
                      onChange={(e) => setProfile({...profile, alamat: e.target.value})}
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
                        onChange={(e) => setProfile({...profile, sekolah: {...profile.sekolah, [item.key]: e.target.value}})}
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
                      onChange={(e) => setProfile({...profile, sekolah: {...profile.sekolah, alamat: e.target.value}})}
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
              {isEditMode && <Button size="sm" variant="secondary" className="h-9 bg-[#D4AF37] hover:bg-[#B8962E] text-white border-none font-bold rounded-xl shadow-md"><Plus className="w-4 h-4 mr-1" /> Tambah</Button>}
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
                    ) : kelulusan.map((row) => (
                      <TableRow key={row.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 font-bold text-slate-700">{row.kelayakan}</TableCell>
                        <TableCell className="text-slate-600">{row.institusi}</TableCell>
                        <TableCell className="text-slate-600 font-medium">{row.bidang}</TableCell>
                        <TableCell className="font-bold text-[#002B5B]">{row.tahun}</TableCell>
                        {isEditMode && (
                          <TableCell className="no-print pr-8 text-right">
                            <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 h-9 w-9 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
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
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="bg-[#002B5B] px-6 py-3 flex justify-between items-center">
              <h2 className="text-white font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Subjek Semasa Yang Diajar</h2>
              {isEditMode && <Button size="sm" variant="secondary" className="h-8"><Plus className="w-3 h-3 mr-1" /> Tambah</Button>}
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-12 text-center font-bold text-[#002B5B] uppercase text-xs">Bil.</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Subjek</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Tahun / Tingkatan</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Bil. Murid</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">TOV</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">ETR</TableHead>
                      {isEditMode && <TableHead className="w-20 no-print"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjek.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center font-bold text-slate-400">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-slate-700">{row.nama}</TableCell>
                        <TableCell>{row.kelas}</TableCell>
                        <TableCell>{row.murid || "-"}</TableCell>
                        <TableCell>{row.tov || "-"}</TableCell>
                        <TableCell>{row.etr || "-"}</TableCell>
                        {isEditMode && (
                          <TableCell className="no-print">
                            <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
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
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="bg-[#002B5B] px-6 py-3 flex justify-between items-center">
              <h2 className="text-white font-semibold flex items-center gap-2"><Clock className="w-5 h-5" /> Sejarah Perkhidmatan</h2>
              {isEditMode && <Button size="sm" variant="secondary" className="h-8"><Plus className="w-3 h-3 mr-1" /> Tambah</Button>}
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Nama dan Alamat Sekolah</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Tahun</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Subjek yang Diajar</TableHead>
                      {isEditMode && <TableHead className="w-20 no-print"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sejarah.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium text-slate-700">{row.sekolah}</TableCell>
                        <TableCell>{row.tahun}</TableCell>
                        <TableCell>{row.subjek}</TableCell>
                        {isEditMode && (
                          <TableCell className="no-print">
                            <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
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
        <div className="grid md:grid-cols-2 gap-12 mt-16 px-6">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="font-semibold text-slate-800">Tandatangan Guru</p>
              <div className="w-full border-b-2 border-slate-300 pt-16"></div>
              <p className="text-sm text-slate-500 italic">Tarikh: ____________________________</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="font-semibold text-slate-800">Disahkan Oleh</p>
              <div className="w-full border-b-2 border-slate-300 pt-16"></div>
              <p className="text-sm text-slate-500">Cap dan Tandatangan Pengetua / Guru Besar</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 border-t border-slate-200 py-8 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-slate-800 font-bold">Profil Guru © 2026</p>
          <p className="text-[#002B5B] font-semibold text-sm">Kementerian Pendidikan Malaysia</p>
          <p className="text-slate-400 text-xs mt-4">Maklumat ini adalah untuk kegunaan rasmi sekolah.</p>
        </footer>
      </div>
    </div>
  );
}
