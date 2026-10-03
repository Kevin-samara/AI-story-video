import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { CreateVideoPage } from './pages/CreateVideoPage';
import { CharactersPage } from './pages/CharactersPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GeneratedVideosPage } from './pages/GeneratedVideosPage';
import { SettingsPage } from './pages/SettingsPage';
import { Project, SystemSettings } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('create');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setActiveTab('create');
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigateToCreate={() => setActiveTab('create')}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'create' && (
            <CreateVideoPage
              activeProject={activeProject}
              setActiveProject={setActiveProject}
              onNavigateToGenerated={() => setActiveTab('generated')}
            />
          )}

          {activeTab === 'characters' && (
            <CharactersPage />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'generated' && (
            <GeneratedVideosPage
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

    </div>
  );
}

export default App;
