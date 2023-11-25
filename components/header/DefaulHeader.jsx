import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import HeaderNavContent from "./HeaderNavContent";
import { UserContext } from "../../pages/context/UserContext";
import Image from "next/image";

const DefaulHeader = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  const user = useContext(UserContext);

  return (
    // <!-- Main Header-->
    <header
      className={`main-header  ${navbar ? "fixed-header animated slideInDown" : ""
        }`}
    >
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <img src="/images/logo.svg" alt="brand" />
              </Link>
            </div>
          </div>
          {/* End .logo-box */}

          <HeaderNavContent />
          {/* <!-- Main Menu End--> */}
        </div>
        {/* End .nav-outer */}

        <div className="outer-box">
          {/* <!-- Login/Register --> */}
          <div className="btn-box">
            {user
              ? (
                <>
                  <Link href={
                    user?.is_employer 
                      ? "/employer/company-profile" 
                      : '/candidate/my-profile'
                  }>
                    <Image
                      alt="avatar"
                      className="thumb mx-2 d-inline-block"
                      src={user.avatar || "/images/resource/company-6.png"}
                      style={{ objectFit: 'cover' }}
                      width={50}
                      height={50}
                    />
                    <span className="name">My Account</span>
                  </Link>
                  {user?.is_employer && (
                    <Link
                      href="/employer/post-jobs"
                      className="theme-btn btn-style-one"
                    >
                      Post Job
                    </Link>
                  )}
                </>
              )
              : (
                <a
                  href="/login"
                  className="theme-btn btn-style-three call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  Login / Register
                </a>
              )
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default DefaulHeader;
