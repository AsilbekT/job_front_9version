import cookie from 'js-cookie';
import { useCallback, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import fetchFromApi from '../../../../pages/api/api';

const FormContent = ({
  isApplication,
  onApply,
  setValidationError,
  setSuccess
}) => {
  const [role, setRole] = useState(isApplication ? 'candidate' : 'employer');
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  let is_employer = false;
  let path = "/candidate/dashboard";

  const setValidationErrorMsg = useCallback((errorMsg) => {
    if (typeof setValidationError === 'function') {
      setValidationError(errorMsg);
    }
    console.log(errorMsg);
  }, [setValidationError]);

  const setSuccessValue = useCallback((val) => {
    if (typeof setSuccess === 'function') {
      setSuccess(val);
    }
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setValidationErrorMsg('');

    if (password !== password2) {
      setValidationErrorMsg("Passwords do not match");
      return;
    }
    if (role === 'employer') {
      is_employer = true;
      path = "/employer/dashboard";
    }
    try {
      const payload = {
        email,
        username,
        password,
        password2,
        is_employer
      };

      let callbackFailed = false;
      if (typeof onApply === 'function') {
        callbackFailed = (await onApply(payload))?.error;
      }

      if (callbackFailed) return;

      const response = await fetchFromApi("/api/accounts/register/", "POST", payload);
      // If registration was successful, redirect the user

      if (!response.error) {
        const { token } = response.data;
        cookie.set("token", token);

        setSuccessValue(true);
        if (!isApplication) {
          window.location.href = path
        }
      } else {
        setValidationError(
          Object.values(response.data)
            .flat()
            .filter(val => typeof val === 'string')
            .join(' ')
        );
        setSuccessValue(false);
      }

    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {!isApplication && (
        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            className="form-select"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
        </div>
      )}
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          required
          name="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
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

      <div className="form-group">
        <label>Confirm password</label>
        <input
          id="password-field2"
          type="password"
          required
          name="password2"
          placeholder="Confirm password"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
        />
      </div>

      <div className="form-group">
        <button className="theme-btn btn-style-one w-100" type="submit">
          {isApplication ? 'Apply' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default FormContent;
