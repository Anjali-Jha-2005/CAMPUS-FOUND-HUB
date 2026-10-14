import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Signup.module.css';

const FLOATING_ITEMS = ['🔑', '👜', '📱', '💳', '🎒', '👓', '🔍', '📚', '⌚', '🎧', '💼', '🪪'];

export default function Signup({ onGoToLogin }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('⚠ Passwords do not match');
      return;
    }

    try {
      await signup({ name, email, password });
    } catch (err) {
      setError(
        err.response?.data?.error || 
        '⚠ Signup failed. Please try again or use a different email.'
      );
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
          <div className={styles.illustrationEmoji}>🎒</div>
          <h2 className={styles.illustrationTitle}>
            Join the Campus<br />Found Hub
          </h2>
          <p className={styles.illustrationSubtitle}>
            Help build a stronger campus community. Report lost items, return found belongings, and make a difference.
          </p>
          <div className={styles.illustrationStats}>
            <div className={styles.illustrationStat}>
              <span className={styles.illustrationStatNum}>2K+</span>
              <span className={styles.illustrationStatLabel}>Students</span>
            </div>
            <div className={styles.illustrationStat}>
              <span className={styles.illustrationStatNum}>24/7</span>
              <span className={styles.illustrationStatLabel}>Available</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Create Account ✨</h3>
            <p className={styles.formSubtitle}>Register with your college email to get started</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="signup-name">Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  id="signup-name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="signup-email">College Email</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✉</span>
                <input
                  type="email"
                  id="signup-email"
                  placeholder="yourname@its.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="signup-password">Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  id="signup-password"
                  placeholder="Create a password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="signup-confirm">Confirm Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔐</span>
                <input
                  type="password"
                  id="signup-confirm"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.loginButton}>
              Create Account →
            </button>
          </form>

          <div className={styles.toggleLink}>
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onGoToLogin}
                className={styles.toggleBtn}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
