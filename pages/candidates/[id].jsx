import dynamic from "next/dynamic";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import Seo from "../../components/common/Seo";
import { useFetch } from "../../hooks/useFetch";
import { NotFoundPage } from "../../components/common/NotFountPage";
import dayjs from "dayjs";
import { jobTypesMap } from "../../data/job-types";

const CandidateSingleDynamicV1 = () => {
  const router = useRouter();
  const applicationId = router.query.id;
  const applicantsFetch = useFetch();
  const jobFetch = useFetch();
  const categoryFetch = useFetch();
  const awardsFetch = useFetch();
  const educationFetch = useFetch();
  const experienceFetch = useFetch();
  const skillsFetch = useFetch();

  const application = applicantsFetch.data;
  const job = jobFetch.data;
  const user = applicantsFetch.data?.user;
  const category = categoryFetch.data;

  const filteredFetch = useCallback(async (fetch, url) => {
    let fetchedData = await fetch.makeRequest(url, undefined, true);
    if (fetchedData instanceof Array) {
      fetchedData = fetchedData.filter(data => {
        if ('user' in data) {
          return data.user === user?.id;
        }
        return true;
      });
    }
    fetch.setData(fetchedData);
  }, [user]);

  const fetchJobData = useCallback(async (application) => {
    if (!application) return;
    await jobFetch.makeRequest(`/jobs/${application.job}/`);
    return application;
  }, []);

  useEffect(() => {
    if (jobFetch.data?.category) {
      categoryFetch.makeRequest(`/catagories/${jobFetch.data.category}/`);
    }
  }, [jobFetch.data]);

  useEffect(() => {
    if (user) {
      Promise.all([
        filteredFetch(educationFetch, '/education/'),
        filteredFetch(experienceFetch, '/work_experience/'),
        filteredFetch(awardsFetch, '/award/'),
        filteredFetch(skillsFetch, '/skill/'),
      ]);
    }
  }, [user]);

  useEffect(() => {
    if (applicationId) {
      applicantsFetch.makeRequest(`/applications/${applicationId}/`)
        .then(fetchJobData);
    }
  }, [applicationId]);

  if (!applicantsFetch.data && applicantsFetch.loading) {
    return (
      <>
        <Seo pageTitle="Candidate Single Dyanmic V1" />
        <span className="header-span"></span>
        <LoginPopup />
        <DefaulHeader />
        <MobileMenu />
        <div className="w-100 text-center py-5">
          <h4>Loading...</h4>
        </div>
      </>
    )
  } else if (!applicantsFetch.data) {
    return <NotFoundPage />;
  }

  const awardEls = awardsFetch.data?.map(award => {
    return (
      <div className="resume-block" key={award.id}>
        <div className="inner">
          <span className="name">{award.title.charAt(0)}</span>
          <div className="title-box">
            <div className="info-box">
              <h3>{award.title}</h3>
            </div>
            <div className="edit-box">
              <span className="year">{award.year}</span>
            </div>
          </div>
          <div className="text">{award.description}</div>
        </div>
      </div>
    );
  });

  const experienceEls = experienceFetch.data?.map(experience => {
    return (
      <div className="resume-block" key={experience.id}>
        <div className="inner">
          <span className="name">{experience.company.charAt(0)}</span>
          <div className="title-box">
            <div className="info-box">
              <h3>{experience.jot_title}</h3>
              <span>{experience.company}</span>
            </div>
            <div className="edit-box">
              <span className="year">
                {experience.start_year}{experience.end_year && ` - ${experience.end_year}`}
              </span>
            </div>
          </div>
          <div className="text">{experience.description}</div>
        </div>
      </div>
    );
  });

  const skillEls = skillsFetch.data?.map(skill => {
    return (
      <li key={skill.id}>{skill.name}</li>
    );
  });

  const educationEls = educationFetch.data?.map(education => {
    return (
      <div className="resume-block" key={education.id}>
        <div className="inner">
          <span className="name">{education.institution.charAt(0)}</span>
          <div className="title-box">
            <div className="info-box">
              <h3>{education.degree}</h3>
              <span>{education.institution}</span>
            </div>
            <div className="edit-box">
              <span className="year">
                {education.start_year}{education.end_year && ` - ${education.end_year}`}
              </span>
            </div>
          </div>
          <div className="text">{education.description}</div>
        </div>
      </div>
    );
  });

  const noContent = !educationEls?.length && !awardEls?.length && !experienceEls?.length;

  return (
    <>
      <Seo pageTitle="Candidate Single Dyanmic V1" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <img
                      src={user?.avatar || '/images/User-avatar.svg.png'}
                      alt="avatar"
                      style={{ objectFit: 'cover', height: '100%' }}
                    />
                  </figure>
                  <h4 className="name">{application.user?.username}</h4>

                  <ul className="candidate-info">
                    <li className="designation">{job?.job_title}</li>
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {job?.location}
                    </li>
                    <li>
                      <span className="icon flaticon-money"></span> $
                      {job?.salary}
                    </li>
                    <li>
                      <span className="icon flaticon-clock"></span>
                      Applied: {dayjs(applicantsFetch.data.date_applied).format('DD MMMM YYYY HH:MM A')}
                    </li>
                  </ul>

                  <ul className="post-tags">
                    {job?.tag.split(' ').map((val, i) => (
                      <li key={i}>{val}</li>
                    ))}
                  </ul>
                </div>

                <div className="btn-box">
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    className="theme-btn btn-style-one"
                    href={applicantsFetch.data.cv}
                    download={applicantsFetch.data.cv}
                  >
                    Download Resume
                  </a>
                  {/* <button className="bookmark-btn">
                    <i className="flaticon-bookmark"></i>
                  </button> */}
                </div>
              </div>
            </div>
            {/*  <!-- Candidate block Five --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  {/* <div className="video-outer">
                    <h4>Candidates About</h4>
                  </div>
                  <p>
                    Hello my name is Nicole Wells and web developer from
                    Portland. In pharetra orci dignissim, blandit mi semper,
                    ultricies diam. Suspendisse malesuada suscipit nunc non
                    volutpat. Sed porta nulla id orci laoreet tempor non
                    consequat enim. Sed vitae aliquam velit. Aliquam ante erat,
                    blandit at pretium et, accumsan ac est. Integer vehicula
                    rhoncus molestie. Morbi ornare ipsum sed sem condimentum, et
                    pulvinar tortor luctus. Suspendisse condimentum lorem ut
                    elementum aliquam.
                  </p>
                  <p>
                    Mauris nec erat ut libero vulputate pulvinar. Aliquam ante
                    erat, blandit at pretium et, accumsan ac est. Integer
                    vehicula rhoncus molestie. Morbi ornare ipsum sed sem
                    condimentum, et pulvinar tortor luctus. Suspendisse
                    condimentum lorem ut elementum aliquam. Mauris nec erat ut
                    libero vulputate pulvinar.
                  </p> */}

                  {/* <!-- Portfolio --> */}
                  {/* <div className="portfolio-outer">
                    <div className="row">
                      <GalleryBox />
                    </div>
                  </div> */}
                  {noContent && (
                    <h3 className="text-center w-100">No content🥲</h3>
                  )}
                  {!!educationEls?.length && (
                    <div className="resume-outer">
                      <div className="upper-title">
                        <h4>Education</h4>
                      </div>
                      {educationEls}
                    </div>
                  )}
                  {!!experienceEls?.length && (
                    <div className="resume-outer theme-blue">
                      <div className="upper-title">
                        <h4>Work Experience</h4>
                      </div>
                      {experienceEls}
                    </div>
                  )}
                  {!!awardEls?.length && (
                    <div className="resume-outer theme-yellow">
                      <div className="upper-title">
                        <h4>Awards</h4>
                      </div>
                      {awardEls}
                    </div>
                  )}
                </div>
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <h5 className="mb-3">Job Details:</h5>
                      <ul className="job-overview">
                        <li>
                          <i className="icon icon-calendar"></i>
                          <h5>Experience:</h5>
                          <span>{job?.experience} Years</span>
                        </li>

                        <li>
                          <i className="icon icon-expiry"></i>
                          <h5>Job Type:</h5>
                          <span>{jobTypesMap[job?.job_type || 'FT']}</span>
                        </li>

                        {category && (
                          <li>
                            <i className="icon icon-language"></i>
                            <h5>Category:</h5>
                            <span>{category.title}</span>
                          </li>
                        )}

                        {/* <li>
                          <i className="icon icon-rate"></i>
                          <h5>Current Salary:</h5>
                          <span>11K - 15K</span>
                        </li> */}

                        <li>
                          <i className="icon icon-salary"></i>
                          <h5>Salary:</h5>
                          <span>${job?.salary}</span>
                        </li>

                        {/* <li>
                          <i className="icon icon-user-2"></i>
                          <h5>Gender:</h5>
                          <span>Female</span>
                        </li> */}

                        {/* <li>
                          <i className="icon icon-language"></i>
                          <h5>Language:</h5>
                          <span>English, German, Spanish</span>
                        </li> */}

                        {/* <li>
                          <i className="icon icon-degree"></i>
                          <h5>Education:</h5>
                          <span>Master Degree</span>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                  {/* End .sidebar-widget conadidate overview */}

                  {/* <div className="sidebar-widget social-media-widget">
                    <h4 className="widget-title">Social media</h4>
                    <div className="widget-content">
                      <div className="social-links">
                        <Social />
                      </div>
                    </div>
                  </div> */}
                  {/* End .sidebar-widget social-media-widget */}

                  {!!skillEls?.length && (
                    <div className="sidebar-widget">
                      <h4 className="widget-title">Professional Skills</h4>
                      <div className="widget-content">
                        <ul className="job-skills">
                          {skillEls}
                        </ul>
                      </div>
                    </div>
                  )}
                  {/* End .sidebar-widget skill widget */}

                  {/* <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                    </div>
                  </div> */}
                  {/* End .sidebar-widget contact-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(CandidateSingleDynamicV1), {
  ssr: false,
});
