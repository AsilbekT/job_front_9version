import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../pages/context/UserContext";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import DashboardHeader from "../../../header/DashboardHeader";
import MobileMenu from "../../../header/MobileMenu";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";
import FormInfoBox from "./components/my-profile/FormInfoBox";
import { ProfileView } from "./components/my-profile/ProfileView";

const defaultForm = {
    description: '',
    title: '',
    website: ''
};

const index = () => {
    const [editMode, setEditMode] = useState(false);
    const [companyLogo, setCompanyLogo] = useState('');
    const [form, setForm] = useState(defaultForm);
    const user = useContext(UserContext);
    const company = user?.companyData;

    useEffect(() => {
        if (!editMode) {
            setForm(company || defaultForm);
        }
    }, [editMode, company]);

    useEffect(() => {
        if (company) {
            setForm(company);
            const logoFileName = company?.company_logo?.split('/')?.at(-1);
            setCompanyLogo(logoFileName);
        }
    }, [company]);

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
                    <BreadCrumb
                        action={!editMode && {
                            label: 'Edit',
                            onClick: () => setEditMode(true)
                        }}
                        title="Company Profile"
                    />
                    {/* breadCrumb */}

                    <MenuToggler />
                    {/* Collapsible sidebar button */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ls-widget">
                                <div className="tabs-box">
                                    <div className="widget-title">
                                        <h4>My Company</h4>
                                    </div>
                                    {editMode
                                        ? <FormInfoBox
                                            setForm={setForm}
                                            form={form}
                                            setEditMode={setEditMode}
                                            companyLogo={companyLogo}
                                            setCompanyLogo={setCompanyLogo}
                                        />
                                        : <ProfileView
                                            company={company}
                                            companyLogo={companyLogo}
                                            form={form}
                                            setForm={setForm}
                                        />
                                    }
                                </div>
                            </div>
                            {/* <!-- Ls widget --> */}

                            {/* <div className="ls-widget">
                                <div className="tabs-box">
                                    <div className="widget-title">
                                        <h4>Social Network</h4>
                                    </div>
                                    <div className="widget-content">
                                        <SocialNetworkBox />
                                    </div>
                                </div>
                            </div> */}
                            {/* <!-- Ls widget --> */}

                            {/* <div className="ls-widget">
                                <div className="tabs-box">
                                    <div className="widget-title">
                                        <h4>Contact Information</h4>
                                    </div>

                                    <div className="widget-content">
                                        <ContactInfoBox />
                                    </div>
                                </div>
                            </div> */}
                            {/* <!-- Ls widget --> */}
                        </div>
                    </div>
                    {/* End .row */}
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

export default index;
