const nav = document.querySelector("#nav");
			const abrir = document.querySelector("#abrir");
			const cerrar = document.querySelector("#cerrar");

			abrir.addEventListener("click", () => {
				nav.classList.add("visible");
			});

			cerrar.addEventListener("click", () => {
				nav.classList.remove("visible");
			});



/*JAVAScrip  movimiento  opiniones */ 
const swiper = new Swiper('.mySwiper', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 5,
  speed: 20000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
  allowTouchMove: true,
  grabCursor: true,
});