import { useState } from "react";
import { setTimedAlert } from "../utils/alerts.js";
import { createAccount } from "../services/auth.js";

const MIN_PASSWORD_LEN = 8;

/**
 * sign up with email, username, and password
 * TODO: implement the home page and redirect
 * to it after a successful sign up
 */
const SignUpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
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

    const { email, username, password } = form;
    if (password.length < MIN_PASSWORD_LEN) {
      setTimedAlert(
        "danger",
        `Password must be at least ${MIN_PASSWORD_LEN} characters`,
        setAlert,
      );
      setIsSubmitting(false);
      return;
    }

    // add account to database
    try {
      await createAccount(email, username, password);
      setTimedAlert("success", "Successfully created account", setAlert);
    } catch {
      setTimedAlert("danger", "Failed to create account", setAlert);
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
      <h2 className="mb-3">Sign Up</h2>

      <label htmlFor="signup-email" className="form-label">
        Email
      </label>
      <input
        type="email"
        name="email"
        id="signup-email"
        className="form-control mb-3"
        value={form.email}
        onChange={handleInputChange}
        placeholder="email@example.com"
        disabled={isSubmitting}
        required
      />

      <label htmlFor="signup-username" className="form-label">
        Username
      </label>
      <input
        type="text"
        name="username"
        id="signup-username"
        className="form-control mb-3"
        value={form.username}
        onChange={handleInputChange}
        placeholder="user123"
        disabled={isSubmitting}
        required
      />

      <label htmlFor="signup-password" className="form-label">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="signup-password"
        className="form-control mb-3"
        value={form.password}
        onChange={handleInputChange}
        placeholder="************"
        disabled={isSubmitting}
        required
      />

      <button className="btn btn-primary" type="submit">
        Create Account
      </button>

      <small
        className="text-center text-muted mx-auto mt-3"
        style={{ maxWidth: "350px" }}
      >
        By signing up, you agree to our Terms of Service and Privacy Policy
      </small>

      {/* alert showing error and success feedback*/}
      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}
    </form>
  );
};

export default SignUpPage;
