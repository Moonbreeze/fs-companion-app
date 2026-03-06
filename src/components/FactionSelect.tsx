import { factions } from '../data';
import type { FactionId } from '../data';

interface Props {
  value: FactionId | null;
  onChange: (id: FactionId) => void;
  exclude?: FactionId[];
  label?: string;
}

export default function FactionSelect({ value, onChange, exclude = [], label }: Props) {
  const available = Object.values(factions).filter(f => !exclude.includes(f.id));

  return (
    <div>
      {label && <label className="block text-xs text-gray-400 font-gothic tracking-wide mb-2">{label}</label>}
      <div className="flex gap-2 flex-wrap">
        {available.map((faction) => (
          <button
            key={faction.id}
            onClick={() => onChange(faction.id)}
            className={`px-3 py-2 text-sm font-gothic tracking-wide border transition-all
              ${value === faction.id
                ? 'border-current text-white shadow-lg shadow-current/20'
                : 'border-wh-border text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }`}
            style={value === faction.id ? { borderColor: faction.color, color: faction.color } : undefined}
          >
            {faction.name}
          </button>
        ))}
      </div>
    </div>
  );
}
