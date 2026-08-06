import React from "react";

interface AcademicQualificationsTableProps {
  qualifications: any[];
}

export const AcademicQualificationsTable: React.FC<AcademicQualificationsTableProps> = ({ qualifications }) => {
  if (!qualifications || qualifications.length === 0) return null;

  return (
    <div className="section">
      <h2 className="section-title">III. Kelulusan Akademik & Profesional</h2>
      <table>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Kelayakan</th>
            <th style={{ width: '30%' }}>Institusi</th>
            <th style={{ width: '20%' }}>Bidang</th>
            <th style={{ width: '10%' }}>Tahun</th>
          </tr>
        </thead>
        <tbody>
          {qualifications.map((q, idx) => (
            <tr key={q.id || idx}>
              <td>{q.kelayakan}</td>
              <td>{q.institusi}</td>
              <td>{q.bidang}</td>
              <td>{q.tahun}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
