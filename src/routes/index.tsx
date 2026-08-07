// @ts-nocheck
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
  MapPin,
  History,
  PenTool
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { importEOperasiData } from "@/lib/eoperasi.functions";
import { useServerFn } from "@tanstack/react-start";

// Constants for Storage
const STORAGE_BUCKET = 'teacher-assets';



// SSPA Grade Constants
const SSPA_GRADES = ["DG9", "DG10", "DG11", "DG12", "DG13", "DG14"];

// Malaysian States
const MALAYSIAN_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", 
  "Perak", "Perlis", "Pulau Pinang", "Sabah", "Sarawak", "Selangor", 
  "Terengganu", "Wilayah Persekutuan Kuala Lumpur", 
  "Wilayah Persekutuan Labuan", "Wilayah Persekutuan Putrajaya"
];

const PRINT_STYLES = `
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  @media screen {
    .print-only {
      display: none !important;
    }
  }

  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-shadow: none !important;
      text-shadow: none !important;
      border-radius: 0 !important;
      background-image: none !important;
      background-color: transparent !important;
    }

    html, body, #root, [data-reactroot] {
      background: #ffffff !important;
      background-color: #ffffff !important;
      color: black !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    body {
      font-family: 'Arial', sans-serif !important;
      font-size: 10pt !important;
      line-height: 1.2 !important;
    }


    /* Hide everything by default during print */
    #root > div:not(.print-only),
    .no-print,
    .no-print-section,
    .dashboard-container,
    header,
    footer,
    nav,
    aside,
    button,
    .badge,
    [role="button"],
    .print-preview-modal > div:not(.print-preview-content) {
      display: none !important;
    }

    /* Show only the print layout */
    .print-only {
      display: block !important;
      width: 100% !important;
      background: #ffffff !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .print-layout-container {
      padding: 0 !important;
      margin: 0 !important;
      background: #ffffff !important;
      width: 100% !important;
      min-height: auto !important;
      box-shadow: none !important;
    }

    .print-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      border-bottom: 1.5pt solid black !important;
      padding-bottom: 3mm !important;
      margin-bottom: 4mm !important;
      background: #ffffff !important;
    }

    .print-photo {
      width: 30mm !important;
      height: 38mm !important;
      border: 0.5pt solid #000 !important;
      object-fit: cover !important;
      background: #ffffff !important;
    }

    .section-title {
      font-size: 11pt !important;
      font-weight: bold !important;
      text-transform: uppercase !important;
      color: black !important;
      background-color: transparent !important;
      border-top: 1pt solid black !important;
      border-bottom: 1pt solid black !important;
      padding: 1.5mm 0 !important;
      margin: 6mm 0 3mm 0 !important;
      display: block !important;
      width: 100% !important;
      page-break-after: avoid !important;
    }


    .info-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 1.5mm 6mm !important;
      margin-bottom: 2mm !important;
      background: #ffffff !important;
    }

    .info-item {
      display: flex !important;
      flex-direction: row !important;
      align-items: baseline !important;
      gap: 2mm !important;
      background: #ffffff !important;
    }

    .info-label {
      font-size: 8.5pt !important;
      color: black !important;
      text-transform: uppercase !important;
      font-weight: bold !important;
      min-width: 35mm !important;
      flex-shrink: 0 !important;
    }

    .info-label::after {
      content: ":" !important;
    }

    .info-value {
      font-size: 9pt !important;
      font-weight: normal !important;
      color: black !important;
    }

    table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-top: 0 !important;
      margin-bottom: 4mm !important;
      table-layout: fixed !important;
      page-break-inside: auto !important;
      background: #ffffff !important;
    }

    thead {
      display: table-header-group !important;
    }

    tr {
      page-break-inside: avoid !important;
      page-break-after: auto !important;
      background: #ffffff !important;
    }

    th {
      background: transparent !important;
      font-size: 9pt !important;
      text-transform: uppercase !important;
      padding: 1.5mm 2mm !important;
      border: 0.5pt solid #000 !important;
      text-align: left !important;
      font-weight: bold !important;
      color: black !important;
    }

    td {
      padding: 1.5mm 2mm !important;
      border: 0.5pt solid #000 !important;
      font-size: 9pt !important;
      vertical-align: top !important;
      color: black !important;
      overflow-wrap: break-word !important;
      background: transparent !important;
    }


    .signature-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 15mm !important;
      margin-top: 8mm !important;
      page-break-inside: avoid !important;
      width: 100% !important;
      background: #ffffff !important;
    }

    .sig-column {
      display: flex !important;
      flex-direction: column !important;
      width: 100% !important;
      background: #ffffff !important;
    }

    .sig-label {
      font-size: 9pt !important;
      font-weight: bold !important;
      text-transform: uppercase !important;
      margin-bottom: 2mm !important;
      color: black !important;
    }

    .sig-space {
      min-height: 15mm !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-end !important;
      align-items: center !important;
      width: 100% !important;
      background: #ffffff !important;
    }

    .sig-image {
      max-height: 12mm !important;
      object-fit: contain !important;
      margin-bottom: 1mm !important;
      background: transparent !important;
    }

    .sig-line {
      width: 100% !important;
      border-top: 0.5pt solid black !important;
      margin-top: 1mm !important;
      padding-top: 1mm !important;
    }

    .sig-name {
      font-size: 8.5pt !important;
      font-weight: bold !important;
      text-align: left !important;
      width: 100% !important;
    }

    /* Remove UI elements and backgrounds from all components during print */
    .card, .rounded-3xl, .rounded-xl, .bg-[#002B5B], .shadow-lg, .shadow-md, .shadow-xl, .bg-slate-50, .bg-slate-50\/50, .bg-emerald-600, .bg-[#D4AF37], .bg-blue-500\/20 {
      border-radius: 0 !important;
      background: #ffffff !important;
      background-color: #ffffff !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      color: black !important;
    }


    /* Force plain white background for the specific signature modal elements if they leak */
    .signature-pad-container, .bg-slate-50, .border-slate-100, .bg-white\/10, .bg-black\/20 {
      background: #ffffff !important;
      background-color: #ffffff !important;
      border-color: black !important;
    }

  }

  /* Print Preview Styles */
  .print-preview-modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    overflow-y: auto;
  }

  .print-preview-content {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 10mm;
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
    margin-bottom: 2rem;
    color: black;
    font-family: 'Arial', sans-serif;
  }

  /* Apply print rules to preview */
  .print-preview-content .section-title {
    font-size: 10pt;
    font-weight: bold;
    text-transform: uppercase;
    color: black;
    background-color: #f3f4f6;
    border-top: 0.5pt solid black;
    border-bottom: 0.5pt solid black;
    padding: 1.5mm 2mm;
    margin: 4mm 0 2mm 0;
    display: block;
  }

  .print-preview-content table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4mm;
  }

  .print-preview-content th {
    background: #f3f4f6;
    font-size: 8.5pt;
    padding: 1.5mm 2mm;
    border: 0.5pt solid black;
    text-align: left;
  }

  .print-preview-content td {
    padding: 1.5mm 2mm;
    border: 0.5pt solid black;
    font-size: 9pt;
  }
`;


// Reusable Print Layout Component to ensure "pratonton" and "cetak" match perfectly
import schoolLogoAsset from "@/assets/school-logo.png.asset.json";

const PrintLayout = ({ currentTeacher, isAdminMode, schoolLogo }: { currentTeacher: any, isAdminMode: boolean, schoolLogo: string | null }) => {

  if (!currentTeacher) return null;
  const profile = currentTeacher.profile || {};
  
  // School logo logic: use uploaded logo first, then asset
  const displayedLogo = schoolLogo || schoolLogoAsset.url;
  
  return (
    <div className="print-layout-container">
      {/* Header */}
      <div className="print-header flex items-center justify-between border-b-2 border-black pb-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white flex items-center justify-center p-0 overflow-hidden">
             <img src={displayedLogo} alt="Logo Sekolah" className="w-full h-full object-contain" />
          </div>

          <div>
            <h1 className="text-xl font-black text-black uppercase leading-tight">Profile Guru</h1>
            <p className="text-base font-bold text-black uppercase leading-tight">SMK SULTAN AHMAD SHAH</p>
            <p className="text-sm font-bold text-black uppercase leading-tight">CAMERON HIGHLANDS</p>
          </div>
        </div>

        <div className="print-photo-container">
          {currentTeacher.profileImage ? (
            <img 
              src={currentTeacher.profileImage} 
              alt="Profil" 
              className="print-photo w-[30mm] h-[38mm] border border-black object-cover"
            />
          ) : (
            <div className="w-[30mm] h-[38mm] border border-black flex items-center justify-center bg-white text-[8pt] text-black text-center px-4">
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
      <div className="info-grid mt-1">
        <div className="info-item">
          <span className="info-label">Alamat Kediaman</span>
          <span className="info-value">{(profile as any)?.alamat || "-"}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Jawatan</span>
          <span className="info-value">{(profile as any)?.sekolah?.jawatan || "-"}</span>
        </div>
      </div>


      {/* Academic */}
      <span className="section-title">Kelulusan Akademik dan Ikhtisas</span>
      <table>
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Kelulusan</th>
            <th style={{ width: '35%' }}>Bidang / Pengkhususan</th>
            <th style={{ width: '30%' }}>Institusi / Universiti</th>
            <th style={{ width: '10%' }}>Tahun</th>
          </tr>
        </thead>
        <tbody>
          {currentTeacher.kelulusan && (currentTeacher.kelulusan as any[]).length > 0 ? (
            (currentTeacher.kelulusan as any[]).map((row: any) => (
              <tr key={row.id}>
                <td>{row.kelayakan}</td>
                <td>{row.bidang}</td>
                <td>{row.institusi}</td>
                <td>{row.tahun}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center italic text-slate-400">Tiada rekod kelulusan akademik</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Subjects */}
      <span className="section-title">Subjek yang Diajar</span>
      <table>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Subjek</th>
            <th style={{ width: '30%' }}>Tahun / Tingkatan</th>
            <th style={{ width: '30%' }}>Bil. Murid</th>
          </tr>
        </thead>
        <tbody>
          {currentTeacher.subjek && (currentTeacher.subjek as any[]).length > 0 ? (
            (currentTeacher.subjek as any[]).map((row: any) => (
              <tr key={row.id}>
                <td>{row.nama}</td>
                <td>{row.kelas}</td>
                <td>{row.murid}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center italic text-slate-400">Tiada rekod subjek diajar</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Service History */}
      <span className="section-title">Sejarah Perkhidmatan</span>
      <table>
        <thead>
          <tr>
            <th style={{ width: '60%' }}>Nama dan Alamat Sekolah</th>
            <th style={{ width: '15%' }}>Tahun</th>
            <th style={{ width: '25%' }}>Subjek yang Diajar</th>
          </tr>
        </thead>
        <tbody>
          {currentTeacher.sejarah && (currentTeacher.sejarah as any[]).length > 0 ? (
            (currentTeacher.sejarah as any[]).map((row: any) => (
              <tr key={row.id}>
                <td>{row.sekolah}</td>
                <td>{row.tahun}</td>
                <td>{row.subjek}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center italic text-slate-400">Tiada rekod sejarah perkhidmatan</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Signatures */}
      <div className="signature-grid">
        <div className="sig-column">
          <span className="sig-label">TANDATANGAN GURU:</span>
          <div className="sig-space">
            {currentTeacher.signatureUrl ? (
              <img src={currentTeacher.signatureUrl} alt="Tandatangan" className="sig-image" />
            ) : (
              <span className="text-[7pt] text-slate-400 italic mb-4">(Belum ditandatangani)</span>
            )}
            <div className="sig-line">
              <span className="sig-name">NAMA: {(profile as any)?.nama}</span>
            </div>
          </div>
        </div>
        <div className="sig-column">
        </div>
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
    title: "BIODATA GURU SMKSAS",
    meta: [
      { name: "description", content: "Portal Rasmi Biodata Guru - SMK Sultan Ahmad Shah" },
      { property: "og:title", content: "BIODATA GURU SMKSAS" },
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
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('school_logo');
      if (savedLogo) setSchoolLogo(savedLogo);
    }
  }, []);
  const schoolLogoInputRef = useRef<HTMLInputElement>(null);

  
  // Teachers state for multi-profile support
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    const initSession = async () => {
      // Check real Supabase Auth session first
      const { data: { session: supabaseSession } } = await supabase.auth.getSession();
      
      if (supabaseSession) {
        setSession(supabaseSession);
        // If we have a real session, we might want to fetch by owner_id or IC
        // For now, prioritize IC as requested in previous turns
        const userIc = supabaseSession.user.user_metadata?.ic || localStorage.getItem('guru_ic_session');
        if (userIc) {
          fetchTeachersByIc(userIc);
          if (userIc === SUPERADMIN_IC) {
            setIsAdminMode(true);
            setShowAdminDashboard(true);
          }
        } else {
          setIsLoading(false);
        }
      } else {
        // Fallback to pseudo-session for IC login
        const savedIc = localStorage.getItem('guru_ic_session');
        if (savedIc) {
          setSession({ user: { ic: savedIc, id: 'pseudo-user' } });
          fetchTeachersByIc(savedIc);
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
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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
        profileImage: t.profile_image_url || t.profile_image,
        signatureUrl: t.signature_url,
        schoolLogoUrl: t.school_logo_url,
      }));
      setTeachers(mappedData);
      
      // Auto-set school logo from profile if available
      const firstWithLogo = mappedData.find(t => (t.profile as any)?.schoolLogo || t.school_logo_url);
      if (firstWithLogo) {
        setSchoolLogo(firstWithLogo.school_logo_url || (firstWithLogo.profile as any).schoolLogo);
      }

      
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
    const cleanIc = icInput.trim().replace(/[-\s]/g, "");
    
    if (!cleanIc) {
      toast.error("Sila masukkan nombor kad pengenalan.");
      return;
    }

    if (cleanIc.length !== 12) {
      toast.error("No. kad pengenalan mestilah 12 digit tanpa tanda sempang.");
      return;
    }

    setIsLoggingIn(true);
    console.log("Memulakan proses log masuk untuk IC:", cleanIc);

    // Validate if the IC exists in SAS_TEACHERS softcoded list
    const sasTeacher = SAS_TEACHERS.find(t => t.kp === cleanIc);
    
    if (!sasTeacher && cleanIc !== SUPERADMIN_IC) {
      toast.error("Profil guru tidak ditemui.");
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
          
          if (cleanIc !== SUPERADMIN_IC && firstTeacher) {
             setActiveTeacherId(firstTeacher.id);
             setIsEditMode(false);
          }
        } else {
          if (cleanIc !== SUPERADMIN_IC) {
            toast.info("Menjana profil baru anda...", { duration: 2000 });
            await handleAutoCreateTeacher(cleanIc, sasTeacher);
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
        nama: (sasTeacher?.nama || "").toUpperCase(),
        kp: ic || "",
        tel: "01X-XXXXXXX",
        email: `${(sasTeacher?.nama || 'guru').toLowerCase().replace(/\s+/g, '.')}@moe-dl.edu.my`,
        pengalaman: "10 TAHUN",
        tempohSemasa: "5 TAHUN",
        tarikhMula: "01/01/2015",
        opsyen: "SEJARAH",
        gred: "DG44",
        mengajarOpsyen: "YA",
        alamat: "KUWATERS GURU, TANAH RATA",
        sekolah: {
          nama: "SMK SULTAN AHMAD SHAH",
          alamat: "PERSIARAN DAYANG ENDAH",
          poskod: "39000",
          daerah: "TANAH RATA",
          negeri: "PAHANG",
          kod: "CEB1003",
          tel: "05-4911018",
          faks: "05-4914922",
          jawatan: (sasTeacher?.jabatan || "GURU").toUpperCase(),
          guruKhas: "TIADA",
          pemeriksaSPM: "TIDAK",
          lain: "-"
        }
      },
      kelulusan: [
        { id: 1, kelayakan: "SARJANA MUDA PENDIDIKAN", institusi: "UPSI", bidang: "SEJARAH", tahun: "2014" }
      ],
      subjek: [
        { id: 1, nama: "SEJARAH", kelas: "5 DELTA", murid: "30" }
      ],
      sejarah: [
        { id: 1, sekolah: "SMK SULTAN AHMAD SHAH", tahun: "2015-2026", subjek: "SEJARAH" }
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
        nama: name.toUpperCase(),
        kp: ic,
        tel: "01X-XXXXXXX",
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@moe-dl.edu.my`,
        pengalaman: "10 TAHUN",
        tempohSemasa: "5 TAHUN",
        tarikhMula: "01/01/2015",
        opsyen: "SEJARAH",
        gred: "",
        mengajarOpsyen: "YA",
        alamat: "KUWATERS GURU, TANAH RATA",
        sekolah: {
          nama: "SMK SULTAN AHMAD SHAH",
          alamat: "PERSIARAN DAYANG ENDAH",
          poskod: "39000",
          daerah: "TANAH RATA",
          negeri: "PAHANG",
          kod: "CEB1003",
          tel: "05-4911018",
          faks: "05-4914922",
          jawatan: jabatan.toUpperCase(),
          guruKhas: "TIADA",
          pemeriksaSPM: "TIDAK",
          lain: "-"
        }
      },
      kelulusan: [
        { id: 1, kelayakan: "SARJANA MUDA PENDIDIKAN", institusi: "UPSI", bidang: "SEJARAH", tahun: "2014" }
      ],
      subjek: [
        { id: 1, nama: "SEJARAH", kelas: "5 DELTA", murid: "30" }
      ],
      sejarah: [
        { id: 1, sekolah: "SMK SULTAN AHMAD SHAH", tahun: "2015-2026", subjek: "SEJARAH" }
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
  const eOperasiInputRef = useRef<HTMLInputElement>(null);
  const importEOperasi = useServerFn(importEOperasiData);
  const [isImporting, setIsImporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [pendingLogo, setPendingLogo] = useState<string | null>(null);
  const [showLogoConfirmation, setShowLogoConfirmation] = useState(false);

  const handleEOperasiImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Sila muat naik fail PDF sahaja.");
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const importedData = await importEOperasi({
          data: {
            fileBase64: base64,
            fileName: file.name
          }
        });


        if (importedData && currentTeacher) {
          // Merge imported data with current teacher
          const updatedTeacher = {
            ...currentTeacher,
            profile: {
              ...currentTeacher.profile,
              ...importedData.profile,
              // Ensure we don't overwrite crucial metadata
              kp: currentTeacher.profile.kp, 
            },
            kelulusan: (importedData.kelulusan && importedData.kelulusan.length > 0) ? [...currentTeacher.kelulusan, ...importedData.kelulusan] : currentTeacher.kelulusan,
            sejarah: (importedData.sejarah && importedData.sejarah.length > 0) ? [...currentTeacher.sejarah, ...importedData.sejarah] : currentTeacher.sejarah,
          };

          // Update state
          setTeachers(prev => prev.map(t => t.id === currentTeacher.id ? updatedTeacher : t));
          setIsEditMode(true);
          toast.success("Data eOperasi berjaya diimport! Sila semak dan simpan.");
        }
      } catch (err: any) {
        console.error("Import error:", err);
        const errorMessage = err.message || "Gagal mengimport data.";
        toast.error(`${errorMessage} Sila pastikan fail PDF adalah betul.`);
      } finally {
        setIsImporting(false);
      }
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };


  
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
        nama: (sasTeacher?.nama || "").toUpperCase(),
        kp: ic || "",
        tel: "01X-XXXXXXX",
        email: `${(sasTeacher?.nama || 'guru').toLowerCase().replace(/\s+/g, '.')}@moe-dl.edu.my`,
        pengalaman: "10 TAHUN",
        tempohSemasa: "5 TAHUN",
        tarikhMula: "01/01/2015",
        opsyen: "SEJARAH",
        gred: "",
        mengajarOpsyen: "YA",
        alamat: "KUWATERS GURU, TANAH RATA",
        sekolah: {
          nama: "SMK SULTAN AHMAD SHAH",
          alamat: "PERSIARAN DAYANG ENDAH",
          poskod: "39000",
          daerah: "TANAH RATA",
          negeri: "PAHANG",
          kod: "CEB1003",
          tel: "05-4911018",
          faks: "05-4914922",
          jawatan: (sasTeacher?.jabatan || "GURU").toUpperCase(),
          guruKhas: "TIADA",
          pemeriksaSPM: "TIDAK",
          lain: "-"
        }
      },
      kelulusan: [
        { id: 1, kelayakan: "SARJANA MUDA PENDIDIKAN", institusi: "UPSI", bidang: "SEJARAH", tahun: "2014" }
      ],
      subjek: [
        { id: 1, nama: "SEJARAH", kelas: "5 DELTA", murid: "30" }
      ],
      sejarah: [
        { id: 1, sekolah: "SMK SULTAN AHMAD SHAH", tahun: "2015-2026", subjek: "SEJARAH" }
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
    
    // Auto-uppercase function
    const toUpper = (val: any) => {
      if (typeof val === 'string') return val.toLocaleUpperCase("ms-MY");
      return val;
    };

    // Auto-uppercase string values in profile
    if (updates.profile) {
      const p = updates.profile;
      const exclude = ['email', 'kp']; // Only exclude email from uppercase, and IC (technical)
      Object.keys(p).forEach(k => {
        if (typeof p[k] === 'string' && !exclude.includes(k)) {
          p[k] = toUpper(p[k]);
        }
        if (k === 'sekolah' && typeof p[k] === 'object') {
          const s = p[k];
          Object.keys(s).forEach(sk => {
            if (typeof s[sk] === 'string') {
              s[sk] = toUpper(s[sk]);
            }
          });
        }
        // Handle nested arrays in profile if any
        if (Array.isArray(p[k])) {
          p[k] = p[k].map((item: any) => {
            if (typeof item === 'object') {
              const newItem = { ...item };
              Object.keys(newItem).forEach(ik => {
                if (typeof newItem[ik] === 'string') newItem[ik] = toUpper(newItem[ik]);
              });
              return newItem;
            }
            return toUpper(item);
          });
        }
      });
    }

    // Auto-uppercase arrays
    if (updates.kelulusan) {
      updates.kelulusan = updates.kelulusan.map((k: any) => {
        const nk = { ...k };
        Object.keys(nk).forEach(field => {
          if (typeof nk[field] === 'string') nk[field] = toUpper(nk[field]);
        });
        return nk;
      });
    }

    if (updates.subjek) {
      updates.subjek = updates.subjek.map((s: any) => {
        const ns = { ...s };
        Object.keys(ns).forEach(field => {
          if (typeof ns[field] === 'string') ns[field] = toUpper(ns[field]);
        });
        return ns;
      });
    }

    if (updates.sejarah) {
      updates.sejarah = updates.sejarah.map((s: any) => {
        const ns = { ...s };
        Object.keys(ns).forEach(field => {
          if (typeof ns[field] === 'string') ns[field] = toUpper(ns[field]);
        });
        return ns;
      });
    }

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
    toast.info("Sedang menyimpan maklumat...");

    // Check if we have unsaved canvas signature
    let finalSignatureUrl = currentTeacher.signatureUrl;
    if (hasSignature && canvasRef.current) {
      try {
        const signatureBase64 = canvasRef.current.toDataURL('image/png');
        const blob = await (await fetch(signatureBase64)).blob();
        const fileName = `${session?.user?.id || 'anonymous'}/${activeTeacherId}/signature_${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, blob, { upsert: true });

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(uploadData.path);
        
        finalSignatureUrl = publicUrl;
      } catch (err) {
        console.error("Error saving signature:", err);
        toast.error("Gagal menyimpan tandatangan.");
      }
    }

    const { error } = await supabase
      .from('teachers')
      .update({
        profile: currentTeacher.profile,
        kelulusan: currentTeacher.kelulusan,
        subjek: currentTeacher.subjek,
        sejarah: currentTeacher.sejarah,
        profile_image_url: currentTeacher.profileImage, // Now stores URL
        signature_url: finalSignatureUrl,
        school_logo_url: schoolLogo,
        ic_number: (currentTeacher.profile as any)?.kp
      })
      .eq('id', activeTeacherId);

    setIsSaving(false);
    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      console.error(error);
    } else {
      setIsEditMode(false);
      localStorage.removeItem('guru_profile_draft');
      toast.success("Maklumat telah berjaya disimpan kekal.");
      // Refresh current teacher state with new URLs
      updateCurrentTeacher({ signatureUrl: finalSignatureUrl });
    }
  };

  useEffect(() => {
    if (isEditMode && activeTeacherId) {
      localStorage.setItem('guru_profile_draft', JSON.stringify({ id: activeTeacherId, timestamp: new Date().getTime() }));
    }
  }, [isEditMode, activeTeacherId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeTeacherId) {
      try {
        setIsSaving(true);
        toast.info("Sedang memuat naik gambar...");
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${session?.user?.id || 'anonymous'}/${activeTeacherId}/profile_${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(data.path);

        updateCurrentTeacher({ profileImage: publicUrl });
        toast.success("Gambar profil berjaya dimuat naik.");
      } catch (err: any) {
        console.error("Upload error:", err);
        toast.error(`Gagal memuat naik gambar: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
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

  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPendingLogo(event.target?.result as string);
        setShowLogoConfirmation(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmLogoUpload = async () => {
    if (!pendingLogo) return;
    
    try {
      setIsSaving(true);
      toast.info("Sedang memuat naik logo sekolah...");
      
      // Convert base64 to blob for storage upload
      const response = await fetch(pendingLogo);
      const blob = await response.blob();
      
      const fileExt = "png"; // Standardize or extract from original if needed
      const fileName = `${session?.user?.id || 'anonymous'}/school_logo_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, blob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);

      setSchoolLogo(publicUrl);
      localStorage.setItem('school_logo', publicUrl);
      toast.success("Logo sekolah telah berjaya dikemaskini di seluruh aplikasi.");
      setShowLogoConfirmation(false);
      setPendingLogo(null);
    } catch (err: any) {
      console.error("Logo upload error:", err);
      toast.error(`Gagal memuat naik logo: ${err.message}`);
    } finally {
      setIsSaving(false);
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center p-0"
            >
              <Settings className={`w-4 h-4 ${showSettings ? 'text-[#002B5B]' : 'text-slate-300'}`} />
            </Button>
          </div>

          <div 
            className="w-20 h-20 bg-white border-2 border-[#002B5B]/10 rounded-2xl mx-auto flex items-center justify-center p-2 shadow-xl transform rotate-3 overflow-hidden cursor-pointer hover:rotate-0 transition-transform"
            onClick={() => schoolLogoInputRef.current?.click()}
          >
             <img src={schoolLogo || schoolLogoAsset.url} alt="Logo Sekolah" className="w-full h-full object-contain" />
          </div>
          <input 
            type="file" 
            ref={schoolLogoInputRef} 
            onChange={handleSchoolLogoUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {showSettings && (
            <div className="bg-slate-50 p-4 rounded-2xl text-left animate-in slide-in-from-top-2 duration-300">
              <Label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Tetapan Portal</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs font-bold rounded-xl h-9 border-slate-200"
                onClick={() => {
                  console.log("Setting logo input click");
                  schoolLogoInputRef.current?.click();
                }}
              >
                <ImageIcon className="w-3.5 h-3.5 mr-2 text-blue-500" />
                Muat Naik Logo Sekolah
              </Button>
            </div>
          )}
          
          <input 
            type="file" 
            ref={schoolLogoInputRef} 
            onChange={handleSchoolLogoUpload} 
            accept="image/*" 
            className="hidden" 
            style={{ display: 'none' }}
          />

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
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-6 sm:p-10 text-center space-y-6 sm:space-y-8 bg-white animate-in zoom-in duration-500">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-4 border-[#002B5B]/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl transform rotate-3 transition-transform hover:rotate-0 overflow-hidden">
             <img src={schoolLogo || schoolLogoAsset.url} alt="Logo Sekolah" className="w-full h-full object-contain p-2" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-[#002B5B] tracking-tight uppercase">Profile Guru</h1>
            <p className="text-lg font-bold text-[#002B5B] uppercase">SMK Sultan Ahmad Shah</p>
            <div className="pt-2">
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                Sila masukkan No. Kad Pengenalan anda untuk mengakses profil.
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-2">
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
                  onChange={(e) => setIcInput(e.target.value.replace(/[^0-9]/g, ""))}
                  onKeyDown={(e) => e.key === 'Enter' && handleIcLogin()}
                  maxLength={12}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                  <User className="w-6 h-6 text-[#002B5B]" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleIcLogin} 
                disabled={isLoggingIn}
                className="w-full h-14 sm:h-16 bg-[#002B5B] hover:bg-[#003B7B] rounded-[1.25rem] text-lg sm:text-xl font-black shadow-xl shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Masuk Profil
                  </>
                )}
              </Button>
              
              <div className="flex justify-center">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 py-2.5 px-5 rounded-xl border border-slate-100/50">
                  Tanpa tanda sempang <span className="text-[#002B5B] font-black mx-1">(-)</span>
                </p>
              </div>
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
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-4 border-[#002B5B]/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl transform rotate-3 overflow-hidden">
             <img src={schoolLogo || schoolLogoAsset.url} alt="Logo Sekolah" className="w-full h-full object-contain p-2" />
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center p-2 shadow-inner transform -rotate-3 transition-transform hover:rotate-0 overflow-hidden">
                   <img src={schoolLogo || schoolLogoAsset.url} alt="Logo Sekolah" className="w-full h-full object-contain" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">Dashboard Admin</h1>
                  <p className="text-blue-100/70 font-bold text-sm sm:text-base mt-1">Pengurusan Panitia Guru 2026</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full md:w-auto">
                <Button 
                  onClick={() => {
                    console.log("Admin logo button click");
                    schoolLogoInputRef.current?.click();
                  }}
                  className="h-12 sm:h-14 px-6 bg-white/10 text-white border-white/20 hover:bg-white/20 font-black rounded-2xl shadow-lg border transition-all text-sm uppercase tracking-wider"
                >
                  <ImageIcon className="w-5 h-5 mr-3 text-[#D4AF37]" /> 
                  Muat Naik Logo
                </Button>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-0">
            <Card className="bg-white border-none shadow-md rounded-2xl p-4 sm:p-6 hover:scale-[1.02] transition-transform cursor-pointer border-l-4 border-blue-500" onClick={handleAddTeacher}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Tambah Guru</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Cipta profil baru</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white border-none shadow-md rounded-2xl p-4 sm:p-6 border-l-4 border-amber-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">{teachers.length} Ahli Panitia</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Jumlah profil</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-none shadow-md rounded-2xl p-4 sm:p-6 border-l-4 border-[#D4AF37]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                   <img src={schoolLogo || schoolLogoAsset.url} alt="Logo Sekolah" className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Status Portal</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Online & Aktif</p>
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
                  placeholder={showRoleManager ? "Cari dalam senarai..." : "Cari profil..."} 
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
                      <TableHead>Nama Guru (Senarai Profil)</TableHead>
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
        <PrintLayout currentTeacher={currentTeacher} isAdminMode={isAdminMode} schoolLogo={schoolLogo} />
      </div>

      <div id="profile-container" className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 print-container space-y-6 no-print">


        
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

        {/* Removed print buttons from profile header as requested */}





        {/* SCREEN HEADER */}

        <header className="no-print flex flex-col items-center bg-[#002B5B] p-4 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl border-b-8 border-[#D4AF37] relative overflow-hidden group">
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg">
                <img src={schoolLogo || schoolLogoAsset.url} alt="Logo Sekolah" className="w-full h-full object-contain" />
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 relative z-10 w-full">
            <div className="relative group/avatar">
              <div 
                className="w-24 h-32 sm:w-36 sm:h-48 bg-white/10 rounded-xl sm:rounded-[2rem] border-2 border-white/20 overflow-hidden shadow-2xl transition-all group-hover/avatar:border-white/50 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 space-y-2">
                    <Camera className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Muat Naik</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              {isEditMode && (
                 <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] p-2 rounded-lg shadow-lg border border-white/20 animate-in zoom-in duration-300">
                    <Camera className="w-4 h-4 text-white" />
                 </div>
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[9px] font-black rounded uppercase tracking-wider">
                  {(profile as any)?.gred || "SSPA"}
                </span>
                <span className="px-2 py-0.5 bg-white/10 border border-white/10 text-blue-100 text-[9px] font-black rounded uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> {(profile as any)?.sekolah?.jawatan || "GURU"}
                </span>
              </div>
              <h1 className="text-xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-sm uppercase">
                {(profile as any)?.nama || "NAMA GURU"}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-200/60 font-bold text-xs sm:text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>SMK SULTAN AHMAD SHAH, CAMERON HIGHLANDS</span>
              </div>
              
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-[10px] font-bold text-blue-100/80">
                 <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                 {isSaving ? "Sedang menyimpan..." : "Semua perubahan disimpan"}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <Button 
                onClick={() => setIsEditMode(!isEditMode)} 
                className={`h-11 sm:h-12 px-6 ${isEditMode ? 'bg-[#D4AF37] text-white' : 'bg-white text-[#002B5B]'} font-black rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest min-h-[44px]`}
              >
                {isEditMode ? <><X className="w-4 h-4 mr-2" /> Batal</> : <><Edit2 className="w-4 h-4 mr-2" /> Edit Profil</>}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="h-11 sm:h-12 bg-rose-600 text-white hover:bg-rose-700 border-none font-black rounded-xl shadow-lg text-xs uppercase tracking-widest min-h-[44px]"
              >
                <LogOut className="w-4 h-4 mr-2" /> Log Keluar
              </Button>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        </header>

        {/* MOBILE VIEW CONTENT */}
        <div className="sm:hidden block w-full px-2 mt-4 space-y-4">
          <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-slate-50">
              <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Maklumat Peribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { label: "Nama Penuh", key: "nama" },
                { label: "No. Kad Pengenalan", key: "kp" },
                { label: "No. Telefon", key: "tel" },
                { label: "E-mel", key: "email" },
                { label: "Gred Jawatan", key: "gred" },
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{item.label}</Label>
                  {isEditMode ? (
                    item.key === 'gred' ? (
                      <Select
                        value={(profile as any)[item.key] || ""}
                        onValueChange={(val) => updateCurrentTeacher({ profile: { ...(profile as any), [item.key]: val } })}
                      >
                        <SelectTrigger className="h-10 rounded-xl border-slate-100 text-sm font-bold">
                          <SelectValue placeholder="Pilih Gred" />
                        </SelectTrigger>
                        <SelectContent>
                          {SSPA_GRADES.map(grade => (
                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        value={(profile as any)[item.key]} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const exclude = ['email', 'kp', 'tel', 'tarikhMula', 'poskod'];
                          const finalVal = exclude.includes(item.key) ? val : val.toUpperCase();
                          updateCurrentTeacher({ profile: {...(profile as any), [item.key]: finalVal}});
                        }}
                        className="h-10 rounded-xl border-slate-100 text-sm font-bold"
                      />
                    )
                  ) : (

                    <p className="text-[#002B5B] font-bold text-sm">{(profile as any)[item.key] || "-"}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-slate-50">
              <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Jawatan</p>
                <p className="text-sm font-bold text-[#002B5B]">{(profile as any).sekolah?.jawatan || "-"}</p>
              </div>
              <div className="bg-[#002B5B]/5 p-3 rounded-xl border border-[#002B5B]/10">
                 <p className="text-[10px] font-black text-[#002B5B]/40 uppercase tracking-wider mb-1">Alamat Sekolah</p>
                 <p className="text-sm font-bold text-[#002B5B]">{(profile as any).sekolah?.alamat}, {(profile as any).sekolah?.poskod} {(profile as any).sekolah?.daerah}, {(profile as any).sekolah?.negeri}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-slate-50">
              <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Akademik
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {kelulusan?.map((item: any, idx: number) => (
                  <AccordionItem key={item.id || idx} value={`acad-mob-${idx}`} className="border-b border-slate-50 last:border-none">
                    <AccordionTrigger className="px-4 py-3 text-left">
                      <div>
                        <p className="text-sm font-black text-[#002B5B]">{item.kelayakan || "Kelayakan"}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.tahun || "-"}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 bg-slate-50/30">
                      <p className="text-xs font-bold text-[#002B5B]">{item.institusi}</p>
                      <p className="text-[10px] text-slate-500">{item.bidang}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-slate-50">
              <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                <History className="w-4 h-4" />
                Perkhidmatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {sejarah?.map((item: any, idx: number) => (
                  <AccordionItem key={item.id || idx} value={`hist-mob-${idx}`} className="border-b border-slate-50 last:border-none">
                    <AccordionTrigger className="px-4 py-3 text-left">
                      <div>
                        <p className="text-sm font-black text-[#002B5B]">{item.sekolah || "Sekolah"}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.tahun || "-"}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 bg-slate-50/30">
                      <p className="text-xs font-bold text-[#002B5B]">{item.subjek}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-slate-50">
              <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Tandatangan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex justify-center">
              {currentTeacher?.signatureUrl ? (
                <img src={currentTeacher.signatureUrl} alt="Tandatangan" className="max-h-20" />
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignatureModal(true)}
                  className="w-full h-10 border-dashed border-2 text-[10px] uppercase font-black"
                >
                  Tandatangan Sekarang
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-2 no-print sticky top-2 z-50 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Cari maklumat..." 
              className="pl-12 h-12 bg-white/95 backdrop-blur-xl border-white shadow-lg rounded-xl focus:ring-2 focus:ring-[#002B5B]/10 transition-all text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={eOperasiInputRef} 
              onChange={handleEOperasiImport} 
              accept="application/pdf" 
              className="hidden" 
            />
            <Button 
              onClick={() => eOperasiInputRef.current?.click()}
              disabled={isImporting}
              className="flex-1 sm:w-auto h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md border-none text-xs uppercase tracking-widest min-h-[44px]"
            >
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />}
              Import
            </Button>
            <Button 
              onClick={() => setShowPrintPreview(true)}
              className="flex-1 sm:w-auto h-12 px-6 bg-[#002B5B] hover:bg-[#003B7B] text-white font-black rounded-xl shadow-md border-none text-xs uppercase tracking-widest min-h-[44px]"
            >
              <Printer className="w-4 h-4 mr-2" /> Cetak
            </Button>
          </div>
        </div>



        {/* STATS CARDS REMOVED PER USER REQUEST */}


        {/* TWO COLUMNS DATA */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 sm:grid hidden">
          <Card className="lg:col-span-2 border-none shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-black text-[#002B5B] flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Maklumat Peribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6">
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
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">{item.label}</Label>
                    </div>

                    {isEditMode ? (
                      item.key === 'gred' ? (
                        <Select
                          value={(profile as any)[item.key] || ""}
                          onValueChange={(val) => updateCurrentTeacher({ profile: { ...(profile as any), [item.key]: val } })}
                        >
                          <SelectTrigger className="h-11 rounded-xl border-slate-100 focus:ring-[#002B5B] text-sm font-bold">
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
                          className="h-11 rounded-xl border-slate-100 focus:border-[#002B5B] focus:ring-[#002B5B] text-sm font-bold"
                        />

                      )
                    ) : (
                      <div className="min-h-[44px] flex items-center px-4 rounded-xl bg-slate-50 border border-transparent">
                        <p className="text-[#002B5B] font-bold text-sm sm:text-base">{(profile as any)[item.key as keyof typeof profile] as string || "-"}</p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="sm:col-span-2 space-y-1 mt-2">
                  <Label className="text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Alamat Kediaman</Label>
                  {isEditMode ? (
                    <Textarea 
                      value={(profile as any).alamat} 
                      onChange={(e) => updateCurrentTeacher({ profile: {...(profile as any), alamat: e.target.value}})}
                      className="min-h-[80px] rounded-xl border-slate-100 text-sm font-bold"
                    />
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-transparent">
                      <p className="text-[#002B5B] font-bold text-sm sm:text-base leading-relaxed">{(profile as any).alamat || "-"}</p>
                    </div>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 no-print sm:block hidden">
            <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white sm:block hidden">
              <CardHeader className="p-4 border-b border-slate-50">
                <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Sekolah
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Sekolah", val: (profile as any).sekolah?.nama },
                    { label: "Kod Sekolah", val: (profile as any).sekolah?.kod },
                    { label: "Jawatan", val: (profile as any).sekolah?.jawatan },
                    { label: "Pemeriksa SPM", val: (profile as any).sekolah?.pemeriksaSPM },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-sm font-bold text-[#002B5B]">{item.val || "-"}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#002B5B]/5 p-3 rounded-xl border border-[#002B5B]/10">
                   <p className="text-[10px] font-black text-[#002B5B]/40 uppercase tracking-wider mb-1">Alamat Sekolah</p>
                   <p className="text-sm font-bold text-[#002B5B]">{(profile as any).sekolah?.alamat}, {(profile as any).sekolah?.poskod} {(profile as any).sekolah?.daerah}, {(profile as any).sekolah?.negeri}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white no-print">
              <CardHeader className="p-4 border-b border-slate-50">
                <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Kelayakan Akademik ({profile?.academic?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {profile?.academic?.map((item: any, idx: number) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-slate-50 last:border-none">
                      <AccordionTrigger className="px-4 py-3 hover:bg-slate-50/50">
                        <div className="text-left">
                          <p className="text-sm font-black text-[#002B5B] leading-tight">{item.tahap || "Peringkat"}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[200px]">{item.bidang || "Bidang"}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-3 bg-slate-50/30">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-2 rounded-lg border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Tahun</p>
                             <p className="text-xs font-bold text-[#002B5B]">{item.tahun || "-"}</p>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-100 col-span-2">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Institusi</p>
                             <p className="text-xs font-bold text-[#002B5B]">{item.institusi || "-"}</p>
                          </div>
                        </div>
                        {isEditMode && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newAcademic = [...(profile?.academic || [])];
                              newAcademic.splice(idx, 1);
                              updateCurrentTeacher({ profile: { ...profile, academic: newAcademic } });
                            }}
                            className="w-full h-8 text-rose-500 font-bold text-[10px] uppercase"
                          >
                            Padam Rekod
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {isEditMode && (
                  <div className="p-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const newAcademic = [...(profile?.academic || []), { tahap: "", bidang: "", institusi: "", tahun: "" }];
                        updateCurrentTeacher({ profile: { ...profile, academic: newAcademic } });
                      }}
                      className="w-full h-10 border-dashed border-2 border-slate-200 text-[#002B5B] font-black text-[10px] uppercase"
                    >
                      Tambah Rekod Akademik
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white no-print">
              <CardHeader className="p-4 border-b border-slate-50">
                <CardTitle className="text-sm font-black text-[#002B5B] flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Sejarah Perkhidmatan ({profile?.history?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {profile?.history?.map((item: any, idx: number) => (
                    <AccordionItem key={idx} value={`history-${idx}`} className="border-b border-slate-50 last:border-none">
                      <AccordionTrigger className="px-4 py-3 hover:bg-slate-50/50">
                        <div className="text-left">
                          <p className="text-sm font-black text-[#002B5B] leading-tight">{item.tempat || "Tempat Perkhidmatan"}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.tahun || "Tahun"}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-3 bg-slate-50/30">
                        <div className="bg-white p-2 rounded-lg border border-slate-100">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Jawatan</p>
                           <p className="text-xs font-bold text-[#002B5B]">{item.jawatan || "-"}</p>
                        </div>
                        {isEditMode && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newHistory = [...(profile?.history || [])];
                              newHistory.splice(idx, 1);
                              updateCurrentTeacher({ profile: { ...profile, history: newHistory } });
                            }}
                            className="w-full h-8 text-rose-500 font-bold text-[10px] uppercase"
                          >
                            Padam Rekod
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {isEditMode && (
                   <div className="p-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const newHistory = [...(profile?.history || []), { tempat: "", jawatan: "", tahun: "" }];
                        updateCurrentTeacher({ profile: { ...profile, history: newHistory } });
                      }}
                      className="w-full h-10 border-dashed border-2 border-slate-200 text-[#002B5B] font-black text-[10px] uppercase"
                    >
                      Tambah Sejarah Perkhidmatan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Floating Save Bar for Mobile Edit Mode */}
      {isEditMode && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-[100] no-print animate-in slide-in-from-bottom duration-500">
           <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mod Edit</p>
                 <p className="text-xs font-bold text-[#002B5B]">{isSaving ? "Sedang menyimpan..." : "Perubahan belum disimpan"}</p>
              </div>
              <div className="flex gap-2">
                 <Button 
                   variant="outline"
                   onClick={() => setIsEditMode(false)}
                   className="h-11 px-4 border-slate-200 text-slate-600 font-black text-xs uppercase"
                 >
                   Batal
                 </Button>
                 <Button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="h-11 px-8 bg-[#D4AF37] hover:bg-[#B8860B] text-white font-black text-xs uppercase shadow-lg shadow-[#D4AF37]/20"
                 >
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                 </Button>
              </div>
           </div>
        </div>
      )}
      <div id="profile-details-container" className="space-y-6 sm:block hidden">
        {/* TABLES SECTION */}
        <div className="space-y-6 animate-in slide-up duration-500 delay-400 sm:block hidden">
          
          {/* KELULUSAN ACADEMIK */}
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white card-print no-print">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center print:bg-transparent print:px-0 print:py-0">
              <h2 className="text-white text-lg font-black flex items-center gap-3 section-title-app">
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
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white card-print no-print">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center print:bg-transparent print:px-0 print:py-0">
              <h2 className="text-white text-lg font-black flex items-center gap-3 section-title-app">
                <div className="bg-white/20 p-1.5 rounded-lg no-print"><BookOpen className="w-5 h-5" /></div>
                Subjek Semasa Diajar
              </h2>

              {isEditMode && (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => {
                    const newId = Math.random();
                    updateCurrentTeacher({ subjek: [...subjek, {id: newId, nama: "", kelas: "", murid: ""}] });
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
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest px-8">Subjek</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Tahun / Tingkatan</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Bil. Murid</TableHead>
                      {isEditMode && <TableHead className="w-20 no-print"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjek.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isEditMode ? 4 : 3} className="h-24 text-center text-slate-400 italic">Tiada rekod subjek</TableCell>
                      </TableRow>
                    ) : (subjek as any[]).map((row) => (
                      <TableRow key={row.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 font-medium text-slate-700">
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
          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white card-print no-print">
            <div className="bg-[#002B5B] px-8 py-5 flex justify-between items-center print:bg-transparent print:px-0 print:py-0">
              <h2 className="text-white text-lg font-black flex items-center gap-3 section-title-app">
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
        <div className="grid md:grid-cols-2 gap-12 py-16 px-8 bg-white rounded-3xl shadow-lg border-t-4 border-[#002B5B] relative overflow-hidden signature-grid print:hidden sm:grid hidden no-print-section">

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
        </div>
      </div>


        <footer className="no-print text-center py-12 space-y-2">
          <p className="text-[#002B5B] font-black text-sm">Profile Guru SMK Sultan Ahmad Shah © 2026</p>
          <p className="text-slate-400 text-xs font-medium">Maklumat ini adalah untuk kegunaan rasmi sekolah sahaja.</p>
        </footer>


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
             <PrintLayout currentTeacher={currentTeacher} isAdminMode={isAdminMode} schoolLogo={schoolLogo} />
          </div>

        </div>
      )}
      
      {/* LOGO CONFIRMATION MODAL */}
      {showLogoConfirmation && pendingLogo && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] bg-white p-8 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight">Pratonton Logo Baru</h2>
              <p className="text-slate-500 font-bold text-sm">Adakah anda pasti mahu menggantikan logo sekolah di seluruh aplikasi?</p>
            </div>

            <div className="flex justify-center gap-8 py-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 text-center">Logo Sedia Ada</p>
                <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center p-2 mx-auto">
                  <img src={schoolLogo || schoolLogoAsset.url} alt="Logo Lama" className="max-w-full max-h-full object-contain opacity-50" />
                </div>
              </div>

              <div className="flex items-center text-slate-300">
                <Plus className="w-6 h-6 rotate-45" />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-[#D4AF37] text-center">Logo Baru</p>
                <div className="w-24 h-24 bg-white border-4 border-[#D4AF37]/20 rounded-2xl flex items-center justify-center p-2 shadow-xl animate-pulse mx-auto">
                  <img src={pendingLogo} alt="Logo Baru" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={confirmLogoUpload}
                disabled={isSaving}
                className="h-14 bg-[#002B5B] hover:bg-[#003B7B] text-white font-black rounded-2xl shadow-xl transition-all active:scale-95"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                SAHKAN & KEMASKINI SEMUA
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => { setShowLogoConfirmation(false); setPendingLogo(null); }}
                disabled={isSaving}
                className="h-12 text-slate-400 hover:text-rose-500 font-black rounded-xl uppercase text-xs tracking-widest"
              >
                Batal
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default GuruProfile;





