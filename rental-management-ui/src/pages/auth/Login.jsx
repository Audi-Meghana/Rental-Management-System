import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

function Login({
  email: initialEmail = "",
  onClose,
  onRegister,
  onAuthenticated
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(
        email,
        password
      );

      onClose?.();

      if (onAuthenticated) {
        onAuthenticated(data.user);
      } else {
        const destination = data.user.role === "Admin"
          ? "/admin"
          : data.user.role === "Owner"
            ? "/owner/dashboard"
            : "/user/dashboard";
        navigate(destination);
      }

    } catch (error) {
      setError(
        error.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-modal-backdrop login-backdrop"
      onClick={onClose}
    >

      <div
        className="login-card"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* CLOSE */}

        <button
          type="button"
          className="login-close"
          onClick={onClose}
        >
          <i className="bi bi-x-lg"></i>
        </button>


        {/* HEADER */}

        <div className="login-header">

          <div className="login-logo">
            my<span>HOME</span>
          </div>

          <div className="login-icon">
            <i className="bi bi-person"></i>
          </div>

          <h2>
            Welcome back
          </h2>

          <p>
            Login to your account and continue
            your home search.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="login-error">

            <i className="bi bi-exclamation-circle"></i>

            <span>
              {error}
            </span>

          </div>
        )}


        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="login-field">

            <label>
              Email Address
            </label>

            <div className="login-input">

              <i className="bi bi-envelope"></i>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <div className="login-password-row">

              <label>
                Password
              </label>

              <button
                type="button"
                className="login-forgot"
                onClick={() =>
                  setError(
                    "Password reset will be available soon."
                  )
                }
              >
                Forgot password?
              </button>

            </div>

            <div className="login-input">

              <i className="bi bi-lock"></i>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
              />

            </div>

          </div>


          {/* LOGIN */}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >

            <span>
              {loading
                ? "LOGGING IN..."
                : "LOGIN TO MY ACCOUNT"}
            </span>

            <i className="bi bi-arrow-right"></i>

          </button>

        </form>


        {/* DIVIDER */}

        <div className="login-divider">
          <span>
            New to myHOME?
          </span>
        </div>


        {/* CREATE ACCOUNT */}

        <button
          type="button"
          className="login-create"
          onClick={onRegister}
        >
          CREATE AN ACCOUNT
        </button>


        {/* SECURITY */}

        <div className="login-security">

          <i className="bi bi-shield-check"></i>

          <span>
            Your account information is securely
            protected.
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;