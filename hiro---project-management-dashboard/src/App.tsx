import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { ProjectHeader } from './components/layout/ProjectHeader';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/views/ListView';
import { CalendarView } from './components/views/CalendarView';
import { HomeView } from './components/views/HomeView';
import { MyTasksView } from './components/views/MyTasksView';
import { GoalsView } from './components/views/GoalsView';
import { MembersView } from './components/views/MembersView';
import { TaskModal } from './components/modals/TaskModal';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { ShareModal } from './components/modals/ShareModal';
import { ToastContainer } from './components/common/Toast';

const DashboardContent: React.FC = () => {
  const { activeNav, viewMode } = useApp();

  return (
    <div className="min-h-screen bg-[#F1F3F8] dark:bg-slate-950 text-[#172033] dark:text-slate-100 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNavbar />

        {/* Dynamic Route/View Container */}
        <main className="flex-1 flex flex-col min-w-0">
          {activeNav === 'home' && <HomeView />}

          {activeNav === 'projects' && (
            <>
              <ProjectHeader />
              {viewMode === 'board' && <KanbanBoard />}
              {viewMode === 'list' && <ListView />}
              {viewMode === 'calendar' && <CalendarView />}
            </>
          )}

          {activeNav === 'my-tasks' && <MyTasksView />}

          {activeNav === 'goals' && <GoalsView />}

          {activeNav === 'members' && <MembersView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <TaskModal />
      <NewProjectModal />
      <ShareModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
