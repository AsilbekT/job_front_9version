import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { NotFoundPage } from "../../components/common/NotFountPage";
import Seo from "../../components/common/Seo";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import JobOverView2 from "../../components/job-single-pages/job-overview/JobOverView2";
import ApplyJobModalContent from "../../components/job-single-pages/shared-components/ApplyJobModalContent";
import CompnayInfo from "../../components/job-single-pages/shared-components/CompanyInfo";
import { useFetch } from "../../hooks/useFetch";
import { fetchWithAuth } from "../../utils/fetch.util";
import { UserContext } from "../context/UserContext";

const JobSingleDynamicV3 = () => {
  const router = useRouter();
  const jobId = router.query.id;
  const applicationsFetch = useFetch();
  const user = useContext(UserContext);
  const [selectedCv, setSelectedCv] = useState(null);
  const [success, setSuccess] = useState(false);
  const closeBtnRef = useRef();
  const categoryFetch = useFetch();
  const [selectedFileCv, setSelectedFileCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const modalContentRef = useRef();

  useEffect(() => {
    if (validationError) {
      modalContentRef.current.scroll({ top: 0, behavior: 'smooth' });
    }
  }, [validationError]);

  const jobFetch = useFetch();
  const companyFetch = useFetch();

  useEffect(() => {
    if (jobFetch.data) {
      companyFetch.makeRequest(
        `/companies/${jobFetch.data.company}/`,
        undefined,
        undefined,
        true
      );
    }
  }, [jobFetch.data]);

  useEffect(() => {
    if (jobId) {
      jobFetch.makeRequest(`/jobs/${jobId}/`, undefined, undefined, true);
      categoryFetch.makeRequest('/catagories/', undefined, undefined, true);
    }
  }, [jobId]);

  const uploadResumeFile = useCallback(async () => {
    try {
      if (!user) return null;

      const formData = new FormData();
      formData.append('user', user.id);
      formData.append('title', selectedFileCv.name);
      formData.append('resume', selectedFileCv);

      const response = await fetchWithAuth('/resumes/', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.id;
    } catch (er) {
      console.log(er);
      return null;
    }
  }, [selectedFileCv, user]);

  const onApplyToJob = useCallback(async () => {
    try {
      const userResumesCount = user?.resumes?.length;
      let userSelectedCvId = selectedCv;

      if ((userResumesCount && !selectedCv) || (!userResumesCount && !selectedFileCv)) {
        setValidationError('Please select or upload your resume first.');
        return;
      }

      if (!userResumesCount && user) {
        userSelectedCvId = await uploadResumeFile();
        if (!userSelectedCvId) {
          setValidationError('Something went wrong, please try again later.');
          return;
        }
      }

      setLoading(true);
      setValidationError('');
      setSuccess(false);
      applicationsFetch.setError(null);
      const formData = new FormData();
      formData.append(
        user ? 'resume_id' : 'resume',
        user ? userSelectedCvId : selectedFileCv
      );
      formData.append('job', jobFetch.data.id);
      const response = await applicationsFetch.makeRequest(
        '/applications/',
        {
          method: 'POST',
          body: formData
        },
        true,
        !user
      );
      if (!response.error) {
        setSuccess(true);
      }
      setLoading(false);
    } catch (er) {
      setLoading(false);
      console.log(er);
      applicationsFetch.setError('Something went wrong!');
    }
  }, [jobFetch.data, selectedCv, user, selectedFileCv, uploadResumeFile]);

  const onCvChange = useCallback((e) => {
    const [file] = e.target.files;
    if (!file) return;
    setSelectedFileCv(file);
  }, []);

  if (jobFetch.loading && !jobFetch.data) {
    return (
      <>
        <Seo pageTitle="Job Single Dyanmic V3" />
        <span className="header-span"></span>
        <LoginPopup />
        <DefaulHeader />
        <MobileMenu />
        <h6 className="text-center">Loading...</h6>
      </>
    );
  } else if (!jobFetch.data) {
    return <NotFoundPage />;
  }

  const jobCategory = categoryFetch.data?.find(({ id }) => (
    id === jobFetch.data?.category
  ));

  return (
    <>
      <Seo pageTitle="Job Single Dyanmic V3" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        {applicationsFetch.error && (
          <h5 className="error text-center mt-5">
            Something went wrong, please try again later🥲
          </h5>
        )}
        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                {/* <!-- job block outer --> */}

                <div className="job-overview-two">
                  <h4>Job Description</h4>
                  <JobOverView2 category={jobCategory} job={jobFetch.data} />
                </div>
                {/* <!-- job-overview-two --> */}

                {jobFetch.data.required_skills && (
                  <div className="job-overview-two">
                    <h4>Required Skills: </h4>
                    <ul className="post-tags d-flex">
                      {jobFetch.data.required_skills?.split(',').map((val, i) => (
                        <li key={i}>{val}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobFetch.data.description && (
                  <div className="job-overview-two">
                    <h4>Description: </h4>
                    <span
                      className="pb-4 d-block"
                      dangerouslySetInnerHTML={{ __html: jobFetch.data.description }}
                    />
                  </div>
                )}

                {jobFetch.data.tag && (
                  <div className="job-overview-two">
                    <h4>Job Tags: </h4>
                    <ul className="post-tags d-flex">
                      {jobFetch.data.tag.split(' ').map((val, i) => (
                        <li key={i}>{val}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* <JobDetailsDescriptions job={jobFetch.data} /> */}

                {/* End job-details */}

                {/* <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <SocialTwo />
                  </div>
                </div> */}
                {/* <!-- Other Options --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      <div className="company-title">
                        <div className="company-logo">
                          <img
                            src={process.env.NEXT_PUBLIC_API_URL + companyFetch.data?.company_logo}
                            alt="resource"
                          />
                        </div>
                        <h5 className="company-name">
                          {companyFetch.data?.title}
                        </h5>
                        {/* <a href="#" className="profile-link">
                          View company profile
                        </a> */}
                      </div>
                      {/* End company title */}

                      <CompnayInfo company={companyFetch.data} />

                      <div className="btn-box">
                        <a
                          href={companyFetch.data?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn btn-style-three"
                        >
                          Visit website
                        </a>
                      </div>
                      {/* End btn-box */}
                    </div>
                  </div>
                  {!user?.is_employer && (
                    <div className="btn-box d-flex flex-column">
                      <a
                        className="theme-btn btn-style-one"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#applyJobModal"
                      >
                        Apply
                      </a>
                      {/* <button className="bookmark-btn">
                        <i className="flaticon-bookmark"></i>
                      </button> */}
                    </div>
                  )}
                  {/* End apply for job btn */}

                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="applyJobModal"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="apply-modal-content modal-content" ref={modalContentRef}>
                        <div className="text-center">
                          <h3 className="title">Apply for this job</h3>
                          <button
                            type="button"
                            className="closed-modal"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            ref={closeBtnRef}
                          />
                        </div>
                        {/* <div className="input-group checkboxes square mb-2">
                          <input
                            type="checkbox"
                            onChange={(e) => setUseProfileCv(e.currentTarget.checked)}
                            checked={useProfileCv}
                            name="useProfileCv"
                            id="useProfileCv"
                          />
                        </div> */}
                        {/* End modal-header */}

                        <ApplyJobModalContent
                          validationError={validationError}
                          setValidationError={setValidationError}
                          // useProfileCv={useProfileCv}
                          onApply={onApplyToJob}
                          onFileChange={onCvChange}
                          closeBtnRef={closeBtnRef}
                          file={selectedFileCv}
                          loading={loading}
                          setSelectedCv={setSelectedCv}
                          selectedCv={selectedCv}
                          success={success}
                          setSuccess={setSuccess}
                        />
                        {/* End PrivateMessageBox */}
                      </div>
                      {/* End .send-private-message-wrapper */}
                    </div>
                  </div>
                  {/* End .modal */}

                  {/* End .company-widget */}

                  {/* <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                    </div>
                  </div> */}
                  {/* End contact-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
            {/* End .row  */}

            {/* <div className="related-jobs">
              <div className="title-box">
                <h3>Related Jobs</h3>
                <div className="text">2020 jobs live - 293 added today.</div>
              </div>
              <div className="row">
                <RelatedJobs2 />
              </div>
            </div> */}
            {/* <!-- Related Jobs --> */}
          </div>
          {/* End auto-container */}
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV3), {
  ssr: false,
});
