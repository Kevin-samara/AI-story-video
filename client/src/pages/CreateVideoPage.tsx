import React, { useState } from 'react';
import { PromptInput } from '../components/PromptInput';
import { StoryPlanPreview } from '../components/StoryPlanPreview';
import { TimelineEditor } from '../components/TimelineEditor';
import { GenerationProgressModal } from '../components/GenerationProgressModal';
import { VideoPlayer } from '../components/VideoPlayer';
import { StoryPlan, ProjectSettings, Project } from '../types';
import { api } from '../services/api';

interface CreateVideoPageProps {
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  onNavigateToGenerated: () => void;
}

export const CreateVideoPage: React.FC<CreateVideoPageProps> = ({
  activeProject,
  setActiveProject,
  onNavigateToGenerated
}) => {
  const [storyPlan, setStoryPlan] = useState<StoryPlan | null>(activeProject?.storyPlan || null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);

  // Phase workflow: 'input' -> 'preview' -> 'generating' -> 'completed'
  const currentStep = activeProject?.status === 'completed'
    ? 'completed'
    : activeProject?.status === 'generating'
    ? 'generating'
    : storyPlan
    ? 'preview'
    : 'input';

  // Generate Story Plan from User Prompt
  const handleGeneratePlan = async (prompt: string, settings: ProjectSettings) => {
    setIsLoadingPlan(true);
    try {
      const plan = await api.generateStoryPlan(prompt, settings);
      setStoryPlan(plan);

      // Create a draft project in DB
      const proj = await api.createProject(prompt, settings, plan);
      setActiveProject(proj);
    } catch (err: any) {
      alert(err.message || 'Failed to generate story plan.');
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Approve Plan and Trigger Background Video Generation
  const handleApproveAndGenerate = async () => {
    if (!activeProject || !storyPlan) return;
    setIsSubmittingJob(true);
    try {
      // First update DB with any edits made to plan
      await api.updateProjectPlan(activeProject.id, storyPlan);

      // Trigger background generation
      const updatedProj = await api.startGeneration(activeProject.id);
      setActiveProject(updatedProj);
      setShowProgressModal(true);

      // Start polling for project status updates
      pollProjectStatus(activeProject.id);
    } catch (err: any) {
      alert(err.message || 'Failed to start generation.');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  // Poll job status every 3 seconds
  const pollProjectStatus = (projectId: string) => {
    const interval = setInterval(async () => {
      try {
        const p = await api.getProject(projectId);
        setActiveProject(p);
        if (p.status === 'completed' || p.status === 'failed') {
          clearInterval(interval);
        }
      } catch (e) {
        clearInterval(interval);
      }
    }, 3000);
  };

  // Single Scene Regeneration
  const handleRegenerateScene = async (sceneNumber: number, type: 'video' | 'voice' | 'image' | 'all') => {
    if (!activeProject) return;
    try {
      const updated = await api.regenerateScene(activeProject.id, sceneNumber, type);
      setActiveProject(updated);
      if (updated.storyPlan) setStoryPlan(updated.storyPlan);
    } catch (err: any) {
      alert(err.message || 'Scene regeneration failed.');
    }
  };

  const handleUpdateScene = async (sceneNumber: number, updatedData: any) => {
    if (!activeProject || !storyPlan) return;
    try {
      await api.updateScene(activeProject.id, sceneNumber, updatedData);
      const p = await api.getProject(activeProject.id);
      setActiveProject(p);
      if (p.storyPlan) setStoryPlan(p.storyPlan);
    } catch (e) {}
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Workflow Phase 1: Prompt Box */}
      {currentStep === 'input' && (
        <PromptInput
          onGeneratePlan={handleGeneratePlan}
          isLoading={isLoadingPlan}
        />
      )}

      {/* Workflow Phase 2: Story Plan Preview & Approval */}
      {currentStep === 'preview' && storyPlan && (
        <>
          <StoryPlanPreview
            plan={storyPlan}
            onUpdatePlan={setStoryPlan}
            onApproveAndGenerate={handleApproveAndGenerate}
            onRegeneratePlan={() => handleGeneratePlan(storyPlan.rawPrompt, activeProject?.settings || { duration: 60, genre: 'Auto-Detect', visualStyle: 'Cinematic', aspectRatio: '9:16', quality: '720p', lowCostMode: false })}
            isSubmitting={isSubmittingJob}
          />

          <TimelineEditor
            project={activeProject!}
            onUpdateScene={handleUpdateScene}
            onRegenerateScene={handleRegenerateScene}
            isRegenerating={false}
          />
        </>
      )}

      {/* Workflow Phase 3 & 4: Completed Video View */}
      {currentStep === 'completed' && activeProject && (
        <div className="space-y-8">
          <VideoPlayer
            project={activeProject}
            onEditScenes={() => setStoryPlan(activeProject.storyPlan || null)}
            onRegenerate={handleApproveAndGenerate}
          />

          <TimelineEditor
            project={activeProject}
            onUpdateScene={handleUpdateScene}
            onRegenerateScene={handleRegenerateScene}
            isRegenerating={false}
          />
        </div>
      )}

      {/* Progress Modal */}
      {showProgressModal && activeProject && (
        <GenerationProgressModal
          project={activeProject}
          onRetry={handleApproveAndGenerate}
          onClose={() => setShowProgressModal(false)}
        />
      )}

    </div>
  );
};
