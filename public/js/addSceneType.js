// document.addEventListener('DOMContentLoaded', function() {
//     let otherLanguage = document.querySelector('.otherLanguage');
//     let languageChoice = document.querySelector('[name="language[]"]:checked');

//     if (languageChoice && languageChoice.value!== 'other') {
//         otherLanguage.style.display = 'none';
//     }

//     document.querySelectorAll('[name="language[]"]').forEach(function(checkbox) {
//         checkbox.addEventListener('change', function() {
//             if (this.value === 'other') {
//                 otherLanguage.style.display = 'block';
//             } else {
//                 otherLanguage.style.display = 'none';
//             }
//         });
//     });
// });