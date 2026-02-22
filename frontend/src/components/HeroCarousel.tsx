
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';

import weddingImg from '../assets/carousel/wedding.jpg';
import conferenceImg from '../assets/carousel/conference.jpg';
import meetingImg from '../assets/carousel/meeting.jpg';
import concertImg from '../assets/carousel/concert.jpg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../styles/HeroCarousel.css';

const slides = [
    {
        id: 1,
        image: weddingImg,
        eyebrow: 'Weddings',
        title: 'Celebrate Your Big Day',
        subtitle: 'Plan the perfect wedding with our curated vendor packages and expert coordinators.',
        cta: 'Start Planning',
        link: '/category/wedding',
    },
    {
        id: 2,
        image: conferenceImg,
        eyebrow: 'Conferences',
        title: 'Industry-Leading Conferences',
        subtitle: 'Host seamless professional gatherings at scale — from keynotes to workshops.',
        cta: 'Explore Venues',
        link: '/category/conferences',
    },
    {
        id: 3,
        image: meetingImg,
        eyebrow: 'Meetings',
        title: 'Productive Executive Spaces',
        subtitle: 'Premium boardrooms and collaborative venues designed for success.',
        cta: 'Find Spaces',
        link: '/category/meetings',
    },
    {
        id: 4,
        image: concertImg,
        eyebrow: 'Events',
        title: 'Unforgettable Live Experiences',
        subtitle: 'From concerts to festivals — create moments your audience will never forget.',
        cta: 'Create Event',
        link: '/category/events',
    },
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
                autoplay={{ delay: 5500, disableOnInteraction: false }}
                loop={true}
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="hero-slide"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="hero-overlay" />
                            <div className="hero-content-container container">
                                <div className="hero-text-wrapper">
                                    <span className="hero-eyebrow">{slide.eyebrow}</span>
                                    <h1 className="hero-title">{slide.title}</h1>
                                    <div className="hero-accent-line" />
                                    <p className="hero-subtitle">{slide.subtitle}</p>
                                    <div className="hero-cta-wrapper">
                                        <Link to={slide.link} className="hero-btn">{slide.cta}</Link>
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