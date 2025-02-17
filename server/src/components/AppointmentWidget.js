function AppointmentWidget(containerId, apiBaseUrl) {
    const container = document.getElementById(containerId);

    async function fetchSlots(date) {
        try {
            const response = await fetch(`${apiBaseUrl}/book/getSlot?date=${date}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            return data.availableSlots || [];
        } catch (error) {
            console.error("Error fetching slots:", error);
            return [];
        }
    }

    async function bookAppointment(name, phone, date, timeSlot) {
        try {
            const response = await fetch(`${apiBaseUrl}/book/bookSlot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, date, timeSlot }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error booking appointment:", error);
            return { success: false, message: "Server error" };
        }
    }

    function renderUI() {
        container.innerHTML = `
        <div id="booking-form">
          <h3>Book an Appointment</h3>
          <label>Date: <input type="date" id="appointment-date"></label>
          <select id="time-slots">
            <option value="">Select a time slot</option>
          </select>
          <label>Name: <input type="text" id="name"></label>
          <label>Phone: <input type="text" id="phone"></label>
          <button id="book-now" disabled>Book Now</button>
          <p id="status-message"></p>
        </div>
      `;

        document.getElementById("time-slots").addEventListener("change", () => {
            const timeSlot = document.getElementById("time-slots").value;
            const bookNowButton = document.getElementById("book-now");
            bookNowButton.disabled = !timeSlot;
        });

        document.getElementById("appointment-date").addEventListener("change", async (event) => {
            const selectedDate = event.target.value;

            if (selectedDate) {
                const slots = await fetchSlots(selectedDate);
                const slotsDropdown = document.getElementById("time-slots");
                slotsDropdown.innerHTML = "<option value=''>Select a time slot</option>";

                if (slots.length === 0) {
                    const option = document.createElement("option");
                    option.value = "";
                    option.innerText = "No available slots";
                    slotsDropdown.appendChild(option);
                } else {
                    slots.forEach((slot) => {
                        const option = document.createElement("option");
                        option.value = slot;
                        option.innerText = slot;
                        slotsDropdown.appendChild(option);
                    });
                }

                document.getElementById("time-slots").disabled = false;
            }
        });

        document.getElementById("book-now").addEventListener("click", async () => {
            console.log("Book Now button clicked!");
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const date = document.getElementById("appointment-date").value;
            const timeSlot = document.getElementById("time-slots").value;

            if (!name || !phone || !date || !timeSlot) {
                document.getElementById("status-message").innerText = "All fields are required!";
                return;
            }

            const result = await bookAppointment(name, phone, date, timeSlot);
            document.getElementById("status-message").innerText = result.message;
        });
    }

    renderUI();
}
