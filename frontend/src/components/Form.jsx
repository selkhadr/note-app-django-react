import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { User, Lock, LogIn, UserPlus, Sparkles,AlertTriangle } from "lucide-react";
import LoadingIndicator from "./LoadingIndicator";
import '../styles/Form.css';


function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    // Your original handleSubmit function - UNCHANGED
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                error.response?.data?.username?.[0] ||
                error.response?.data?.password?.[0] ||
                "An error occurred. Please try again."
            );
        } finally {
            setLoading(false)
        }
    };

   return (
        <div className="auth-container">
            {/* Animated Background Elements */}
            <div className="background-elements">
                <div className="bg-orb bg-orb-1"></div>
                <div className="bg-orb bg-orb-2"></div>
                <div className="bg-orb bg-orb-3"></div>
            </div>

            {/* Floating Particles */}
            <div className="particles">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="form-wrapper">
                <div className="form-header">
                    <div className="header-icon">
                        <Sparkles className="sparkles-icon" />
                    </div>
                    <h1 className="form-title">{name}</h1>
                    <p className="form-subtitle">
                        {method === "login" 
                            ? "Welcome back! Please sign in to your account" 
                            : "Create your account to get started"
                        }
                    </p>
                </div>

                <div className="form-container">
                    {error && (
                        <div className="custom-alert">
                            <AlertTriangle className="alert-icon" />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="input-group">
                        <div className="input-icon">
                            <User className="icon" />
                        </div>
                        <input
                            className="form-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <div className="input-icon">
                            <Lock className="icon" />
                        </div>
                        <input
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    {loading && <LoadingIndicator />}

                    <button className="form-button" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <div className="button-spinner"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                {method === "login" ? (
                                    <LogIn className="button-icon" />
                                ) : (
                                    <UserPlus className="button-icon" />
                                )}
                                {name}
                            </>
                        )}
                    </button>
                </div>
            </div>


        </div>
    );
}

export default Form;