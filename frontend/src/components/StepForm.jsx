import React from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

function StepForm({ step, formData, setFormData, handleFileChange, loading }) {
  return (
    <div className="p-6">
      {step === 1 && <StepOne formData={formData} setFormData={setFormData} loading={loading} />}
      {step === 2 && <StepTwo formData={formData} setFormData={setFormData} loading={loading} />}
      {step === 3 && <StepThree formData={formData} handleFileChange={handleFileChange} loading={loading} />}
    </div>
  );
}

export default StepForm;