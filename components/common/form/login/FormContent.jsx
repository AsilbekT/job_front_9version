import cookie from 'js-cookie';
import Link from "next/link";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import fetchFromApi from '../../../../pages/api/api';

const FormContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchFromApi("api/accounts/login/", "POST", {
        email: email,
        password: password
      });

      if (!response.error) {
        const { token } = response.data;

        setUser({ token });

        const userResponse = await fetchFromApi("user/", "GET", null, {
          'Authorization': `Token ${token}`
        });

        const userData = JSON.parse(JSON.stringify(userResponse[0]))
        cookie.set("token", token);

        if (userData.is_employer) {
          window.location.href = "/employer/dashboard";
        } else {
          window.location.href = "/candidate/my-profile";
        }

      } else {
        setError(
          Object.values(response)
            .flat()
            .filter(val => typeof val === 'string')
            .join(' ')
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to Superio</h3>
      {error && (
        <h6 className="error mb-3">
          {error}
        </h6>
      )}

      {/* <!--Login Form--> */}
      <form onSubmit={handleFormSubmit}>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* name */}

        <div className="form-group">
          <label>Password</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn-toggle-password"
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>
        {/* password */}

        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input type="checkbox" name="remember-me" id="remember" />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label>
            </div>
            <a href="#" className="pwd">
              Forgot password?
            </a>
          </div>
        </div>
        {/* forgot password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
          >
            Log In
          </button>
        </div>
        {/* login */}
      </form>
      {/* End form */}

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="call-modal signup"
            data-bs-toggle="modal"
            data-bs-target="#registerModal"
          >
            Signup
          </Link>
        </div>



      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent;
