
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { getMe, login, register } from "./api";
import type { User } from "./api";

type Mode = "login" | "register";
type Page = "home" | "crop" | "health" | "economics" | "guide";

const features = [
  { id: "crop" as Page, icon: "🌱", title: "Crop recommendations", text: "Explore crop choices based on soil, season, and water availability." },
  { id: "health" as Page, icon: "🍃", title: "Plant health", text: "Upload a crop image for the plant-health workflow." },
  { id: "economics" as Page, icon: "₹", title: "Farm economics", text: "Estimate costs, revenue, break-even price, and profit." },
  { id: "guide" as Page, icon: "தமிழ்", title: "English + Tamil", text: "Access basic farming guidance in your preferred language." }
];

const labels = {
  en: {
    home: "Dashboard", crop: "Crop recommendations", health: "Plant health",
    economics: "Farm economics", guide: "Farming guide", back: "← Dashboard",
    submit: "Get recommendation", soil: "Soil and weather details",
    nitrogen: "Nitrogen (N)", phosphorus: "Phosphorus (P)", potassium: "Potassium (K)",
    temperature: "Temperature (°C)", humidity: "Humidity (%)", ph: "Soil pH",
    rainfall: "Rainfall (mm)", result: "Initial crop suggestion",
    costs: "Farm economics calculator", area: "Farm area (acres)",
    cost: "Total estimated cost (₹)", price: "Selling price per kg (₹)",
    yield: "Expected yield per acre (kg)", calculate: "Calculate profit",
    revenue: "Estimated revenue", profit: "Estimated profit / loss",
    breakEven: "Break-even price per kg", image: "Upload a crop image",
    imageNote: "Image preview only. Disease diagnosis is not yet connected to a trained model.",
    guideTitle: "Practical farming guide", language: "Language",
    choose: "Choose a feature to get started.", signout: "Sign out",
    welcome: "Your PocketCrop+ workspace", backLogin: "Sign in",
    account: "Create your account", name: "Full name", email: "Email address",
    password: "Password", create: "Create account →", login: "Sign in →",
    wait: "Please wait…", logout: "Sign out", open: "Open feature →",
    water: "Check soil moisture regularly and avoid overwatering.",
    soilTip: "Test soil nutrients and pH before applying fertilizer.",
    weather: "Check local weather forecasts before spraying or planting.",
    caution: "These initial suggestions are general guidance, not a substitute for local agricultural expert advice."
  },
  ta: {
    home: "முகப்பு", crop: "பயிர் பரிந்துரைகள்", health: "பயிர் நலம்",
    economics: "பண்ணை பொருளாதாரம்", guide: "விவசாய வழிகாட்டி", back: "← முகப்பு",
    submit: "பரிந்துரையைப் பெறுக", soil: "மண் மற்றும் வானிலை விவரங்கள்",
    nitrogen: "நைட்ரஜன் (N)", phosphorus: "பாஸ்பரஸ் (P)", potassium: "பொட்டாசியம் (K)",
    temperature: "வெப்பநிலை (°C)", humidity: "ஈரப்பதம் (%)", ph: "மண் pH",
    rainfall: "மழைப்பொழிவு (மிமீ)", result: "ஆரம்பப் பயிர் பரிந்துரை",
    costs: "பண்ணை செலவுக் கணிப்பான்", area: "நிலப்பரப்பு (ஏக்கர்)",
    cost: "மொத்த மதிப்பிடப்பட்ட செலவு (₹)", price: "ஒரு கிலோ விற்பனை விலை (₹)",
    yield: "ஏக்கருக்கு எதிர்பார்க்கும் மகசூல் (கிலோ)", calculate: "லாபத்தைக் கணக்கிடு",
    revenue: "மதிப்பிடப்பட்ட வருவாய்", profit: "மதிப்பிடப்பட்ட லாபம் / நட்டம்",
    breakEven: "ஒரு கிலோவுக்கான செலவு ஈடுசெய்யும் விலை", image: "பயிர் படத்தைப் பதிவேற்றவும்",
    imageNote: "இது பட முன்னோட்டம் மட்டுமே. நோய் கண்டறியும் பயிற்சி பெற்ற மாதிரி இன்னும் இணைக்கப்படவில்லை.",
    guideTitle: "நடைமுறை விவசாய வழிகாட்டி", language: "மொழி",
    choose: "தொடங்க ஒரு அம்சத்தைத் தேர்ந்தெடுக்கவும்.", signout: "வெளியேறு",
    welcome: "உங்கள் PocketCrop+ பணியிடம்", backLogin: "உள்நுழைக",
    account: "கணக்கை உருவாக்கு", name: "முழுப் பெயர்", email: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்", create: "கணக்கை உருவாக்கு →", login: "உள்நுழைக →",
    wait: "காத்திருக்கவும்…", logout: "வெளியேறு", open: "திறக்க →",
    water: "மண்ணின் ஈரப்பதத்தைத் தொடர்ந்து கவனித்து, அதிக நீர்ப்பாசனத்தைத் தவிர்க்கவும்.",
    soilTip: "உரம் இடுவதற்கு முன் மண்ணின் ஊட்டச்சத்து மற்றும் pH அளவைப் பரிசோதிக்கவும்.",
    weather: "பயிரிடுவதற்கு முன் உள்ளூர் வானிலை முன்னறிவிப்பைப் பார்க்கவும்.",
    caution: "இவை பொதுவான வழிகாட்டுதல்கள் மட்டுமே; உள்ளூர் வேளாண் நிபுணரின் ஆலோசனைக்கு மாற்றாகாது."
  }
};

type Language = "en" | "ta";

export default function App() {
  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => sessionStorage.getItem("pocketcrop_token") ?? "");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [cropResult, setCropResult] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [area, setArea] = useState("1");
  const [cost, setCost] = useState("10000");
  const [price, setPrice] = useState("30");
  const [yieldPerAcre, setYieldPerAcre] = useState("1000");
  const [economicsDone, setEconomicsDone] = useState(false);

  const t = labels[language];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = mode === "register"
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password);
      sessionStorage.setItem("pocketcrop_token", result.access_token);
      setToken(result.access_token);
      setUser(result.user);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to the server.");
    } finally {
      setBusy(false);
    }
  }

  async function loadProfile() {
    if (!token) return;
    setError("");
    setChecking(true);
    try {
      setUser(await getMe(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load profile.");
      sessionStorage.removeItem("pocketcrop_token");
      setToken("");
      setUser(null);
    } finally {
      setChecking(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("pocketcrop_token");
    setToken("");
    setUser(null);
    setPage("home");
    setMode("login");
  }

  function recommendCrop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const n = Number(data.get("nitrogen"));
    const p = Number(data.get("phosphorus"));
    const k = Number(data.get("potassium"));
    const temp = Number(data.get("temperature"));
    const humidity = Number(data.get("humidity"));
    const ph = Number(data.get("ph"));
    const rain = Number(data.get("rainfall"));

    let crop = "Millet";
    let reason = "A possible option to investigate for relatively dry conditions.";

    if (rain > 180 && humidity > 70 && temp >= 20 && temp <= 35) {
      crop = "Rice";
      reason = "The entered conditions indicate relatively high rainfall and humidity.";
    } else if (temp >= 20 && temp <= 35 && rain >= 50 && rain <= 150 && ph >= 5.5 && ph <= 7.5) {
      crop = "Maize";
      reason = "The entered temperature, rainfall, and pH fall within a broad range worth investigating for maize.";
    } else if (ph < 5.5) {
      crop = "Consider soil testing before selecting a crop";
      reason = "The entered pH is acidic. Check local crop suitability and soil amendment needs.";
    } else if (rain < 50) {
      crop = "Millet or pulses";
      reason = "The entered rainfall is low; confirm local water availability and seasonal suitability.";
    } else if (n < 40 && p < 25 && k < 25) {
      crop = "Groundnut or pulses";
      reason = "The entered nutrient values are relatively low. Confirm soil needs with a soil test.";
    }

    setCropResult(`${crop}: ${reason} These are rule-based suggestions, not a validated machine-learning prediction.`);
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
  }

  const totalArea = Math.max(0, Number(area) || 0);
  const totalCost = Math.max(0, Number(cost) || 0);
  const totalRevenue = totalArea * Math.max(0, Number(yieldPerAcre) || 0) * Math.max(0, Number(price) || 0);
  const totalProfit = totalRevenue - totalCost;
  const totalYield = totalArea * Math.max(0, Number(yieldPerAcre) || 0);
  const money = (value: number) => value.toLocaleString("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  });

  if (token && !user) {
    return (
      <main className="center-screen">
        <section className="auth-card">
          <Brand />
          <h1>Welcome back</h1>
          <p className="muted">Verify your session to open your farmer dashboard.</p>
          {error && <p className="error">{error}</p>}
          <button className="primary-button full" onClick={loadProfile} disabled={checking}>
            {checking ? "Checking session…" : "Open dashboard"}
          </button>
          <button className="text-button" onClick={logout}>Sign out</button>
        </section>
      </main>
    );
  }

  if (!token || !user) {
    return (
      <main className="landing">
        <section className="story-panel">
          <Brand />
          <div className="story-content">
            <span className="eyebrow light">YOUR FARM. YOUR FUTURE.</span>
            <h1>Better farming decisions, rooted in knowledge.</h1>
            <p>One workspace for crop planning, plant health, farm economics, and multilingual agricultural guidance.</p>
            <div className="story-points">
              <span>✓ Region-aware planning</span>
              <span>✓ Practical financial estimates</span>
              <span>✓ English and Tamil</span>
            </div>
          </div>
          <div className="landscape" aria-hidden="true"><div className="sun" /><div className="hill hill-one" /><div className="hill hill-two" /><div className="field-lines" /></div>
          <p className="story-caption">Designed with farmers in mind · Initial focus: Tamil Nadu, India</p>
        </section>
        <section className="form-panel">
          <div className="mobile-brand"><Brand /></div>
          <div className="auth-card">
            <span className="eyebrow">{mode === "register" ? "GET STARTED" : "WELCOME BACK"}</span>
            <h2>{mode === "register" ? t.account : "Sign in to PocketCrop+"}</h2>
            <p className="muted">{mode === "register" ? "Start building your personal farmer workspace." : "Access your farmer workspace securely."}</p>
            <div className="mode-switch" role="tablist" aria-label="Account action">
              <button className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setError(""); }}>{t.backLogin}</button>
              <button className={mode === "register" ? "selected" : ""} onClick={() => { setMode("register"); setError(""); }}>{t.account}</button>
            </div>
            <form onSubmit={handleSubmit}>
              {mode === "register" && <label>{t.name}<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" minLength={2} maxLength={100} autoComplete="name" required /></label>}
              <label>{t.email}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
              <label>{t.password}<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} required /></label>
              {error && <p className="error" role="alert">{error}</p>}
              <button className="primary-button full" type="submit" disabled={busy}>{busy ? t.wait : mode === "register" ? t.create : t.login}</button>
            </form>
            <p className="legal-note">Your password is securely hashed before storage. Never reuse a sensitive password in a demo application.</p>
          </div>
          <p className="copyright">© PocketCrop+ 2.0 · Farmer Decision Support System</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <Brand />
        <div className="topbar-actions">
          <label className="language-select">{t.language}
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
            </select>
          </label>
          <button className="outline-button" onClick={logout}>{t.signout}</button>
        </div>
      </header>

      {page === "home" ? (
        <>
          <section className="welcome-panel">
            <span className="eyebrow">FARMER WORKSPACE · POCKETCROP+ 2.0</span>
            <h1>{language === "ta" ? `வணக்கம், ${user.name}` : `Vanakkam, ${user.name}`} 🌿</h1>
            <p>{t.choose}</p>
            <div className="status-row"><span className="status-dot" /> Account authenticated <span className="pill">{language === "ta" ? "தமிழ்" : "English"}</span></div>
          </section>
          <section className="section-heading"><div><span className="eyebrow">YOUR TOOLKIT</span><h2>Smarter farming starts here</h2></div></section>
          <section className="feature-grid">
            {features.map((feature) => (
              <button className="feature-card feature-button" key={feature.id} onClick={() => { setPage(feature.id); setCropResult(""); setEconomicsDone(false); }}>
                <span className="feature-icon">{feature.icon}</span>
                <h3>{language === "ta" ? labels.ta[feature.id] : feature.title}</h3>
                
<p>
  {language === "ta"
    ? ({
        crop: "மண் மற்றும் வானிலை அடிப்படையில் பயிர்களைத் தேர்வு செய்யவும்.",
        health: "தாவரத்தின் படத்தைப் பதிவேற்றி அறிகுறிகளைச் சரிபார்க்கவும்.",
        economics: "செலவு, வருவாய் மற்றும் லாபத்தைக் கணக்கிடவும்.",
        guide: "தமிழ் மற்றும் ஆங்கிலத்தில் விவசாய வழிகாட்டுதலைப் பெறவும்.",
      } as Record<string, string>)[feature.id] ?? feature.text
    : feature.text}
</p>
                <span className="coming-soon">{t.open}</span>
              </button>
            ))}
          </section>
        </>
      ) : (
        <section className="module-panel">
          <button className="text-button" onClick={() => setPage("home")}>{t.back}</button>

          {page === "crop" && (
            <>
              <span className="eyebrow">CROP PLANNING</span>
              <h1>{t.crop}</h1>
              <p className="muted">{t.soil}</p>
              <form className="module-form" onSubmit={recommendCrop}>
                <label>{t.nitrogen}<input name="nitrogen" type="number" min="0" max="200" defaultValue="50" required /></label>
                <label>{t.phosphorus}<input name="phosphorus" type="number" min="0" max="200" defaultValue="40" required /></label>
                <label>{t.potassium}<input name="potassium" type="number" min="0" max="250" defaultValue="40" required /></label>
                <label>{t.temperature}<input name="temperature" type="number" min="-10" max="60" step="0.1" defaultValue="28" required /></label>
                <label>{t.humidity}<input name="humidity" type="number" min="0" max="100" defaultValue="65" required /></label>
                <label>{t.ph}<input name="ph" type="number" min="0" max="14" step="0.1" defaultValue="6.5" required /></label>
                <label>{t.rainfall}<input name="rainfall" type="number" min="0" max="5000" defaultValue="100" required /></label>
                <button className="primary-button" type="submit">{t.submit}</button>
              </form>
              {cropResult && <div className="result-panel"><h3>{t.result}</h3><p>{cropResult}</p></div>}
              <p className="legal-note">{t.caution}</p>
            </>
          )}

          {page === "health" && (
            <>
              <span className="eyebrow">PLANT HEALTH</span>
              <h1>{t.health}</h1>
              <p className="muted">{t.imageNote}</p>
              <label className="upload-area">{t.image}
                <input type="file" accept="image/*" onChange={handleImage} />
              </label>
              {imageUrl && <div className="image-preview"><img src={imageUrl} alt="Uploaded crop preview" /><p>Image loaded successfully. No diagnosis has been generated.</p></div>}
              <p className="legal-note">For suspected crop disease, consult your local agricultural extension service. Do not apply pesticides based only on an unverified image assessment.</p>
            </>
          )}

          {page === "economics" && (
            <>
              <span className="eyebrow">FARM FINANCES</span>
              <h1>{t.economics}</h1>
              <form className="module-form" onSubmit={(event) => { event.preventDefault(); setEconomicsDone(true); }}>
                <label>{t.area}<input type="number" min="0.01" step="0.01" value={area} onChange={(e) => setArea(e.target.value)} required /></label>
                <label>{t.cost}<input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required /></label>
                <label>{t.yield}<input type="number" min="0" step="0.01" value={yieldPerAcre} onChange={(e) => setYieldPerAcre(e.target.value)} required /></label>
                <label>{t.price}<input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></label>
                <button className="primary-button" type="submit">{t.calculate}</button>
              </form>
              {economicsDone && (
                <div className="result-panel">
                  <h3>{t.revenue}: {money(totalRevenue)}</h3>
                  <p>{t.profit}: <strong>{money(totalProfit)}</strong></p>
                  <p>{t.breakEven}: {totalYield > 0 ? money(totalCost / totalYield) : "—"}</p>
                  <p className="muted">This is an estimate based on your inputs. Actual yield, market price, and expenses may differ.</p>
                </div>
              )}
            </>
          )}

          {page === "guide" && (
            <>
              <span className="eyebrow">FARMER LEARNING</span>
              <h1>{t.guideTitle}</h1>
              <div className="guide-list">
                <article><h3>💧 {language === "ta" ? "நீர்ப்பாசனம்" : "Water management"}</h3><p>{t.water}</p></article>
                <article><h3>🌱 {language === "ta" ? "மண் பராமரிப்பு" : "Soil care"}</h3><p>{t.soilTip}</p></article>
                <article><h3>🌦️ {language === "ta" ? "வானிலை" : "Weather awareness"}</h3><p>{t.weather}</p></article>
              </div>
              <p className="legal-note">{t.caution}</p>
            </>
          )}
        </section>
      )}
      <footer className="footer">PocketCrop+ 2.0 · Practical tools for informed farm decisions.</footer>
    </main>
  );
}

function Brand() {
  return (
    <a className="brand" href="/" aria-label="PocketCrop home">
      <span className="brand-mark">✳</span>
      <span>PocketCrop<span className="brand-plus">+</span><small>FARMER DECISION SUPPORT</small></span>
    </a>
  );
}