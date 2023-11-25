import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import employerMenuData from "../../data/employerMenuData";
import { useFetch } from "../../hooks/useFetch";
import { UserContext } from "../../pages/context/UserContext";
import { isActiveLink } from "../../utils/linkActiveChecker";
import Modal from "../Modal";
import { getDefaultImage } from '../dashboard-pages/candidates-dashboard/my-profile/components/my-profile/LogoUpload';
import HeaderNavContent from "./HeaderNavContent";

const DashboardHeader = () => {
    const user = useContext(UserContext);
    const [navbar, setNavbar] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const userFetch = useFetch();

    const router = useRouter();

    const changeBackground = () => {
        if (window.scrollY >= 0) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", changeBackground);
    }, []);

    const onLogOut = useCallback(async () => {
        Cookies.remove('token');
        await router.replace('/login');
        window.location.reload();
    }, [router]);


    const onDeleteProfile = useCallback(async () => {
        await userFetch.makeRequest(`/user/${user?.id}/`, {
            method: 'DELETE',
        });
        onLogOut();
    }, [user, onLogOut]);

    return (
        // <!-- Main Header-->
        <>
            {showDeleteModal && (
                <Modal
                    primaryAction={onDeleteProfile}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete profile"
                    primaryActionTitle="Confirm"
                >
                    <span className="error w-100 d-flex justify-content-center">
                        Are you sure you want to delete your profile?
                    </span>
                </Modal>
            )}
            <header
                className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""
                    }`}
            >
                <div className="container-fluid">
                    {/* <!-- Main box --> */}
                    <div className="main-box">
                        {/* <!--Nav Outer --> */}
                        <div className="nav-outer">
                            <div className="logo-box">
                                <div className="logo">
                                    <Link href="/">
                                        <Image
                                            alt="brand"
                                            src="/images/logo.svg"
                                            width={154}
                                            height={50}
                                            priority
                                        />
                                    </Link>
                                </div>
                            </div>
                            {/* End .logo-box */}

                            <HeaderNavContent />
                            {/* <!-- Main Menu End--> */}
                        </div>
                        {/* End .nav-outer */}

                        <div className="outer-box">
                            {/* <button className="menu-btn">
                                <span className="count">1</span>
                                <span className="icon la la-heart-o"></span>
                            </button> */}

                            {/* <button className="menu-btn">
                                <span className="icon la la-bell"></span>
                            </button> */}
                            {/* End notification-icon */}

                            {/* <!-- Dashboard Option --> */}
                            <div className="dropdown dashboard-option">
                                <a
                                    className="dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <Image
                                        alt="avatar"
                                        className="thumb"
                                        src={getDefaultImage(user?.avatar)}
                                        width={50}
                                        style={{ objectFit: 'cover' }}
                                        height={50}
                                    />
                                    <span className="name">My Account</span>
                                </a>

                                <ul className="dropdown-menu">
                                    {employerMenuData.map((item) => (
                                        <li
                                            className={`${isActiveLink(
                                                item.routePath,
                                                router.asPath
                                            )
                                                ? "active"
                                                : ""
                                                } mb-1`}
                                            key={item.id}
                                        >
                                            <Link href={item.routePath}>
                                                <i
                                                    className={`la ${item.icon}`}
                                                ></i>{" "}
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="mb-1">
                                        <a onClick={onLogOut}>
                                            <i
                                                className="la la-sign-out"
                                            ></i>{" "}
                                            Logout
                                        </a>
                                    </li>
                                    <li className="mb-1" onClick={() => setShowDeleteModal(true)}>
                                        <a>
                                            <i
                                                className="la la-trash"
                                            ></i>{" "}
                                            Delete profile
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* End dropdown */}
                        </div>
                        {/* End outer-box */}
                    </div>
                </div>
            </header>
        </>
    );
};

export default DashboardHeader;
