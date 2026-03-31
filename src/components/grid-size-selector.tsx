import React from "react";
import type { GridPreset } from "../utils/grid-presets";

interface GridSizeSelectorProps {
  presets: readonly GridPreset[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function GridSizeSelector({
  presets,
  selectedIndex,
  onChange,
}: GridSizeSelectorProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2">
      {presets.map((preset, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={preset.label}
            type="button"
            aria-pressed={isSelected}
            onClick={() => {
              if (!isSelected) onChange(index);
            }}
            className={`
              rounded-lg p-3 text-center transition-all duration-150 border-2
              ${
                isSelected
                  ? "border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-200"
                  : "border-brand-100 bg-surface-raised text-text-primary hover:border-brand-200"
              }
            `}
          >
            <span className="block text-sm font-bold">{preset.label}</span>
            <span className="block text-xs text-text-muted">{preset.cards} cards</span>
          </button>
        );
      })}
    </div>
  );
}
