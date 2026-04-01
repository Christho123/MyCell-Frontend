import { useState } from 'react'
import { useAuth } from '../auth/useAuth'

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
      <section className="auth-card">
        <header className="auth-header">
          <h1>MyCell</h1>
          <p>Accede a tu panel para gestionar el sistema.</p>
        </header>

        <div className="auth-switch">
          <button
            type="button"
            className={view === 'login' ? 'active' : ''}
            onClick={() => setView('login')}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            className={view === 'register' ? 'active' : ''}
            onClick={() => setView('register')}
          >
            Registro
          </button>
        </div>

        {errorMessage && <p className="feedback error">{errorMessage}</p>}
        {successMessage && <p className="feedback success">{successMessage}</p>}

        {view === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="sosa2@gmail.com"
              required
            />

            <label htmlFor="login-password">Contrasena</label>
            <input
              id="login-password"
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="********"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <label htmlFor="register-name">Nombre</label>
            <input
              id="register-name"
              type="text"
              value={registerForm.user_name}
              onChange={(event) =>
                setRegisterForm((prev) => ({ ...prev, user_name: event.target.value }))
              }
              required
            />

            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />

            <label htmlFor="register-document">Documento</label>
            <input
              id="register-document"
              type="text"
              value={registerForm.document_number}
              onChange={(event) =>
                setRegisterForm((prev) => ({ ...prev, document_number: event.target.value }))
              }
              required
            />

            <label htmlFor="register-password">Contrasena</label>
            <input
              id="register-password"
              type="password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />

            <label htmlFor="register-password-confirm">Confirmar contrasena</label>
            <input
              id="register-password-confirm"
              type="password"
              value={registerForm.password_confirm}
              onChange={(event) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  password_confirm: event.target.value,
                }))
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default AuthPage
