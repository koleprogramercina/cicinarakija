# Čičina Rakija — Podešavanje Email-a za Porudžbine

## EmailJS Setup (besplatno, 200 mejlova/mesec)

### Korak 1 — Nalog
1. Idite na https://www.emailjs.com/
2. Registrujte se besplatno
3. Potvrdite email

### Korak 2 — Email Service
1. Dashboard → **Email Services** → **Add New Service**
2. Izaberite Gmail (ili drugi provider)
3. Kliknite **Connect Account** → povežite vaš email (npr. cicinarakija@gmail.com)
4. **Service ID** = `cicina_rakija` ← koristimo ovaj ID u kodu

### Korak 3 — Template
1. Dashboard → **Email Templates** → **Create New Template**
2. **Template ID** = `porudzbina_template` ← koristimo ovaj ID
3. Kopirajte ovaj sadržaj u template:

---
**Subject:** Nova porudžbina #{{order_num}} — Čičina Rakija

**Body:**
```
Nova porudžbina pristigla!

━━━━━━━━━━━━━━━━━━━━━━━
BROJ PORUDŽBINE: #{{order_num}}
━━━━━━━━━━━━━━━━━━━━━━━

KUPAC:
  Ime:     {{customer_name}}
  Telefon: {{phone}}
  Email:   {{email}}

DOSTAVA:
  Adresa:  {{address}}
  Metod:   {{delivery}}
  Plaćanje: {{payment}}

PORUDŽBINA:
{{items}}

━━━━━━━━━━━━━━━━━━━━━━━
  Stavke:   {{items_total}}
  Dostava:  {{delivery_cost}}
  UKUPNO:   {{total}}
━━━━━━━━━━━━━━━━━━━━━━━

Napomena: {{note}}
```

4. U **To Email** unesite: `cicinarakija@gmail.com` (vaš email)
5. Sačuvajte template

### Korak 4 — Public Key
1. Dashboard → **Account** → **General** → **Public Key**
2. Kopirajte key (npr. `AbC123xyz`)

### Korak 5 — Ubacite u sajt
U svim HTML fajlovima pronađite liniju:
```js
if(window.emailjs) emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });
```
Zamenite `YOUR_PUBLIC_KEY` sa vašim key-em.

### Test
Pokrenite sajt, dodajte proizvod u korpu, završite porudžbinu → email stiže za ~5 sekundi.

---
## Slike
Slike su placeholder (lozovaca.png, sljivovica.png).
Pozadine su vineyard slike sa Unsplash (besplatno, bez atribucije za web).
