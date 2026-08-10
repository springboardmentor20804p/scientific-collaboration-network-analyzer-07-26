import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Temporary login simulation.
    // This will later be connected to the FastAPI backend.
    setTimeout(() => {
      setLoading(false);
      alert("Login successful!");
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT SECTION */}
        <div className="welcome-section">
          <div className="brand-icon">
            <span>SC</span>
          </div>

          <h1>Scientific Collaboration</h1>
          <h2>Network Analyzer</h2>

          <p className="welcome-text">
            Connect researchers, institutions, publications and
            projects through a centralized collaboration platform.
          </p>

          <div className="feature-list">

            <div className="feature">
              <span className="feature-icon">🔬</span>

              <div>
                <strong>Research Network</strong>
                <p>
                  Discover and manage research collaborations.
                </p>
              </div>
            </div>

            <div className="feature">
              <span className="feature-icon">📚</span>

              <div>
                <strong>Publication Management</strong>
                <p>
                  Organize publications, citations and references.
                </p>
              </div>
            </div>

            <div className="feature">
              <span className="feature-icon">🤝</span>

              <div>
                <strong>Collaborate</strong>
                <p>
                  Build meaningful academic partnerships.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* LOGIN SECTION */}
        <div className="login-section">
          <div className="login-card">

            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <div
                  className={`input-wrapper ${
                    errors.email ? "input-error" : ""
                  }`}
                >
                  <span className="input-icon">✉</span>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({
                        ...errors,
                        email: ""
                      });
                    }}
                  />
                </div>

                {errors.email && (
                  <span className="error-message">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div
                  className={`input-wrapper ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <span className="input-icon">🔒</span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({
                        ...errors,
                        password: ""
                      });
                    }}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>

                {errors.password && (
                  <span className="error-message">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* OPTIONS */}
              <div className="form-options">

                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Password reset functionality will be added soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            {/* REGISTER */}
            <div className="register-section">
              <span>Don't have an account?</span>

              <button
                type="button"
                className="register-button"
                onClick={() =>
                  alert(
                    "Registration page will be added soon."
                  )
                }
              >
                Create an account
              </button>
            </div>

            <div className="security-note">
              🔐 Your account information is securely protected.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;