import React from 'react';

const COMMON = ['ğŸâ€˜', 'â¤ï¸', 'ğŸ˜‚', 'ğŸ˜®', 'ğŸ˜¢', 'ğŸâ€¥', 'ğŸ‰', 'ğŸâ€˜'];

export const ReactionPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
  return (
    <div className="p-2 bg-slate-900/40 rounded-md flex gap-2" data-testid="reaction-picker">
      {COMMON.map((e) => (
        <button key={e} onClick={() => onSelect(e)} className="p-2 rounded-md hover:bg-slate-800/30" data-testid={`reaction-${encodeURIComponent(e)}`}>
          <span className="text-xl">{e}</span>
        </button>
      ))}
    </div>
  );
};
