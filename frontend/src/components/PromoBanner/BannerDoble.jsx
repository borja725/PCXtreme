import React from 'react';
import './PromoBanner.css';

export default function BannerDoble() {
  return (
    <div className="row g-4 justify-content-center align-items-stretch my-4">
      {/* AMD Banner */}
      <div className="col-12 col-md-6 d-flex">
        <button
          className="w-100 p-0 border-0 bg-transparent banner-card-btn"
          style={{ cursor: 'pointer', borderRadius: 24, overflow: 'hidden', background: '#2a2636', minHeight: 180 }}
        >
          <div
            className="d-flex align-items-center justify-content-center w-100 h-100"
            style={{ minHeight: 180, height: '100%' }}
          >
            <img
              src="/AMDBanner.jpg"
              alt="AMD Banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }}
            />
          </div>
        </button>
      </div>
      {/* NVIDIA Banner */}
      <div className="col-12 col-md-6 d-flex">
        <button
          className="w-100 p-0 border-0 bg-transparent banner-card-btn"
          style={{ cursor: 'pointer', borderRadius: 24, overflow: 'hidden', background: '#1a253a', minHeight: 180 }}
        >
          <div
            className="d-flex align-items-center justify-content-center w-100 h-100"
            style={{ maxHeight: 410, height: '100%' }}
          >
            <img
              src="https://img.pccomponentes.com/pcblog/1747778400000/500x320-nvidia-serie-50-w21.png"
              alt="NVIDIA Serie 50 Banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }}
            />
          </div>
        </button>
      </div>
    </div>
  );
}

