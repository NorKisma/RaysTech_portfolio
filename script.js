document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialize AOS (Animations)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // 2. Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Service Slider (Swiper) Setup
    if (document.querySelector(".service-swiper") && typeof Swiper !== 'undefined') {
        const serviceSwiper = new Swiper(".service-swiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
            },
            scrollbar: {
                el: ".swiper-scrollbar-custom",
                draggable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
            },
        });
    }

    // 4. Contact Form Handling (Nadiifinta iyo Refresh-ka)
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault(); // Jooji in Formspree uu bog kale kuu qaado
            
            const status = document.getElementById("form-status");
            const button = document.getElementById("submit-btn");
            const formData = new FormData(form);

            // Badhanka Disable ka dhig
            button.disabled = true;
            button.innerText = "Diraya...";

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                status.style.display = "block";
                if (response.ok) {
                    // 1. Muuji fariinta guusha
                    status.className = "mt-3 p-2 rounded alert alert-success text-center";
                    status.innerHTML = "✅ Mahadsanid! Fariintaada waa la helay.";
                    
                    // 2. Nadiifi foomka (Clear)
                    form.reset(); 

                    // 3. Refresh bogga 3 ilbiriqsi ka dib si uu u noqdo mid bilow ah
                    setTimeout(() => {
                        window.location.reload(); // Tani waxay samaynaysaa Refresh
                    }, 3000);

                } else {
                    response.json().then(data => {
                        status.className = "mt-3 p-2 rounded alert alert-danger text-center";
                        if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
                            status.innerHTML = "❌ " + data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.innerHTML = "❌ Cilad ayaa dhacday.";
                        }
                        button.disabled = false;
                        button.innerText = "Send Message";
                    });
                }
            }).catch(error => {
                status.style.display = "block";
                status.className = "mt-3 p-2 rounded alert alert-danger text-center";
                status.innerHTML = "❌ Fadlan hubi internet-kaaga.";
                button.disabled = false;
                button.innerText = "Send Message";
            });
        });
    }
});