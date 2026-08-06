import React from "react";

interface SignatureSectionProps {
  isAdminMode?: boolean | undefined;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ isAdminMode }) => {
  return (
    <div className="section">
      <div className="signature-area">
        <div className="sig-container">
          <span className="data-label">Disahkan Oleh Guru:</span>
          <div className="sig-line">Tandatangan & Nama Guru</div>
        </div>
        
        {isAdminMode && (
          <div className="sig-container">
            <span className="data-label">Pengesahan Pengetua / Pentadbir:</span>
            <div className="sig-line">Tandatangan & Cop Rasmi</div>
          </div>
        )}
      </div>
      <div className="text-[6pt] text-slate-400 mt-2 text-right">
        Dokumen ini dijanakan secara digital melalui Sistem Profil Guru Profesional 2026.
      </div>
    </div>
  );
};
