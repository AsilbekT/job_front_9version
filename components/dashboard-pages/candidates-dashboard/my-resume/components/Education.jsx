import { memo } from "react";
import { useMyResumeContext } from "../../../../../contexts/MyResumeContext";
import Modal from "../../../../Modal";
import { useCallback } from "react";

const FIELD_KEY = 'education';

const Education = () => {
  const {
    fetchStates,
    removeFieldItem,
    closeEditing,
    addOrEditFieldItem,
    activeFieldEditing,
    onChangeEditingStateValue,
    saveFieldItem,
  } = useMyResumeContext();
  const { education } = fetchStates;

  const educationEls = education.data?.map((education, index) => {
    return (
      <div className="resume-block" key={education.id + index}>
        <div className="inner">
          <span className="name">{education.degree.charAt(0)}</span>
          <div className="title-box">
            <div className="info-box">
              <h3>{education.degree}</h3>
              <span>{education.institution}</span>
            </div>
            <div className="edit-box">
              <span className="year">
                {education.start_year}{education.end_year && ` - ${education.end_year}`}
              </span>
              <div className="edit-btns">
                <button onClick={() => addOrEditFieldItem(FIELD_KEY, education.id)}>
                  <span className="la la-pencil"></span>
                </button>
                <button onClick={() => removeFieldItem(FIELD_KEY, education)}>
                  <span className="la la-trash"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="text">
            {education.description}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {activeFieldEditing.activeField === FIELD_KEY && (
        <Modal
          title="Add / Edit Education"
          onClose={closeEditing}
          primaryAction={saveFieldItem}
        >
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <label>Degree Type</label>
              <input
                type="text"
                required
                value={activeFieldEditing.state.degree}
                onChange={(e) => onChangeEditingStateValue('degree', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Institution</label>
              <input
                type="text"
                required
                value={activeFieldEditing.state.institution}
                onChange={(e) => onChangeEditingStateValue('institution', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Start year</label>
              <input
                type="number"
                className="no-arrows-input"
                required
                value={activeFieldEditing.state.start_year}
                onChange={(e) => onChangeEditingStateValue('start_year', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>End year</label>
              <input
                type="number"
                required
                className="no-arrows-input"
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
      <div className="resume-outer">
        <div className="upper-title">
          <h4>Education</h4>
          <button
            className="add-info-btn"
            onClick={() => addOrEditFieldItem(FIELD_KEY)}
            type="button"
          >
            <span className="icon flaticon-plus"></span> Add Education
          </button>
        </div>
        {educationEls}
      </div>
    </>
  );
};

export default memo(Education);
