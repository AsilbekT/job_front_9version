import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import Applicants from "./components/Applicants";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";
import { useFetch } from "../../../../hooks/useFetch";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "../../../../pages/context/UserContext";

const Index = () => {
  const applicationsFetch = useFetch();
  const jobsFetch = useFetch();
  const user = useContext(UserContext);

  useEffect(() => {
    if (user?.companyData) {
      const companyId = user.companyData.id;
      applicationsFetch.makeRequest(
        `/companies/${companyId}/applicants/`
      );
      jobsFetch.makeRequest(
        `/companies/${companyId}/jobs/`
      );
    }
  }, [user]);

  const onDeleteApplication = useCallback(async (application) => {
    await applicationsFetch.makeRequest(
      `/applications/${application.id}/`, 
      { method: 'DELETE' },
      true
    );
    applicationsFetch.setData(prev => (
      prev.filter(({ id }) => id !== application.id)
    ));
  }, []);

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardEmployerSidebar />
      {/* <!-- End User Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Dashboard Home!" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <TopCardBlock
              jobs={jobsFetch.data || []}
              applications={applicationsFetch.data || []}
            />
          </div>
          {/* End .row top card block */}

          <div className="row">
            {/* <div className="col-xl-7 col-lg-12">
              <div className="graph-widget ls-widget">
                <ProfileChart />
              </div>
            </div> */}
            {/* End .col */}

            {/* <div className="col-xl-5 col-lg-12">
              <div className="notification-widget ls-widget">
                <div className="widget-title">
                  <h4>Notifications</h4>
                </div>
                <div className="widget-content">
                  <Notification />
                </div>
              </div>
            </div> */}
            {/* End .col */}

            <div className="col-lg-12">
              {/* <!-- applicants Widget --> */}
              <div className="applicants-widget ls-widget">
                <div className="widget-title">
                  <h4>Recent Applicants</h4>
                </div>
                <div className="widget-content">
                  <div className="row">
                    {/* <!-- Candidate block three --> */}

                    <Applicants 
                      applications={applicationsFetch.data || []}
                      onDeleteApplication={onDeleteApplication}
                      jobs={jobsFetch.data || []}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row profile and notificatins */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default Index;
