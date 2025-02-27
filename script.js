document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Handle different status codes explicitly
      if (response.ok) {
        document.getElementById("successMessage").style.display = "block";
        form.reset(); // Clear the form on success
      } else {
        // Try parsing error details if available
        const errorData = await response.json();
        console.log("Error response from server:", errorData);
        alert("There was a problem with your submission. Please try again.");
      }
    } catch (error) {
      // Only show this if there's a network issue or some problem with the request itself
      console.error("Network or other error:", error);
      alert(
        "Error: Could not send your message. Please check your connection and try again."
      );
    }
  });
