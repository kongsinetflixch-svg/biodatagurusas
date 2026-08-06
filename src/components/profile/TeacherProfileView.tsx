import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Edit2, LogOut, LayoutDashboard } from "lucide-react";
import { PrintableTeacherProfile } from "./PrintableTeacherProfile";

interface TeacherProfileViewProps {
  teacher: any;
  isAdminMode: boolean | undefined;
  onEdit: () => void;
  onLogout: () => void;
  onShowAdmin: () => void;
  isSuperadmin: boolean;
}

export const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({
  teacher,
  isAdminMode,
  onEdit,
  onLogout,
  onShowAdmin,
  isSuperadmin
}) => {
  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Toolbars - Hidden in Print */}
      <div className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#002B5B] rounded-xl flex items-center justify-center p-2 shadow-inner">
             <span className="text-white text-xs font-black tracking-tight">KPM</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#002B5B] leading-none mb-1">PROFIL GURU 2026</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">SMK Sultan Ahmad Shah</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSuperadmin && (
            <Button variant="outline" size="sm" onClick={onShowAdmin} className="h-9 px-4 rounded-full border-slate-200">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onEdit} className="h-9 px-4 rounded-full border-slate-200">
            <Edit2 className="w-4 h-4 mr-2" /> Kemaskini
          </Button>
          <Button onClick={() => window.print()} className="h-9 px-4 rounded-full bg-[#002B5B] hover:bg-[#003d82]">
            <Printer className="w-4 h-4 mr-2" /> Cetak / PDF
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout} className="h-9 w-9 p-0 rounded-full text-rose-500 hover:bg-rose-50">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* A4 Preview Sheet */}
      <div className="max-w-[210mm] mx-auto my-8 print:my-0 shadow-[0_0_50px_rgba(0,0,0,0.05)] print:shadow-none overflow-x-auto">
        <div className="bg-white p-[10mm] min-h-[297mm] w-full print:p-0">
          <PrintableTeacherProfile teacher={teacher} isAdminMode={isAdminMode} />
        </div>
      </div>
    </div>
  );
};
