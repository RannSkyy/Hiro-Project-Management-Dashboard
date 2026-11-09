import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ColumnId, Priority, Subtask, Attachment } from '../../types';
import { COLUMN_CONFIG, COLUMNS } from '../../utils/taskLogic';
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  Paperclip,
  MessageSquare,
  CheckSquare,
  Trash2,
  Plus,
  Image,
  ExternalLink,
  Heart,
  Send,
  Sparkles,
} from 'lucide-react';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    selectedTaskId,
    taskModalInitialStatus,
    tasks,
    createTask,
    updateTask,
    deleteTask,
    activeProjectId,
    members,
    currentUser,
    addComment,
    toggleSubtask,
  } = useApp();

  const isEditing = Boolean(selectedTaskId);
  const existingTask = tasks.find((t) => t.id === selectedTaskId);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ColumnId>('TODO');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [category, setCategory] = useState('Design');
  const [categoryColor, setCategoryColor] = useState('#2563EB');
  const [dueDate, setDueDate] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');

  // Subtasks & Comments & Attachments local state
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  const [newCommentText, setNewCommentText] = useState('');

  // Load existing task data or reset on open
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setStatus(existingTask.status);
      setPriority(existingTask.priority);
      setCategory(existingTask.category);
      setCategoryColor(existingTask.categoryColor || '#2563EB');
      setDueDate(existingTask.dueDate || '');
      setAssigneeIds(existingTask.assigneeIds || []);
      setCoverImage(existingTask.coverImage || '');
      setSubtasks(existingTask.subtasks || []);
      setAttachments(existingTask.attachments || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(taskModalInitialStatus);
      setPriority('MEDIUM');
      setCategory('Design');
      setCategoryColor('#2563EB');
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setAssigneeIds([currentUser.id]);
      setCoverImage('');
      setSubtasks([]);
      setAttachments([]);
    }
  }, [existingTask, isTaskModalOpen, taskModalInitialStatus, currentUser.id]);

  if (!isTaskModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && existingTask) {
      updateTask(existingTask.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category,
        categoryColor,
        dueDate,
        assigneeIds,
        coverImage: coverImage.trim() || undefined,
        subtasks,
        attachments,
      });
    } else {
      createTask({
        projectId: activeProjectId,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category,
        categoryColor,
        dueDate,
        assigneeIds: assigneeIds.length > 0 ? assigneeIds : [currentUser.id],
        coverImage: coverImage.trim() || undefined,
        subtasks,
        attachments,
        comments: [],
      });
    }

    closeTaskModal();
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: 'sub-' + Date.now().toString(36),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSt]);
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return;
    const newAtt: Attachment = {
      id: 'att-' + Date.now().toString(36),
      name: newAttachmentName.trim(),
      url: newAttachmentUrl.trim() || '#',
      type: newAttachmentUrl.includes('.png') || newAttachmentUrl.includes('.jpg') ? 'image' : 'link',
      size: 'External link',
    };
    setAttachments([...attachments, newAtt]);
    setNewAttachmentName('');
    setNewAttachmentUrl('');
  };

  const handleSendComment = () => {
    if (!newCommentText.trim() || !existingTask) return;
    addComment(existingTask.id, newCommentText.trim());
    setNewCommentText('');
  };

  const categoryPresets = [
    { name: 'Design', color: '#2563EB' },
    { name: 'Frontend', color: '#3B82F6' },
    { name: 'Backend', color: '#8B5CF6' },
    { name: 'Marketing', color: '#EC4899' },
    { name: 'QA / Test', color: '#F59E0B' },
    { name: 'Research', color: '#10B981' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLUMN_CONFIG[status].color }}
            />
            <span className="uppercase tracking-wider">{COLUMN_CONFIG[status].label}</span>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && existingTask && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete task "${existingTask.title}"?`)) {
                    deleteTask(existingTask.id);
                    closeTaskModal();
                  }
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={closeTaskModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design System Typography & Elevation Tokens"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row of 3 Selectors: Status, Priority, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status Column */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Column Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ColumnId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                {COLUMNS.map((col) => (
                  <option key={col} value={col}>
                    {COLUMN_CONFIG[col].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Category & Color Presets */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Category / Label
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {categoryPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => {
                    setCategory(preset.name);
                    setCategoryColor(preset.color);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    category === preset.name
                      ? 'ring-2 ring-blue-500 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: `${preset.color}15`,
                    borderColor: `${preset.color}40`,
                    color: preset.color,
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Assignees Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Assigned Team Members
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {members.map((member) => {
                const isSelected = assigneeIds.includes(member.id);
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => {
                      if (isSelected) {
                        setAssigneeIds(assigneeIds.filter((id) => id !== member.id));
                      } else {
                        setAssigneeIds([...assigneeIds, member.id]);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <img src={member.avatar} alt={member.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{member.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Description & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what needs to be delivered..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Cover Image URL (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="px-2.5 py-2 text-rose-500 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
            {coverImage && (
              <div className="mt-2 rounded-xl overflow-hidden aspect-video max-h-32 bg-slate-100">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Subtasks & Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </label>
            </div>

            <div className="space-y-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => {
                        setSubtasks(
                          subtasks.map((s) =>
                            s.id === st.id ? { ...s, completed: !s.completed } : s
                          )
                        );
                      }}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span
                      className={`text-xs ${
                        st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add subtask input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Add a checklist item (press Enter)..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <Paperclip className="w-4 h-4 text-blue-600" />
              Attachments ({attachments.length})
            </label>

            <div className="space-y-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{att.name}</span>
                    {att.size && <span className="text-[10px] text-slate-400">({att.size})</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  placeholder="File name or document title..."
                  className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newAttachmentUrl}
                  onChange={(e) => setNewAttachmentUrl(e.target.value)}
                  placeholder="URL link (optional)..."
                  className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold shrink-0"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section (when editing existing task) */}
          {isEditing && existingTask && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Comments & Discussion ({existingTask.comments.length})
              </label>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-thin">
                {existingTask.comments.length === 0 ? (
                  <p className="text-slate-400 italic">No comments yet. Start the conversation!</p>
                ) : (
                  existingTask.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2.5">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {comment.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleSendComment}
                  disabled={!newCommentText.trim()}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition-colors"
                  aria-label="Send comment"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer / Save Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/20"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
