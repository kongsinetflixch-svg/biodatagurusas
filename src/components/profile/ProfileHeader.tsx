import React from "react";

interface ProfileHeaderProps {
  profile: any;
  profileImage?: string | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, profileImage }) => {
  return (
    <div className="official-header">
      <div className="kpm-logo-area">
        <div className="w-12 h-12 bg-[#002B5B] flex items-center justify-center p-2 rounded-sm print:rounded-none">
          <span className="text-white text-lg font-black tracking-tighter">KPM</span>
        </div>
        <div>
          <h1 className="doc-title">REKOD PERIBADI PENJAWAT AWAM</h1>
          <p className="doc-subtitle">Kementerian Pendidikan Malaysia • SMK Sultan Ahmad Shah</p>
        </div>
      </div>
      
      <div className="photo-frame">
        {profileImage ? (
          <img src={profileImage} alt="Profil" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[8pt] text-slate-400 text-center px-2">
            Gambar Profil
          </div>
        )}
      </div>
    </div>
  );
};
