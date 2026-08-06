import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Printer, Edit, Shield } from "lucide-react";
import { PrintableTeacherProfile } from "./PrintableTeacherProfile";
import { toast } from "sonner";

interface TeacherProfileViewProps {
  teacher: any;
  isAdminMode: boolean;
  isSuperadmin: boolean;
  onEdit: () => void;
  onLogout: () => void;
  onShowAdmin: () => void;
}

export const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({
  teacher,
  isAdminMode,
  isSuperadmin,
  onEdit,
  onLogout,
  onShowAdmin
}) => {
  const handlePrint = () => {
    window.print();
  };

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 space-y-4">
        <div className="w-16 h-16 bg-[#002B5B] rounded-xl flex items-center justify-center text-white font-black animate-pulse">KPM</div>
        <p className="text-slate-500 font-medium">Tiada profil dijumpai. Sila hubungi Admin.</p>
        <Button onClick={onLogout} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">Log Keluar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/50 print:bg-white pb-12 print:pb-0">
      {/* Editorial Toolbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 no-print shadow-sm">
        <div className="max-w-[210mm] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#002B5B] rounded-lg flex items-center justify-center text-white text-xs font-black">KPM</div>
            <span className="text-sm font-bold text-[#002B5B] hidden sm:inline">PROFIL GURU 2026</span>
          </div>
          
          <div className="flex items-center gap-2">
            {(isAdminMode || isSuperadmin) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onShowAdmin}
                className="text-blue-600 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
              className="border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider"
            >
              <Edit className="w-4 h-4 mr-2" /> Kemaskini
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handlePrint}
              className="bg-[#002B5B] text-white hover:bg-[#003B7B] font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" /> Cetak A4
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-rose-500 hover:bg-rose-50 font-bold text-xs uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4 mr-2" /> Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* A4 Document Container */}
      <div className="max-w-[210mm] mx-auto mt-8 print:mt-0 shadow-2xl print:shadow-none bg-white min-h-[297mm]">
        <PrintableTeacherProfile teacher={teacher} isAdminMode={isAdminMode} />
      </div>

      {/* Editorial Disclaimer Footer */}
      <div className="max-w-[210mm] mx-auto mt-8 px-4 text-center no-print">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" /> Dokumen Rasmi Kementerian Pendidikan Malaysia • 2026
        </p>
      </div>
    </div>
  );
};
