import { memo } from "react";
import { useMyResumeContext } from "../../../../../contexts/MyResumeContext";
import Modal from "../../../../Modal";

const FIELD_KEY = 'award';

const Awards = () => {
  const {
    fetchStates,
    removeFieldItem,
    closeEditing,
    addOrEditFieldItem,
    activeFieldEditing,
    onChangeEditingStateValue,
    saveFieldItem,
  } = useMyResumeContext();
  const { award } = fetchStates;

  const awardEls = award.data?.map((award, index) => {
    return (
      <div className="resume-block" key={award.id + index}>
        <div className="inner">
          <span className="name">{award.title.charAt(0)}</span>
          <div className="title-box">
            <div className="info-box">
              <h3>{award.title}</h3>
              <span></span>
            </div>
            <div className="edit-box">
              <span className="year">{award.year}</span>
              <div className="edit-btns">
                <button onClick={() => addOrEditFieldItem(FIELD_KEY, award.id)}>
                  <span className="la la-pencil"></span>
                </button>
                <button onClick={() => removeFieldItem(FIELD_KEY, award)}>
                  <span className="la la-trash"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="text">
            {award.description}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {activeFieldEditing.activeField === FIELD_KEY && (
        <Modal
          title="Add / Edit Awards"
          onClose={closeEditing}
          primaryAction={saveFieldItem}
        >
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <label>Award title</label>
              <input
                type="text"
                required
                value={activeFieldEditing.state.title}
                onChange={(e) => onChangeEditingStateValue('title', e.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Year awarded</label>
              <input
                type="number"
                required
                min={1000}
                value={activeFieldEditing.state.year}
                onChange={(e) => onChangeEditingStateValue('year', +e.target.value)}
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
      <div className="resume-outer theme-yellow">
        <div className="upper-title">
          <h4>Awards</h4>
          <button
            type="button"
            className="add-info-btn"
            onClick={() => addOrEditFieldItem(FIELD_KEY)}
          >
            <span className="icon flaticon-plus"></span> Awards
          </button>
        </div>
        {awardEls}
      </div>
    </>
  );
};

export default memo(Awards);
