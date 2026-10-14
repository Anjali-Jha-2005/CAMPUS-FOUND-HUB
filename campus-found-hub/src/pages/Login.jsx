import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const FLOATING_ITEMS = ['🔑', '👜', '📱', '💳', '🎒', '👓', '🔍', '📚', '⌚', '🎧', '💼', '🪪'];

export default function Login({ onGoToSignup }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('⚠ Invalid credentials. If you haven\'t registered yet, please create an account first.');
      } else {
        setError(
          err.response?.data?.error || 
          '⚠ Server error. Please try again later.'
        );
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Animated gradient orbs */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      {/* Floating lost items animation */}
      <div className={styles.floatingItems}>
        {FLOATING_ITEMS.map((item, i) => (
          <span key={i} className={styles.floatItem}>{item}</span>
        ))}
      </div>

      {/* Main Split Card */}
      <div className={styles.mainCard}>
        {/* Left Illustration Panel */}
        <div className={styles.illustrationPanel}>
          <div className={styles.illustrationEmoji}>🔍</div>
          <h2 className={styles.illustrationTitle}>
            Lost Something on Campus?
          </h2>
          <p className={styles.illustrationSubtitle}>
            Our community-powered portal helps reunite students with their lost belongings. Fast, simple, and secure.
          </p>
          <div className={styles.illustrationStats}>
            <div className={styles.illustrationStat}>
              <span className={styles.illustrationStatNum}>500+</span>
              <span className={styles.illustrationStatLabel}>Items Found</span>
            </div>
            <div className={styles.illustrationStat}>
              <span className={styles.illustrationStatNum}>95%</span>
              <span className={styles.illustrationStatLabel}>Success Rate</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Welcome Back 👋</h3>
            <p className={styles.formSubtitle}>Sign in with your college email to continue</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="login-email">Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✉</span>
                <input
                  type="email"
                  id="login-email"
                  placeholder="yourname@its.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="login-password">Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  id="login-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.loginButton}>
              Sign In →
            </button>
          </form>

          <div className={styles.toggleLink}>
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onGoToSignup}
                className={styles.toggleBtn}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
