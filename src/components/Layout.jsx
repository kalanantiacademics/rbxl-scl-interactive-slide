import React from "react";

const Layout = ({ children, title }) => {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-start vh-100 pt-4" >

      <div className="static-box-large p-4 rounded-4 shadow-lg d-flex flex-column" 
           style={{ backgroundColor: "#0b0e18", border: "2px solid rgba(255,255,255,0.1)" }}>

        <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary border-opacity-25 pb-3 flex-shrink-0">

          <div className="d-flex align-items-center">
            <div className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center border border-secondary border-opacity-25" 
                 style={{ width: "60px", height: "60px", backgroundColor: "rgba(255,255,255,0.05)" }}>
              <img 
                src="https://cdn-web-2.ruangguru.com/landing-pages/assets/e7d93748-818d-462d-be57-7db1e479cd62.png" // <-- INSERT SQUARE LOGO URL HERE
                alt="Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>


            <div className="ms-3">
              <h1 className="text-white fw-bold mb-0 h3 text-uppercase tracking-wider" style={{ letterSpacing: '2px' }}>
                {title}
              </h1>
              <div className="d-flex align-items-center">
                <span className="text-warning fw-bold small text-uppercase me-2">ROBLOX STUDIO</span>
                <span className="text-secondary small">/</span>
              </div>
            </div>
          </div>


          <div className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center border border-secondary border-opacity-25" 
               style={{ width: "180px", height: "60px", backgroundColor: "rgba(255,255,255,0.05)" }}>
            <img 
              src="https://cdn-web-2.ruangguru.com/landing-pages/assets/hs/kalananti%202022/Kalananti%20by%20Ruangguru.png" // <-- INSERT RECTANGLE PARTNER LOGO URL HERE
              alt="Partner Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>

        </div>


        <div className="flex-grow-1 overflow-auto pe-2 custom-scrollbar">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
