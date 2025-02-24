import React from 'react';
import CreateProject from './CreateProject'; // Changed to default import
import { UserProfile } from './UserProfile'; // Assuming UserProfile is still a named export

function Modals({ showProfile, setShowProfile, showCreateProject, onCloseCreateProject }) {
  return (
    <>
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      {showCreateProject && <CreateProject onClose={onCloseCreateProject} />}
    </>
  );
}

export default Modals;