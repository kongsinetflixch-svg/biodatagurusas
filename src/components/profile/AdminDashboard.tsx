import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, LayoutDashboard, Search, FileText, Edit2, Trash2, Settings, User, Loader2 } from "lucide-react";

interface AdminDashboardProps {
  teachers: any[];
  sasTeachers: any[];
  onAddTeacher: () => void;
  onSelectTeacher: (id: string, edit: boolean) => void;
  onDeleteTeacher: (id: string, e: React.MouseEvent) => void;
  onManualCreate: (ic: string, name: string, role: string) => void;
  onBackToProfile: () => void;
  onLogout: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleSearchTerm: string;
  setRoleSearchTerm: (term: string) => void;
  showRoleManager: boolean;
  setShowRoleManager: (show: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  teachers,
  sasTeachers,
  onAddTeacher,
  onSelectTeacher,
  onDeleteTeacher,
  onManualCreate,
  onBackToProfile,
  onLogout,
  searchTerm,
  setSearchTerm,
  roleSearchTerm,
  setRoleSearchTerm,
  showRoleManager,
  setShowRoleManager
}) => {
  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans animate-in fade-in duration-700 no-print">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col items-stretch bg-[#002B5B] p-6 sm:p-10 rounded-[2.5rem] shadow-xl border-b-8 border-[#D4AF37] relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center p-2 shadow-inner transform -rotate-3 transition-transform hover:rotate-0">
                 <span className="text-lg sm:text-2xl font-black text-[#002B5B] tracking-tighter">KPM</span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">Dashboard Admin</h1>
                <p className="text-blue-100/70 font-bold text-sm sm:text-base mt-1">Pengurusan Panitia Guru 2026</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full md:w-auto">
              <Button 
                onClick={() => setShowRoleManager(!showRoleManager)} 
                className={`h-12 sm:h-14 px-6 ${showRoleManager ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'} font-black rounded-2xl shadow-lg border transition-all text-sm uppercase tracking-wider`}
              >
                <Users className="w-5 h-5 mr-3" /> 
                {showRoleManager ? "Senarai Profil" : "Urus Peranan"}
              </Button>
              <Button onClick={onBackToProfile} className="h-12 sm:h-14 px-6 bg-white text-[#002B5B] hover:bg-blue-50 font-black rounded-2xl shadow-lg text-sm uppercase tracking-wider">
                <LayoutDashboard className="w-5 h-5 mr-3" /> Lihat Profil
              </Button>
              <Button variant="ghost" onClick={onLogout} className="h-12 sm:h-14 px-6 text-white hover:bg-rose-500/20 font-black rounded-2xl text-sm uppercase tracking-wider">
                <LogOut className="w-5 h-5 mr-3" /> Log Keluar
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-none shadow-xl rounded-3xl p-6 hover:scale-[1.02] transition-transform cursor-pointer border-l-4 border-blue-500" onClick={onAddTeacher}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Tambah Guru</h3>
                <p className="text-xs text-slate-500">Cipta profil baru dalam panitia</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white border-none shadow-xl rounded-3xl p-6 border-l-4 border-amber-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{teachers.length} Ahli Panitia</h3>
                <p className="text-xs text-slate-500">Jumlah profil berdaftar</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-none shadow-xl rounded-3xl p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[#002B5B] rounded-2xl flex items-center justify-center font-black">
                KPM
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Status Portal</h3>
                <p className="text-xs text-slate-500">Online & Aktif</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between p-6">
            <CardTitle className="text-xl font-black text-[#002B5B]">
              {showRoleManager ? "Urus Peranan Guru/Pentadbir" : "Senarai Profil Guru Panitia"}
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder={showRoleManager ? "Cari dalam senarai KPM..." : "Cari profil..."} 
                value={showRoleManager ? roleSearchTerm : searchTerm}
                onChange={(e) => showRoleManager ? setRoleSearchTerm(e.target.value) : setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-slate-50 border-none rounded-xl text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {showRoleManager ? (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Nama Guru (Senarai KPM)</TableHead>
                    <TableHead>No. KP</TableHead>
                    <TableHead>Peranan Semasa</TableHead>
                    <TableHead className="text-right">Kemaskini Peranan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sasTeachers
                    .filter(t => t.nama.toLowerCase().includes(roleSearchTerm.toLowerCase()) || t.kp.includes(roleSearchTerm))
                    .map((t, idx) => (
                      <TableRow key={t.kp + idx} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-700">{t.nama}</TableCell>
                        <TableCell className="text-slate-500 text-sm">{t.kp}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            t.jabatan === 'Pengetua' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            t.jabatan === 'Pentadbir' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {t.jabatan}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {['Guru', 'Pentadbir', 'Pengetua'].map((role) => (
                              <Button
                                key={role}
                                variant={t.jabatan === role ? "default" : "outline"}
                                size="sm"
                                onClick={() => onManualCreate(t.kp, t.nama, role)}
                                className={`h-7 px-2 text-[10px] rounded-lg font-black ${
                                  t.jabatan === role 
                                    ? 'bg-[#002B5B] text-white hover:bg-[#003B7B]' 
                                    : 'bg-white text-slate-400 hover:text-[#002B5B] border-slate-200'
                                }`}
                              >
                                {role}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="w-[100px]">Profil</TableHead>
                    <TableHead>Nama Penuh</TableHead>
                    <TableHead>No. KP</TableHead>
                    <TableHead>Jawatan</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers
                    .filter(t => (t.profile as any)?.nama?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((t) => (
                    <TableRow key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <Avatar className="w-10 h-10 border-2 border-slate-100">
                          <AvatarImage src={t.profileImage || ""} />
                          <AvatarFallback className="bg-slate-100 text-[#002B5B] font-bold">{(t.profile as any)?.nama?.charAt(0) || "G"}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-bold text-slate-700">{(t.profile as any)?.nama || "Tanpa Nama"}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{(t.profile as any)?.kp || "-"}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{(t.profile as any)?.sekolah?.jawatan || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onSelectTeacher(t.id, false)}
                            className="h-8 rounded-lg border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" /> Lihat
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onSelectTeacher(t.id, true)}
                            className="h-8 rounded-lg border-slate-200 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => onDeleteTeacher(t.id, e)}
                            className="h-8 rounded-lg border-slate-200 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
