import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { VscChromeClose } from 'react-icons/vsc';
import { experienceLevels } from '../../../../../data/experienceLevels';
import { jobTypes } from "../../../../../data/job-types";
import { salaryRanges } from "../../../../../data/salary-range";
import { useFetch } from "../../../../../hooks/useFetch";
import { UserContext } from "../../../../../pages/context/UserContext";
import Modal from "../../../../Modal";

const DEFAULT_JOB = {
  job_title: '',
  company: 1,
  location: '',
  salary: '',
  tag: '',
  category: '',
  experience: '1',
  description: '',
  job_type: 'FT',
  required_skills: '',
  salary_range: 'monthly',
  city: '',
  state: '',
  salaryMin: '',
  salaryMax: '',
};

const getInitialJobData = (job) => {
  if (!job) return DEFAULT_JOB;

  const [salary, salaryRange] = job.salary.split(' per ');
  const [salaryMin = '', salaryMax = ''] = salary.includes(' - ') ? salary.split(' - ') : [];
  const jobLocationSplit = (job.location.match(/\(([^)]+)\)/) || [])[0];
  const [city = '', state = ''] = (jobLocationSplit || '').split(', ');

  return {
    ...DEFAULT_JOB,
    ...job,
    city: city.replace('(', ''),
    state: state.replace(')', ''),
    salary,
    salaryMax,
    salaryMin,
    salary_range: salaryRange || 'month',
    location: jobLocationSplit ? job.location.replace(jobLocationSplit, '') : job.location
  };
};

const PostBoxForm = ({ job }) => {
  const categoriesFetch = useFetch();
  const formFetch = useFetch();
  const [success, setSuccess] = useState(false);
  const [tag, setTag] = useState('');
  const [skill, setSkill] = useState('');
  const [formError, setFormError] = useState(null);
  const [savedJob, setSavedJob] = useState(null);
  const router = useRouter();

  const user = useContext(UserContext);

  const [form, setForm] = useState(getInitialJobData(job));

  useEffect(() => {
    if (job) {
      setForm(getInitialJobData(job));
    }
  }, [job]);

  const tagsArr = form.tag.split(',').filter(Boolean);
  const skillsArr = form.required_skills.split(',').filter(Boolean);

  const onRedirectToJob = useCallback(() => {
    if (!savedJob) return;
    router.replace(`/jobs/${savedJob.id}`);
  }, [savedJob, router]);

  useEffect(() => {
    if (formError || formFetch.error || success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [formError, formFetch.error, success]);

  const onSubmitForm = useCallback(async (e) => {
    try {
      e.preventDefault();
      setSavedJob(null);
      setFormError(null);
      if (!skillsArr.length) {
        setFormError('Missing skills, at least one skill is required');
        return;
      }
      setSuccess(false);
      e.preventDefault();
      const data = await formFetch.makeRequest(
        job ? `/jobs/${job.id}/` : '/jobs/',
        {
          method: job ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...form,
            company: user?.companyData?.id,
            category: +form.category,
            location: form.city.trim() + (form.state ? `, ${form.state.trim()}` : ''),
            experience: +form.experience,
            salary:
              form.salary
                ? `${form.salary} per ${form.salary_range}`
                : `${form.salaryMin} - ${form.salaryMax} per ${form.salary_range}`,
          })
        }
      );
      if (!data.error) {
        setSuccess(Boolean(data));
        setSavedJob(data);
      } else {
        setSuccess(false);
        setFormError('Something went wrong, please try again.');
        setSavedJob(null);
      }
    } catch (er) {
      setSuccess(false);
      setSavedJob(null);
    }
  }, [form, user, skillsArr, job]);

  const onFormValueChange = useCallback((key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  useEffect(() => {
    Promise.all([
      categoriesFetch.makeRequest('/catagories/')
        .then((response) => {
          const [firstCategory] = response || [];
          if (!firstCategory) return;
          onFormValueChange('category', firstCategory?.id)
        }),
    ]);
  }, []);

  const onAddTag = useCallback(() => {
    const trimmedTag = tag.trim().replace(/\s*,\s*/ig, ',');
    if (!trimmedTag.length) return;
    onFormValueChange('tag', form.tag + (form.tag.length ? ',' : '') + trimmedTag);
    setTag('');
  }, [tag, form.tag]);

  const onAddSkill = useCallback(() => {
    const trimmedSkill = skill.trim().replace(/\s*,\s*/ig, ',');
    if (!trimmedSkill.length) return;
    onFormValueChange(
      'required_skills',
      form.required_skills + (form.required_skills.length ? ',' : '') + trimmedSkill
    );
    setSkill('');
  }, [skill, form.required_skills]);

  const onRemoveTag = useCallback((tag) => {
    const newTagsList = tagsArr.filter((addedTag) => addedTag !== tag);
    onFormValueChange('tag', newTagsList.join(','));
  }, [tagsArr]);

  const onRemoveSkill = useCallback((skill) => {
    const newSkillsList = skillsArr.filter((addedSkill) => addedSkill !== skill);
    onFormValueChange('required_skills', newSkillsList.join(','));
  }, [skillsArr]);

  const categoryOptions = categoriesFetch.data?.map(category => {
    return (
      <option key={category.id} value={category.id}>
        {category.title}
      </option>
    );
  });

  const salaryRangeOptions = salaryRanges.map((range, index) => {
    return (
      <option value={range.value} key={index}>
        {range.label}
      </option>
    )
  });

  const jobTypeOptions = jobTypes.map(type => {
    return (
      <option key={type.value} value={type.value}>
        {type.label}
      </option>
    );
  });

  const skillEls = useMemo(() =>
    skillsArr.map((skill, index) => (
      <button
        onClick={() => onRemoveSkill(skill)}
        key={index}
        type="button"
        className="border-1 border py-1 px-2 rounded d-flex align-items-center gap-1"
      >
        {skill}
        <VscChromeClose />
      </button>
    )
    ), [skillsArr]);

  const tagEls = useMemo(() =>
    tagsArr.map((tag, index) => (
      <button
        type="button"
        onClick={() => onRemoveTag(tag)}
        key={index}
        className="border-1 border py-1 px-2 rounded d-flex align-items-center gap-1"
      >
        {tag}
        <VscChromeClose />
      </button>
    )
    ), [tagsArr]);

  const experienceLevelOptions = Object.keys(experienceLevels).map(level => {
    return (
      <option key={level} value={level}>
        {experienceLevels[level]}
      </option>
    );
  });

  console.log({ form })

  return (
    <>
      {savedJob && (
        <Modal
          primaryActionTitle="See the Posting"
          onClose={() => setSavedJob(null)}
          primaryAction={onRedirectToJob}
        >
          <p>Your job posting has successfully been saved!</p>
        </Modal>
      )}
      <form className="default-form" onSubmit={onSubmitForm}>
        {(formFetch.error || formError) && (
          <h5 className="error mb-4">
            {formError || 'Something went wrong'}
          </h5>
        )}
        {success && (
          <h5 className="success mb-3">
            Job posting has successfully been saved!
          </h5>
        )}
        <div className="row">
          {/* <!-- Input --> */}
          <div className="form-group col-lg-12 col-md-12">
            <label>Job Title</label>
            <input
              value={form.job_title}
              onChange={(e) => onFormValueChange('job_title', e.target.value)}
              type="text"
              placeholder="Title"
              required
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => onFormValueChange('category', +e.target.value)}
              className="chosen-single form-select"
              required
            >
              {categoryOptions}
            </select>
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Offered Salary ($)</label>
            <input
              value={form.salary}
              onChange={(e) => onFormValueChange('salary', +e.target.value)}
              type="number"
              min={0}
              placeholder="Enter amount"
              className="no-arrows-input"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Minimum Salary ($)</label>
            <input
              value={form.salaryMin.toString()}
              onChange={(e) => onFormValueChange('salaryMin', +e.target.value)}
              type="number"
              min={0}
              placeholder="Enter minimum amount"
              className="no-arrows-input"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Maximum Salary ($)</label>
            <input
              value={form.salaryMax.toString()}
              onChange={(e) => onFormValueChange('salaryMax', +e.target.value)}
              type="number"
              min={0}
              placeholder="Enter maximum amount"
              className="no-arrows-input"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Salary Type</label>
            <select
              className="form-select"
              onChange={(e) => onFormValueChange('salary_range', e.target.value)}
              value={form.salary_range}
            >
              {salaryRangeOptions}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Experience</label>
            <select
              className="form-select"
              onChange={(e) => onFormValueChange('experience', e.target.value)}
              value={form.experience}
            >
              {experienceLevelOptions}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Job Type</label>
            <select
              value={form.job_type}
              className="chosen-single form-select"
              onChange={(e) => onFormValueChange('job_type', e.target.value)}
            >
              {jobTypeOptions}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>City</label>
            <input
              value={form.city}
              onChange={(e) => onFormValueChange('city', e.target.value)}
              type="text"
              placeholder="City"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>State</label>
            <input
              value={form.state}
              onChange={(e) => onFormValueChange('state', e.target.value)}
              type="text"
              placeholder="State"
            />
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <label>Job Description</label>
            <textarea
              value={form.description}
              onChange={(e) => onFormValueChange('description', e.target.value)}
              type="text"
              placeholder="Description"
            />
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <label>Required skills</label>
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              type="text"
              placeholder="Input skills separated by comma"
            />
            {skillEls.length > 0 && (
              <div className="d-flex gap-2 mt-2">
                {skillEls}
              </div>
            )}
            <button
              type="button"
              className="add-btn"
              onClick={onAddSkill}
            >
              <span className="icon flaticon-plus"></span> Add skill
            </button>
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <label>Tag</label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              type="text"
              placeholder="Input tags separated by comma"
            />
            {tagEls.length > 0 && (
              <div className="d-flex gap-2 mt-2">
                {tagEls}
              </div>
            )}
            <button
              type="button"
              className="add-btn"
              onClick={onAddTag}
            >
              <span className="icon flaticon-plus"></span> Add tag
            </button>
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-12 col-md-12 text-right">
            <button type="submit" className="theme-btn btn-style-one">
              {job ? 'Edit the job' : 'Post job'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PostBoxForm;
