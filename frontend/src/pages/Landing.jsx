import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAction = () => {
        if (user) {
            const role = user.role;
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'JUDGE') navigate('/judge');
            else if (role === 'POLICE') navigate('/police');
            else if (role === 'LAWYER') navigate('/lawyer');
            else navigate('/citizen');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="landing-container">
            <header className="landing-nav">
                <h1>NyayaConnect</h1>
                {user ? (
                    <button 
                        onClick={handleAction}
                        className="text-white font-medium opacity-85 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </header>

            <main>
                <section className="hero">
                    <h2>Justice Infrastructure Reimagined</h2>
                    <p>Secure, intelligent and unified judicial technology built for tamper-proof digital evidence and seamless institutional access.</p>
                    <button onClick={handleAction}>Upload Evidence</button>
                </section>

                <section className="how-it-works">
                    <h3>How It Works</h3>

                    <div className="steps">
                        <article className="step">
                            <h4>Secure Submission</h4>
                            <p>Upload digital evidence through encrypted infrastructure designed for confidentiality and institutional trust.</p>
                        </article>

                        <article className="step">
                            <h4>Hash & Timestamp</h4>
                            <p>Every file is SHA-256 hashed and cryptographically timestamped to guarantee integrity.</p>
                        </article>

                        <article className="step">
                            <h4>Authorized Access</h4>
                            <p>Only verified judicial authorities can retrieve evidence via role-based authentication protocols.</p>
                        </article>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                © 2026 NyayaConnect — Secure • Intelligent • Unified  
                <br />
                Digital Justice Infrastructure for a Transparent Future
            </footer>
        </div>
    );
};

export default Landing;
