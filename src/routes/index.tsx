import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Components
import { TeacherProfileView } from "@/components/profile/TeacherProfileView";
import { TeacherProfileForm } from "@/components/profile/TeacherProfileForm";
import { AdminDashboard } from "@/components/profile/AdminDashboard";

// Constants
const SSPA_GRADES = ["DG54", "DG52", "DG48", "DG44", "DG41", "DG38", "DG34", "DG32", "DG29", "DG14", "DG12", "DG11", "DG10", "DG9"];
const MALAYSIAN_STATES = ["Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu", "Wilayah Persekutuan Kuala Lumpur", "Wilayah Persekutuan Labuan", "Wilayah Persekutuan Putrajaya"];
const SUPERADMIN_IC = "801022016573";
const SAS_TEACHERS = [
  { nama: "AFIZAWATI BINTI ISMAIL", kp: "790902045232", jabatan: "Guru" },
  { nama: "AHMAD FAIZAL BIN AYOP", kp: "801022016573", jabatan: "Guru" },
  { nama: "AINIL HAYATI BINTI OMAR", kp: "870604085608", jabatan: "Guru" },
  { nama: "AMIR BIN HASSAN", kp: "780915035219", jabatan: "Guru" },
  { nama: "ARBAIYAH BINTI SALLEH", kp: "750402015438", jabatan: "Guru" },
  { nama: "ASMAH BINTI IBRAHIM", kp: "820311025682", jabatan: "Guru" },
  { nama: "AZLINA BINTI ZAKARIA", kp: "810520035246", jabatan: "Guru" },
  { nama: "AZMI BIN AHMAD", kp: "720726025633", jabatan: "Pengetua" },
  { nama: "CHE AZIZ BIN CHE WAN", kp: "770814035629", jabatan: "Guru" },
  { nama: "FAUZIAH BINTI MOHAMED", kp: "741120015438", jabatan: "Guru" },
  { nama: "HABSAH BINTI ABDULLAH", kp: "830205025682", jabatan: "Guru" },
  { nama: "HAMIDAH BINTI HASHIM", kp: "790112035246", jabatan: "Guru" },
  { nama: "HASNAH BINTI MAT", kp: "761022015633", jabatan: "Guru" },
  { nama: "ISMAIL BIN JAAFAR", kp: "710614035629", jabatan: "Guru" },
  { nama: "JAMAL BIN KASSIM", kp: "800820015438", jabatan: "Guru" },
  { nama: "KAMARIAH BINTI LATIF", kp: "840505025682", jabatan: "Guru" },
  { nama: "KHAIRUL BIN MANAF", kp: "780412035246", jabatan: "Guru" },
  { nama: "LAILA BINTI MAHMOD", kp: "771222015633", jabatan: "Guru" },
  { nama: "MAZNAH BINTI NORDIN", kp: "720914035629", jabatan: "Guru" },
  { nama: "MOHD ALI BIN OTHMAN", kp: "811020015438", jabatan: "Guru" },
  { nama: "NORAINI BINTI RAHMAN", kp: "850605025682", jabatan: "Guru" },
  { nama: "ROSLAN BIN SAID", kp: "790712035246", jabatan: "Guru" },
  { nama: "SALMAH BINTI TALIB", kp: "781222015633", jabatan: "Guru" },
  { nama: "ZAINAB BINTI USMAN", kp: "730914035629", jabatan: "Guru" }
];

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Profil Guru Profesional 2026",
    meta: [
      { name: "description", content: "Portal Rasmi Profil Guru Profesional 2026 - KPM" },
      { property: "og:title", content: "Profil Guru Profesional 2026" },
    ],
  }),
  component: GuruProfilePage,
});

function GuruProfilePage() {
  const [session, setSession] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [icInput, setIcInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [showRoleManager, setShowRoleManager] = useState(false);

  useEffect(() => {
    const savedIc = localStorage.getItem('guru_ic_session');
    if (savedIc) {
      setSession({ user: { ic: savedIc } });
      fetchTeachersByIc(savedIc);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchTeachersByIc = async (ic: string) => {
    const cleanIc = ic.replace(/-/g, "");
    setIsLoading(true);
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      setIsLoading(false);
      return;
    }

    const mapped = data.map(t => ({ ...t, profileImage: t.profile_image }));
    
    if (cleanIc === SUPERADMIN_IC) {
      setTeachers(mapped);
      setIsAdminMode(true);
      if (mapped.length > 0 && !activeTeacherId) {
        setActiveTeacherId(mapped[0]?.id || null);
      }
    } else {
      const filtered = mapped.filter(t => t.ic_number === cleanIc);
      setTeachers(filtered);
      if (filtered.length > 0 && !activeTeacherId) {
        setActiveTeacherId(filtered[0]?.id || null);
      }
    }

    setIsLoading(false);
  };

  const handleIcLogin = async () => {
    const cleanIc = icInput.replace(/-/g, "");
    if (!cleanIc) {
      toast.error("Sila masukkan No. IC.");
      return;
    }
    
    setIsLoggingIn(true);
    const sasTeacher = SAS_TEACHERS.find(t => t.kp === cleanIc);
    
    if (!sasTeacher && cleanIc !== SUPERADMIN_IC) {
      setIsLoggingIn(false);
      toast.error("IC tidak dijumpai.");
      return;
    }

    localStorage.setItem('guru_ic_session', cleanIc);
    setSession({ user: { ic: cleanIc } });
    
    // Check if profile exists, if not create one automatically
    const { data: existing } = await supabase
      .from('teachers')
      .select('id')
      .eq('ic_number', cleanIc)
      .maybeSingle();

    if (!existing && sasTeacher) {
      const newTeacher = {
        ic_number: cleanIc,
        profile: {
          nama: sasTeacher.nama,
          kp: cleanIc,
          tel: "01X-XXXXXXX",
          email: "guru@moe-dl.edu.my",
          gred: "DG44",
          alamat: "Alamat Rumah Guru",
          sekolah: {
            nama: "SMK SULTAN AHMAD SHAH",
            kod: "CEB1003",
            alamat: "Persiaran Dayang Endah",
            poskod: "39000",
            daerah: "Tanah Rata",
            negeri: "Pahang",
            tel: "05-4911046"
          }
        },
        kelulusan: [{ id: 1, tahap: "Sarjana Muda", bidang: "Pendidikan (Sejarah)", institusi: "UPSI", tahun: "2015" }],
        subjek: [{ id: 1, subjek: "Sejarah", kelas: "4 Amanah", jam: "4" }],
        sejarah: [{ id: 1, jawatan: "Guru Akademik Biasa", tempat: "SMK SULTAN AHMAD SHAH", tahun: "2015 - Kini" }]
      };
      await supabase.from('teachers').insert([newTeacher]);
    }

    await fetchTeachersByIc(cleanIc);
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('guru_ic_session');
    setSession(null);
    setTeachers([]);
    setActiveTeacherId(null);
    setIsAdminMode(false);
    setShowAdminDashboard(false);
  };

  const handleSave = async () => {
    const current = teachers.find(t => t.id === activeTeacherId);
    if (!current) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('teachers')
      .update({
        profile: current.profile,
        kelulusan: current.kelulusan,
        subjek: current.subjek,
        sejarah: current.sejarah,
        profile_image: current.profileImage
      })
      .eq('id', activeTeacherId as string);

    setIsSaving(false);
    if (!error && activeTeacherId) {
      setIsEditMode(false);
      toast.success("Disimpan!");
    }
  };

  const currentTeacher = teachers.find(t => t.id === activeTeacherId);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full p-8 space-y-6 text-center shadow-xl rounded-3xl bg-white border-none">
        <div className="w-20 h-20 bg-[#002B5B] rounded-2xl flex items-center justify-center mx-auto text-white font-black text-2xl rotate-3">KPM</div>
        <h1 className="text-3xl font-black text-[#002B5B]">LOG MASUK</h1>
        <div className="text-left space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No. Kad Pengenalan</Label>
          <Input 
            value={icInput} 
            onChange={e => setIcInput(e.target.value)} 
            placeholder="Contoh: 801022016573"
            className="h-14 rounded-2xl border-2 border-slate-100 text-lg font-bold"
          />
        </div>
        <Button onClick={handleIcLogin} disabled={isLoggingIn} className="w-full h-14 rounded-2xl bg-[#002B5B] text-white font-bold">
          {isLoggingIn ? "Memuatkan..." : "Masuk Sistem"}
        </Button>
      </Card>
      <Toaster />
    </div>
  );

  if (showAdminDashboard) return (
    <>
      <AdminDashboard 
        teachers={teachers}
        sasTeachers={SAS_TEACHERS}
        onAddTeacher={() => {}} 
        onSelectTeacher={(id, edit) => { setActiveTeacherId(id); setIsEditMode(edit); setShowAdminDashboard(false); }}
        onDeleteTeacher={() => {}}
        onManualCreate={() => {}}
        onBackToProfile={() => setShowAdminDashboard(false)}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleSearchTerm={roleSearchTerm}
        setRoleSearchTerm={setRoleSearchTerm}
        showRoleManager={showRoleManager}
        setShowRoleManager={setShowRoleManager}
      />
      <Toaster />
    </>
  );

  return (
    <>
      {isEditMode ? (
        <TeacherProfileForm 
          teacher={currentTeacher}
          updateTeacher={updates => setTeachers(teachers.map(t => t.id === activeTeacherId ? { ...t, ...updates } : t))}
          onSave={handleSave}
          onCancel={() => setIsEditMode(false)}
          isSaving={isSaving}
          grades={SSPA_GRADES}
          states={MALAYSIAN_STATES}
        />
      ) : (
        <TeacherProfileView 
          teacher={currentTeacher}
          isAdminMode={isAdminMode}
          onEdit={() => setIsEditMode(true)}
          onLogout={handleLogout}
          onShowAdmin={() => setShowAdminDashboard(true)}
          isSuperadmin={session.user.ic === SUPERADMIN_IC}
        />
      )}
      <Toaster />
    </>
  );
}
