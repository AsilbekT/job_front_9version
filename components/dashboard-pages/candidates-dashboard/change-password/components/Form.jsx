import { useCallback } from "react";
import { useFetch } from "../../../../../hooks/useFetch";
import { useContext } from "react";
import { UserContext } from "../../../../../pages/context/UserContext";
import { useState } from "react";

const Form = () => {
  const formFetch = useFetch();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [success, setSuccess] = useState(false);

  const user = useContext(UserContext);

  const onSubmitForm = useCallback(async (e) => {
    try {
      e.preventDefault();
      let errorMsg;
      if (password.length < 6) {
        errorMsg = 'Password should not be less than 6 characters';
      }
      if (password !== passwordConfirm) {
        errorMsg = 'Passwords do not match, please check your passwords!';
      }
      if (errorMsg) {
        formFetch.setError(errorMsg);
        return;
      }
      await formFetch.makeRequest(`/user/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });
      setSuccess(true);
      setTimeout(() => {
        setPassword('');
        setPasswordConfirm('');
        setSuccess(false);
      }, 2500);
    } catch (er) {
      console.log(er);
    }
  }, [user, password, passwordConfirm]);
  
  return (
    <form className="default-form" onSubmit={onSubmitForm}>
      <div className="row">
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-7 col-md-12">
          <label>Old Password </label>
          <input type="password" name="name" required />
        </div> */}

        {/* <!-- Input --> */}
        {formFetch.error && (
          <span className="error">
            {formFetch.error}
          </span>
        )}
        {success && (
          <span className="success">Your password has successfully been updated!</span>
        )}
        <div className="form-group col-lg-7 col-md-12">
          <label>New Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            name="name"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Confirm Password</label>
          <input
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
            type="password"
            name="name"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
