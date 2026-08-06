import React from "react";

interface CurrentSubjectsTableProps {
  subjects: any[];
}

export const CurrentSubjectsTable: React.FC<CurrentSubjectsTableProps> = ({ subjects }) => {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="section">
      <h2 className="section-title">IV. Subjek Yang Diajar (Tahun Semasa)</h2>
      <table>
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Mata Pelajaran</th>
            <th style={{ width: '20%' }}>Kelas</th>
            <th style={{ width: '15%' }}>Bil. Murid</th>
            <th style={{ width: '15%' }}>TOV (%)</th>
            <th style={{ width: '20%' }}>ETR (%)</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, idx) => (
            <tr key={s.id || idx}>
              <td>{s.nama}</td>
              <td>{s.kelas}</td>
              <td>{s.murid}</td>
              <td>{s.tov}</td>
              <td>{s.etr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
