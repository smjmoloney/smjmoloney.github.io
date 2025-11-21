// JavaScript Portfolio - Demonstrating Interactivity (5pts)

document.addEventListener('DOMContentLoaded', function()
{

    // FEATURE 1: Contact Form Validation with Live Feedback
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formStatus = document.getElementById('form-status');
    
    // Real-time validation
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);
    
    function validateName() {
        const nameError = document.getElementById('name-error');
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            return false;
        } else {
            nameError.textContent = '';
            return true;
        }
    }
    
    function validateEmail() {
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }
    
    function validateMessage() {
        const messageError = document.getElementById('message-error');
        if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            return false;
        } else {
            messageError.textContent = '';
            return true;
        }
    }
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameValid = validateName();
        const emailValid = validateEmail();
        const messageValid = validateMessage();
        
        if (nameValid && emailValid && messageValid) {
            formStatus.textContent = `Thank you ${nameInput.value}! Your message has been sent successfully.`;
            formStatus.className = 'success';
            contactForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = '';
            }, 5000);
        } else {
            formStatus.textContent = 'Please fix the errors above before submitting.';
            formStatus.style.color = '#FF5722';
        }
    });
    
    // FEATURE 2: Interactive Image Carousel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-img');
    const indicators = document.querySelectorAll('.indicator');
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Auto-play carousel (pauses on hover)
    let autoplayInterval = setInterval(nextSlide, 4000);
    
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 4000);
    });
    
    // FEATURE 3: Smooth Scroll Animation for Grid Items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe all grid items
    document.querySelectorAll('.grid-item').forEach(item => {
        observer.observe(item);
    });
    
    // Add CSS animation via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .grid-item {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    // FEATURE 4: Interactive Button Feedback
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Log that JavaScript loaded successfully
    console.log('✓ JavaScript interactivity loaded successfully!');
    console.log('✓ Features: Form validation, Image carousel indicators, Animations, Button feedback');
});