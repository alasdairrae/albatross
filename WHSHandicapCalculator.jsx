
import { useState } from "react";

const defaultRow = {
  date: "",
  course: "",
  rating: "",
  slope: "",
  pcc: "",
  score: "",
};

function calculateDifferential(score, rating, slope, pcc) {
  const s = parseFloat(score);
  const r = parseFloat(rating);
  const sl = parseFloat(slope);
  const p = parseFloat(pcc) || 0;
  if (isNaN(s) || isNaN(r) || isNaN(sl) || sl === 0) return "";
  return (((s - r - p) * 113) / sl).toFixed(1);
}

function calculateHandicapIndex(differentials) {
  const validDiffs = differentials.filter((d) => !isNaN(d)).sort((a, b) => a - b);
  const count = validDiffs.length;
  if (count < 3) return "";

  const lookup = {
    3: 1,
    4: 1,
    5: 1,
    6: 2,
    7: 2,
    8: 2,
    9: 3,
    10: 3,
    11: 4,
    12: 4,
    13: 5,
    14: 5,
    15: 6,
    16: 6,
    17: 7,
    18: 8,
    19: 9,
    20: 8,
  };

  const numToUse = lookup[Math.min(count, 20)] || 8;
  const used = validDiffs.slice(0, numToUse);
  const avg = used.reduce((sum, d) => sum + d, 0) / used.length;
  return (avg * 0.96).toFixed(1);
}

export default function WHSHandicapCalculator() {
  const [rows, setRows] = useState(Array.from({ length: 20 }, () => ({ ...defaultRow })));

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const differentials = rows.map((row) =>
    parseFloat(calculateDifferential(row.score, row.rating, row.slope, row.pcc))
  );

  const handicapIndex = calculateHandicapIndex(differentials);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="text-2xl font-bold mb-4">
        Handicap Index: {handicapIndex || "N/A"}
      </div>
      <h1 className="text-xl font-semibold mb-2">WHS Handicap Calculator (enter at least 3 scores to see your handicap)</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="border p-2">Date</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Slope</th>
            <th className="border p-2">PCC</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Differential</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className="border p-1">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateRow(idx, "date", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-1">
                <input
                  type="text"
                  value={row.course}
                  onChange={(e) => updateRow(idx, "course", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-1">
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={row.rating}
                  onChange={(e) => updateRow(idx, "rating", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-1">
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={row.slope}
                  onChange={(e) => updateRow(idx, "slope", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-1">
                <input
                  type="number"
                  min="-1"
                  max="3"
                  step="1"
                  value={row.pcc}
                  onChange={(e) => updateRow(idx, "pcc", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-1">
                <input
                  type="text"
                  value={row.score}
                  onChange={(e) => updateRow(idx, "score", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-1 text-center">
                {calculateDifferential(row.score, row.rating, row.slope, row.pcc)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-gray-600 mt-4">
        This is for personal use only. Not for commercial use. The aim is to help golfers understand the permutations of different scores and to give everyone an easy way to calculate what their handicap is, or might be.
      </p>
    </div>
  );
}
