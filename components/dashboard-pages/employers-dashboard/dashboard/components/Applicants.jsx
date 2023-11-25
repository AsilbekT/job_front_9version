import Link from "next/link";

const Applicants = ({ applications, jobs, onDeleteApplication }) => {

  return (
    <>
      {applications.slice(0, 8).map((application) => {
        const applicationJob = jobs.find(({ id }) => id === application.job);
        return (
          <div
            className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
            key={application.id}
          >
            <div className="inner-box">
              <div className="content">
                {application.user?.avatar && (
                  <figure className="image">
                    <img
                      style={{ objectFit: 'cover' }}
                      className="h-100 object-fit-cover"
                      src={process.env.NEXT_PUBLIC_API_URL + application.user.avatar}
                      alt="candidates"
                    />
                  </figure>
                )}
                <h4 className="name">
                  <Link href={`/candidates/${application.id}`}>
                    {application.user?.email}
                  </Link>
                </h4>

                <ul className="candidate-info">
                  <li className="designation">{applicationJob?.job_title}</li>
                  <li>
                    <span className="icon flaticon-map-locator"></span>{" "}
                    {applicationJob?.location}
                  </li>
                  <li>
                    <span className="icon flaticon-money"></span> $
                    {applicationJob?.salary}
                  </li>
                </ul>
                {/* End candidate-info */}

                <ul className="post-tags">
                  {applicationJob?.tag?.split(' ').map((val, i) => (
                    <li key={i}>{val}</li>
                  ))}
                </ul>
              </div>
              {/* End content */}

              <div className="option-box">
                <ul className="option-list">
                  <li>
                    <Link data-text="View Application" href={`/candidates/${application.id}`}>
                      <span className="la la-eye"></span>
                    </Link>
                  </li>
                  {/* <li>
                  <button data-text="Approve Application">
                    <span className="la la-check"></span>
                  </button>
                </li>
                <li>
                  <button data-text="Reject Application">
                    <span className="la la-times-circle"></span>
                  </button>
                </li> */}
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
              {/* End admin options box */}
            </div>
          </div>
        )
      })}
    </>
  );
};

export default Applicants;
