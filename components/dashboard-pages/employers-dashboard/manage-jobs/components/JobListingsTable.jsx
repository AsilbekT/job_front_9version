import dayjs from "dayjs";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFetch } from "../../../../../hooks/useFetch.js";
import { UserContext } from "../../../../../pages/context/UserContext.js";

const JobListingsTable = () => {
  const jobsFetch = useFetch();
  const categoriesFetch = useFetch();
  const applicationsFetch = useFetch();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    if (user?.companyData) {
      Promise.all([
        jobsFetch.makeRequest(`/companies/${user.companyData.id}/jobs/`)
          .then(setFilteredJobs),
        categoriesFetch.makeRequest('/catagories/'),
        applicationsFetch.makeRequest(`/companies/${user.companyData.id}/applicants/`),
      ]);
    }
  }, [user]);

  const onDeleteJob = useCallback(async (job) => {
    await jobsFetch.makeRequest(`/jobs/${job.id}/`, {
      method: 'DELETE'
    });
    setFilteredJobs(prev => (
      (prev || []).filter(({ id }) => id !== job.id)
    ));
  }, []);

  const countApplications = useCallback((jobId) => {
    if (applicationsFetch.loading) return '...';
    return applicationsFetch.data?.reduce((acc, { job }) => {
      if (job === jobId) {
        acc++;
      }
      return acc;
    }, 0);
  }, [applicationsFetch.data, applicationsFetch.loading]);

  const onDateFilterChange = useCallback((e) => {
    const filterValue = +e.target.value;
    setFilteredJobs(prev => {
      return prev.filter(({ created_at }) => (
        dayjs(created_at).isAfter(dayjs().subtract(filterValue, 'months')
        )))
    });
  }, []);

  const jobEls = filteredJobs?.map(job => {
    const category = categoriesFetch.data?.find(({ id }) => job.category === id);
    const applicationsCount = countApplications(job.id);

    return (
      <tr key={job.id}>
        <td>
          <div className="job-block">
            <div className="inner-box">
              <div className="content">
                <span className="company-logo">
                  <img src={job.company.company_logo} alt="logo" />
                </span>
                <h4>
                  <Link href={`/jobs/${job.id}`}>
                    {job.job_title}
                  </Link>
                </h4>
                <ul className="job-info">
                  {category && (
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {category.title}
                    </li>
                  )}
                  <li>
                    <span className="icon flaticon-map-locator"></span>
                    {job.location}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td className="applied">
          <a href="#">{applicationsCount} Applied</a>
        </td>
        <td>
          {dayjs(job.created_at).format('DD MMMM YYYY HH:MM A')}
        </td>
        <td>
          <div className="option-box">
            <ul className="option-list">
              <li>
                <Link href={`/jobs/${job.id}/edit`} data-text="Edit Job">
                  <span className="la la-pen"></span>
                </Link>
              </li>
              <li>
                <Link href={`/jobs/${job.id}`} data-text="View Job">
                  <span className="la la-eye"></span>
                </Link>
              </li>
              <li>
                <button data-text="Delete Job" onClick={() => onDeleteJob(job)}>
                  <span className="la la-trash"></span>
                </button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    )
  });

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Job Listings</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select onChange={onDateFilterChange} className="chosen-single form-select">
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
            <option value="16">Last 16 Months</option>
            <option value="24">Last 24 Months</option>
            <option value="60">Last 5 years</option>
          </select>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Applications</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {jobEls}
            </tbody>
          </table>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
