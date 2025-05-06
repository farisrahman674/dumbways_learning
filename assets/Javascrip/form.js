function form_js(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  console.log(name, email, phone, subject, message);

  Swal.fire({
    title: "Good job!",
    text: "You clicked the button!",
    icon: "success",
  });
}
