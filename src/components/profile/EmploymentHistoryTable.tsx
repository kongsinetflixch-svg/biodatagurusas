import React from "react";

interface EmploymentHistoryTableProps {
  history: any[];
}

export const EmploymentHistoryTable: React.FC<EmploymentHistoryTableProps> = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="section">
      <h2 className="section-title">V. Sejarah Perkhidmatan</h2>
      <table>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Nama Sekolah / Institusi</th>
            <th style={{ width: '20%' }}>Tempoh (Tahun)</th>
            <th style={{ width: '30%' }}>Subjek / Tugas Utama</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, idx) => (
            <tr key={h.id || idx}>
              <td>{h.sekolah}</td>
              <td>{h.tahun}</td>
              <td>{h.subjek}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
