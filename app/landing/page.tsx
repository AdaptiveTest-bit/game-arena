"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Image - Full Page Cover */}
      <img
        src="/home_landing.png"
        alt="Game Arena Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0
        }}
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* Overlay gradient for readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.75) 0%, rgba(118, 75, 162, 0.75) 100%)",
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box"
      }}>
        {/* Main content */}
        <div style={{
          textAlign: "center",
          maxWidth: "600px"
        }}>
          {/* Logo */}
          <div style={{
            width: "120px",
            height: "120px",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(15px)",
            borderRadius: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
            fontSize: "60px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            border: "4px solid rgba(255,255,255,0.4)",
            animation: "bounce 2s ease-in-out infinite"
          }}>
            🎮
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: "clamp(40px, 10vw, 64px)",
            fontWeight: "bold",
            color: "white",
            margin: "0 0 20px 0",
            textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
            letterSpacing: "2px"
          }}>
            Game Arena
          </h1>
          
          <p style={{
            fontSize: "clamp(20px, 5vw, 28px)",
            color: "rgba(255,255,255,0.95)",
            margin: "0 0 30px 0",
            fontWeight: "600",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            Learn Math the Fun Way! 🚀
          </p>
          
          <p style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.9)",
            margin: "0 0 40px 0",
            lineHeight: 1.7,
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Master CBSE Class 5 skills through interactive games. 
            Track your progress and become a math champion! 🏆
          </p>
          
          {/* Feature badges */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "45px"
          }}>
            <span style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              borderRadius: "25px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              border: "2px solid rgba(255,255,255,0.3)"
            }}>
              📚 CBSE Aligned
            </span>
            <span style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              borderRadius: "25px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              border: "2px solid rgba(255,255,255,0.3)"
            }}>
              🎯 Interactive Games
            </span>
            <span style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              borderRadius: "25px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              border: "2px solid rgba(255,255,255,0.3)"
            }}>
              📊 Track Progress
            </span>
            <span style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              borderRadius: "25px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              border: "2px solid rgba(255,255,255,0.3)"
            }}>
              🏆 Earn Badges
            </span>
          </div>
          
          {/* Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center"
          }}>
            <Link
              href="/register"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "20px 50px",
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                borderRadius: "20px",
                color: "white",
                textDecoration: "none",
                fontSize: "22px",
                fontWeight: "bold",
                boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
                border: "3px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{ fontSize: "32px" }}>📝</span>
              <div style={{ textAlign: "left" }}>
                <div>Register</div>
                <div style={{ fontSize: "13px", opacity: 0.9, fontWeight: "normal" }}>
                  Create new account
                </div>
              </div>
            </Link>
            
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "20px 50px",
                background: "linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)",
                borderRadius: "20px",
                color: "white",
                textDecoration: "none",
                fontSize: "22px",
                fontWeight: "bold",
                boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
                border: "3px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{ fontSize: "32px" }}>🔐</span>
              <div style={{ textAlign: "left" }}>
                <div>Sign In</div>
                <div style={{ fontSize: "13px", opacity: 0.9, fontWeight: "normal" }}>
                  Login to your account
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        a:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 35px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}

