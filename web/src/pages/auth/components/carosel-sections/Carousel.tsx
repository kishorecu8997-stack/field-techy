import { useEffect, useState } from "react";

const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: "300px", height: "200px", overflow: "hidden" }}>
      <img
        src={images[current]}
        alt="carousel"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
