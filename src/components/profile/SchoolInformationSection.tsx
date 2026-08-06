import React from "react";

interface SchoolInformationSectionProps {
  sekolah: any;
}

export const SchoolInformationSection: React.FC<SchoolInformationSectionProps> = ({ sekolah }) => {
  if (!sekolah) return null;

  return (
    <div className="section">
      <h2 className="section-title">II. Maklumat Perkhidmatan & Sekolah</h2>
      <div className="info-grid">
        <div className="col-6 data-field">
          <span className="data-label">Nama Sekolah</span>
          <span className="data-value">{sekolah.nama}</span>
        </div>
        <div className="col-6 data-field">
          <span className="data-label">Kod Sekolah</span>
          <span className="data-value">{sekolah.kod}</span>
        </div>
        
        <div className="col-12 data-field">
          <span className="data-label">Alamat Sekolah</span>
          <span className="data-value">{sekolah.alamat}</span>
        </div>

        <div className="col-4 data-field">
          <span className="data-label">Poskod</span>
          <span className="data-value">{sekolah.poskod}</span>
        </div>
        <div className="col-4 data-field">
          <span className="data-label">Daerah</span>
          <span className="data-value">{sekolah.daerah}</span>
        </div>
        <div className="col-4 data-field">
          <span className="data-label">Negeri</span>
          <span className="data-value">{sekolah.negeri}</span>
        </div>

        <div className="col-6 data-field">
          <span className="data-label">Jawatan</span>
          <span className="data-value">{sekolah.jawatan}</span>
        </div>
        <div className="col-3 data-field">
          <span className="data-label">Pemeriksa SPM</span>
          <span className="data-value">{sekolah.pemeriksaSPM}</span>
        </div>
        <div className="col-3 data-field">
          <span className="data-label">Guru Khas</span>
          <span className="data-value">{sekolah.guruKhas}</span>
        </div>
      </div>
    </div>
  );
};
