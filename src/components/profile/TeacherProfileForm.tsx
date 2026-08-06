import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Save, X, Camera } from "lucide-react";

interface TeacherProfileFormProps {
  teacher: any;
  updateTeacher: (updates: any) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  grades: string[];
  states: string[];
}

export const TeacherProfileForm: React.FC<TeacherProfileFormProps> = ({
  teacher,
  updateTeacher,
  onSave,
  onCancel,
  isSaving,
  grades,
  states
}) => {
  const profile = teacher?.profile || {};
  const sekolah = profile.sekolah || {};

  const handleProfileChange = (field: string, value: any) => {
    updateTeacher({
      profile: { ...profile, [field]: value }
    });
  };

  const handleSekolahChange = (field: string, value: any) => {
    updateTeacher({
      profile: {
        ...profile,
        sekolah: { ...sekolah, [field]: value }
      }
    });
  };

  const handleListChange = (listKey: string, id: number, field: string, value: any) => {
    const list = [...(teacher[listKey] || [])];
    const index = list.findIndex((item: any) => item.id === id);
    if (index > -1) {
      list[index] = { ...list[index], [field]: value };
      updateTeacher({ [listKey]: list });
    }
  };

  const addItem = (listKey: string, newItem: any) => {
    updateTeacher({
      [listKey]: [...(teacher[listKey] || []), { ...newItem, id: Date.now() }]
    });
  };

  const removeItem = (listKey: string, id: number) => {
    updateTeacher({
      [listKey]: (teacher[listKey] || []).filter((item: any) => item.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 no-print">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b">
        <h2 className="text-xl font-bold text-[#002B5B]">Edit Profil Guru</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            <X className="w-4 h-4 mr-2" /> Batal
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="bg-[#002B5B] hover:bg-[#003d82]">
            <Save className="w-4 h-4 mr-2" /> {isSaving ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">I. Maklumat Peribadi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nama Penuh</Label>
            <Input value={profile.nama || ""} onChange={(e) => handleProfileChange("nama", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>No. Kad Pengenalan</Label>
            <Input value={profile.kp || ""} readOnly className="bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label>No. Telefon</Label>
            <Input value={profile.tel || ""} onChange={(e) => handleProfileChange("tel", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-mel Rasmi</Label>
            <Input value={profile.email || ""} onChange={(e) => handleProfileChange("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Gred Jawatan</Label>
            <Select value={profile.gred || ""} onValueChange={(v) => handleProfileChange("gred", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Gred" />
              </SelectTrigger>
              <SelectContent>
                {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Alamat Rumah</Label>
            <Textarea value={profile.alamat || ""} onChange={(e) => handleProfileChange("alamat", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">II. Maklumat Sekolah</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Alamat Jalan Sekolah</Label>
            <Input value={sekolah.alamat || ""} onChange={(e) => handleSekolahChange("alamat", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Poskod</Label>
            <Input value={sekolah.poskod || ""} onChange={(e) => handleSekolahChange("poskod", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Daerah</Label>
            <Input value={sekolah.daerah || ""} onChange={(e) => handleSekolahChange("daerah", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Negeri</Label>
            <Select value={sekolah.negeri || ""} onValueChange={(v) => handleSekolahChange("negeri", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Negeri" />
              </SelectTrigger>
              <SelectContent>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tables could be added here in a real app, but sticking to main sections for brevity */}
      </div>
    </div>
  );
};
