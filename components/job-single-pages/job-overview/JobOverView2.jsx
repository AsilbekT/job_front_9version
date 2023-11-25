import { BiCategory } from "react-icons/bi";
import { experienceLevels } from '../../../data/experienceLevels';
import { jobTypesMap } from "../../../data/job-types";

const JobOverView2 = ({ job, category = {} }) => {

  if (!job) return null;

  return (
    <ul className="job-details">
      <li>
        <i className="icon icon-calendar"></i>
        <h5>Date Posted:</h5>
        <span>{job.time}</span>
      </li>
      <li>
        <i className="icon icon-expiry"></i>
        <h5>Job Type: </h5>
        <span>{jobTypesMap[job.job_type]}</span>
      </li>
      {job.location && (
        <li>
          <i className="icon icon-location"></i>
          <h5>Location:</h5>
          <span>{job.location}</span>
        </li>
      )}
      <li>
        <i className="icon icon-user-2"></i>
        <h5>Job Title:</h5>
        <span>{job.job_title}</span>
      </li>
      {/* <li>
        <i className="icon icon-clock"></i>
        <h5>Hours:</h5>
        <span>50h / week</span>
      </li>
      <li>
        <i className="icon icon-rate"></i>
        <h5>Rate:</h5>
        <span>$15 - $25 / hour</span>
      </li> */}
      <li>
        <i className="icon icon-salary"></i>
        <h5>Salary:</h5>
        <span>${job.salary}</span>
      </li>
      {experienceLevels[job.experience] && (
        <li>
          <i className="icon icon-list"></i>
          <h5>Experience:</h5>
          <span>{experienceLevels[job.experience]}</span>
        </li>
      )}
      {category.title && (
        <li className="d-flex align-items-center gap-4 p-0">
          <BiCategory style={{ width: '25px', height: '25px' }} fill="#1967d2" />
          <div className="d-flex flex-column">
            <h5>Category:</h5>
            <span>{category.title}</span>
          </div>
        </li>
      )}
    </ul>
  );
};

export default JobOverView2;
