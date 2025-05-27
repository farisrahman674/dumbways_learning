function deletedAlert(event, element) {
  event.preventDefault();

  const deleteUrl = element.getAttribute("href");
  console.log("Delete URL:", deleteUrl);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Your project has been deleted.", "success").then(
        () => {
          window.location.href = deleteUrl;
        }
      );
    }
  });
}
