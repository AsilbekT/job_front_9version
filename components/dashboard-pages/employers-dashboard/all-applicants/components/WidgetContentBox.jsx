import Link from "next/link";
import { useFetch } from "../../../../../hooks/useFetch";
import { useCallback, useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { BiSolidUser } from 'react-icons/bi';
import { UserContext } from "../../../../../pages/context/UserContext";

const WidgetContentBox = ({ dateFilter }) => {
  const applicantsFetch = useFetch();
  const jobsFetch = useFetch();
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    if (dateFilter) {
      setFilteredApplications(prev => {
        return prev.filter(({ applied_at }) => (
          dayjs(applied_at).isAfter(dayjs().subtract(dateFilter, 'months')
          )))
      });
    }
  }, [dateFilter]);

  const deleteApplication = useCallback(async (application) => {
    await applicantsFetch.makeRequest(
      `/applications/${application.id}/`,
      { method: 'DELETE' },
      true
    );
    setFilteredApplications(prev => (
      prev.filter(({ id }) => id !== application.id)
    ));
  }, []);

  const changeApplicationStatus = useCallback(
    async (application, status) => {
      await applicantsFetch.makeRequest(
        `/applications/${application.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...application,
            status
          })
        },
        true
      );
      setApplicationStatus({
        ...application,
        status
      });
      setTimeout(() => {
        setApplicationStatus(null);
      }, 3000);
    }, []
  );

  useEffect(() => {
    if (user?.companyData) {
      const companyId = user.companyData.id;
      Promise.all([
        applicantsFetch.makeRequest(`/companies/${companyId}/applicants/`)
          .then(setFilteredApplications),
        jobsFetch.makeRequest(`/companies/${companyId}/jobs/`),
      ]);
    }
  }, [user]);

  const applicationEls = filteredApplications?.map((application) => {
    const job = jobsFetch.data?.find(({ id }) => application.job === id);

    if (!job) return null;

    return (
      <div
        className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
        key={application.id}
      >
        {applicationStatus && (
          <h5 className={applicationStatus.status === 'reject' ? 'error' : 'success'}>
            Application {applicationStatus.id} for {applicationStatus.job?.job_title} has been
            {applicationStatus.status === 'reject' ? 'rejected' : 'approved'}
          </h5>
        )}
        <div className="inner-box">
          <div className="content">
            <figure className="image d-flex align-items-center justify-content-center image-with-svg">
              {application.user?.avatar
                ? <img
                  style={{ objectFit: 'cover' }}
                  className="h-100 object-fit-cover"
                  src={process.env.NEXT_PUBLIC_API_URL + application.user?.avatar}
                  alt="candidate"
                />
                : <BiSolidUser />
              }
            </figure>
            <h4 className="name">
              <Link href={`/candidates/${application.id}`}>
                {job.job_title}
              </Link>
            </h4>

            <ul className="candidate-info flex-column align-items-start">
              <li className="p-0">
                Applicant:&nbsp;
                <span className="designation d-inline-block">
                  {application.user?.email}
                </span>
              </li>
              <li>
                <span className="icon flaticon-map-locator"></span>&nbsp;
                {job.location}
              </li>
              <li>
                <span className="icon flaticon-money"></span> $
                {job.salary}
              </li>
              <li className="p-0">
                Applied:&nbsp;
                {dayjs(application.date_applied).format('DD MMMM YYYY HH:MM A')}
              </li>
            </ul>
            {/* End candidate-info */}
            <div className="d-flex gap-1">
              Tags:
              <ul className="post-tags">
                {job.tag?.split(' ')?.map((val, index) => (
                  <li key={index}>{val}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* End content */}

          <div className="option-box">
            <ul className="option-list">
              <li>
                <Link
                  href={`/candidates/${application.id}`}
                  data-text="View Application"
                >
                  <span className="la la-eye"></span>
                </Link>
              </li>

              {/* <li>
                <button 
                  data-text="Approve Application"
                  onClick={() => changeApplicationStatus(application, 'approve')}
                >
                  <span className="la la-check"></span>
                </button>
              </li>
              <li>
                <button 
                  data-text="Reject Application"
                  onClick={() => changeApplicationStatus(application, 'reject')}
                >
                  <span className="la la-times-circle"></span>
                </button>
              </li> */}

              <li>
                <button
                  data-text="Delete Application"
                  onClick={() => deleteApplication(application)}
                >
                  <span className="la la-trash"></span>
                </button>
              </li>
            </ul>
          </div>
          {/* End admin options box */}
        </div>
      </div>
    )
  });

  return (
    <div className="widget-content">
      <div className="tabs-box">
        {/* <div className="aplicants-upper-bar">
            <h6>Senior Product Designer</h6>

            <TabList className="aplicantion-status tab-buttons clearfix">
              <Tab className="tab-btn totals"> Total(s): 6</Tab>
              <Tab className="tab-btn approved"> Approved: 2</Tab>
              <Tab className="tab-btn rejected"> Rejected(s): 4</Tab>
            </TabList>
          </div> */}

        <div className="tabs-content">
          <div className="row">
            {applicationEls}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetContentBox;
