import React from 'react';
import CreateProject from './CreateProject';
import { UserProfile } from './UserProfile';

function Modals({
  showProfile,
  setShowProfile,
  showCreateProject,
  onCloseCreateProject,
  handleDeleteProject, // Add this prop
}) {
  return (
    <>
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} handleDeleteProject={handleDeleteProject} />
      )}
      {showCreateProject && <CreateProject onClose={onCloseCreateProject} />}
    </>
  );
}

export default Modals;