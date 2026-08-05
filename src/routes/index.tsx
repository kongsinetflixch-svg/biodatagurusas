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
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-sans text-slate-900 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto print-container">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#002B5B] rounded-lg flex items-center justify-center text-white font-bold p-2 overflow-hidden">
               <span className="text-xs text-center">KPM</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#002B5B]">PROFIL GURU</h1>
              <p className="text-slate-500 font-medium">Borang Profil Guru 2026</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4 mt-6 md:mt-0">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-[#002B5B] shadow-lg transition-transform duration-300 group-hover:scale-105">
                <AvatarImage src="https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=200&h=200&auto=format&fit=crop" />
                <AvatarFallback>MM</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 right-0 no-print">
                <Button size="icon" variant="secondary" className="rounded-full w-8 h-8 shadow-md">
                   <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* SEARCH & ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 no-print">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Cari nama, sekolah, subjek atau kelayakan..." 
              className="pl-10 bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {!isEditMode ? (
              <Button onClick={() => setIsEditMode(true)} className="bg-[#002B5B] hover:bg-[#003B7B]">
                <Edit2 className="w-4 h-4 mr-2" /> Edit Maklumat
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="w-4 h-4 mr-2" /> Simpan
                </Button>
                <Button variant="outline" onClick={() => setIsEditMode(false)} className="text-rose-600 border-rose-100 hover:bg-rose-50">
                  <X className="w-4 h-4 mr-2" /> Batal
                </Button>
              </>
            )}
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" /> Cetak
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
            <div className="hidden md:flex gap-2">
               <Button variant="ghost" size="icon" title="Export Excel"><FileSpreadsheet className="w-4 h-4 text-emerald-600" /></Button>
               <Button variant="ghost" size="icon" title="Export Word"><FileText className="w-4 h-4 text-blue-600" /></Button>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Pengalaman Mengajar", value: profile.pengalaman, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Tempoh Sekolah Semasa", value: profile.tempohSemasa, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { title: "Bidang Opsyen", value: profile.opsyen, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
            { title: "Kelayakan Tertinggi", value: "Ijazah & Diploma", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 animate-in slide-up duration-500" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${item.bg} p-3 rounded-xl`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.title}</p>
                  <p className="text-lg font-bold text-slate-800">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TWO COLUMNS DATA */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden animate-in slide-up duration-500 delay-200">
            <CardHeader className="bg-[#002B5B] text-white py-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Maklumat Peribadi Guru
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { label: "Nama Penuh", key: "nama" },
                  { label: "No. Kad Pengenalan", key: "kp" },
                  { label: "No. Telefon", key: "tel" },
                  { label: "E-mel", key: "email" },
                  { label: "Pengalaman Mengajar", key: "pengalaman" },
                  { label: "Tempoh di Sekolah Semasa", key: "tempohSemasa" },
                  { label: "Tarikh Mula Berkhidmat", key: "tarikhMula" },
                  { label: "Gred", key: "gred" },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <Label className="text-slate-400 text-xs font-medium uppercase">{item.label}</Label>
                    {isEditMode ? (
                      <Input 
                        value={profile[item.key as keyof typeof profile] as string} 
                        onChange={(e) => setProfile({...profile, [item.key]: e.target.value})}
                        className="h-9"
                      />
                    ) : (
                      <p className="font-semibold text-slate-700">{profile[item.key as keyof typeof profile] as string}</p>
                    )}
                  </div>
                ))}
                <div className="md:col-span-2 space-y-1">
                  <Label className="text-slate-400 text-xs font-medium uppercase">Alamat Rumah</Label>
                  {isEditMode ? (
                    <Textarea 
                      value={profile.alamat} 
                      onChange={(e) => setProfile({...profile, alamat: e.target.value})}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="font-semibold text-slate-700">{profile.alamat}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden animate-in slide-up duration-500 delay-300">
            <CardHeader className="bg-[#002B5B] text-white py-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Maklumat Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { label: "Nama Sekolah", key: "nama" },
                { label: "Kod Sekolah", key: "kod" },
                { label: "Jawatan", key: "jawatan" },
                { label: "Pemeriksa Kertas SPM", key: "pemeriksaSPM" },
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <Label className="text-slate-400 text-xs font-medium uppercase">{item.label}</Label>
                  {isEditMode ? (
                    <Input 
                      value={profile.sekolah[item.key as keyof typeof profile.sekolah] as string} 
                      onChange={(e) => setProfile({...profile, sekolah: {...profile.sekolah, [item.key]: e.target.value}})}
                      className="h-9"
                    />
                  ) : (
                    <p className="font-semibold text-slate-700">{profile.sekolah[item.key as keyof typeof profile.sekolah] as string}</p>
                  )}
                </div>
              ))}
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs font-medium uppercase">Alamat Sekolah</Label>
                {isEditMode ? (
                  <Textarea 
                    value={profile.sekolah.alamat} 
                    onChange={(e) => setProfile({...profile, sekolah: {...profile.sekolah, alamat: e.target.value}})}
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="font-semibold text-slate-700 text-sm leading-relaxed">{profile.sekolah.alamat}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLES SECTION */}
        <div className="space-y-8 mb-8 animate-in slide-up duration-500 delay-400">
          
          {/* KELULUSAN ACADEMIK */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="bg-[#002B5B] px-6 py-3 flex justify-between items-center">
              <h2 className="text-white font-semibold flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Kelulusan Akademik & Ikhtisas</h2>
              {isEditMode && <Button size="sm" variant="secondary" className="h-8"><Plus className="w-3 h-3 mr-1" /> Tambah</Button>}
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Kelayakan</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Institusi / Universiti</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Bidang / Opsyen</TableHead>
                      <TableHead className="font-bold text-[#002B5B] uppercase text-xs">Tahun</TableHead>
                      {isEditMode && <TableHead className="w-20 no-print"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kelulusan.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium text-slate-700">{row.kelayakan}</TableCell>
                        <TableCell>{row.institusi}</TableCell>
                        <TableCell>{row.bidang}</TableCell>
                        <TableCell>{row.tahun}</TableCell>
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
