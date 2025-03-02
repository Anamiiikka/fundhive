import React from 'react';
import ModalContainer from './ModalContainer';
import ModalHeader from './ModalHeader';
import StepProgress from './StepProgress';
import ErrorMessage from './ErrorMessage';
import StepForm from './StepForm';
import FormActions from './FormActions';
import { useCreateProject } from '../hooks/useCreateProject';

function CreateProject({ onClose }) {
  const {
    step,
    setStep,
    formData,
    setFormData,
    error,
    loading,
    handleFileChange,
    handleSubmit,
  } = useCreateProject({ onClose });

  return (
    <ModalContainer>
      <ModalHeader onClose={onClose} />
      <StepProgress step={step} />
      <ErrorMessage error={error} /> {/* Displays Aadhaar card error if present */}
      <StepForm
        step={step}
        formData={formData}
        setFormData={setFormData}
        handleFileChange={handleFileChange}
        loading={loading}
      />
      <FormActions step={step} setStep={setStep} handleSubmit={handleSubmit} loading={loading} />
    </ModalContainer>
  );
}

export default CreateProject;