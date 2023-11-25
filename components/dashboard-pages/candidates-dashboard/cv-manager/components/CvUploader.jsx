import { useContext, useEffect, useMemo, useState } from "react";
import { useFetch } from "../../../../../hooks/useFetch";
import { UserContext } from "../../../../../pages/context/UserContext";
import { fetchWithAuth } from "../../../../../utils/fetch.util";

// validation chaching
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

const CvUploader = () => {
    const [getManager, setManager] = useState([]);
    const [getError, setError] = useState("");
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const resumesFetch = useFetch();

    useEffect(() => {
        resumesFetch.makeRequest('/resumes/');
    }, []);

    const userResumes = useMemo(() => {
        return resumesFetch.data?.filter((resume) => resume.user === user?.id) || [];
    }, [resumesFetch.data, user?.id]);

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

            const isExist = getManager?.some((file1) =>
                data.some((file2) => file1.name === file2.name)
            );
            if (!isExist) {
                if (checkFileTypes(data)) {
                    setManager(getManager.concat(data));
                    setError("");
                } else {
                    setError("Only accept  (.doc, .docx, .pdf) file");
                    return;
                }
            } else {
                setError("File already exists");
                return;
            }

            const formData = new FormData();
            formData.append('user', user.id);
            formData.append('title', selectedFile.name);
            formData.append('resume', selectedFile);

            const response = await fetchWithAuth(
                `/resumes/`,
                {
                    method: 'POST',
                    body: formData
                }
            );
            const responseData = await response.json();
            // window.location.reload();
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
            const updatedResumesList = getManager?.filter((file) => file.name !== fileName);
            setManager(updatedResumesList);
        } catch (er) {
            console.log(er);
        } finally {
            setLoading(false);
        }
    };

    if (loading || resumesFetch.loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <>
            {/* Start Upload resule */}
            <div className="uploading-resume">
                <div className="uploadButton">
                    <input
                        className="uploadButton-input"
                        type="file"
                        name="attachments[]"
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
            {/* End upload-resume */}

            {/* Start resume Preview  */}
            <div className="files-outer">
                {getManager?.map((file, i) => (
                    <div key={i} className="file-edit-box">
                        <span className="title">{file.name}</span>
                        <div className="edit-btns">
                            {/* <button>
                                <span className="la la-pencil"></span>
                            </button> */}
                            <button onClick={() => deleteHandler(file.name)}>
                                <span className="la la-trash"></span>
                            </button>
                        </div>
                    </div>
                ))}

                {/* <div className="file-edit-box">
                    <span className="title">Sample Resume</span>
                    <div className="edit-btns">
                        <button>
                            <span className="la la-pencil"></span>
                        </button>
                        <button>
                            <span className="la la-trash"></span>
                        </button>
                    </div>
                </div>

                <div className="file-edit-box">
                    <span className="title">Sample Resume</span>
                    <div className="edit-btns">
                        <button>
                            <span className="la la-pencil"></span>
                        </button>
                        <button>
                            <span className="la la-trash"></span>
                        </button>
                    </div>
                </div>*/}
            </div>
            {/* End resume Preview  */}
        </>
    );
};

export default CvUploader;
