// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }
});

// The form submission is now handled by Formspree directly.
// No custom JavaScript is needed for the basic submission.

/*
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    // Check if form exists to prevent errors on other pages
    if (form) { 
        form.addEventListener('submit', function(event) {
            // event.preventDefault(); // Removed this line to allow submission to Formspree
            // alert('Thank you for reaching out! We will get back to you soon.'); // Optional: remove if using Formspree's page
            // form.reset(); // Optional: remove if using Formspree's page
        });
    }
});
*/ 