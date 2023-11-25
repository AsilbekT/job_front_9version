import dayjs from "dayjs";
import Link from "next/link.js";
import { useRouter } from "next/router.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFetch } from "../../../../../hooks/useFetch.js";
import { UserContext } from "../../../../../pages/context/UserContext.js";

const JobListingsTable = () => {
  const applications = useFetch();
  const jobs = useFetch();
  const router = useRouter();
  const categories = useFetch();
  const [filteredApplications, setFilteredApplications] = useState([]);
  const userState = useContext(UserContext);

  const fetchCategories = useCallback(async (jobs) => {
    const categoriesFetchPromises = jobs?.map(async job => {
      if (!job.category) return Promise.resolve({});
      const category = await categories.makeRequest(
        `/catagories/${job.category}/`,
        true
      );
      job['categoryData'] = category;
      return category;
    });
    const fetchedCategories = await Promise.all(categoriesFetchPromises || []);
    categories.setData(fetchedCategories);
    return fetchedCategories;
  }, []);

  const fetchJobs = useCallback(async (fetchedApplications) => {
    const applicationsCopy = fetchedApplications?.filter(({ user }) => (
      user?.id === userState.id
    ));
    if (!applicationsCopy?.length) return;
    const promises = applicationsCopy.map(async app => {
      const jobData = await jobs.makeRequest(`/jobs/${app.job}/`, true);
      app['jobData'] = jobData;
      return jobData;
    });
    const fetchedJobs = await Promise.all(promises);
    await fetchCategories(fetchedJobs);
    jobs.setData(fetchedJobs);
    setFilteredApplications(applicationsCopy);
  }, [userState]);

  useEffect(() => {
    if (userState) {
      applications.makeRequest('/applications/')
        .then(fetchJobs)
    }
  }, [userState]);

  const onDeleteApplication = useCallback(async (application) => {
    await applications.makeRequest(`/applications/${application.id}/`, {
      method: 'DELETE'
    });
    applications.setData(prev => {
      return prev.filter(({ id }) => id !== application.id);
    });
  }, []);

  const onDateFilterChange = useCallback((e) => {
    const filterValue = +e.target.value;
    setFilteredApplications(prev => {
      return prev.filter(({ date_applied }) => (
        dayjs(date_applied).isAfter(dayjs().subtract(filterValue, 'months')
        )))
    });
  }, []);

  const onViewApplication = useCallback((application) => {
    router.replace(`/jobs/${application.job}`);
  }, [router]);

  const jobTableItemEls = filteredApplications.map(application => {

    return (
      <tr key={application.id}>
        <td>
          {/* <!-- Job Block --> */}
          <div className="job-block">
            <div className="inner-box">
              <div className="content">
                <span className="company-logo">
                  <img src={application.jobData?.logo} alt="logo" />
                </span>
                <h4>
                  <Link href={`/jobs/${application.job}`}>
                    {application.jobData?.job_title}
                  </Link>
                </h4>
                <ul className="job-info">
                  <li>
                    <span className="icon flaticon-briefcase"></span>
                    {application.jobData?.categoryData?.title}
                  </li>
                  {application.jobData?.location?.trim()?.length > 0 && (
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {application.jobData?.location}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td>{dayjs(application.date_applied).format('DD MMMM YYYY HH:MM A')}</td>
        <td className="status">Active</td>
        <td>
          <div className="option-box">
            <ul className="option-list">
              <li>
                <button
                  data-text="View Application"
                  onClick={() => onViewApplication(application)}
                >
                  <span className="la la-eye"></span>
                </button>
              </li>
              <li>
                <button
                  data-text="Delete Application"
                  onClick={() => onDeleteApplication(application)}
                >
                  <span className="la la-trash"></span>
                </button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Applied Jobs</h4>

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
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {jobTableItemEls}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
