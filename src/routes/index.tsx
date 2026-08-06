import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
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
  Camera,
  Eraser,
  Settings,
  User,
  ShieldCheck,
  LogOut,
  LogIn,
  Loader2,
  LayoutDashboard,
  Users,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// SSPA Grade Constants
const SSPA_GRADES = [
  "DG54", "DG52", "DG48", "DG44", "DG41", "DG38", "DG34", "DG32", "DG29",
  "DG14", "DG12", "DG11", "DG10", "DG9"
];

// Malaysian States
const MALAYSIAN_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", 
  "Perak", "Perlis", "Pulau Pinang", "Sabah", "Sarawak", "Selangor", 
  "Terengganu", "Wilayah Persekutuan Kuala Lumpur", 
  "Wilayah Persekutuan Labuan", "Wilayah Persekutuan Putrajaya"
];

const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 10mm;
  }

  @media screen {
    .print-only {
      display: none !important;
    }
  }

  @media print {
    body {
      background: white !important;
      color: black !important;
      font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif !important;
      font-size: 10pt !important;
      line-height: 1.2 !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* Hide everything by default during print */
    #root > div:not(.print-only),
    .no-print,
    .dashboard-container,
    header,
    footer,
    nav,
    aside {
      display: none !important;
    }

    /* Show only the print layout */
    .print-only {
      display: block !important;
      width: 100% !important;
    }


    .print-layout-container {
      padding: 0 !important;
      margin: 0 !important;
      background: white !important;
    }

    .print-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      border-bottom: 1.5pt solid #002B5B !important;
      padding-bottom: 3mm !important;
      margin-bottom: 4mm !important;
    }

    .print-photo {
      width: 30mm !important;
      height: 38mm !important;
      border: 0.5pt solid #000 !important;
      object-fit: cover !important;
    }


    .section-title {
      font-size: 10pt !important;
      font-weight: bold !important;
      text-transform: uppercase !important;
      color: #002B5B !important;
      border-bottom: 0.5pt solid #002B5B !important;
      padding-bottom: 1pt !important;
      margin: 3mm 0 2mm 0 !important;
      display: block !important;
    }

    .info-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 1.5mm 6mm !important;
    }

    .info-item {
      display: flex !important;
      flex-direction: row !important;
      align-items: baseline !important;
      gap: 2mm !important;
    }

    .info-label {
      font-size: 8pt !important;
      color: #333 !important;
      text-transform: uppercase !important;
      font-weight: bold !important;
      min-width: 35mm !important;
      flex-shrink: 0 !important;
    }

    .info-label::after {
      content: ":" !important;
    }

    .info-value {
      font-size: 9.5pt !important;
      font-weight: normal !important;
      color: black !important;
    }

    table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-top: 2mm !important;
    }


    th {
      background: #eee !important;
      font-size: 8pt !important;
      text-transform: uppercase !important;
      padding: 1mm 2mm !important;
      border: 0.5pt solid #000 !important;
      text-align: left !important;
    }

    td {
      padding: 1mm 2mm !important;
      border: 0.5pt solid #000 !important;
      font-size: 9pt !important;
      vertical-align: top !important;
    }

    .signature-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 15mm !important;
      margin-top: 8mm !important;
      page-break-inside: avoid !important;
    }

    .sig-box {
      border-top: 0.5pt solid #000 !important;
      margin-top: 15mm !important;
      padding-top: 1mm !important;
      text-align: center !important;
      font-size: 8pt !important;
    }

  }

  /* Print Preview Styles */
  .print-preview-modal {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    overflow-y: auto;
  }

  .print-preview-content {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 10mm;
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
    transform-origin: top center;
    margin-bottom: 2rem;
    color: black;
    font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
  }

  .print-preview-content * {
    color: black !important;
  }
  
  .print-preview-content .no-print {
    display: none !important;
  }
`;


// Reusable Print Layout Component to ensure "pratonton" and "cetak" match perfectly
const PrintLayout = ({ currentTeacher, isAdminMode }: { currentTeacher: any, isAdminMode: boolean }) => {
  if (!currentTeacher) return null;
  const profile = currentTeacher.profile || {};
  
  return (
    <div className="print-layout-container">
      {/* Header */}
      <div className="print-header flex items-center justify-between border-b-[1.5pt] border-[#002B5B] pb-3 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#002B5B] rounded-lg flex items-center justify-center p-2">
             <span className="text-[10px] font-black text-white">KPM</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-[#002B5B] uppercase leading-none mb-1">Profile Guru</h1>
            <p className="text-sm font-bold text-[#002B5B] uppercase mb-1">SMK Sultan Ahmad Shah</p>
            <p className="text-[8pt] font-bold text-slate-500 uppercase tracking-widest">Kementerian Pendidikan Malaysia</p>
          </div>
        </div>
        <div className="print-photo-container">
          {currentTeacher.profile_image ? (
            <img 
              src={currentTeacher.profile_image} 
              alt="Profil" 
              className="print-photo w-[30mm] h-[38mm] border-[0.5pt] border-black object-cover"
            />
          ) : (
            <div className="w-[30mm] h-[38mm] border-[0.5pt] border-slate-300 flex items-center justify-center bg-slate-50 text-[8pt] text-slate-400 text-center px-4">
              GAMBAR PROFIL
            </div>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <span className="section-title">Maklumat Peribadi</span>
      <div className="info-grid">
        {[
          { label: "Nama Penuh", value: (profile as any)?.nama },
          { label: "No. Kad Pengenalan", value: (profile as any)?.kp },
          { label: "No. Telefon", value: (profile as any)?.tel },
          { label: "E-mel", value: (profile as any)?.email },
          { label: "Pengalaman Mengajar", value: (profile as any)?.pengalaman },
          { label: "Tempoh Sekolah Semasa", value: (profile as any)?.tempohSemasa },
          { label: "Tarikh Berkhidmat", value: (profile as any)?.tarikhMula },
          { label: "Gred Jawatan", value: (profile as any)?.gred },
        ].map((item) => (
          <div key={item.label} className="info-item">
            <span className="info-label">{item.label}</span>
            <span className="info-value">{item.value || "-"}</span>
          </div>
        ))}
      </div>
      <div className="info-item mt-1">
        <span className="info-label">Alamat Kediaman</span>
        <span className="info-value">{(profile as any)?.alamat || "-"}</span>
      </div>

      {/* School Info */}
      <span className="section-title">Maklumat Sekolah</span>
      <div className="info-grid">
        <div className="info-item"><span className="info-label">Nama Sekolah</span><span className="info-value">{(profile as any)?.sekolah?.nama || "-"}</span></div>
        <div className="info-item"><span className="info-label">Kod Sekolah</span><span className="info-value">{(profile as any)?.sekolah?.kod || "-"}</span></div>
        <div className="info-item"><span className="info-label">Jawatan</span><span className="info-value">{(profile as any)?.sekolah?.jawatan || "-"}</span></div>
        <div className="info-item"><span className="info-label">Pemeriksa SPM</span><span className="info-value">{(profile as any)?.sekolah?.pemeriksaSPM || "-"}</span></div>
      </div>
      
      <div className="info-item mt-1">
        <span className="info-label">Alamat Sekolah</span>
        <span className="info-value">
          {(profile as any)?.sekolah?.alamat}, {(profile as any)?.sekolah?.poskod} {(profile as any)?.sekolah?.daerah}, {(profile as any)?.sekolah?.negeri}
        </span>
      </div>

      {/* Academic */}
      <span className="section-title">Kelulusan Akademik</span>
      <table>
        <thead>
          <tr>
            <th>Tahap Kelulusan</th>
            <th>Bidang / Pengkhususan</th>
            <th>Institusi / Universiti</th>
            <th>Tahun</th>
          </tr>
        </thead>
        <tbody>
          {((currentTeacher.kelulusan || []) as any[]).map((row: any) => (
            <tr key={row.id}>
              <td>{row.kelayakan}</td>
              <td>{row.bidang}</td>
              <td>{row.institusi}</td>
              <td>{row.tahun}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Subjects */}
      <span className="section-title">Subjek yang Diajar</span>
      <table>
        <thead>
          <tr>
            <th>Subjek</th>
            <th>Tingkatan / Tahun</th>
            <th>Bil. Murid</th>
            <th>TOV</th>
            <th>ETR</th>
          </tr>
        </thead>
        <tbody>
          {((currentTeacher.subjek || []) as any[]).map((row: any) => (
            <tr key={row.id}>
              <td>{row.nama}</td>
              <td>{row.kelas}</td>
              <td>{row.murid}</td>
              <td>{row.tov}</td>
              <td>{row.etr}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Service History */}
      <span className="section-title">Sejarah Perkhidmatan</span>
      <table>
        <thead>
          <tr>
            <th>Nama dan Alamat Sekolah</th>
            <th>Tahun</th>
            <th>Subjek yang Diajar</th>
          </tr>
        </thead>
        <tbody>
          {((currentTeacher.sejarah || []) as any[]).map((row: any) => (
            <tr key={row.id}>
              <td>{row.sekolah}</td>
              <td>{row.tahun}</td>
              <td>{row.subjek}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signatures */}
      <div className="signature-grid">
        <div>
          <span className="info-label block mb-10">Tandatangan Guru</span>
          <div className="sig-box">
            Nama: {(profile as any)?.nama}
          </div>
        </div>
        {isAdminMode && (
          <div>
            <span className="info-label block mb-10">Disahkan Oleh</span>
            <div className="sig-box">
              Cap dan Tandatangan Pengetua
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Hardcoded teachers data from SAS 2026 List
// Filtering for Guru, Pentadbir, and Pengetua only
const SAS_TEACHERS: { nama: string, kp: string, jabatan: string }[] = [

  { nama: "AFIZAWATI BINTI ISMAIL", kp: "790902045232", jabatan: "Guru" },
  { nama: "AHMAD FAIZAL BIN AYOP", kp: "801022016573", jabatan: "Guru" },
  { nama: "AHMAD FAZIERUL BIN AHMAD FARDUN", kp: "980429085665", jabatan: "Guru" },
  { nama: "AHMAD SYAFIQ BIN DAHLAN", kp: "960929045119", jabatan: "Guru" },
  { nama: "AINA MARDIAH BINTI BASRI", kp: "910825065240", jabatan: "Guru" },
  { nama: "ANIZA BINTI AWANG", kp: "690331035138", jabatan: "Guru" },
  { nama: "ARTIKA BINTI ABD RAHMAN", kp: "890309065134", jabatan: "Guru" },
  { nama: "ATHILETCHMI A/P SINASAMY", kp: "800417065594", jabatan: "Guru" },
  { nama: "AZIAH BINTI ABDUL AZIZ", kp: "810528115194", jabatan: "Pentadbir" },
  { nama: "AZIZAH BINTI AWANG", kp: "671125025728", jabatan: "Guru" },
  { nama: "AZMI BIN AHMAD", kp: "720726025633", jabatan: "Pengetua" },
  { nama: "AZURA WATI BINTI MOHAMED ZAINI", kp: "830413086168", jabatan: "Guru" },
  { nama: "CHEAH CHEN AI", kp: "930312035466", jabatan: "Guru" },
  { nama: "CHEW ZI QEE", kp: "000614070661", jabatan: "Guru" },
  { nama: "DR.KANNAN AL RAJAGOPAL", kp: "690401025673", jabatan: "Guru" },
  { nama: "FATIN AISYAH", kp: "940329065564", jabatan: "Guru" },
  { nama: "GEETHA A/P BASKARARAU", kp: "960924145460", jabatan: "Guru" },
  { nama: "HEMAMALINI SHELVAM", kp: "940223065638", jabatan: "Guru" },
  { nama: "INTAN IZZLYANIE BINTI ABD HAMID", kp: "000413080302", jabatan: "Guru" },
  { nama: "IZZUL UMAIR BIN TAFRI", kp: "990622135028", jabatan: "Guru" },
  { nama: "J.VEJAYA A/P K. JAYARAMAN", kp: "710705105846", jabatan: "Guru" },
  { nama: "KAMALA AP RATNAM", kp: "801213086056", jabatan: "Guru" },
  { nama: "KHAIRUL AZWA BIN MZI", kp: "991007035709", jabatan: "Guru" },
  { nama: "KHAIRUNNISA AMINAH BINTI MOHD AMIN", kp: "831210145804", jabatan: "Guru" },
  { nama: "KRISHNANANTHINI A/P GUNASAYGARAN", kp: "900516075198", jabatan: "Guru" },
  { nama: "LIM KOK CHENG", kp: "850421135861", jabatan: "Guru" },
  { nama: "LOW YEE CHUNG", kp: "830709085885", jabatan: "Guru" },
  { nama: "MAIZON BINTI OTHMAN", kp: "770328035516", jabatan: "Pentadbir" },
  { nama: "MANGAIYARKARASI A/P RAJAREM", kp: "710707085594", jabatan: "Guru" },
  { nama: "MASLINAWATI BINTI MUJIIB", kp: "761001145006", jabatan: "Guru" },
  { nama: "MASNIZAM BINTI MOHAMED", kp: "770613035750", jabatan: "Guru" },
  { nama: "MIATI BINTI MOHD LELA", kp: "760202115212", jabatan: "Pentadbir" },
  { nama: "MOHAMAD NURSALAM BIN MOHD FOUZI", kp: "960803115425", jabatan: "Guru" },
  { nama: "MOHAMMAD FAIRUS KHAZALI BIN ISMAIL", kp: "840517115233", jabatan: "Guru" },
  { nama: "MOHD ERMAN BIN MAHMAT", kp: "800309035793", jabatan: "Pentadbir" },
  { nama: "MOHD FAAIEZ BIN HASBULLAH", kp: "810814035339", jabatan: "Guru" },
  { nama: "MOHD FAHMI BIN JUSOH", kp: "881111035277", jabatan: "Guru" },
  { nama: "MOHD HAFIZUDDIN BIN DAHALAN", kp: "921212115149", jabatan: "Guru" },
  { nama: "MOHD HAMDAN BIN MANSOR", kp: "860109295739", jabatan: "Guru" },
  { nama: "MOHD HAZIM BIN MOHD KASSIM", kp: "860415295331", jabatan: "Guru" },
  { nama: "MOHD SHAHROL BIN CHE ADIK", kp: "930107035109", jabatan: "Guru" },
  { nama: "MOHD SHAZUAN BIN MD SABUDI", kp: "880905565101", jabatan: "Guru" },
  { nama: "MUHAMAD ILHAM BIN POK MUDA", kp: "930307036405", jabatan: "Guru" },
  { nama: "MUHAMAD SHAIFUL BIN MOKTAH", kp: "850505035403", jabatan: "Guru" },
  { nama: "MUHAMMAD A'FIFI BIN MUHAMMAD TAJUDDIN", kp: "980107065477", jabatan: "Guru" },
  { nama: "MUHAMMAD LUTHFI AIMAN BIN KASMER", kp: "000123060717", jabatan: "Guru" },
  { nama: "MUHAMMAD SYAZWAN SYAKIR BIN OSMAN", kp: "990629065895", jabatan: "Guru" },
  { nama: "NIK NURHASNIZA BT NIK SIN", kp: "830922086342", jabatan: "Guru" },
  { nama: "NOOR AMIZA SHAMSUDDIN", kp: "860520385240", jabatan: "Guru" },
  { nama: "NOORDAYANA FARISHAH BINTI RAZALI", kp: "991105115286", jabatan: "Guru" },
  { nama: "NOR AMIRAH BINTI MOHD KUSAIRI", kp: "881231035706", jabatan: "Guru" },
  { nama: "NOR DASILLA BINTI DAHARIM", kp: "870302086356", jabatan: "Guru" },
  { nama: "NORAIDA YUSOFF", kp: "860502295284", jabatan: "Guru" },
  { nama: "NORAZLIN BT MOHD ZAIN", kp: "781102055534", jabatan: "Guru" },
  { nama: "NORHANANI BINTI MOHD HANAFIAH", kp: "840607085760", jabatan: "Guru" },
  { nama: "NORHANISHAH BT HARON", kp: "780507035430", jabatan: "Guru" },
  { nama: "NORSAHRINA BINTI ASMAWI", kp: "900228085826", jabatan: "Guru" },
  { nama: "NUR AIN BINTI ISMAIL", kp: "951023035788", jabatan: "Guru" },
  { nama: "NUR AQILLAH BINTI MUHAMMAD", kp: "990624115558", jabatan: "Guru" },
  { nama: "NUR FARRAH NAJIHAH BINTI AMIR", kp: "950204085042", jabatan: "Guru" },
  { nama: "NUR HASMIDA BINTI HASSAN", kp: "940426025556", jabatan: "Guru" },
  { nama: "NUR SYAZWANI BINTI SAARI", kp: "920704035722", jabatan: "Guru" },
  { nama: "NURIN FALISHA BINTI ANUAR", kp: "901101065988", jabatan: "Guru" },
  { nama: "NURUL ASYIKIN BALQIS", kp: "990302065582", jabatan: "Guru" },
  { nama: "NURUL FARHANA BINTI MT RIDZUAN", kp: "990406036368", jabatan: "Guru" },
  { nama: "NURUL HUDA AHAT", kp: "870320235116", jabatan: "Guru" },
  { nama: "NURUL NABILAH BINTI AZMI", kp: "970725086284", jabatan: "Guru" },
  { nama: "NURUL NAGIHAH", kp: "990117116302", jabatan: "Guru" },
  { nama: "NURUL NAJIHA AQILAH BINTI JAFFAR", kp: "980806066030", jabatan: "Guru" },
  { nama: "NURUL SYAKIRA BINTI MOHD SAADUN", kp: "980711066038", jabatan: "Guru" },
  { nama: "RAFIDAH BINTI RASHID", kp: "850329115382", jabatan: "Pentadbir" },
  { nama: "RAHNUSHA A/P KUMARA", kp: "000902020618", jabatan: "Guru" },
  { nama: "RAMU NAGAPPAN", kp: "730528106351", jabatan: "Guru" },
  { nama: "ROFIZAH BT HUSSAIN", kp: "860605335074", jabatan: "Guru" },
  { nama: "ROHANA BINTI IBRAHIM", kp: "740331035552", jabatan: "Guru" },
  { nama: "ROZIEYLA BINTI ROSLI", kp: "840619035092", jabatan: "Guru" },
  { nama: "RUSLIZA BINTI ABDULLAH", kp: "821224065718", jabatan: "Guru" },
  { nama: "SAIDATUL HUDA BINTI MOHD SABRI", kp: "941220115630", jabatan: "Guru" },
  { nama: "SAIFUL MASLUL BIN ZAINAL ABIDIN", kp: "730813085721", jabatan: "Guru" },
  { nama: "SANUSI BIN MOHD NOOR", kp: "670510035805", jabatan: "Pentadbir" },
  { nama: "SARASU A/P NALLAPAN", kp: "660711025372", jabatan: "Guru" },
  { nama: "SARINA BT AHMAD", kp: "710622025736", jabatan: "Guru" },
  { nama: "SIM HUI YIN", kp: "850818135712", jabatan: "Guru" },
  { nama: "SITI NOR ZULAIKHA BINTI ISMAIL", kp: "000318030606", jabatan: "Guru" },
  { nama: "SITI NORATINA BT AB RAHMAN", kp: "890326295046", jabatan: "Guru" },
  { nama: "SITI NURANISA’ AIN BINTI CHE HASMANI", kp: "960323115362", jabatan: "Guru" },
  { nama: "SUZIANA@NAZIRAH BT ISMAIL@DAGANG", kp: "750101117308", jabatan: "Guru" },
  { nama: "SYADILA BINTI ABD RAZAK", kp: "831109085392", jabatan: "Guru" },
  { nama: "SYAIFUL AMRI AMRI BIN JUSOF", kp: "840220035267", jabatan: "Guru" },
  { nama: "VASUKI VARATHAPPAN", kp: "840115015184", jabatan: "Guru" },
  { nama: "WAN MOHD RAZUHA BIN WAN MD ZUHAIDI", kp: "890809035927", jabatan: "Guru" },
  { nama: "WAN MUHAMMAD HAFIZ BIN WAN ZIN", kp: "960711035401", jabatan: "Guru" },
  { nama: "WONG PEI CHIT", kp: "760726085560", jabatan: "Guru" },
  { nama: "ZAIDATONAKMA BINTI ABDUL HAMID", kp: "720506085706", jabatan: "Pentadbir" },
  { nama: "ZAKWAN ELKMAL BIN HAMDAN", kp: "901220065315", jabatan: "Guru" },
  { nama: "ZIZAH BINTI OMAR", kp: "800620025774", jabatan: "Pentadbir" },
  { nama: "ZUREENA BTI MOHD REZUAN", kp: "740102066144", jabatan: "Guru" }
];

const SUPERADMIN_IC = "801022016573";



export const Route = createFileRoute("/")({

  head: () => ({
    title: "Profile Guru | SMK Sultan Ahmad Shah",
    meta: [
      { name: "description", content: "Portal Rasmi Profile Guru - SMK Sultan Ahmad Shah" },
      { property: "og:title", content: "Profile Guru | SMK Sultan Ahmad Shah" },
    ],
  }),
  component: GuruProfile,
});

function GuruProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [icInput, setIcInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  
  // Teachers state for multi-profile support
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    // We check for a "pseudo-session" in localStorage for IC login
    const savedIc = localStorage.getItem('guru_ic_session');
    if (savedIc) {
      setSession({ user: { ic: savedIc, id: 'pseudo-user' } });
      fetchTeachersByIc(savedIc);
      // Auto-enable admin mode for superadmin
      if (savedIc === SUPERADMIN_IC) {
        setIsAdminMode(true);
        setShowAdminDashboard(true);
      } else {
        setIsAdminMode(false);
        setShowAdminDashboard(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchTeachersByIc = async (ic: string) => {
    const cleanIc = ic.replace(/-/g, "");
    setIsLoading(true);
    console.log("Fetching profile for IC:", cleanIc);
    // In "IC Mode", we query by ic_number (TEXT) to avoid UUID errors
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('ic_number', cleanIc)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error("Gagal memuat profil guru.");
      console.error(error);
    } else if (data) {
      const mappedData = data.map((t: any) => ({
        ...t,
        profileImage: t.profile_image,
      }));
      setTeachers(mappedData);
      
      // Auto-select the first profile if not already set
      if (mappedData.length > 0) {
        if (!activeTeacherId) {
          setActiveTeacherId(mappedData[0].id);
        }
        
        // If not admin, ensure we land on the profile view directly
        if (cleanIc !== SUPERADMIN_IC) {
          setShowAdminDashboard(false);
          setIsAdminMode(false);
        }
      }
    }
    setIsLoading(false);
    console.log("Fetch complete for IC:", cleanIc);
  };

  const handleIcLogin = async () => {
    if (!icInput.trim()) {
      toast.error("Sila masukkan No. IC.");
      return;
    }
    const cleanIc = icInput.trim().replace(/-/g, "");
    setIsLoggingIn(true);
    console.log("Memulakan proses log masuk untuk IC:", cleanIc);

    // Validate if the IC exists in SAS_TEACHERS softcoded list
    const sasTeacher = SAS_TEACHERS.find(t => t.kp === cleanIc);
    
    if (!sasTeacher && cleanIc !== SUPERADMIN_IC) {
      toast.error("Maaf, No. IC anda tiada dalam senarai Guru/Pentadbir SAS 2026.");
      setIsLoggingIn(false);
      return;
    }

    try {
      if (cleanIc === SUPERADMIN_IC) {
        setIsAdminMode(true);
        setShowAdminDashboard(true);
        toast.success("Selamat datang, Superadmin!");
      }
      
      // Check if teacher profile already exists in DB
      // Note: ic_number is TEXT but owner_id is UUID. 
      // We only compare cleanIc with ic_number to avoid UUID syntax errors.
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('ic_number', cleanIc)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Ralat Supabase:", error);
        toast.error(`Ralat semasa log masuk: ${error.message}`);
      } else {
        localStorage.setItem('guru_ic_session', cleanIc);
        setSession({ user: { ic: cleanIc, id: 'pseudo-user' } });
        
        if (data && data.length > 0) {
          await fetchTeachersByIc(cleanIc);
          const firstTeacher = data[0];
          const teacherName = (firstTeacher?.profile as any)?.nama || sasTeacher?.nama || 'Cikgu';
          toast.success(`Selamat kembali, ${teacherName}`);
          
          // If not superadmin and profile exists, jump straight to the first profile
          if (cleanIc !== SUPERADMIN_IC && firstTeacher) {
             setActiveTeacherId(firstTeacher.id);
             setIsEditMode(false);
          }
        } else {
          // If profile doesn't exist in DB, start fresh for this user from the list
          if (cleanIc !== SUPERADMIN_IC) {
            // Automatically trigger creation if not superadmin
            handleAutoCreateTeacher(cleanIc, sasTeacher);
          } else {
            toast.info("Anda belum mempunyai profil digital. Sila isi maklumat anda.");
            setTeachers([]);
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      console.error("Ralat tidak dijangka:", err);
      toast.error("Berlaku ralat sistem yang tidak dijangka.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchTeachers = async (userId: string) => {
    // This function is kept for backward compatibility if needed, 
    // but we use fetchTeachersByIc now.
    setIsLoading(true);
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('ic_number', userId.replace(/-/g, ""))
      .order('created_at', { ascending: true });

    if (error) {
      toast.error("Gagal memuat profil guru.");
      console.error(error);
    } else if (data) {
      const mappedData = data.map((t: any) => ({
        ...t,
        profileImage: t.profile_image,
      }));
      setTeachers(mappedData);
      if (mappedData.length > 0 && !activeTeacherId) {
        setActiveTeacherId(mappedData[0].id);
      }
    }
    setIsLoading(false);
  };
  // Automatically creates a teacher profile if it doesn't exist
  const handleAutoCreateTeacher = async (ic: string, sasTeacher: any) => {
    setIsLoading(true);
    console.log("Auto-creating profile for IC:", ic);
    const newTeacherData = {
      profile: {
        nama: sasTeacher?.nama || "",
        kp: ic || "",
        tel: "01X-XXXXXXX",
        email: `${(sasTeacher?.nama || 'guru').toLowerCase().replace(/\s+/g, '.')}@moe-dl.edu.my`,
        pengalaman: "10 Tahun",
        tempohSemasa: "5 Tahun",
        tarikhMula: "01/01/2015",
        opsyen: "Sejarah",
        gred: "DG44",
        mengajarOpsyen: "Ya",
        alamat: "Kuwaters Guru, Tanah Rata",
        sekolah: {
          nama: "SMK Sultan Ahmad Shah",
          alamat: "Persiaran Dayang Endah",
          poskod: "39000",
          daerah: "Tanah Rata",
          negeri: "Pahang",
          kod: "CEB1003",
          tel: "05-4911018",
          faks: "05-4914922",
          jawatan: sasTeacher?.jabatan || "Guru",
          guruKhas: "Tiada",
          pemeriksaSPM: "Tidak",
          lain: "-"
        }
      },
      kelulusan: [
        { id: 1, kelayakan: "Sarjana Muda Pendidikan", institusi: "UPSI", bidang: "Sejarah", tahun: "2014" }
      ],
      subjek: [
        { id: 1, nama: "Sejarah", kelas: "5 Delta", murid: "30", tov: "45", etr: "75" }
      ],
      sejarah: [
        { id: 1, sekolah: "SMK Sultan Ahmad Shah", tahun: "2015-2026", subjek: "Sejarah" }
      ],
      ic_number: ic,
      profile_image: null
    } as any;

    console.log("Payload to insert:", newTeacherData);

    const { data, error } = await supabase
      .from('teachers')
      .insert([newTeacherData])
      .select();

    if (error) {
      toast.error(`Gagal menjana profil: ${error.message}`);
      console.error("Auto-creation error:", error);
      setIsLoading(false);
    } else if (data && data[0]) {
      const teacher = data[0];
      const newTeacher = {
        ...teacher,
        profileImage: teacher.profile_image
      };
      setTeachers([newTeacher]);
      setActiveTeacherId(teacher.id as string);
      
      // Update teachers state
      const mappedTeacher = {
        ...teacher,
        profileImage: teacher.profile_image
      };
      setTeachers([mappedTeacher]);
      
      setIsEditMode(false);
      setIsLoading(false);
      console.log("Auto-creation complete for IC:", ic);
      toast.success("Profil digital anda telah dijanakan secara automatik.");
    }
  };

  const handleManualCreateTeacher = async (ic: string, name: string, jabatan: string) => {
    setIsLoading(true);
    const newTeacherData = {
      profile: {
        nama: name,
        kp: ic,
        tel: "01X-XXXXXXX",
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@moe-dl.edu.my`,
        pengalaman: "10 Tahun",
        tempohSemasa: "5 Tahun",
        tarikhMula: "01/01/2015",
        opsyen: "Sejarah",
        gred: "DG44",
        mengajarOpsyen: "Ya",
        alamat: "Kuwaters Guru, Tanah Rata",
        sekolah: {
          nama: "SMK Sultan Ahmad Shah",
          alamat: "Persiaran Dayang Endah",
          poskod: "39000",
          daerah: "Tanah Rata",
          negeri: "Pahang",
          kod: "CEB1003",
          tel: "05-4911018",
          faks: "05-4914922",
          jawatan: jabatan,
          guruKhas: "Tiada",
          pemeriksaSPM: "Tidak",
          lain: "-"
        }
      },
      kelulusan: [
        { id: 1, kelayakan: "Sarjana Muda Pendidikan", institusi: "UPSI", bidang: "Sejarah", tahun: "2014" }
      ],
      subjek: [
        { id: 1, nama: "Sejarah", kelas: "5 Delta", murid: "30", tov: "45", etr: "75" }
      ],
      sejarah: [
        { id: 1, sekolah: "SMK Sultan Ahmad Shah", tahun: "2015-2026", subjek: "Sejarah" }
      ],
      ic_number: ic,
      profile_image: null
    } as any;

    const { data, error } = await supabase
      .from('teachers')
      .insert([newTeacherData])
      .select();

    if (error) {
      toast.error(`Gagal menjana profil: ${error.message}`);
      setIsLoading(false);
    } else if (data && data[0]) {
      const teacher = data[0];
      const newTeacher = {
        ...teacher,
        profileImage: teacher.profile_image
      };
      setTeachers(prev => [...prev, newTeacher]);
      setActiveTeacherId(teacher.id as string);
      setIsEditMode(true);
      setIsLoading(false);
      toast.success(`Profil untuk ${name} telah dijanakan.`);
    }
  };

  
  // Derived state for current active teacher
  const currentTeacher = activeTeacherId ? teachers.find(t => t.id === activeTeacherId) : null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  
  // Handlers for switching and creating teachers
  const handleAddTeacher = async () => {
    if (!session) {
      toast.error("Sila log masuk untuk menambah profil.");
      return;
    }

    const ic = session.user.ic.replace(/-/g, "");

    const sasTeacher = SAS_TEACHERS.find(t => t.kp === ic);

    const newTeacherData = {
      profile: {
        nama: sasTeacher?.nama || "",
        kp: ic || "",
        tel: "01X-XXXXXXX",
        email: `${(sasTeacher?.nama || 'guru').toLowerCase().replace(/\s+/g, '.')}@moe-dl.edu.my`,
        pengalaman: "10 Tahun",
        tempohSemasa: "5 Tahun",
        tarikhMula: "01/01/2015",
        opsyen: "Sejarah",
        gred: "DG44",
        mengajarOpsyen: "Ya",
        alamat: "Kuwaters Guru, Tanah Rata",
        sekolah: {
          nama: "SMK Sultan Ahmad Shah",
          alamat: "Persiaran Dayang Endah",
          poskod: "39000",
          daerah: "Tanah Rata",
          negeri: "Pahang",
          kod: "CEB1003",
          tel: "05-4911018",
          faks: "05-4914922",
          jawatan: sasTeacher?.jabatan || "Guru",
          guruKhas: "Tiada",
          pemeriksaSPM: "Tidak",
          lain: "-"
        }
      },
      kelulusan: [
        { id: 1, kelayakan: "Sarjana Muda Pendidikan", institusi: "UPSI", bidang: "Sejarah", tahun: "2014" }
      ],
      subjek: [
        { id: 1, nama: "Sejarah", kelas: "5 Delta", murid: "30", tov: "45", etr: "75" }
      ],
      sejarah: [
        { id: 1, sekolah: "SMK Sultan Ahmad Shah", tahun: "2015-2026", subjek: "Sejarah" }
      ],
      ic_number: ic,
      profile_image: null
    };

    const { data, error } = await supabase
      .from('teachers')
      .insert([newTeacherData])
      .select();

    if (error) {
      toast.error("Gagal menambah profil guru.");
      console.error(error);
    } else if (data && data[0]) {
      const teacher = data[0];
      const newTeacher = {
        ...teacher,
        profileImage: teacher.profile_image
      };
      setTeachers([...teachers, newTeacher]);
      setActiveTeacherId(teacher.id as string);
      setIsEditMode(true);
      toast.success("Profil guru baru telah dicipta.");
    }
  };

  const handleSelectTeacher = (id: string) => {
    setActiveTeacherId(id);
    setIsEditMode(false);
  };

  const handleDeleteTeacher = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Adakah anda pasti mahu memadam profil ini?")) {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Gagal memadam profil.");
      } else {
        const updated = teachers.filter(t => t.id !== id);
        setTeachers(updated);
        if (activeTeacherId === id) {
          setActiveTeacherId(updated.length > 0 ? updated[0].id : null);
        }
        toast.error("Profil guru telah dipadam.");
      }
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

  const handleSave = async () => {
    if (!activeTeacherId || !currentTeacher) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('teachers')
      .update({
        profile: currentTeacher.profile,
        kelulusan: currentTeacher.kelulusan,
        subjek: currentTeacher.subjek,
        sejarah: currentTeacher.sejarah,
        profile_image: currentTeacher.profileImage,
        ic_number: (currentTeacher.profile as any)?.kp // Ensure IC number is synced
      })
      .eq('id', activeTeacherId);

    setIsSaving(false);
    if (error) {
      toast.error("Gagal menyimpan maklumat.");
      console.error(error);
    } else {
      setIsEditMode(false);
      localStorage.removeItem('guru_profile_draft');
      toast.success("Maklumat telah berjaya disimpan.");
    }
  };

  useEffect(() => {
    if (isEditMode && activeTeacherId) {
      localStorage.setItem('guru_profile_draft', JSON.stringify({ id: activeTeacherId, timestamp: new Date().getTime() }));
    }
  }, [isEditMode, activeTeacherId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeTeacherId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentTeacher({ profileImage: reader.result as string });
        toast.success("Gambar profil berjaya dikemaskini. Sila simpan untuk mengekalkan perubahan.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      console.error("Login error:", error);
      toast.error("Gagal log masuk. Sila cuba lagi.");
    }
  };

  const handleLogout = async () => {
    setIsAdminMode(false);
    localStorage.removeItem('guru_ic_session');
    setSession(null);
    setTeachers([]);
    toast.info("Anda telah log keluar.");
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;


    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);


    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#002B5B';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, [currentTeacher?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <Card className="max-w-xs w-full border-none shadow-2xl rounded-3xl p-8 text-center space-y-6 bg-white animate-in zoom-in duration-500">
          <div className="flex justify-between items-start mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs p-0 h-auto"
            >
              <LogOut className="w-4 h-4 mr-1" /> Log Keluar
            </Button>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          <div className="w-20 h-20 bg-[#002B5B] rounded-2xl mx-auto flex items-center justify-center p-3 shadow-xl transform rotate-3">
             <span className="text-xl font-black text-white">KPM</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight">Profile Guru</h3>
            <p className="text-sm font-bold text-[#002B5B] uppercase">SMK Sultan Ahmad Shah</p>
            <p className="text-slate-500 text-sm font-medium px-4">
              Sila tunggu sebentar sementara kami memuatkan maklumat anda...
            </p>
          </div>

          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 text-[#002B5B] animate-spin opacity-40" />
          </div>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-6 sm:p-10 text-center space-y-6 sm:space-y-8 bg-white animate-in zoom-in duration-500">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#002B5B] rounded-[2rem] flex items-center justify-center mx-auto shadow-xl transform rotate-3 transition-transform hover:rotate-0">
             <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter">KPM</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-[#002B5B] tracking-tight">Profile Guru</h1>
            <p className="text-lg font-bold text-[#002B5B] uppercase">SMK Sultan Ahmad Shah</p>
            <p className="text-slate-500 font-semibold text-sm sm:text-base px-2">Sila masukkan No. Kad Pengenalan anda untuk mengakses profil.</p>
          </div>
          <div className="space-y-4 pt-4 sm:pt-6">
            <div className="space-y-3 text-left">
              <Label htmlFor="ic-login" className="text-slate-500 font-black ml-1 text-[10px] uppercase tracking-[0.2em]">No. Kad Pengenalan</Label>
              <div className="relative group">
                <Input 
                  id="ic-login"
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 770613035750" 
                  className="h-14 sm:h-16 rounded-[1.25rem] border-2 border-slate-100 focus:border-[#002B5B] focus:ring-0 text-lg sm:text-xl font-bold transition-all px-6 bg-slate-50/50 group-hover:bg-white"
                  value={icInput}
                  onChange={(e) => setIcInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleIcLogin()}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                  <User className="w-6 h-6 text-[#002B5B]" />
                </div>
              </div>
            </div>
            <Button 
              onClick={handleIcLogin} 
              disabled={isLoggingIn}
              className="w-full h-14 sm:h-16 bg-[#002B5B] hover:bg-[#003B7B] rounded-[1.25rem] text-lg sm:text-xl font-black shadow-xl shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-6 h-6 mr-3 stroke-[3px]" /> Masuk Profil
                </>
              )}
            </Button>
            <div className="pt-2">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 py-2 rounded-lg inline-block px-4">
                Tanpa tanda sempang <span className="text-[#002B5B] font-black mx-1">(-)</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (teachers.length === 0 && !isAdminMode && session) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-6 sm:p-10 text-center space-y-6 sm:space-y-8 bg-white animate-in zoom-in duration-500">
          <div className="flex justify-between items-center no-print">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black text-xs uppercase tracking-tighter rounded-xl px-4"
            >
              <LogOut className="w-4 h-4 mr-2" /> Log Keluar
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => { setIsAdminMode(true); setShowAdminDashboard(true); }} 
              className="text-slate-100 hover:text-[#002B5B] transition-colors rounded-xl"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#002B5B] rounded-[2rem] flex items-center justify-center mx-auto shadow-xl transform rotate-3">
             <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter">KPM</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-[#002B5B] tracking-tight">Profile Guru</h1>
            <p className="text-lg font-bold text-[#002B5B] uppercase">SMK Sultan Ahmad Shah</p>
            <div className="bg-blue-50/50 py-3 px-4 rounded-2xl">
              <p className="text-[#002B5B] font-bold text-sm sm:text-base">
                Memuatkan maklumat anda...
              </p>
            </div>
          </div>
          <div className="flex justify-center py-6 sm:py-8">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#002B5B] animate-spin stroke-[3px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => handleIcLogin()} 
            className="w-full h-14 sm:h-16 text-[#002B5B] font-black border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
          >
            Cuba Muat Semula
          </Button>
        </Card>
      </div>
    );
  }

  if (showAdminDashboard && isAdminMode) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans animate-in fade-in duration-700">
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
                <Button onClick={() => setShowAdminDashboard(false)} className="h-12 sm:h-14 px-6 bg-white text-[#002B5B] hover:bg-blue-50 font-black rounded-2xl shadow-lg text-sm uppercase tracking-wider">
                  <LayoutDashboard className="w-5 h-5 mr-3" /> Lihat Profil
                </Button>
                <Button variant="outline" onClick={() => { setIsAdminMode(false); setShowAdminDashboard(false); }} className="h-12 sm:h-14 px-6 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-black rounded-2xl text-sm uppercase tracking-wider">
                  <User className="w-5 h-5 mr-3" /> Paparan Guru
                </Button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-none shadow-xl rounded-3xl p-6 hover:scale-[1.02] transition-transform cursor-pointer border-l-4 border-blue-500" onClick={handleAddTeacher}>
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
                    {SAS_TEACHERS
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
                                  onClick={async () => {
                                    const teacherIdx = SAS_TEACHERS.findIndex(st => st.kp === t.kp);
                                    if (teacherIdx !== -1) {
                                      const currentSAS = SAS_TEACHERS[teacherIdx];
                                      if (currentSAS) currentSAS.jabatan = role;
                                      setRoleSearchTerm(prev => prev + " ");
                                      setTimeout(() => setRoleSearchTerm(prev => prev.trim()), 0);
                                      
                                      const { data: existing } = await supabase
                                        .from('teachers')
                                        .select('*')
                                        .eq('ic_number', t.kp)
                                        .maybeSingle();
                                        
                                      if (existing) {
                                        const typedExisting = existing as any;
                                        await supabase
                                          .from('teachers')
                                          .update({ 
                                            profile: { 
                                              ...typedExisting.profile, 
                                              sekolah: { ...(typedExisting.profile?.sekolah || {}), jawatan: role } 
                                            } 
                                          } as any)
                                          .eq('id', typedExisting.id);
                                        toast.success(`Peranan ${t.nama} dikemaskini.`);
                                      } else {
                                        handleManualCreateTeacher(t.kp, t.nama, role);
                                      }
                                    }
                                  }}
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
                              onClick={() => { setActiveTeacherId(t.id); setShowAdminDashboard(false); setIsEditMode(false); }}
                              className="h-8 rounded-lg border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" /> Lihat
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => { setActiveTeacherId(t.id); setShowAdminDashboard(false); setIsEditMode(true); }}
                              className="h-8 rounded-lg border-slate-200 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => handleDeleteTeacher(t.id, e)}
                              className="h-8 rounded-lg border-slate-200 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {teachers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium">
                          Tiada rekod guru dijumpai.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { profile, profileImage, kelulusan, subjek, sejarah } = currentTeacher || {
    profile: {
      nama: "", kp: "", tel: "", email: "", pengalaman: "", tempohSemasa: "", tarikhMula: "", opsyen: "", gred: "", mengajarOpsyen: "", alamat: "",
      sekolah: { nama: "SMK Sultan Ahmad Shah", alamat: "Persiaran Dayang Endah", poskod: "39000", daerah: "Tanah Rata", negeri: "Pahang", kod: "CEB1003", tel: "05-4911018", faks: "05-4914922", jawatan: "", guruKhas: "", pemeriksaSPM: "Tidak", lain: "" }
    },
    profileImage: null,
    kelulusan: [],
    subjek: [],
    sejarah: []
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans text-slate-900 animate-in fade-in duration-700">
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      <div className="print-only">
        <PrintLayout currentTeacher={currentTeacher} isAdminMode={isAdminMode} />
      </div>

      <div id="profile-container" className="max-w-6xl mx-auto print-container space-y-6 no-print">


        
        {/* PANITIA SELECTOR / TABS */}
        {isAdminMode && (
          <div className="no-print flex flex-wrap gap-2 mb-4 animate-in slide-in-from-left duration-500">
            <div 
              className="flex items-center gap-2 mr-4 bg-[#002B5B] text-white px-4 py-2 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowAdminDashboard(true)}
            >
              <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-black text-xs uppercase tracking-widest">Admin Dashboard</span>
            </div>
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
                      <AvatarFallback className="text-[8px]">{(t.profile as any)?.nama?.charAt(0) || "G"}</AvatarFallback>
                    </Avatar>
                    {(t.profile as any)?.nama || "Tanpa Nama"}
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
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="h-12 px-4 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black uppercase text-xs tracking-widest"
            >
              <LogOut className="w-4 h-4 mr-2" /> Log Keluar
            </Button>

          </div>
        )}

        {/* PRINT BUTTONS (Visible in Web UI) */}
        {!isEditMode && currentTeacher && (
          <div className="no-print flex justify-end gap-3 mb-4">
            <Button 
              onClick={() => setShowPrintPreview(true)}
              className="bg-white text-[#002B5B] hover:bg-slate-50 border border-slate-200 font-bold rounded-2xl px-6 h-12 shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2 text-[#D4AF37]" /> Pratonton Cetak
            </Button>
            <Button 
              onClick={handlePrint}
              className="bg-[#002B5B] hover:bg-[#003B7B] text-white font-bold rounded-2xl px-6 h-12 shadow-lg"
            >
              <Printer className="w-4 h-4 mr-2 text-[#D4AF37]" /> Simpan PDF / Cetak
            </Button>

          </div>
        )}



        {/* PRINT ONLY HEADER */}
        <div className="hidden print:block print-header">
          <div className="flex items-start gap-8">
            <div className="flex flex-col">
              <span className="kpm-logo-text">KPM</span>
              <div className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mt-1">
                Profil Guru Profesional 2026
              </div>
              <h1 className="text-xl font-black text-[#002B5B] uppercase leading-tight mt-2">
                REKOD PERIBADI PENJAWAT AWAM
              </h1>
              <div className="text-slate-600 font-bold text-sm mt-1">
                SMK Sultan Ahmad Shah (SAS)
              </div>
            </div>
          </div>
          <Avatar className="print-photo rounded-none">
            <AvatarImage src={profileImage || ""} />
            <AvatarFallback className="bg-slate-100 text-[#002B5B] text-xl font-bold">
              {(profile as any)?.nama?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* SCREEN HEADER */}

        <header className="no-print flex flex-col items-stretch bg-[#002B5B] p-6 sm:p-10 rounded-[2.5rem] shadow-2xl border-b-8 border-[#D4AF37] relative overflow-hidden group animate-in slide-in-from-top duration-700">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-[#D4AF37] rounded-[2rem] blur-xl opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
                <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-white shadow-2xl rounded-[2rem] overflow-hidden transition-all group-hover/avatar:scale-105 group-hover/avatar:rotate-2 duration-500">
                  <AvatarImage src={profileImage || ""} alt={(profile as any)?.nama} className="object-cover" />
                  <AvatarFallback className="bg-slate-100 text-[#002B5B] text-2xl font-black">
                    {(profile as any)?.nama?.charAt(0) || "G"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 no-print">
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
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl transition-all hover:scale-110 active:scale-95 border-4 border-white"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center md:text-left space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner transform -rotate-3 transition-transform hover:rotate-0 hidden sm:flex">
                     <span className="text-xs font-black text-[#002B5B]">KPM</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-lg">
                    {(profile as any)?.nama || "SILA ISI NAMA GURU"}
                  </h1>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-2">
                  <div className="text-[#D4AF37] font-black text-[10px] sm:text-xs flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 uppercase tracking-[0.1em]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Profil Guru Profesional
                  </div>
                  <div className="text-blue-100/70 font-bold text-xs sm:text-sm flex items-center gap-2 px-1">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    SMK Sultan Ahmad Shah
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-2">
              <div className="flex flex-col sm:flex-row items-center gap-3 no-print">
                <Button 
                  onClick={() => setIsEditMode(!isEditMode)} 
                  variant={isEditMode ? "destructive" : "secondary"}
                  className={`w-full sm:w-auto h-12 px-8 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${!isEditMode && 'bg-white text-[#002B5B] hover:bg-blue-50'}`}
                >
                  {isEditMode ? <><X className="w-5 h-5 mr-3" /> Batal</> : <><Edit2 className="w-5 h-5 mr-3" /> Edit Maklumat</>}
                </Button>
                {isEditMode && (
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full sm:w-auto h-12 px-10 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl shadow-[#D4AF37]/20 transition-all animate-in zoom-in"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-3" /> Simpan Profil</>}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* SEARCH & ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 no-print sticky top-4 z-50 animate-in slide-in-from-top duration-1000">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#002B5B] transition-colors w-6 h-6" />
            <Input 
              placeholder="Cari maklumat profil..." 
              className="pl-14 h-16 bg-white/95 backdrop-blur-xl border-white shadow-2xl shadow-[#002B5B]/10 rounded-[1.25rem] focus:ring-4 focus:ring-[#002B5B]/5 transition-all text-lg font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center gap-3 p-3 bg-white/95 backdrop-blur-xl rounded-[1.25rem] shadow-2xl shadow-[#002B5B]/10 border border-white">
            <Button 
              onClick={() => setShowPrintPreview(true)} 
              variant="outline"
              className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl sm:rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all text-[#002B5B]"
            >
              <FileText className="w-5 h-5 sm:mr-3" /> <span className="hidden sm:inline">Pratonton Cetak</span>
            </Button>
            <Button 
              onClick={handlePrint} 
              variant="outline"
              className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl sm:rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all"
            >
              <Printer className="w-5 h-5 sm:mr-3" /> <span className="hidden sm:inline">Cetak</span>
            </Button>
            <Button 
              onClick={handlePrint}
              className="h-12 w-12 sm:w-auto sm:px-8 bg-[#002B5B] hover:bg-[#003B7B] text-white rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <Download className="w-5 h-5 sm:mr-3" /> <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>


        {/* STATS CARDS REMOVED PER USER REQUEST */}


        {/* TWO COLUMNS DATA */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-lg rounded-3xl overflow-hidden animate-in slide-up duration-500 delay-200 bg-white card-print">
            <div className="h-2 bg-[#002B5B] no-print"></div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 py-6 px-8 print:py-0 print:px-0 print:border-none">
              <CardTitle className="text-xl font-black text-[#002B5B] flex items-center gap-3 section-title">
                <div className="bg-[#002B5B] p-2 rounded-lg no-print"><FileText className="w-5 h-5 text-white" /></div>
                Maklumat Peribadi
              </CardTitle>
              {!isEditMode && <div className="text-[10px] px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold uppercase tracking-wider">Lengkap</div>}
            </CardHeader>
            <CardContent className="p-8 print:p-0">
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 info-grid">
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
                  <div key={item.key} className="space-y-2 group info-item">
                    <div className="flex items-center gap-2 print:gap-0">
                      <span className="text-sm opacity-50 no-print">{item.icon}</span>
                      <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">{item.label}</Label>
                    </div>

                    {isEditMode ? (
                      item.key === 'gred' ? (
                        <Select
                          value={(profile as any)[item.key] || ""}
                          onValueChange={(val) => updateCurrentTeacher({ profile: { ...(profile as any), [item.key]: val } })}
                        >
                          <SelectTrigger className="h-12 sm:h-11 rounded-xl border-slate-100 focus:ring-[#002B5B] text-base">
                            <SelectValue placeholder="Pilih Gred" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200">
                            {SSPA_GRADES.map(grade => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input 
                          value={(profile as any)[item.key as keyof typeof profile] as string} 
                          onChange={(e) => {
                            const val = item.key === 'kp' ? e.target.value.replace(/-/g, "") : e.target.value;
                            updateCurrentTeacher({ profile: {...(profile as any), [item.key]: val}});
                          }}
                          className="h-12 sm:h-11 rounded-xl border-slate-100 focus:border-[#002B5B] focus:ring-[#002B5B] text-base"
                        />
                      )
                    ) : (
                      <div className="min-h-[44px] flex items-center px-4 rounded-xl bg-slate-50 border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all print:min-h-0 print:p-0 print:bg-transparent print:border-none">
                        <p className="text-slate-700 info-value">{(profile as any)[item.key as keyof typeof profile] as string || "-"}</p>
                      </div>

                    )}
                  </div>
                ))}
                <div className="md:col-span-2 space-y-2 info-item">
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-50 no-print">🏠</span>
                    <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">Alamat Kediaman</Label>

                  </div>
                  {isEditMode ? (
                    <Textarea 
                      value={(profile as any).alamat} 
                      onChange={(e) => updateCurrentTeacher({ profile: {...(profile as any), alamat: e.target.value}})}
                      className="min-h-[100px] rounded-xl border-slate-100 text-base"
                    />
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all print:p-0 print:bg-transparent print:border-none">
                      <p className="text-slate-700 leading-relaxed info-value">{(profile as any).alamat || "-"}</p>
                    </div>

                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-lg rounded-3xl overflow-hidden animate-in slide-up duration-500 delay-300 bg-white card-print">
              <div className="h-2 bg-[#D4AF37] no-print"></div>
              <CardHeader className="py-6 px-8 border-b border-slate-50 print:py-0 print:px-0 print:border-none">
                <CardTitle className="text-lg font-black text-[#002B5B] flex items-center gap-3 section-title">
                  <div className="bg-[#D4AF37] p-2 rounded-lg no-print"><Briefcase className="w-5 h-5 text-white" /></div>
                  Sekolah
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 print:p-0 print:space-y-2">
                {[
                  { label: "Nama Sekolah", key: "nama" },
                  { label: "Kod Sekolah", key: "kod" },
                  { label: "Jawatan", key: "jawatan" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2 info-item">
                    <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">{item.label}</Label>

                    {isEditMode ? (
                      <Input 
                        value={(profile as any).sekolah?.[item.key] || ""} 
                        onChange={(e) => updateCurrentTeacher({ 
                          profile: {
                            ...(profile as any), 
                            sekolah: {
                              ...((profile as any).sekolah || {}), 
                              [item.key]: e.target.value
                            }
                          } 
                        })}
                        className="h-12 sm:h-10 rounded-xl border-slate-100 text-base"

                      />
                    ) : (
                      <p className="text-slate-700 info-value">{(profile as any).sekolah?.[item.key] || "-"}</p>
                    )}
                  </div>
                ))}

                <div className="space-y-2 info-item">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">Pemeriksa SPM</Label>

                  {isEditMode ? (
                    <Select
                      value={(profile as any).sekolah?.pemeriksaSPM || "Tidak"}
                      onValueChange={(val) => updateCurrentTeacher({ 
                        profile: {
                          ...(profile as any), 
                          sekolah: {
                            ...((profile as any).sekolah || {}), 
                            pemeriksaSPM: val
                          }
                        } 
                      })}
                    >
                      <SelectTrigger className="h-12 sm:h-10 rounded-xl border-slate-100 focus:ring-[#002B5B] text-base">

                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="Ya">Ya</SelectItem>
                        <SelectItem value="Tidak">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-slate-700 info-value">{(profile as any).sekolah?.pemeriksaSPM || "-"}</p>
                  )}
                </div>

                <div className="space-y-2 info-item">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">Alamat Sekolah</Label>

                  {isEditMode ? (
                    <Input 
                      value={(profile as any).sekolah?.alamat || ""} 
                      onChange={(e) => updateCurrentTeacher({ 
                        profile: {
                          ...(profile as any), 
                          sekolah: {
                            ...((profile as any).sekolah || {}), 
                            alamat: e.target.value
                          }
                        } 
                      })}
                      className="h-12 sm:h-10 rounded-xl border-slate-100 text-base"

                    />
                  ) : (
                    <p className="font-bold text-slate-700 info-value">{(profile as any).sekolah?.alamat || "-"}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 print:grid-cols-1 print:gap-2">
                  <div className="space-y-2 info-item">
                    <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">Poskod</Label>

                    {isEditMode ? (
                      <Input 
                        value={(profile as any).sekolah?.poskod || ""} 
                        onChange={(e) => updateCurrentTeacher({ 
                          profile: {
                            ...(profile as any), 
                            sekolah: {
                              ...((profile as any).sekolah || {}), 
                              poskod: e.target.value
                            }
                          } 
                        })}
                        className="h-12 sm:h-10 rounded-xl border-slate-100 text-base"

                      />
                    ) : (
                      <p className="text-slate-700 info-value">{(profile as any).sekolah?.poskod || "-"}</p>
                    )}
                  </div>
                  <div className="space-y-2 info-item">
                    <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">Daerah</Label>

                    {isEditMode ? (
                      <Input 
                        value={(profile as any).sekolah?.daerah || ""} 
                        onChange={(e) => updateCurrentTeacher({ 
                          profile: {
                            ...(profile as any), 
                            sekolah: {
                              ...((profile as any).sekolah || {}), 
                              daerah: e.target.value
                            }
                          } 
                        })}
                        className="h-12 sm:h-10 rounded-xl border-slate-100 text-base"
                      />
                    ) : (
                      <p className="text-slate-700 info-value">{(profile as any).sekolah?.daerah || "-"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 info-item">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest info-label">Negeri</Label>

                  {isEditMode ? (
                    <Select
                      value={(profile as any).sekolah?.negeri || ""}
                      onValueChange={(val) => updateCurrentTeacher({ 
                        profile: {
                          ...(profile as any), 
                          sekolah: {
                            ...((profile as any).sekolah || {}), 
                            negeri: val
                          }
                        } 
                      })}
                    >
                      <SelectTrigger className="h-12 sm:h-10 rounded-xl border-slate-100 focus:ring-[#002B5B] text-base">
                        <SelectValue placeholder="Pilih Negeri" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {MALAYSIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-slate-700 info-value">{(profile as any).sekolah?.negeri || "-"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* TABLES SECTION */}
        <div className="space-y-6 animate-in slide-up duration-500 delay-400">
          
          {/* KELULUSAN ACADEMIK */}
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white card-print">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center print:bg-transparent print:px-0 print:py-0">
              <h2 className="text-white text-lg font-black flex items-center gap-3 section-title">
                <div className="bg-white/20 p-1.5 rounded-lg no-print"><GraduationCap className="w-5 h-5" /></div>
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
                        <TableCell className="px-8 font-medium text-slate-700">
                          {isEditMode ? (
                            <Input 
                              value={row.kelayakan} 
                              onChange={(e) => {
                                const newKelulusan = (kelulusan as any[]).map(k => k.id === row.id ? {...k, kelayakan: e.target.value} : k);
                                updateCurrentTeacher({ kelulusan: newKelulusan });
                              }}
                              className="h-12 sm:h-8 rounded-lg text-base"

                            />
                          ) : row.kelayakan}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {isEditMode ? (
                            <Input 
                              value={row.institusi} 
                              onChange={(e) => {
                                const newKelulusan = (kelulusan as any[]).map(k => k.id === row.id ? {...k, institusi: e.target.value} : k);
                                updateCurrentTeacher({ kelulusan: newKelulusan });
                              }}
                              className="h-12 sm:h-8 rounded-lg text-base"

                            />
                          ) : row.institusi}
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">
                          {isEditMode ? (
                            <Input 
                              value={row.bidang} 
                              onChange={(e) => {
                                const newKelulusan = (kelulusan as any[]).map(k => k.id === row.id ? {...k, bidang: e.target.value} : k);
                                updateCurrentTeacher({ kelulusan: newKelulusan });
                              }}
                              className="h-12 sm:h-8 rounded-lg text-base"

                            />
                          ) : row.bidang}
                        </TableCell>
                        <TableCell className="font-medium text-[#002B5B]">
                          {isEditMode ? (
                            <Input 
                              value={row.tahun} 
                              onChange={(e) => {
                                const newKelulusan = (kelulusan as any[]).map(k => k.id === row.id ? {...k, tahun: e.target.value} : k);
                                updateCurrentTeacher({ kelulusan: newKelulusan });
                              }}
                              className="h-12 sm:h-8 rounded-lg w-full sm:w-20 text-base"

                            />
                          ) : row.tahun}
                        </TableCell>
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
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white card-print">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center print:bg-transparent print:px-0 print:py-0">
              <h2 className="text-white text-lg font-black flex items-center gap-3 section-title">
                <div className="bg-white/20 p-1.5 rounded-lg no-print"><BookOpen className="w-5 h-5" /></div>
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
                        <TableCell className="font-medium text-slate-700">
                          {isEditMode ? (
                            <Input 
                              value={row.nama} 
                              onChange={(e) => {
                                const newSubjek = (subjek as any[]).map(s => s.id === row.id ? {...s, nama: e.target.value} : s);
                                updateCurrentTeacher({ subjek: newSubjek });
                              }}
                              className="h-8 rounded-lg"
                            />
                          ) : row.nama}
                        </TableCell>
                        <TableCell className="font-medium text-slate-500">
                          {isEditMode ? (
                            <Input 
                              value={row.kelas} 
                              onChange={(e) => {
                                const newSubjek = (subjek as any[]).map(s => s.id === row.id ? {...s, kelas: e.target.value} : s);
                                updateCurrentTeacher({ subjek: newSubjek });
                              }}
                              className="h-12 sm:h-8 rounded-lg text-base"

                            />
                          ) : row.kelas}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700">
                          {isEditMode ? (
                            <Input 
                              value={row.murid} 
                              onChange={(e) => {
                                const newSubjek = (subjek as any[]).map(s => s.id === row.id ? {...s, murid: e.target.value} : s);
                                updateCurrentTeacher({ subjek: newSubjek });
                              }}
                              className="h-12 sm:h-8 rounded-lg w-full sm:w-20 text-base"
                            />
                          ) : (row.murid || "-")}
                        </TableCell>
                        <TableCell className="text-center">
                          {isEditMode ? (
                            <Input 
                              value={row.tov} 
                              onChange={(e) => {
                                const newSubjek = (subjek as any[]).map(s => s.id === row.id ? {...s, tov: e.target.value} : s);
                                updateCurrentTeacher({ subjek: newSubjek });
                              }}
                              className="h-12 sm:h-8 rounded-lg w-full sm:w-16 mx-auto text-center text-base"

                            />
                          ) : (
                            <span className="px-2 py-1 bg-blue-50 text-[#002B5B] rounded-lg text-xs font-black">{row.tov || "-"}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isEditMode ? (
                            <Input 
                              value={row.etr} 
                              onChange={(e) => {
                                const newSubjek = (subjek as any[]).map(s => s.id === row.id ? {...s, etr: e.target.value} : s);
                                updateCurrentTeacher({ subjek: newSubjek });
                              }}
                              className="h-12 sm:h-8 rounded-lg w-full sm:w-16 mx-auto text-center text-base"
                            />
                          ) : (
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black">{row.etr || "-"}</span>
                          )}
                        </TableCell>
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
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white card-print">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center print:bg-transparent print:px-0 print:py-0">
              <h2 className="text-white text-lg font-black flex items-center gap-3 section-title">
                <div className="bg-white/20 p-1.5 rounded-lg no-print"><Clock className="w-5 h-5" /></div>
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
                    ) : (sejarah as any[]).map((row) => (
                      <TableRow key={row.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 py-4">
                          {isEditMode ? (
                            <Input 
                              value={row.sekolah} 
                              onChange={(e) => {
                                const newSejarah = (sejarah as any[]).map(s => s.id === row.id ? {...s, sekolah: e.target.value} : s);
                                updateCurrentTeacher({ sejarah: newSejarah });
                              }}
                              className="h-12 sm:h-8 rounded-lg text-base"

                            />
                          ) : (
                            <p className="font-medium text-slate-700">{row.sekolah}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isEditMode ? (
                            <Input 
                              value={row.tahun} 
                              onChange={(e) => {
                                const newSejarah = (sejarah as any[]).map(s => s.id === row.id ? {...s, tahun: e.target.value} : s);
                                updateCurrentTeacher({ sejarah: newSejarah });
                              }}
                              className="h-12 sm:h-8 rounded-lg w-full sm:w-24 mx-auto text-base"
                            />
                          ) : (
                            <span className="px-3 py-1 bg-[#002B5B] text-white rounded-full text-[10px] font-black">{row.tahun}</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-slate-600">
                          {isEditMode ? (
                            <Input 
                              value={row.subjek} 
                              onChange={(e) => {
                                const newSejarah = (sejarah as any[]).map(s => s.id === row.id ? {...s, subjek: e.target.value} : s);
                                updateCurrentTeacher({ sejarah: newSejarah });
                              }}
                              className="h-12 sm:h-8 rounded-lg text-base"

                            />
                          ) : row.subjek}
                        </TableCell>
                        {isEditMode && (
                          <TableCell className="no-print pr-8 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateCurrentTeacher({ sejarah: sejarah.filter((s: any) => s.id !== row.id) })}
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
        </div>

        {/* SIGNATURE SECTION */}
        <div className="grid md:grid-cols-2 gap-12 py-16 px-8 bg-white rounded-3xl shadow-lg border-t-4 border-[#002B5B] relative overflow-hidden signature-grid print:py-0 print:px-0 print:border-none print:shadow-none print:grid-cols-2">

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-black text-[#002B5B] uppercase tracking-widest text-xs info-label">Tandatangan Guru</p>
                <div className="no-print flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearSignature}
                    className="h-8 px-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold"
                  >
                    <Eraser className="w-3 h-3 mr-1" /> Padam
                  </Button>
                </div>
              </div>
              
              <div className="relative bg-slate-50/50 rounded-2xl border-2 border-slate-100 border-dashed overflow-hidden group print:bg-transparent print:border-none print:mt-10">
                <canvas 
                  ref={canvasRef}
                  width={800}
                  height={250}

                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[250px] cursor-crosshair touch-none bg-white/50 print:bg-transparent print:h-[150px]"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <p className="text-slate-400 text-sm font-medium italic">Sila tandatangan di sini...</p>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[#002B5B] text-white text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
                    Digital Signature Active
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 print:flex-row print:justify-between">
                <div className="flex-1 border-b border-slate-100 pb-1 sig-box">
                  Nama: <span className="text-[#002B5B] ml-2 font-medium">{(currentTeacher?.profile as any)?.nama || "________________________"}</span>
                </div>
                <div className="w-full sm:w-32 border-b border-slate-100 pb-1">
                  Tarikh: <span className="text-[#002B5B] ml-2">{new Date().toLocaleDateString('ms-MY')}</span>
                </div>
              </div>
            </div>
          </div>
          {isAdminMode && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="space-y-4">
                <p className="font-black text-[#002B5B] uppercase tracking-widest text-xs info-label">Disahkan Oleh</p>
                <div className="h-[150px] w-full border-2 border-slate-100 border-dashed rounded-2xl bg-slate-50/30 flex items-center justify-center print:border-none print:mt-10">
                  <p className="text-slate-300 text-[10px] uppercase font-bold tracking-widest">Ruang Cap Rasmi</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sig-box">Cap dan Tandatangan Pengetua / Guru Besar</p>
              </div>
            </div>
          )}

        </div>


        {/* FOOTER */}
        <footer className="no-print text-center py-12 space-y-2">
          <p className="text-[#002B5B] font-black text-sm">Profile Guru SMK Sultan Ahmad Shah © 2026</p>
          <p className="text-slate-400 text-xs font-medium">Maklumat ini adalah untuk kegunaan rasmi sekolah sahaja.</p>
        </footer>

      </div>

      {/* PRINT PREVIEW MODAL */}
      {showPrintPreview && (
        <div className="print-preview-modal no-print animate-in fade-in duration-300">
          <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 bg-[#002B5B] p-4 rounded-2xl shadow-2xl">
            <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
              Pratonton Cetak A4
            </h2>
            <div className="flex gap-3">
              <Button 
                onClick={handlePrint}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-bold rounded-xl px-6"
              >
                <Printer className="w-4 h-4 mr-2" /> Sah & Cetak / PDF
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setShowPrintPreview(false)}
                className="text-white hover:bg-white/10 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="print-preview-content animate-in zoom-in-95 duration-500 shadow-2xl rounded-sm">
             <PrintLayout currentTeacher={currentTeacher} isAdminMode={isAdminMode} />
          </div>

        </div>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

