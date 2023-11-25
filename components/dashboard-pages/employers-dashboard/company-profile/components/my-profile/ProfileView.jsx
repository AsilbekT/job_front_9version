import { memo, useContext } from "react";
import { UserContext } from "../../../../../../pages/context/UserContext";
import { getDefaultImage } from "../../../../candidates-dashboard/my-profile/components/my-profile/LogoUpload";

export const ProfileView = memo(({ form, companyLogo, company }) => {
  const userImg = useContext(UserContext)?.avatar;

  return (
    <div className="job-overview-two">
      {(companyLogo || userImg) && (
        <div className="uploading-outer">
          <div className="d-flex gap-4">
            {companyLogo && (
              <div className="d-flex flex-column align-items-center gap-2">
                <div className="uploadButton">
                  <figure className="image-overlay">
                    <img
                      src={company?.company_logo || '/images/User-avatar.svg.png'}
                      alt="User Avatart"
                      width="100%"
                      height="100%"
                    />
                  </figure>
                </div>
                <div>Company Logo</div>
              </div>
            )}
            {userImg && (
              <div className="d-flex flex-column align-items-center gap-2">
                <div className="uploadButton">
                  <figure className="image-overlay">
                    <img
                      src={getDefaultImage(userImg)}
                      alt="User Avatart"
                      width="100%"
                      height="100%"
                    />
                  </figure>
                </div>
                <div>Profile Image</div>
              </div>
            )}
          </div>
        </div>
      )}
      <ul className="job-details">
        <li>
          <i className="icon icon-user-2"></i>
          <h5>Company: </h5>
          <span>{form.title}</span>
        </li>
        <li>
          <i className="icon icon-text"></i>
          <h5>Description: </h5>
          <span>{form.description}</span>
        </li>
        <li>
          <i className="icon icon-world"></i>
          <h5>Website: </h5>
          <span>{form.website}</span>
        </li>
      </ul>
    </div>
  );
});