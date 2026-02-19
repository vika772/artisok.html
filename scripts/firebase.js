import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZkHxKXEYi_wGlmLg-3BdbAoZQWEsiZ-c",
  authDomain: "rezervari-e8d10.firebaseapp.com",
  databaseURL: "https://rezervari-e8d10-default-rtdb.firebaseio.com",
  projectId: "rezervari-e8d10",
  storageBucket: "rezervari-e8d10.firebasestorage.app",
  messagingSenderId: "341271581795",
  appId: "1:341271581795:web:cac44e827dcecd9d8b1456",
  measurementId: "G-77DZ2PZC5B",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("bookingForm");
const statusEl = document.getElementById("bookingStatus");

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const dateInput = form.querySelector('input[name="date"]');

  if (dateInput) {
    const today = new Date();
    const yyyy = String(today.getFullYear());
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const setStatus = (text, type = "info") => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.remove("is-error", "is-success");
    if (type === "error") statusEl.classList.add("is-error");
    if (type === "success") statusEl.classList.add("is-success");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    const formData = new FormData(form);
    const data = {
      name: (formData.get("name") || "").toString().trim(),
      phone: (formData.get("phone") || "").toString().trim(),
      date: (formData.get("date") || "").toString().trim(),
      time: (formData.get("time") || "").toString().trim(),
      guests: Number(formData.get("guests") || 1),
      zone: (formData.get("zone") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
      createdAt: serverTimestamp(),
      source: "website_rezervari_form",
    };

    if (!data.name || !data.phone || !data.date || !data.time) {
      setStatus("Completează câmpurile obligatorii.", "error");
      return;
    }

    if (submitButton) submitButton.disabled = true;

    try {
      const docRef = await addDoc(collection(db, "rezervari"), data);
      form.reset();
      setStatus(`Rezervarea a fost trimisă. ID: ${docRef.id}`, "success");
    } catch (error) {
      console.error("Failed to save reservation:", error);
      setStatus("Eroare la trimitere. Încearcă din nou.", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
