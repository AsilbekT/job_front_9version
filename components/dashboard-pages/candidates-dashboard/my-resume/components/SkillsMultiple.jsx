import Select from "react-select";
import { useMyResumeContext } from "../../../../../contexts/MyResumeContext";
import { useContext } from "react";
import { UserContext } from "../../../../../pages/context/UserContext";
import Modal from "../../../../Modal";
import { useCallback } from "react";

const FIELD_KEY = 'skill';

const SkillsMultiple = () => {
  const {
    fetchStates,
    addOrEditFieldItem,
    closeEditing,
    saveFieldItem,
    activeFieldEditing,
    onChangeEditingStateValue,
    removeFieldItem,
  } = useMyResumeContext();
  const { skill } = fetchStates;

  const userState = useContext(UserContext);

  const skillOptions = skill.data
    ?.filter(({ user }) => user === userState.id)
    ?.map((skill) => ({
      value: skill.id,
      label: skill.name
    }));

  const onSkillChange = useCallback((newSkillsList) => {
    const deletedItems = [];
    skill.data?.forEach(skill => {
      const existingSkill = newSkillsList.find(({ value }) => (
        skill.id === value
      ));
      if (!existingSkill) {
        deletedItems.push(skill);
      }
    });
    deletedItems.forEach(item => removeFieldItem(FIELD_KEY, item));
  }, [skill.data, removeFieldItem]);

  return (
    <div>
      {activeFieldEditing.activeField === FIELD_KEY && (
        <Modal 
          title="Add Skill" 
          onClose={closeEditing}
          primaryAction={saveFieldItem}
        >
          <div className="row">
            <div className="form-group">
              <label>Skill name</label>
              <input
                type="text"
                required
                value={activeFieldEditing.state.name}
                onChange={(e) => onChangeEditingStateValue('name', e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
      <Select
        defaultValue={skillOptions}
        value={skillOptions}
        isMulti
        name="colors"
        onChange={onSkillChange}
        options={skillOptions || []}
        className="basic-multi-select"
        classNamePrefix="select"
        required
      />
      <button
        type="button"
        className="add-btn"
        onClick={() => addOrEditFieldItem(FIELD_KEY)}
      >
        <span className="icon flaticon-plus"></span> Add new
      </button>
    </div>
  );
};

export default SkillsMultiple;
