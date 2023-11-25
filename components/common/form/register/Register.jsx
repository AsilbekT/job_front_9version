import Link from "next/link";
import { useState } from "react";
import { Tabs } from "react-tabs";
import Form from "./FormContent";

const Register = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [validationError, setValidationError] = useState('');

  return (
    <div className="form-inner">
      <h3>Create a Free Superio Account</h3>

      <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        {/* <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-user"></i> Candidate
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-briefcase"></i> Employer
              </button>
            </Tab>
          </TabList>
        </div> */}
        {/* End .form-group */}

        {/* End Employer Form */}
      </Tabs>
      {/* End form-group */}
      {validationError && (
        <h6 className="error mb-2">{validationError}</h6>
      )}
      <Form setValidationError={setValidationError} />

      <div className="bottom-box">
        <div className="text">
          Already have an account?{" "}
          <Link
            href="#"
            className="call-modal login"
            data-bs-toggle="modal"
            data-bs-dismiss="modal"
            data-bs-target="#loginPopupModal"
          >
            LogIn
          </Link>
        </div>
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default Register;
