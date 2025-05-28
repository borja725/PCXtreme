import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Container } from '@mui/material';

const slides = [
  {
    tipo: 'curiosidad',
    color: '#512da8',
    title: '¿Sabías que…?',
    desc: 'La primera memoria RAM de la historia solo tenía 1 KB. ¡Hoy tu PC tiene millones de veces más!',
    link: 'https://es.wikipedia.org/wiki/Memoria_RAM',
    linkText: 'Leer más',
  },
  {
    tipo: 'reto',
    color: '#d84315',
    title: 'Reto de la semana',
    desc: '¡Sube una foto de tu setup a Instagram con #PCXtremeSetup y participa en el sorteo de un pack gaming!',
    link: 'https://www.instagram.com/explore/tags/pcxtremesetup/',
    linkText: 'Ver reto',
  },
  {
    tipo: 'configurador',
    color: '#00897b',
    title: 'Configurador Express',
    desc: '¿No sabes qué componentes elegir? Usa nuestro configurador inteligente y crea tu PC ideal en 1 minuto.',
    link: '/configurador',
    linkText: 'Probar ahora',
  },
];

export default function CarruselDestacado() {
  return (
    <Container maxWidth="xl" disableGutters>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        style={{ borderRadius: 18, boxShadow: '0 6px 32px #1976d233' }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(90deg,' + slide.color + '11 0%, #fff 100%)',
                borderRadius: 18,
                padding: '32px 48px',
                minHeight: 380,
                gap: 48,
              }}
            >
              <div style={{ flex: 1 }}>
                <h2 style={{ fontWeight: 800, fontSize: '2.1rem', color: slide.color, marginBottom: 8 }}>{slide.title}</h2>
                <p style={{ fontSize: '1.15rem', color: '#222', marginBottom: 18 }}>{slide.desc}</p>
                <a
                  href={slide.link}
                  style={{
                    padding: '10px 26px',
                    background: slide.color,
                    color: '#fff',
                    borderRadius: 999,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 2px 12px ' + slide.color + '33',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#111')}
                  onMouseOut={e => (e.currentTarget.style.background = slide.color)}
                >
                  Ver más
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
