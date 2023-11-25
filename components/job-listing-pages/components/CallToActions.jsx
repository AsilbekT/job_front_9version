import { useContext } from "react";
import { UserContext } from "../../../pages/context/UserContext";
import Link from "next/link";

const CallToActions = () => {
  const user = useContext(UserContext);
  return (
    <div className="call-to-action-four ">
      <h5>Recruiting?</h5>
      <p>
        Advertise your jobs!
      </p>
      <Link
        href={user?.is_employer ? '/employer/dashboard' : '/register'}
        className="theme-btn btn-style-one bg-blue"
      >
        <span className="btn-title">Start Recruiting Now</span>
      </Link>
      <div
        className="image"
        style={{ backgroundImage: "url(/images/resource/ads-bg-4.png)" }}
      ></div>
    </div>
  );
};

export default CallToActions;
