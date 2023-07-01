import React from "react";
import "./TrustedBy.scss";

const TrustedBy = () => {
  return (
    <div className="trustedBy">
      <div className="container">
        <span>Trusted by:</span>
        <img
          src="https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687140264/fiverr/LOGOS/face-min_fqsdpq.png"
          alt="logo de facebook"
          loading="lazy"
        />
        <img
          src="https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687140264/fiverr/LOGOS/google-min_rfx2zx.png"
          alt="logo de google"
          loading="lazy"
        />
        <img
          src="https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687140264/fiverr/LOGOS/netflix-min_yaekbx.png"
          alt="logo de netflix"
          loading="lazy"
        />
        <img
          src="https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687140264/fiverr/LOGOS/pyg-min_bgoq2k.png"
          alt="logo de pyg"
          loading="lazy"
        />
        <img
          src="https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687140264/fiverr/LOGOS/pay-min_kqsclj.png"
          alt="logo paypal"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default TrustedBy;
