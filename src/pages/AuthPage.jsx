import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import logoKml from '../assets/logo-kml.png'

const defaultLoginForm = {
  email: '',
  password: '',
}

const defaultRegisterForm = {
  user_name: '',
  email: '',
  document_number: '',
  password: '',
  password_confirm: '',
}

/* ── Iconos inline ── */
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M8 10h2" /><path d="M8 14h4" />
  </svg>
)
const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
  </svg>
)
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)
const IconError = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)
const IconSuccess = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

/* ── Ojo abierto / cerrado ── */
const IconEyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconEyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

/* ── Campo de contraseña con toggle ── */
function PasswordField({ id, label, value, onChange, placeholder, required }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <IconLock />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="has-toggle"
        />
        <button
          type="button"
          className="eye-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
        >
          <span className={`eye-icon ${visible ? 'open' : ''}`}>
            <IconEyeOpen />
            <IconEyeClosed />
          </span>
        </button>
      </div>
    </div>
  )
}

function AuthPage() {
  const { login, register, loading } = useAuth()
  const [view, setView] = useState('login')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loginForm, setLoginForm] = useState(defaultLoginForm)
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm)

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    try {
      await login(loginForm)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || 'No se pudo iniciar sesion. Verifica los datos.',
      )
    }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (registerForm.password !== registerForm.password_confirm) {
      setErrorMessage('Las contrasenas no coinciden.')
      return
    }
    try {
      await register(registerForm)
      setSuccessMessage('Registro completado. Ahora puedes iniciar sesion.')
      setRegisterForm(defaultRegisterForm)
      setView('login')
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || 'No se pudo registrar. Revisa la informacion.',
      )
    }
  }

  return (
    <main className="auth-page">
      {/* ═══ Panel izquierdo: Branding ═══ */}
      <aside className="auth-branding">
        <div className="brand-content">
          <img src={logoKml} alt="KML Logistics International" className="brand-logo" />

          <h1 className="brand-title">KML Logistics International</h1>
          <p className="brand-subtitle">
            Soluciones logisticas integrales para comercio internacional.
            Transporte, gestion aduanera e importacion de mercancias.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <IconGlobe />
              <div>
                <strong>Transporte global</strong>
                <span>Maritimo, aereo y terrestre hacia cualquier destino</span>
              </div>
            </div>
            <div className="brand-feature">
              <IconShield />
              <div>
                <strong>Gestion aduanera</strong>
                <span>Asesoria completa en tramites de importacion y exportacion</span>
              </div>
            </div>
            <div className="brand-feature">
              <IconBox />
              <div>
                <strong>Logistica integral</strong>
                <span>Almacenamiento, distribucion y seguimiento de carga</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <p>KML Logistic S.A.C. &middot; RUC: 20556054755</p>
          <p>Jr Francisco Lazo 1932, Dpto 404, Lince</p>
          <p className="brand-copy">&copy; 2026 KML Logistics International. Todos los derechos reservados.</p>
        </div>
      </aside>

      {/* ═══ Panel derecho: Formulario ═══ */}
      <section className="auth-form-section">
        <div className="auth-card">
          <div className="auth-card-accent" />

          <header className="auth-header">
            <h1>KML Logistics International</h1>
            <p>Accede a tu panel para gestionar el sistema.</p>
          </header>

          <div className="auth-switch">
            <button
              type="button"
              className={view === 'login' ? 'active' : ''}
              onClick={() => { setView('login'); setErrorMessage(''); setSuccessMessage('') }}
            >
              Iniciar sesion
            </button>
            <button
              type="button"
              className={view === 'register' ? 'active' : ''}
              onClick={() => { setView('register'); setErrorMessage(''); setSuccessMessage('') }}
            >
              Registro
            </button>
          </div>

          {errorMessage && (
            <div className="feedback error">
              <IconError />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="feedback success">
              <IconSuccess />
              <span>{successMessage}</span>
            </div>
          )}

          {view === 'login' ? (
            <form className="auth-form" key="login" onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label htmlFor="login-email">Email</label>
                <div className="input-wrap">
                  <IconMail />
                  <input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="sosa2@gmail.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <PasswordField
                id="login-password"
                label="Contrasena"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="********"
                required
              />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <svg className="btn-spinner" width="18" height="18" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"
                        strokeWidth="3" strokeDasharray="45 18" strokeLinecap="round" />
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          ) : (
            <form className="auth-form" key="register" onSubmit={handleRegisterSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="register-name">Nombre</label>
                  <div className="input-wrap">
                    <IconUser />
                    <input
                      id="register-name"
                      type="text"
                      value={registerForm.user_name}
                      onChange={(e) =>
                        setRegisterForm((p) => ({ ...p, user_name: e.target.value }))
                      }
                      placeholder="Juan Sosa"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="register-document">Documento</label>
                  <div className="input-wrap">
                    <IconDoc />
                    <input
                      id="register-document"
                      type="text"
                      value={registerForm.document_number}
                      onChange={(e) =>
                        setRegisterForm((p) => ({ ...p, document_number: e.target.value }))
                      }
                      placeholder="12345678"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-email">Email</label>
                <div className="input-wrap">
                  <IconMail />
                  <input
                    id="register-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="sosa2@gmail.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-row">
                <PasswordField
                  id="register-password"
                  label="Contrasena"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="********"
                  required
                />

                <PasswordField
                  id="register-password-confirm"
                  label="Confirmar"
                  value={registerForm.password_confirm}
                  onChange={(e) =>
                    setRegisterForm((p) => ({ ...p, password_confirm: e.target.value }))
                  }
                  placeholder="********"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <svg className="btn-spinner" width="18" height="18" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"
                        strokeWidth="3" strokeDasharray="45 18" strokeLinecap="round" />
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>
          )}

          <footer className="auth-card-footer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Conexion segura y encriptada</span>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default AuthPage