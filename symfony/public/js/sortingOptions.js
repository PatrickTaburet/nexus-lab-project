document.addEventListener('DOMContentLoaded', function() {
    let sortSelect = document.querySelector('.formOptions');
    sortSelect.addEventListener('change', function() {
      let sortForm = document.querySelector('#selectForm');
      sortForm.submit();
    });
  });