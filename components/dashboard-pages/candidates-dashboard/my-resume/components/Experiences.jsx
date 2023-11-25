import { memo } from "react";
import { useMyResumeContext } from "../../../../../contexts/MyResumeContext";
import Modal from "../../../../Modal";

const FIELD_KEY = 'work_experience';

const Experiences = () => {
  const {
    fetchStates,
    removeFieldItem,
    closeEditing,
    addOrEditFieldItem,
    activeFieldEditing,
    onChangeEditingStateValue,
    saveFieldItem,
  } = useMyResumeContext();
  const { work_experience } = fetchStates;

  const experienceEls = work_experience.data?.map((experience, index) => {
    return (
      <div className="resume-block" key={experience.id + index}>
        <div className="inner">
          <span className="name">{experience.company.charAt(0)}</span>
          <div className="title-box">
            <div className="info-box">
              <h3>{experience.job_title}</h3>
              <span>{experience.company}</span>
            </div>
            <div className="edit-box">
              <span className="year">
                {experience.start_year}{experience.end_year && ` - ${experience.end_year}`}
              </span>
              <div className="edit-btns">
                <button onClick={() => addOrEditFieldItem(FIELD_KEY, experience.id)}>
                  <span className="la la-pencil"></span>
                </button>
                <button onClick={() => removeFieldItem(FIELD_KEY, experience)}>
                  <span className="la la-trash"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="text">
            {experience.description}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {activeFieldEditing.activeField === FIELD_KEY && (
        <Modal
          primaryAction={saveFieldItem}
          title="Add / Edit Experience"
          onClose={closeEditing}
        >
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <label>Job title</label>
              <input
                type="text"
                required
                value={activeFieldEditing.state.job_title}
                onChange={(e) => onChangeEditingStateValue('job_title', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Company</label>
              <input
                type="text"
                required
                value={activeFieldEditing.state.company}
                onChange={(e) => onChangeEditingStateValue('company', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Start year</label>
              <input
                className="no-arrows-input"
                type="number"
                required
                value={activeFieldEditing.state.start_year}
                onChange={(e) => onChangeEditingStateValue('start_year', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>End year</label>
              <input
                type="number"
                className="no-arrows-input"
                required
                value={activeFieldEditing.state.end_year}
                onChange={(e) => onChangeEditingStateValue('end_year', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-12 col-md-12">
              <label>Description</label>
              <textarea
                placeholder="description"
                value={activeFieldEditing.state.description}
                onChange={(e) => onChangeEditingStateValue('description', e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
      <div className="resume-outer theme-blue">
        <div className="upper-title">
          <h4>Work & Experience</h4>
          <button
            className="add-info-btn"
            type="button"
            onClick={() => addOrEditFieldItem(FIELD_KEY)}
          >
            <span className="icon flaticon-plus"></span> Add Work
          </button>
        </div>
        {experienceEls}
      </div>
    </>
  );
};

export default memo(Experiences);
