import { useContext } from "react";
import { UserContext } from "../../pages/context/UserContext";

const BreadCrumb = ({ title = "", action }) => {
  const user = useContext(UserContext);

  return (
    <div className="upper-title-box d-flex align-items-center justify-content-between">
      <h3>
        {!user ? 'You are not logged in, please login to interact with the page' : title}
      </h3>
      {action && (
        <button title={action.label} className="theme-btn btn-style-three" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default BreadCrumb;
