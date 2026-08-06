import React from "react";

interface DataFieldProps {
  label: string;
  value: string | number | undefined | null;
  className?: string;
}

const DataField: React.FC<DataFieldProps> = ({ label, value, className = "col-6" }) => {
  if (!value || value === "-" || value === "N/A" || value === "Tiada") return null;
  
  return (
    <div className={`data-field ${className}`}>
      <span className="data-label">{label}</span>
      <span className="data-value">{value}</span>
    </div>
  );
};

interface PersonalInformationSectionProps {
  profile: any;
}

export const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({ profile }) => {
  return (
    <div className="section">
      <h2 className="section-title">I. Maklumat Peribadi</h2>
      <div className="info-grid">
        <DataField label="Nama Penuh" value={profile?.nama} className="col-12" />
        <DataField label="No. Kad Pengenalan" value={profile?.kp} className="col-4" />
        <DataField label="No. Telefon" value={profile?.tel} className="col-4" />
        <DataField label="E-mel Rasmi" value={profile?.email} className="col-4" />
        
        <DataField label="Gred Jawatan" value={profile?.gred} className="col-3" />
        <DataField label="Opsyen" value={profile?.opsyen} className="col-6" />
        <DataField label="Mengajar Opsyen" value={profile?.mengajarOpsyen} className="col-3" />
        
        <DataField label="Tarikh Mula Perkhidmatan" value={profile?.tarikhMula} className="col-4" />
        <DataField label="Jumlah Pengalaman" value={profile?.pengalaman} className="col-4" />
        <DataField label="Tempoh di Sekolah Semasa" value={profile?.tempohSemasa} className="col-4" />

        <div className="col-12 data-field">
          <span className="data-label">Alamat Rumah</span>
          <span className="data-value">{profile?.alamat}</span>
        </div>
      </div>
    </div>
  );
};
