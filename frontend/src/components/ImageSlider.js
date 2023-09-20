import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "../images/graphics/image1.jpg";
import image2 from "../images/graphics/image2.jpg";
import image3 from "../images/graphics/image3.jpg";

const images = [image1, image2, image3];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const ImageSlider = () => {
  return (
    <div className="camvas">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
