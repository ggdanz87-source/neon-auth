// ============================================
// GANTI PAKE URL & KEY SUPABASE LO!
// ============================================
const SUPABASE_URL = 'https://hlhlpznffrnuvxgcuwiu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__Xm9KHWul4yOcvbH9cPAGg_h_A4s0_O';

// Init Supabase
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- TABS SWITCHING ---
const tabs = document.querySelectorAll('.tab');
const tabsContainer = document.querySelector('.tabs');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        tabsContainer.dataset.active = target;
        
        document.getElementById('loginForm').classList.toggle('active', target === 'login');
        document.getElementById('registerForm').classList.toggle('active', target === 'register');
    });
});

// --- HELPER MESSAGE ---
function showMsg(id, text, type) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = `msg ${type}`;
    setTimeout(() => { el.className = 'msg'; }, 4000);
}

// --- LOGIN SUBMIT ---
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    btn.classList.add('loading');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    btn.classList.remove('loading');

    if (error) {
        showMsg('loginMsg', error.message, 'error');
    } else {
        showMsg('loginMsg', 'Login Berhasil! Mengalihkan...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    }
});

// --- REGISTER SUBMIT ---
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    btn.classList.add('loading');

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // 1. Daftar ke Auth
    const { data, error } = await sb.auth.signUp({ email, password });

    if (error) {
        btn.classList.remove('loading');
        showMsg('registerMsg', error.message, 'error');
        return;
    }

    // 2. Insert Profile
    if (data.user) {
        const { error: profileErr } = await sb.from('profiles').insert({
            id: data.user.id,
            full_name: name,
            username: email.split('@')[0] // Default username dari email
        });

        if (profileErr) {
            btn.classList.remove('loading');
            showMsg('registerMsg', 'Gagal simpen profile: ' + profileErr.message, 'error');
            return;
        }
    }

    btn.classList.remove('loading');
    showMsg('registerMsg', 'Registrasi Berhasil! Silakan Login.', 'success');
    setTimeout(() => {
        document.querySelector('.tab[data-tab="login"]').click();
    }, 2000);
});
