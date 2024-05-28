// Sorting Options :

document.addEventListener('DOMContentLoaded', function() {
    let sortSelect = document.querySelector('.formOptions');
    let storedValue = sessionStorage.getItem('sortSelect');
    if (storedValue) {
        sortSelect.value = storedValue;
    }
    sortSelect.addEventListener('change', function() {
      let sortForm = document.querySelector('#selectForm');
      sessionStorage.setItem('sortSelect', sortSelect.value);
      sortForm.submit();
    });
  });

// Lightbox config :

document.addEventListener('DOMContentLoaded', function () {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': false,
        'showImageNumberLabel': true,
        'alwaysShowNavOnTouchDevices': true
    });
});

// Cards lazy loading

document.addEventListener('DOMContentLoaded', function () {
    let cards = document.querySelectorAll('.card');
    
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        observer.observe(card);
    });
});