import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Layout, Smartphone, FolderPlus, Palette } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, closeNewProjectModal, createProject, members, currentUser } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [icon, setIcon] = useState('Sparkles');
  const [category, setCategory] = useState('Design');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([currentUser.id]);

  if (!isNewProjectModalOpen) return null;

  const colorOptions = ['#2563EB', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1', '#14B8A6'];
  const iconOptions = [
    { id: 'Sparkles', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'Layout', icon: <Layout className="w-4 h-4" /> },
    { id: 'Smartphone', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'FolderPlus', icon: <FolderPlus className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      isFavorite: false,
      memberIds: selectedMemberIds,
      category,
      targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });

    closeNewProjectModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            Create Workspace Project
          </h2>
          <button
            onClick={closeNewProjectModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Workspace / Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design System V2"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Goals and deliverable roadmap..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Theme Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Project Icon
            </label>
            <div className="flex items-center gap-2">
              {iconOptions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setIcon(item.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    icon === item.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Member assignment */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Workspace Members
            </label>
            <div className="flex flex-wrap gap-1.5">
              {members.map((m) => {
                const isSelected = selectedMemberIds.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMemberIds(selectedMemberIds.filter((id) => id !== m.id));
                      } else {
                        setSelectedMemberIds([...selectedMemberIds, m.id]);
                      }
                    }}
                    className={`px-2 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 text-blue-600 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeNewProjectModal}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
