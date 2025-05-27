document.addEventListener("DOMContentLoaded", function () {
  const datePickers = document.querySelectorAll(".datePicker");
  datePickers.forEach((input) => {
    flatpickr(input, {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d M Y",
      defaultDate: input.value,
    });
  });
});
