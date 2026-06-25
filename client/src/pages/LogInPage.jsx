import { useState } from "react";
import { setTimedAlert } from "../utils/alerts";
import { login } from "../services/auth";

/**
 *  log in with username and password
 * TODO: implement the home page and redirect
 * to it after a successful log in
 */
const LogInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { username, password } = form;
    // try login
    try {
      await login(username, password);
      setTimedAlert("success", "Successfully logged in", setAlert);
    } catch {
      setTimedAlert("danger", "Failed to log in", setAlert);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card mx-auto my-4 p-3"
      style={{ maxWidth: "500px" }}
    >
      <h2 className="mb-3">Log In</h2>

      {/* username */}
      <label htmlFor="login-username" className="form-label">
        Username
      </label>
      <input
        type="text"
        name="username"
        id="login-username"
        className="form-control mb-3"
        value={form.username}
        onChange={handleInputChange}
        placeholder="user123"
        disabled={isSubmitting}
        required
      />

      {/* password */}
      <label htmlFor="login-password" className="form-label">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="login-password"
        className="form-control mb-3"
        value={form.password}
        onChange={handleInputChange}
        placeholder="************"
        disabled={isSubmitting}
        required
      />

      <button className="btn btn-primary" type="submit">
        Log In
      </button>

      {/* alert showing error and success feedback*/}
      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}
    </form>
  );
};

export default LogInPage;
