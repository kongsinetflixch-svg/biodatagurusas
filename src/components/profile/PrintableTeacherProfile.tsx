import React, { useEffect } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { PersonalInformationSection } from "./PersonalInformationSection";
import { SchoolInformationSection } from "./SchoolInformationSection";
import { AcademicQualificationsTable } from "./AcademicQualificationsTable";
import { CurrentSubjectsTable } from "./CurrentSubjectsTable";
import { EmploymentHistoryTable } from "./EmploymentHistoryTable";
import { SignatureSection } from "./SignatureSection";

interface PrintableTeacherProfileProps {
  teacher: any;
  isAdminMode?: boolean | undefined;
}

export const PrintableTeacherProfile: React.FC<PrintableTeacherProfileProps> = ({ teacher, isAdminMode }) => {
  useEffect(() => {
    // Add print class to body to ensure CSS scoping works correctly in preview
    document.body.classList.add('print-ready');
    return () => document.body.classList.remove('print-ready');
  }, []);

  if (!teacher) return null;

  return (
    <div id="profile-container" className="profile-container bg-white w-[210mm] min-h-[297mm] p-[10mm] box-border">
      <ProfileHeader 
        profile={teacher.profile} 
        profileImage={teacher.profileImage} 
      />
      
      <PersonalInformationSection profile={teacher.profile} />
      
      <SchoolInformationSection sekolah={teacher.profile?.sekolah} />
      
      <AcademicQualificationsTable qualifications={teacher.kelulusan} />
      
      <CurrentSubjectsTable subjects={teacher.subjek} />
      
      <EmploymentHistoryTable history={teacher.sejarah} />
      
      <SignatureSection isAdminMode={isAdminMode} />
    </div>
  );
};
