import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Kanban,
  List,
  Calendar,
  Search,
  Bell,
  MessageSquare,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
  User,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ViewMode } from '../../types';

export const TopNavbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    currentUser,
    members,
    setCurrentUser,
    activities,
    setIsMobileSidebarOpen,
    activeNav,
    activeProject,
    openCreateTaskModal,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(e.target as Node)) {
        setShowMessages(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'board', label: 'Board View', icon: <Kanban className="w-4 h-4" /> },
    { id: 'list', label: 'List View', icon: <List className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar View', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Views Tabs (when on projects or my-tasks) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* View Switcher Tabs (Board, List, Calendar) */}
        {(activeNav === 'projects' || activeNav === 'my-tasks') && (
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {views.map((tab) => {
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label={tab.label}
                >
                  <span className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div
          className={`relative flex items-center w-full transition-all rounded-xl ${
            isSearchFocused
              ? 'ring-2 ring-blue-500/30 bg-white dark:bg-slate-900 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800/70'
          }`}
        >
          <Search className="w-4 h-4 ml-3 text-slate-400 shrink-0" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter({ searchQuery: e.target.value })}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search tasks, descriptions, or tags..."
            className="w-full py-2 pl-2.5 pr-8 text-xs bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter({ searchQuery: '' })}
              className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Notifications, Messages, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Toggle (shown on small screens) */}
        <div className="md:hidden">
          <button
            onClick={() => {
              const query = prompt('Search tasks:', filters.searchQuery);
              if (query !== null) updateFilter({ searchQuery: query });
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowMessages(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Activity & Notifications</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {activities.length}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Live stream</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-1 scrollbar-thin">
                {activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="py-2.5 flex items-start gap-3">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 text-xs">
                      <p className="text-slate-700 dark:text-slate-200 leading-snug">
                        <span className="font-semibold text-slate-900 dark:text-white">{act.userName}</span>{' '}
                        {act.action}{' '}
                        <span className="font-medium text-blue-600 dark:text-blue-400">"{act.target}"</span>
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5" />
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages / Quick Feedback Popover */}
        <div className="relative" ref={messagesRef}>
          <button
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Messages"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">Team Chat & Sync</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Collaborate with {members.length} teammates in <b>{activeProject?.name || 'Workspace'}</b>.
              </p>
              <div className="flex -space-x-2 mb-3">
                {members.slice(0, 5).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    title={`${m.name} (${m.role})`}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setShowMessages(false);
                  openCreateTaskModal('TODO');
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Assign Work or Post Update
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowMessages(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="User profile menu"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">{currentUser.role}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                  <span className="inline-block mt-0.5 text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {currentUser.department}
                  </span>
                </div>
              </div>

              {/* Switch active user profile demo */}
              <div className="py-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">
                  Switch Active Teammate
                </div>
                <div className="space-y-1">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCurrentUser(m);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        m.id === currentUser.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{m.name}</span>
                      </div>
                      {m.id === currentUser.id && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
