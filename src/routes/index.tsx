import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Printer, Download, Edit2, Plus, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/")({
  component: GuruProfile,
});

function GuruProfile() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-900">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold">KPM</div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">PROFIL GURU</h1>
            <p className="text-slate-600">Borang Profil Guru 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Avatar className="w-24 h-24 border-4 border-blue-100 shadow-md">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>GM</AvatarFallback>
          </Avatar>
          <Button variant="outline">Upload Gambar</Button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Pengalaman Mengajar", value: "25 Tahun" },
          { title: "Tempoh Sekolah Semasa", value: "21 Tahun" },
          { title: "Bidang Opsyen", value: "Sejarah / Geografi" },
          { title: "Kelayakan", value: "Ijazah & Diploma" },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">{item.title}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-blue-900">{item.value}</p></CardContent>
          </Card>
        ))}
      </div>

      {/* PROFILE DETAILS */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Maklumat Peribadi</h2>
          <dl className="grid grid-cols-2 gap-y-4">
            <dt className="text-slate-500">Nama Penuh</dt><dd className="font-medium">Masnizam Binti Mohamed</dd>
            <dt className="text-slate-500">No. KP</dt><dd className="font-medium">770613035750</dd>
          </dl>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Maklumat Sekolah</h2>
          <dl className="grid grid-cols-2 gap-y-4">
            <dt className="text-slate-500">Nama Sekolah</dt><dd className="font-medium">SMK Sultan Ahmad Shah</dd>
            <dt className="text-slate-500">Kod Sekolah</dt><dd className="font-medium">CEB1003</dd>
          </dl>
        </Card>
      </div>

      {/* TABLES */}
      <Card className="mb-8">
        <CardHeader><CardTitle className="text-blue-900">Kelulusan Akademik</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-blue-900 text-white">
              <TableRow>
                <TableHead className="text-white">Kelayakan</TableHead>
                <TableHead className="text-white">Institusi</TableHead>
                <TableHead className="text-white">Bidang</TableHead>
                <TableHead className="text-white">Tahun</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ijazah Sarjana Muda Sains Sosial</TableCell>
                <TableCell>Universiti Malaya</TableCell>
                <TableCell>Sejarah / Geografi</TableCell>
                <TableCell>2000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <footer className="text-center text-slate-500 py-8 text-sm">
        <p>Profil Guru © 2026 Kementerian Pendidikan Malaysia</p>
        <p className="mt-1">Maklumat ini adalah untuk kegunaan rasmi sekolah.</p>
      </footer>
    </div>
  );
}
