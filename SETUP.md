# Kurulum ve Geliştirme Notları

## Yerel kurulum

**Gereksinimler:** Python 3.12 veya üzeri ve pip. Bootstrap dosyaları CDN üzerinden yüklendiği için arayüzün bu kaynaklara erişmesi gerekir. Node.js kurulumu gerekmez.

Depoyu klonlayın veya ZIP olarak indirin. Terminali bu `README.md` dosyasının bulunduğu **ana klasörde** açın. `manage.py`, içteki `kisisel_portfoy` klasöründedir.

### 1. Sanal ortamı oluşturun

Windows / PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

PowerShell etkinleştirme betiğini engelliyorsa yalnızca mevcut terminal oturumu için aşağıdaki komutu çalıştırıp etkinleştirmeyi tekrar deneyin:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

macOS / Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

### 2. Ortam değişkenlerini hazırlayın

Ana klasörde `.env.example` dosyasını `.env` adıyla kopyalayın. Mevcut bir `.env` dosyanız varsa üzerine yazmayın.

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS / Linux:

```bash
cp .env.example .env
```

Yeni bir kurulum için aşağıdaki komut rastgele bir gizli anahtar üretip `.env` dosyasına kaydeder:

```bash
python -c "import secrets; from dotenv import set_key; set_key('.env', 'DJANGO_SECRET_KEY', secrets.token_urlsafe(64))"
```

| Değişken | Açıklama |
| --- | --- |
| `DJANGO_SECRET_KEY` | Django'nun gizli anahtarı. Gerçek değer yalnızca yerel `.env` dosyasında veya sunucu ortamında tutulur. |
| `DJANGO_DEBUG` | Yerel geliştirmede `True`; yayın ortamında `False`. Tanımlı değilse `False` kabul edilir. |
| `DJANGO_ALLOWED_HOSTS` | Virgülle ayrılmış alan adları. Yerelde `localhost,127.0.0.1,[::1]`. URL şeması veya yol yazılmaz. |

`.env` dosyası ana klasörden otomatik okunur. Sunucuda tanımlanan ortam değişkenleri `.env` değerlerinden önceliklidir. Gizli anahtar boşsa veya örnek değer değiştirilmemişse uygulama açıklayıcı bir hata vererek başlamaz.

### 3. Veritabanını oluşturun ve çalıştırın

```bash
cd kisisel_portfoy
python manage.py migrate
python manage.py createsuperuser
python manage.py check
python manage.py runserver
```

- Site: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Yönetim paneli: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

Migration dosyaları depoya dahildir; ilk kurulumda `migrate` yeterlidir. `makemigrations`, model yapısını değiştirdiğinizde kullanılır.

## İçerik yönetimi

Admin paneline oluşturduğunuz hesapla giriş yapın:

| Model | Yönetilen içerik |
| --- | --- |
| `Projects` | Proje başlığı, kısa ve detaylı açıklama, görsel, GitHub ve demo adresleri |
| `Skills` | Teknoloji adı ve ikonu |
| `Profile` | Hakkımda metni, CV, e-posta, GitHub ve LinkedIn adresleri |

Bir profil kaydı oluşturun ve sonraki düzenlemeleri aynı kayıt üzerinden yapın. Admin arayüzü, kayıt mevcutken ikinci profil eklenmesine izin vermez. Bu sınırlama admin katmanındadır.

Proje veya yetenek eklemek için migration çalıştırılmaz. Kaydı kaydedip ana sayfayı yenilemeniz yeterlidir. Projeler son eklenenden başlayarak listelenir; boş bırakılan proje bağlantıları ve iletişim bağlantıları gösterilmez.

Girişteki ad, kısa tanıtım, navbar ve footer gibi sabit metinler `index.html` ve `base.html` şablonlarından düzenlenir. CV için PDF, proje görselleri için PNG veya JPEG kullanılabilir.

### Veritabanı ve yüklenen dosyalar

SQLite veritabanı, CV ve yüklenen görseller depoya eklenmez. Yeni bir kurulum içerik ve admin hesabı olmadan başlar; bilgileri admin panelinden ekleyebilirsiniz.

Mevcut siteyi başka bir sunucuya taşırken **veritabanını ve `media/` klasörünü birlikte** ayrıca aktarın. Bunları silmek veya GitHub'a yüklemek gerekmez. CSS ve JavaScript dosyaları ise `static/` altında kaynak kodla birlikte tutulur.

## Proje yapısı

```text
.
├── .env.example
├── .gitignore
├── README.md
├── requirements.txt
└── kisisel_portfoy/
    ├── manage.py
    ├── portfoy/
    │   ├── settings.py
    │   ├── urls.py
    │   ├── asgi.py
    │   └── wsgi.py
    └── portfoy_app/
        ├── models.py
        ├── admin.py
        ├── views.py
        ├── urls.py
        ├── migrations/
        ├── templates/portfoy_app/
        │   ├── base.html
        │   └── index.html
        └── static/portfoy_app/
            ├── style.css
            └── projects.js
```

Yerel kullanım sırasında ana klasörde `.env` ve `.venv/`; içteki `kisisel_portfoy/` klasöründe `db.sqlite3` ve `media/` oluşur. Bu dosyalar `.gitignore` kapsamındadır.

## Yayınlama notları

Bu depoyu GitHub'a yüklemek Django uygulamasını çalışır hâlde yayınlamaz. Dinamik uygulama, Python çalıştırabilen bir barındırma ortamı gerektirir; GitHub Pages tek başına bu backend'i çalıştırmaz.

Yayın ortamında ayrı bir gizli anahtar tanımlayın, `DJANGO_DEBUG=False` kullanın ve `DJANGO_ALLOWED_HOSTS` içine gerçek alan adınızı ekleyin. Geliştirme sunucusu yerine uygun bir WSGI/ASGI sunucusu kullanın. HTTPS, statik dosya sunumu ve kalıcı medya depolamasını barındırma ortamınıza göre yapılandırın.

```bash
python manage.py collectstatic --noinput
python manage.py check --deploy
```

`collectstatic` çıktısı `kisisel_portfoy/staticfiles/` klasörüne yazılır; bu klasörün dosyalarını sunucu ayrıca sunmalıdır. `urls.py` içindeki medya yönlendirmesi yalnızca `DEBUG=True` iken geliştirme içindir. Yayın ortamında görseller ve CV için ayrıca dosya sunumu gerekir.

Bu depo belirli bir barındırma hizmeti için otomatik dağıtım yapılandırması içermez.

## Kaynaklar

- [Django dokümantasyonu](https://docs.djangoproject.com/en/6.1/)
- [Django yayınlama kontrol listesi](https://docs.djangoproject.com/en/6.1/howto/deployment/checklist/)
- [Bootstrap dokümantasyonu](https://getbootstrap.com/docs/5.3/)
- [python-dotenv](https://bbc2.github.io/python-dotenv/)
