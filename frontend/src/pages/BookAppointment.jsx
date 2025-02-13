import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { addDays, format, startOfDay } from "date-fns";

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor } = location.state || {};

  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!doctor) {
      alert("No doctor selected!");
      navigate("/");
      return;
    }

    // ✅ Show only future available dates (next 2 months)
    const today = startOfDay(new Date());
    const futureDates = [];

    for (let i = 1; i <= 60; i++) {
      const date = addDays(today, i);
      const dayName = format(date, "EEEE"); // Get "Monday", "Tuesday", etc.

      if (doctor.availability.some((slot) => slot.day === dayName)) {
        futureDates.push({ date, formatted: format(date, "yyyy-MM-dd") });
      }
    }
    setAvailableDates(futureDates);
  }, [doctor, navigate]);

  useEffect(() => {
    if (!selectedDate) return;

    // ✅ Fetch available time slots for the selected date
    const dayName = format(new Date(selectedDate), "EEEE");
    const availability = doctor.availability.find((slot) => slot.day === dayName);

    if (availability) {
      const startTime = parseInt(availability.startTime.split(":")[0], 10);
      const endTime = parseInt(availability.endTime.split(":")[0], 10);
      const slots = [];

      for (let hour = startTime; hour < endTime; hour++) {
        slots.push(`${hour}:00 - ${hour + 1}:00`);
      }

      setAvailableTimeSlots(slots);
    }
  }, [selectedDate, doctor.availability]);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("❌ Please select a valid date and time.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log("📡 Initiating payment for doctor:", doctor.name);
  
      // ✅ Step 1: Create Payment Order
      const paymentResponse = await axios.post("http://localhost:8080/api/payments/create", {
        amount: doctor.fees * 100,  // Convert to paise for Razorpay
      });
  
      if (!paymentResponse.data.orderId) {
        alert("❌ Payment initiation failed. Please try again.");
        return;
      }
  
      console.log("✅ Payment order created:", paymentResponse.data);
  
      // ✅ Step 2: Open Razorpay Payment Window
      const options = {
        key: "rzp_test_UCnm9ZETwzn9YW",
        amount: paymentResponse.data.amount,
        currency: "INR",
        name: "Telemedicine Platform",
        description: `Consultation with Dr. ${doctor.name}`,
        order_id: paymentResponse.data.orderId,  // ✅ Correct key
        handler: async (response) => {
          try {
            console.log("Payment successful:", response);
      
            // ✅ Verify payment with the backend
            const verifyResponse = await axios.post("http://localhost:8080/api/payments/verify", {
              orderId: response.razorpay_order_id,          // ✅ Correct key
              paymentId: response.razorpay_payment_id,      // ✅ Correct key
              razorpaySignature: response.razorpay_signature, // ✅ Correct key
            });
      
            console.log("Verification Response:", verifyResponse.data);
      
            if (verifyResponse.status !== 200) {
              alert("Payment verification failed!");
              return;
            }
      
            // ✅ If payment is verified, book the appointment
            const bookingResponse = await axios.post("http://localhost:8080/api/appointments/book", {
              patientId: JSON.parse(localStorage.getItem("user")).id,
              doctorId: doctor.id,
              date: selectedDate,
              time: selectedTime,
              isPaid: true,
            });
      
            alert("Appointment booked successfully!");
            navigate("/patientdashboard");
      
          } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed, please try again.");
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("user")).name,
          email: JSON.parse(localStorage.getItem("user")).email,
        },
        theme: { color: "#528FF0" },
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("❌ Booking failed:", error.response?.data || error.message);
      alert("❌ Booking failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

      <label className="block mb-2 font-medium">Select Date:</label>
      <select className="w-full p-2 border rounded-md" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
        <option value="">-- Choose a Date --</option>
        {availableDates.map(({ formatted }) => (
          <option key={formatted} value={formatted}>{formatted}</option>
        ))}
      </select>

      <label className="block mt-4 mb-2 font-medium">Select Time Slot:</label>
      <select className="w-full p-2 border rounded-md" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} disabled={!selectedDate}>
        <option value="">-- Choose a Time --</option>
        {availableTimeSlots.map((slot, index) => (
          <option key={index} value={slot}>{slot}</option>
        ))}
      </select>

      <button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTime || isLoading} className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md">
        {isLoading ? "Processing..." : `Confirm & Pay ₹${doctor.fees}`}
      </button>
    </div>
  );
};

export default BookAppointment;
