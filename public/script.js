// ─── WORKER CATEGORY COLORS & EMOJIS ───────────────────────────────────────
const CAT_META = {
  'சமையல்காரர்': { emoji: '🍳', bg: '#FFF3E0', fg: '#E65100' },
  'கொத்தனார்': { emoji: '🧱', bg: '#F3E5F5', fg: '#6A1B9A' },
  'டிரைவர்': { emoji: '🚗', bg: '#E3F2FD', fg: '#1565C0' },
  'எலக்ட்ரீஷியன்': { emoji: '⚡', bg: '#FFFDE7', fg: '#F57F17' },
  'பிளம்பர்': { emoji: '🔧', bg: '#E0F2F1', fg: '#00695C' },
  'பெயிண்டர்': { emoji: '🎨', bg: '#FCE4EC', fg: '#880E4F' },
  'பைக் மெக்கானிக்': { emoji: '🏍️', bg: '#E8F5E9', fg: '#2E7D32' },
  'கார் மெக்கானிக்': { emoji: '🚙', bg: '#E8EAF6', fg: '#283593' },
  'தச்சர்': { emoji: '🪚', bg: '#FBE9E7', fg: '#BF360C' },
  'AC மெக்கானிக்': { emoji: '❄️', bg: '#E1F5FE', fg: '#0277BD' },
  'தையல்காரர்': { emoji: '👗', bg: '#F8BBD9', fg: '#880E4F' },
};

function getCatMeta(work) {
  return CAT_META[work] || { emoji: '👷', bg: '#E8F5E9', fg: '#2E7D32' };
}

let currentWorkerId = null;

// ─── STORAGE ────────────────────────────────────────────────────────────────
async function loadWorkers() {
  try {
    const res = await fetch('/api/workers');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ─── STATS ──────────────────────────────────────────────────────────────────
async function updateStats() {
  const workers = await loadWorkers();
  document.getElementById('stat-workers').textContent = workers.length;
  const districts = new Set(workers.map(w => w.district)).size;
  document.getElementById('stat-districts').textContent = districts;
  const avgRating = workers.length
    ? (workers.reduce((s, w) => s + (w.rating || 4.5), 0) / workers.length).toFixed(1) + '★'
    : '—';
  document.getElementById('stat-rating').textContent = avgRating;
}

// ─── RENDER WORKERS ─────────────────────────────────────────────────────────
let activeCat = '';

function setCat(el, cat) {
  activeCat = cat;
  document.querySelectorAll('.cat').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('categoryFilter').value = cat;
  renderWorkers();
}

async function renderWorkers() {
  const dist = document.getElementById('districtFilter').value;
  const cat = document.getElementById('categoryFilter').value || activeCat;
  const workers = await loadWorkers();

  const filtered = workers.filter(w =>
    (!dist || w.district === dist) &&
    (!cat || w.work === cat)
  );

  const grid = document.getElementById('wgrid');
  const cnt = document.getElementById('cnt');

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-workers">
      👷 இந்த தேடலில் தொழிலாளர்கள் இல்லை.<br>
      <small style="font-size:13px">வேறு District அல்லது தொழில் தேர்வு செய்யுங்கள்</small>
    </div>`;
    cnt.textContent = '';
    return;
  }

  cnt.textContent = `${filtered.length} worker${filtered.length > 1 ? 's' : ''} கிடைத்தனர்`;

  grid.innerHTML = filtered.map(w => {
    const meta = getCatMeta(w.work);
    const initial = (w.name || '?')[0].toUpperCase();
    const phone = w.phone.replace(/\D/g, '');
    const waMsg = encodeURIComponent(`வணக்கம்! நம்ம ஊர் Workers மூலம் உங்களை தொடர்பு கொள்கிறேன். நான் ${w.work} தேடுகிறேன்.`);
    const stars = '★'.repeat(Math.round(w.rating || 4)) + '☆'.repeat(5 - Math.round(w.rating || 4));
    const expText = w.exp ? `${w.exp} வருட அனுபவம்` : '';

    return `
    <div class="card">
      <button class="edit-btn" onclick="openEdit()">
         ✏️
      </button>
      <div class="card-top">
        <div class="av" style="background:${meta.bg};color:${meta.fg}">${meta.emoji}</div>
        <div>
          <div class="cn">${escHtml(w.name)}</div>
          <div class="cr">${escHtml(w.work)}</div>
          <div class="stars">${stars}</div>
        </div>
      </div>
      <div class="cd">
        📍 ${escHtml(w.district)}${w.place ? ', ' + escHtml(w.place) : ''}<br>
        ${expText ? '🏅 ' + expText + '<br>' : ''}
        ${w.desc ? '💬 ' + escHtml(w.desc.substring(0, 60)) + (w.desc.length > 60 ? '…' : '') : ''}
      </div>
      <div class="crate">₹${Number(w.rate).toLocaleString('ta-IN')}<small> / நாள்</small></div>
      <div class="cbtns">
        <a class="hbtn" href="tel:${phone}">📞 Call</a>
        <a class="wbtn" href="https://wa.me/91${phone}?text=${waMsg}" target="_blank" rel="noopener" title="WhatsApp">
          <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </a>
      </div>
    </div>`;
  }).join('');
}

function searchWorkers() {
  renderWorkers();

  setTimeout(() => {
    document.getElementById('wgrid').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── REGISTRATION ────────────────────────────────────────────────────────────
function openReg() {
  document.getElementById('regMod').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeM(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

async function submitReg() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim().replace(/\D/g, '');
  const pin = document.getElementById('regPin').value.trim();
  const dist = document.getElementById('regDist').value;
  const place = document.getElementById('regPlace').value.trim();
  const work = document.getElementById('regWork').value;
  const rate = document.getElementById('regRate').value.trim();
  const exp = document.getElementById('regExp').value.trim();
  const desc = document.getElementById('regDesc').value.trim();

  // Validation
  if (!name) { showToast('⚠️ பெயர் உள்ளிடவும்'); return; }
  if (phone.length < 10) { showToast('⚠️ சரியான phone number கொடுங்கள்'); return; }
  if (pin.length !== 4) {
    showToast('4 இலக்க PIN உள்ளிடவும்');
    return;
  }
  if (!dist) { showToast('⚠️ District தேர்வு செய்யவும்'); return; }
  if (!work) { showToast('⚠️ தொழில் தேர்வு செய்யவும்'); return; }
  if (!rate || isNaN(rate) || Number(rate) <= 0) { showToast('⚠️ தினசரி கூலி உள்ளிடவும்'); return; }

  const workers = await loadWorkers();

  // Duplicate phone check
  if (workers.some(w => w.phone === phone)) {
    showToast('⚠️ இந்த phone number ஏற்கனவே பதிவு செய்யப்பட்டது'); return;
  }

  const newWorker = {
    id: Date.now(),
    name, phone, pin, district: dist, place, work,
    rate: Number(rate), exp: exp ? Number(exp) : null,
    desc, rating: 4.5,
    createdAt: new Date().toISOString()
  };

  const response = await fetch('/api/workers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newWorker)
  });

  if (!response.ok) {
    showToast('❌ பதிவு தோல்வி');
    return;
  }

  // Reset form
  ['regName', 'regPhone', 'regPin', 'regPlace', 'regRate', 'regExp', 'regDesc'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('regDist').value = '';
  document.getElementById('regWork').value = '';

  closeM('regMod');
  updateStats();

  // Auto-filter to show the new worker's category
  activeCat = newWorker.work;
  document.getElementById('categoryFilter').value = newWorker.work;
  document.getElementById('districtFilter').value = '';
  document.querySelectorAll('.cat').forEach(c => {
    c.classList.toggle('on', c.textContent.includes(newWorker.work));
  });
  renderWorkers();
  showToast(`✅ ${name} பதிவு வெற்றிகரமாக முடிந்தது!`);

  // Scroll to grid
  setTimeout(() => {
    document.getElementById('wgrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

// ─── TOAST ──────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 3000);
}
function openEdit() {
  document.getElementById('editMod').classList.add('open');
}

function closeEdit() {
  document.getElementById('editMod').classList.remove('open');
}

function openFeedback() {
  document
    .getElementById("feedbackModal")
    .classList.add("open");
    
}

function closeFeedback() {
  document
    .getElementById("feedbackModal")
    .classList.remove("open");
}


async function verifyWorker() {

  const phone = document.getElementById("editPhone").value.trim();
  const pin = document.getElementById("editPin").value.trim();

  const response = await fetch("/api/workers/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone, pin })
  });

  const data = await response.json();

  if (!data.success) {
    showToast("❌ Phone Number அல்லது PIN தவறு");
    return;
  }

  const w = data.worker;

  currentWorkerId = w._id;

  document.getElementById("editName").value = w.name || "";
  document.getElementById("editPlace").value = w.place || "";
  document.getElementById("editRate").value = w.rate || "";
  document.getElementById("editExp").value = w.exp || "";
  document.getElementById("editDesc").value = w.desc || "";

  document.getElementById("editForm").style.display = "block";

  showToast("✅ Verify Success");
}

async function updateWorker() {

  if (!currentWorkerId) {
    showToast("❌ முதலில் Verify செய்யவும்");
    return;
  }

  const updatedData = {
    name: document.getElementById("editName").value.trim(),
    place: document.getElementById("editPlace").value.trim(),
    rate: Number(document.getElementById("editRate").value),
    exp: Number(document.getElementById("editExp").value),
    desc: document.getElementById("editDesc").value.trim()
  };

  const response = await fetch(`/api/workers/${currentWorkerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    showToast("❌ Update Failed");
    return;
  }

  showToast("✅ Details Updated");

  closeEdit();

  await renderWorkers();
  await updateStats();
}
// ─── CLOSE MODAL ON OVERLAY CLICK ───────────────────────────────────────────
document.getElementById('regMod').addEventListener('click', function (e) {
  if (e.target === this) closeM('regMod');
});

// ─── INIT ────────────────────────────────────────────────────────────────────
// Mark first category button as active
document.querySelector('.cat').classList.add('on');
(async () => {
  await updateStats();
  await renderWorkers();
})();

async function submitFeedback() {

  const name =
    document.getElementById("fbName").value.trim();

  const rating =
    Number(
      document.getElementById("fbRating").value
    );

  const message =
    document.getElementById("fbMessage").value.trim();

  if (!message) {
    showToast("கருத்தை பதிவு செய்யவும்");
    return;
  }

  const response =
    await fetch("/api/feedback", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name,
        rating,
        message
      })

    });

  const data = await response.json();

  if (data.success) {

    showToast("✅ Feedback Submitted");

    closeFeedback();

  }

}

