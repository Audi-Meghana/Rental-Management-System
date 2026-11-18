import { useState } from "react";
import { saveSession } from "../../services/authService";
import { API_BASE_URL } from "../../services/apiConfig";

const API_URL = `${API_BASE_URL}/Auth`;

function UserSignup({ onClose, onAuthenticated, onLogin }) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
    address: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // UPDATE FORM FIELD
  // =====================================================

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  // =====================================================
  // STEP 1
  // SEND VERIFICATION CODE
  // =====================================================

  const sendCode = async () => {
    setError("");
    setMessage("");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/send-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send verification code."
        );
      }

      setMessage(
        `Development code: ${data.verificationCode}`
      );

      setStep(2);

    } catch (error) {
      setError(
        error.message || "Failed to fetch"
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // STEP 2
  // VERIFY EMAIL
  // =====================================================

  const verifyCode = async () => {
    setError("");
    setMessage("");

    if (form.code.length !== 6) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email,
            code: form.code
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Verification failed."
        );
      }

      setMessage(
        "Email verified successfully."
      );

      setStep(3);

    } catch (error) {
      setError(
        error.message || "Failed to verify email."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // STEP 3
  // COMPLETE REGISTRATION
  // =====================================================

  const completeSignup = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (!form.phoneNumber.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/complete-user-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            confirmPassword:
              form.confirmPassword,
            phoneNumber: form.phoneNumber,
            location: form.location,
            address: form.address
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Registration failed."
        );
      }

      saveSession(data);
      setMessage("Account created successfully!");

      setTimeout(() => {
        onAuthenticated(data.user);
      }, 700);

    } catch (error) {
      setError(
        error.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="auth-modal-backdrop"
      onClick={onClose}
    >

      <div
        className="signup-premium-card"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <button
          type="button"
          className="premium-close"
          onClick={onClose}
        >
          <i className="bi bi-x-lg"></i>
        </button>


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="premium-header">

          <div className="premium-logo">
            my<span>HOME</span>
          </div>

          <div className="premium-icon">
            <i className="bi bi-house-heart"></i>
          </div>

          <h2>
            Find your next home
          </h2>

          <p>
            Create your account and start
            exploring beautiful rental
            properties.
          </p>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="signup-progress">

          <div className="progress-track"></div>

          <div
            className="progress-fill"
            style={{
              width:
                step === 1
                  ? "0%"
                  : step === 2
                  ? "50%"
                  : "100%"
            }}
          ></div>


          {/* STEP 1 */}

          <div
            className={`progress-item ${
              step >= 1
                ? "active"
                : ""
            }`}
          >

            <span>
              {step > 1
                ? "✓"
                : "01"}
            </span>

            <small>
              Your Details
            </small>

          </div>


          {/* STEP 2 */}

          <div
            className={`progress-item ${
              step >= 2
                ? "active"
                : ""
            }`}
          >

            <span>
              {step > 2
                ? "✓"
                : "02"}
            </span>

            <small>
              Verify Email
            </small>

          </div>


          {/* STEP 3 */}

          <div
            className={`progress-item ${
              step >= 3
                ? "active"
                : ""
            }`}
          >

            <span>
              03
            </span>

            <small>
              Complete
            </small>

          </div>

        </div>


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="premium-message error">

            <i className="bi bi-exclamation-circle"></i>

            {error}

          </div>
        )}


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="premium-message success">

            <i className="bi bi-check-circle"></i>

            {message}

          </div>
        )}


        {/* =================================================
            STEP 1 - BASIC DETAILS
        ================================================= */}

        {step === 1 && (

          <div className="signup-content">

            <div className="step-heading">

              <span>
                STEP 01
              </span>

              <h3>
                Tell us about you
              </h3>

              <p>
                Let's start with your
                basic information.
              </p>

            </div>


            {/* FULL NAME */}

            <div className="premium-field">

              <label>
                Full Name
              </label>

              <div className="input-with-icon">

                <i className="bi bi-person"></i>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(event) =>
                    updateField(
                      "fullName",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="premium-field">

              <label>
                Email Address
              </label>

              <div className="input-with-icon">

                <i className="bi bi-envelope"></i>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            {/* CONTINUE */}

            <button
              type="button"
              className="premium-action"
              onClick={sendCode}
              disabled={loading}
            >

              {loading
                ? "SENDING..."
                : "CONTINUE"}

              <i className="bi bi-arrow-right"></i>

            </button>

          </div>

        )}


        {/* =================================================
            STEP 2 - EMAIL VERIFICATION
        ================================================= */}

        {step === 2 && (

          <div className="signup-content">

            <div className="step-heading">

              <span>
                STEP 02
              </span>

              <h3>
                Verify your email
              </h3>

              <p>
                We've sent a 6-digit
                verification code to{" "}
                <strong>
                  {form.email}
                </strong>.
              </p>

            </div>


            {/* EMAIL ICON */}

            <div className="verification-icon">

              <i className="bi bi-envelope-check"></i>

            </div>


            {/* CODE */}

            <div className="premium-field">

              <label>
                Verification Code
              </label>

              <input
                className="code-input"
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="000000"
                value={form.code}
                onChange={(event) =>
                  updateField(
                    "code",
                    event.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

            </div>


            {/* VERIFY */}

            <button
              type="button"
              className="premium-action"
              onClick={verifyCode}
              disabled={loading}
            >

              {loading
                ? "VERIFYING..."
                : "VERIFY EMAIL"}

              <i className="bi bi-shield-check"></i>

            </button>


            {/* BACK */}

            <button
              type="button"
              className="premium-back"
              onClick={() => {

                setError("");
                setMessage("");
                setStep(1);

              }}
            >

              <i className="bi bi-arrow-left"></i>

              Change email

            </button>

          </div>

        )}


        {/* =================================================
            STEP 3 - PROFILE
        ================================================= */}

        {step === 3 && (

          <form
            className="signup-content"
            onSubmit={completeSignup}
          >

            <div className="step-heading">

              <span>
                STEP 03
              </span>

              <h3>
                Complete your profile
              </h3>

              <p>
                Just a few more details
                and you're ready.
              </p>

            </div>


            <div className="profile-grid">


              {/* PASSWORD */}

              <div className="premium-field">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={(event) =>
                    updateField(
                      "password",
                      event.target.value
                    )
                  }
                  minLength="6"
                  required
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="premium-field">

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={
                    form.confirmPassword
                  }
                  onChange={(event) =>
                    updateField(
                      "confirmPassword",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* PHONE */}

              <div className="premium-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={
                    form.phoneNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "phoneNumber",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* LOCATION */}

              <div className="premium-field">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Your city"
                  value={
                    form.location
                  }
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            {/* ADDRESS */}

            <div className="premium-field">

              <label>
                Address
              </label>

              <textarea
                rows="3"
                placeholder="Enter your address"
                value={
                  form.address
                }
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value
                  )
                }
              ></textarea>

            </div>


            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="premium-action"
              disabled={loading}
            >

              {loading
                ? "CREATING ACCOUNT..."
                : "CREATE MY ACCOUNT"}

              <i className="bi bi-arrow-right"></i>

            </button>

          </form>

        )}


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="premium-footer">

          Already have an account?

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default UserSignup;