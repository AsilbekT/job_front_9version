import { useContext } from "react";
import { UserContext } from "../../pages/context/UserContext";
import Link from "next/link";

const CallToAction = () => {
  const user = useContext(UserContext);

  return (
    <section className="call-to-action">
      <div className="auto-container">
        <div className="outer-box" data-aos="fade-up">
          <div className="content-column">
            <div className="sec-title">
              <h2>Recruiting?</h2>
              <div className="text">
                Advertise your jobs!
              </div>
              <Link
                href={user?.is_employer ? '/employer/dashboard' : '/register'}
                className="theme-btn btn-style-one bg-blue"
              >
                <span className="btn-title">Start Recruiting Now</span>
              </Link>
            </div>
          </div>
          {/* End .content-column */}

          <div
            className="image-column"
            style={{ backgroundImage: " url(images/resource/image-1.png)" }}
          >
            <figure className="image">
              <img src="images/resource/image-1.png" alt="resource" />
            </figure>
          </div>
          {/* End .image-column */}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
