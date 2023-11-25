import Link from "next/link";
import "react-circular-progressbar/dist/styles.css";
import candidatesuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { useFetch } from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useCallback } from "react";
import { useContext } from "react";
import { UserContext } from "../../pages/context/UserContext";
import Cookies from "js-cookie";

const DashboardCandidatesSidebar = () => {
  const { menu } = useSelector((state) => state.toggle);
  const router = useRouter();
  const userFetch = useFetch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const user = useContext(UserContext);

  const dispatch = useDispatch();
  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const onLogOut = useCallback(async () => {
    Cookies.remove('token');
    await router.replace('/login');
    window.location.reload();
  }, [router]);

  useEffect(() => {
    if (user && user.is_employer) {
      router.replace('/employer/dashboard');
    }
  }, [user]);

  const onDeleteProfile = useCallback(async () => {
    await userFetch.makeRequest(`/user/${user.id}/`, {
      method: 'DELETE',
    });
    onLogOut();
  }, [user, onLogOut]);

  return (
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
      <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
        {/* Start sidebar close icon */}
        <div className="pro-header text-end pb-0 mb-0 show-1023">
          <div className="fix-icon" onClick={menuToggleHandler}>
            <span className="flaticon-close"></span>
          </div>
        </div>
        {/* End sidebar close icon */}
        {user && (
          <div className="sidebar-inner">
            <ul className="navigation">
              {candidatesuData.map((item) => (
                <li
                  className={`${isActiveLink(item.routePath, router.asPath) ? "active" : ""
                    } mb-1`}
                  key={item.id}
                  onClick={menuToggleHandler}
                >
                  <Link href={item.routePath}>
                    <i className={`la ${item.icon}`}></i> {item.name}
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
              <li className="mb-1">
                <a onClick={() => setShowDeleteModal(true)}>
                  <i
                    className="la la-trash"
                  ></i>{" "}
                  Delete profile
                </a>
              </li>
            </ul>
            {/* End navigation */}

            {/* <div className="skills-percentage">
              <h4>Skills Percentage</h4>
              <p>
                `Put value for <strong>Cover Image</strong> field to increase your
                skill up to <strong>85%</strong>`
              </p>
              <div style={{ width: 200, height: 200, margin: "auto" }}>
                <CircularProgressbar
                  background
                  backgroundPadding={6}
                  styles={buildStyles({
                    backgroundColor: "#7367F0",
                    textColor: "#fff",
                    pathColor: "#fff",
                    trailColor: "transparent",
                  })}
                  value={percentage}
                  text={`${percentage}%`}
                />
              </div>{" "}
            </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardCandidatesSidebar;
