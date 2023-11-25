import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useFetch } from "../../../../../hooks/useFetch";
import { UserContext, dispatchRefetchUserEvent } from "../../../../../pages/context/UserContext";
import { fetchWithAuth } from "../../../../../utils/fetch.util";
import Modal from "../../../../Modal";

function checkFileTypes(files) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  for (let i = 0; i < files.length; i++) {
    if (!allowedTypes.includes(files[i].type)) {
      return false;
    }
  }
  return true;
}

const Resumes = () => {
  const [title, setTitle] = useState('');
  const [getManager, setManager] = useState([]);
  const [getError, setError] = useState("");
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const resumesFetch = useFetch(false);
  const [isAdding, setIsAdding] = useState(false);

  const userResumes = user?.resumes || [];

  useEffect(() => {
    if (userResumes.length) {
      setManager(userResumes.map(({ title }) => ({ name: title })));
    }
  }, [userResumes]);

  const cvManagerHandler = async (e) => {
    try {
      setLoading(true);
      const data = Array.from(e.target.files);
      const [selectedFile] = data;

      if (!selectedFile) {
        setError('No file is selected, please select at least one file');
        return;
      }

      if (checkFileTypes(data)) {
        setManager(getManager.concat(data));
        setError("");
      } else {
        setError("Only accept  (.doc, .docx, .pdf) file");
        return;
      }

      const formData = new FormData();
      formData.append('user', user.id);
      formData.append('title', title || selectedFile.name);
      formData.append('resume', selectedFile);

      const response = await fetchWithAuth(
        `/resumes/`,
        {
          method: 'POST',
          body: formData
        }
      );
      const responseData = await response.json();
      dispatchRefetchUserEvent();
      setTitle('');
      setIsAdding(false);
      return responseData;
    } catch (er) {
      console.log(er);
    } finally {
      setLoading(false);
    }
  };

  // delete image
  const deleteHandler = async (fileName) => {
    try {
      const resume = userResumes.find(({ title }) => title === fileName);
      if (!resume) return;
      setLoading(true);
      await fetchWithAuth(`/resumes/${resume.id}/`, {
        method: 'DELETE'
      });
      dispatchRefetchUserEvent();
    } catch (er) {
      console.log(er);
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = useCallback(() => {
    setIsAdding(false);
    setTitle('');
  }, []);

  const resumeEls = userResumes.map((resume) => {
    return (
      <div key={resume.id} className="d-flex align-items-center gap-3">
        <span className="label">{resume.title}</span>
        <button onClick={() => deleteHandler(resume.title)}>
          <span className="la la-trash"></span>
        </button>
      </div>
    );
  });

  return (
    <>
      {isAdding && (
        <Modal
          title="Add Resume"
          onClose={onCloseModal}
        >
          {resumesFetch.loading ? 'Loading...' : (
            <div className="d-flex flex-column align-items-center">
              <div className="form-group col-lg-6 col-md-12">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter resume title"
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="uploading-resume">
                  <div className="uploadButton">
                    <input
                      className="uploadButton-input"
                      type="file"
                      name="attachments[]"
                      placeholder="resume title"
                      accept="application/msword,application/pdf"
                      id="upload"
                      onChange={cvManagerHandler}
                    />
                    <label className="cv-uploadButton" htmlFor="upload">
                      <span className="title">Drop files here to upload</span>
                      <span className="text">
                        To upload file size is (Max 5Mb) and allowed file
                        types are (.doc, .docx, .pdf)
                      </span>
                      <span className="theme-btn btn-style-one">
                        Upload Resume
                      </span>
                      {getError !== "" ? (
                        <p className="ui-danger mb-0">{getError}</p>
                      ) : undefined}
                    </label>
                    <span className="uploadButton-file-name"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
      <div className="resume-outer">
        <div className="upper-title">
          <h4>Resumes</h4>
          <button
            className="add-info-btn"
            type="button"
            onClick={() => setIsAdding(true)}
          >
            <span className="icon flaticon-plus"></span> Add Resume
          </button>
        </div>
        {loading
          ? 'Loading...'
          : (
            resumeEls.length > 0
              ? (
                <div className="form-group d-flex flex-column gap-2">
                  {resumeEls}
                </div>
              )
              : 'No resumes found'
          )
        }
      </div>
    </>
  );
};

export default memo(Resumes);
