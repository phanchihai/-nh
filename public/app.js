const form = document.getElementById("upload-form");
const imageInput = document.getElementById("imageInput");
const gallery = document.getElementById("gallery");

async function loadGallery() {
  gallery.innerHTML = "<p>⏳ Đang tải ảnh...</p>";
  try {
    const res = await fetch("/gallery");
    const data = await res.json();
    gallery.innerHTML = "";

    data.reverse().forEach(img => {
      // Tạo khung gallery-item
      const item = document.createElement("div");
      item.className = "gallery-item";

      // Ảnh
      const el = document.createElement("img");
      el.src = img.secure_url;
      el.alt = "Kỷ niệm 💖";

      // Caption (nếu muốn có chữ dưới ảnh)
      const caption = document.createElement("div");
      caption.className = "caption";
      caption.textContent = "Kỷ niệm 💕";

      // Gắn vào gallery
      item.appendChild(el);
      item.appendChild(caption);
      gallery.appendChild(item);
    });
  } catch (err) {
    gallery.innerHTML = "<p>🚫 Lỗi tải ảnh!</p>";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = imageInput.files[0];
  if (!file) return alert("Chọn ảnh trước!");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      loadGallery();
    } else {
      alert("❌ Upload thất bại: " + data.message);
    }
  } catch (err) {
    alert("🚫 Lỗi kết nối server!");
  }
});

// Gọi khi load trang
loadGallery();
