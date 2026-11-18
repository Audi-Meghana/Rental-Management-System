import { useState } from "react";
import { saveSession } from "../../services/authService";
import { API_BASE_URL } from "../../services/apiConfig";

const API_URL = `${API_BASE_URL}/Auth`;

function OwnerSignup({ onClose, onAuthenticated, onLogin }) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
    zipCode: "",
    address: "",

    propertyTitle: "",
    propertyLocation: "",
    rent: "",
    bedrooms: "",
    description: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  // =====================================================
  // STEP 1
  // OWNER NAME
  // =====================================================

  const continueFromName = () => {
    setError("");
    setMessage("");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setStep(2);
  };


  // =====================================================
  // STEP 2
  // EMAIL
  // =====================================================

  const sendCode = async () => {
    setError("");
    setMessage("");

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
          data.message ||
          "Unable to send verification code."
        );
      }

      setMessage(
        `Development code: ${data.verificationCode}`
      );

      setStep(3);

    } catch (error) {
      setError(
        error.message ||
        "Failed to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // STEP 3
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
          data.message ||
          "Email verification failed."
        );
      }

      setMessage(
        "Email verified successfully."
      );

      setStep(4);

    } catch (error) {
      setError(
        error.message ||
        "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // STEP 4
  // COMPLETE OWNER REGISTRATION
  // =====================================================

  const completeRegistration = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.phoneNumber.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.zipCode.trim()) {
      setError("Please enter your ZIP code.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.propertyTitle.trim()) {
      setError("Please enter your property title.");
      return;
    }

    if (!form.propertyLocation.trim()) {
      setError("Please enter the property location.");
      return;
    }

    if (!form.rent) {
      setError("Please enter the monthly rent.");
      return;
    }

    if (!form.bedrooms) {
      setError("Please enter the number of bedrooms.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a property description.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/complete-owner-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            phoneNumber: form.phoneNumber,
            location: form.location,
            zipCode: form.zipCode,
            address: form.address,
            propertyTitle: form.propertyTitle,
            propertyLocation: form.propertyLocation,
            rent: Number(form.rent),
            bedrooms: Number(form.bedrooms),
            description: form.description
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Owner registration failed."
        );
      }

      saveSession(data);
      setMessage(data.message);

      setTimeout(() => {
        onAuthenticated(data.user);
      }, 700);
    } catch (error) {
      setError(
        error.message || "Owner registration failed."
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
        className="signup-premium-card owner-signup-card"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* =================================================
            CLOSE
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
            <i className="bi bi-building"></i>
          </div>

          <h2>
            List your property
          </h2>

          <p>
            Create your owner account and
            start renting out your property.
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
                  ? "33%"
                  : step === 3
                  ? "66%"
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
              Owner
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
              Email
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
              {step > 3
                ? "✓"
                : "03"}
            </span>

            <small>
              Verify
            </small>

          </div>


          {/* STEP 4 */}

          <div
            className={`progress-item ${
              step >= 4
                ? "active"
                : ""
            }`}
          >

            <span>
              04
            </span>

            <small>
              Property
            </small>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="premium-message error">

            <i className="bi bi-exclamation-circle"></i>

            {error}

          </div>
        )}


        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div className="premium-message success">

            <i className="bi bi-check-circle"></i>

            {message}

          </div>
        )}


        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (

          <div className="signup-content">

            <div className="step-heading">

              <span>
                STEP 01
              </span>

              <h3>
                Tell us about yourself
              </h3>

              <p>
                Let's start with your basic
                owner information.
              </p>

            </div>


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


            <button
              type="button"
              className="premium-action"
              onClick={continueFromName}
            >

              CONTINUE

              <i className="bi bi-arrow-right"></i>

            </button>

          </div>

        )}


        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (

          <div className="signup-content">

            <div className="step-heading">

              <span>
                STEP 02
              </span>

              <h3>
                Add your email
              </h3>

              <p>
                We'll use this email to
                secure your owner account.
              </p>

            </div>


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


            <button
              type="button"
              className="premium-action"
              onClick={sendCode}
              disabled={loading}
            >

              {loading
                ? "SENDING..."
                : "SEND VERIFICATION CODE"}

              <i className="bi bi-arrow-right"></i>

            </button>


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

              Back

            </button>

          </div>

        )}


        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (

          <div className="signup-content">

            <div className="step-heading">

              <span>
                STEP 03
              </span>

              <h3>
                Verify your email
              </h3>

              <p>
                Enter the 6-digit code sent
                to <strong>{form.email}</strong>.
              </p>

            </div>


            <div className="verification-icon">

              <i className="bi bi-envelope-check"></i>

            </div>


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


            <button
              type="button"
              className="premium-back"
              onClick={() => {
                setError("");
                setMessage("");
                setStep(2);
              }}
            >

              <i className="bi bi-arrow-left"></i>

              Change email

            </button>

          </div>

        )}


        {/* =================================================
            STEP 4
        ================================================= */}

        {step === 4 && (

          <form
            className="signup-content"
            onSubmit={completeRegistration}
          >

            <div className="step-heading">

              <span>
                STEP 04
              </span>

              <h3>
                Your property details
              </h3>

              <p>
                Tell us about the property
                you want to rent.
              </p>

            </div>


            {/* OWNER DETAILS */}

            <div className="owner-section-title">
              Owner Details
            </div>

            <div className="profile-grid">

              <div className="premium-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="premium-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

            </div>


            <div className="profile-grid">

              <div className="premium-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phoneNumber}
                  onChange={(event) =>
                    updateField(
                      "phoneNumber",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="premium-field">

                <label>
                  Your Location
                </label>

                <input
                  type="text"
                  placeholder="Your city"
                  value={form.location}
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="premium-field">
                <label>ZIP Code</label>
                <input
                  type="text"
                  maxLength="10"
                  placeholder="Property area ZIP code"
                  value={form.zipCode}
                  onChange={(event) => updateField("zipCode", event.target.value)}
                  required
                />
              </div>

            </div>


            <div className="premium-field">

              <label>
                Address
              </label>

              <textarea
                rows="2"
                placeholder="Enter your address"
                value={form.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value
                  )
                }
              ></textarea>

            </div>


            {/* PROPERTY DETAILS */}

            <div className="owner-section-title">
              Property Details
            </div>


            <div className="premium-field">

              <label>
                Property Title
              </label>

              <input
                type="text"
                placeholder="Example: Beautiful 2 BHK Apartment"
                value={form.propertyTitle}
                onChange={(event) =>
                  updateField(
                    "propertyTitle",
                    event.target.value
                  )
                }
                required
              />

            </div>


            <div className="profile-grid">

              <div className="premium-field">

                <label>
                  Property Location
                </label>

                <input
                  type="text"
                  placeholder="Property city / area"
                  value={form.propertyLocation}
                  onChange={(event) =>
                    updateField(
                      "propertyLocation",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="premium-field">

                <label>
                  Monthly Rent
                </label>

                <input
                  type="number"
                  placeholder="₹ 15000"
                  value={form.rent}
                  onChange={(event) =>
                    updateField(
                      "rent",
                      event.target.value
                    )
                  }
                  min="1"
                  required
                />

              </div>

            </div>


            <div className="premium-field">

              <label>
                Bedrooms
              </label>

              <input
                type="number"
                placeholder="Number of bedrooms"
                value={form.bedrooms}
                onChange={(event) =>
                  updateField(
                    "bedrooms",
                    event.target.value
                  )
                }
                min="1"
                required
              />

            </div>


            <div className="premium-field">

              <label>
                Property Description
              </label>

              <textarea
                rows="3"
                placeholder="Describe your property..."
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                required
              ></textarea>

            </div>


            <button
              type="submit"
              className="premium-action"
              disabled={loading}
            >

              {loading
                ? "CREATING ACCOUNT..."
                : "CREATE OWNER ACCOUNT"}

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
            onClick={() =>
              onLogin(form.email)
            }
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default OwnerSignup;