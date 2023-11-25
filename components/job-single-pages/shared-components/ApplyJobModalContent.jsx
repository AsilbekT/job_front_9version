import { useContext } from "react";
import { UserContext } from "../../../pages/context/UserContext";

const ApplyJobModalContent = ({
  onFileChange,
  onApply,
  file,
  setSelectedCv,
  loading,
  validationError,
  selectedCv,
  closeBtnRef,
  success,
}) => {
  const user = useContext(UserContext);
  // const cvFilename = user?.cv?.split('/')?.at(-1);
  const resumeEls = user?.resumes?.map((resume) => {
    return (
      <span
        role="checkbox"
        tabIndex={0}
        onClick={() => setSelectedCv(resume.id)}
        className={`label${selectedCv === resume.id ? ' active' : ''}`}
        key={resume.id}
      >
        {resume.title}
      </span>
    );
  });

  let content;
  if (loading) {
    content = (
      <h5 className="d-block text-center">Loading...</h5>
    );
  } else {
    content = (
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          {success ? (
            <>
              <h5 className="mb-4 success text-center d-block">
                Job application has been created and Resume has been forwarded to the company owner!😊
              </h5>
              <button
                className="theme-btn btn-style-one w-100"
                title="Finish"
                onClick={() => closeBtnRef.current?.click()}
              >
                Finish
              </button>
            </>
          ) : (
            <>
              {validationError && (
                <h6 className="mb-1 error text-center d-block">{validationError}</h6>
              )}
              {(!user || user?.resumes?.length === 0) ? (
                <div className="uploading-outer apply-cv-outer">
                  <div className="uploadButton">
                    <input
                      className="uploadButton-input"
                      type="file"
                      onChange={onFileChange}
                      accept="application/pdf, application/msword"
                      id="upload-rt"
                    />
                    <label
                      className="uploadButton-button ripple-effect"
                      htmlFor="upload-rt"
                    >
                      {file ? file.name : 'Upload Resume (pdf, docx, doc)'}
                    </label>
                  </div>
                </div>
              ) : (
                <div className="form-group d-flex flex-column gap-2">
                  <p>Select one of your resumes to apply:</p>
                  {resumeEls}
                </div>
              )}
              <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                <button
                  className="theme-btn btn-style-one w-100"
                  type="submit"
                  name="submit-form"
                  onClick={onApply}
                >
                  Apply
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="default-form job-apply-form">
      {content}
    </div>
  );
};

export default ApplyJobModalContent;
