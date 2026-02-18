
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import local images from assets folder
import weddingImg from '../assets/carousel/wedding.jpg';
import conferenceImg from '../assets/carousel/conference.jpg';
import meetingImg from '../assets/carousel/meeting.jpg';
import concertImg from '../assets/carousel/concert.jpg';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import '../styles/HeroCarousel.css';

const slides = [
    {
        id: 1,
        image: weddingImg, // Linked to wedding.jpg
        title: 'Celebrate Your Big Day',
        subtitle: 'Plan the perfect wedding with our curated vendor packages.',
        cta: 'Start Planning'
    },
    {
        id: 2,
        image: conferenceImg, // Linked to conference.jpg
        title: 'Industry-Leading Conferences',
        subtitle: 'Host seamless professional gatherings at scale.',
        cta: 'Explore Venues'
    },
    {
        id: 3,
        image: meetingImg, // Linked to meeting.jpg
        title: 'Productive Executive Meetings',
        subtitle: 'Executive boardrooms and collaborative spaces for success.',
        cta: 'Find Spaces'
    },
    {
        id: 4,
        image: concertImg, // Linked to concert.jpg
        title: 'Unforgettable Live Experiences',
        subtitle: 'From concerts to festivals, connect with your audience.',
        cta: 'Create Event'
    }
];

const HeroCarousel = () => {
    return (
        <div className="hero-carousel-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1000}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="hero-slide"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="hero-overlay"></div>

                            <div className="hero-content-container container">
                                <div className="hero-text-wrapper">
                                    <h1 className="hero-title">{slide.title}</h1>
                                    <p className="hero-subtitle">{slide.subtitle}</p>
                                    <div className="hero-cta-wrapper">
                                        <Link to="/category/wedding" className="btn btn-primary hero-btn">{slide.cta}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroCarousel;
