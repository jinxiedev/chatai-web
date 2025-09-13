import React from 'react';

interface Model {
  name: string;
  model: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ models, selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">
        AI Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all hover:bg-slate-800/70 font-mono"
      >
        {models.map((model) => (
          <option key={model.model} value={model.model} className="bg-slate-800">
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}