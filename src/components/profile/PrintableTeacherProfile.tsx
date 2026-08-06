import React from "react";
import { ProfileHeader } from "./ProfileHeader";
import { PersonalInformationSection } from "./PersonalInformationSection";
import { SchoolInformationSection } from "./SchoolInformationSection";
import { AcademicQualificationsTable } from "./AcademicQualificationsTable";
import { CurrentSubjectsTable } from "./CurrentSubjectsTable";
import { EmploymentHistoryTable } from "./EmploymentHistoryTable";
import { SignatureSection } from "./SignatureSection";

interface PrintableTeacherProfileProps {
  teacher: any;
  isAdminMode?: boolean;
}

export const PrintableTeacherProfile: React.FC<PrintableTeacherProfileProps> = ({ teacher, isAdminMode }) => {
  if (!teacher) return null;

  return (
    <div id="profile-container" className="profile-container bg-white">
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
