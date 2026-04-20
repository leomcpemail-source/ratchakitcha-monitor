# 📢 ระบบแจ้งเตือนราชกิจจานุเบกษาอัตโนมัติ

ระบบตรวจสอบและแจ้งเตือนเมื่อมีประกาศใหม่ในราชกิจจานุเบกษาที่ตรงกับ keywords ที่กำหนด โดยทำงานอัตโนมัติผ่าน GitHub Actions และส่งอีเมล์แจ้งเตือน

## ✨ Features

- ✅ ตรวจสอบราชกิจจานุเบกษาอัตโนมัติตามเวลาที่กำหนด
- ✅ รองรับหลาย keywords
- ✅ รองรับ pagination (ดึงข้อมูลได้ทั้งหมดแม้มากกว่า 100 รายการ)
- ✅ ส่งอีเมล์แจ้งเตือนพร้อมลิงก์ดาวน์โหลด PDF
- ✅ มี Web UI สำหรับตั้งค่า (ไม่ต้องแก้ไขโค้ด)
- ✅ แปลงเวลา ICT ↔ UTC อัตโนมัติ
- ✅ บันทึก GitHub Token ใน localStorage (ไม่ต้องใส่ใหม่ทุกครั้ง)

## 🚀 Quick Start

### 1. Fork Repository นี้

คลิกปุ่ม **Fork** ที่มุมขวาบน

### 2. ตั้งค่าผ่าน Web UI

1. เปิดไฟล์ `config_rachakitcha.html` ใน browser
2. ใส่ **GitHub Personal Access Token** (สร้างได้ที่ [github.com/settings/tokens](https://github.com/settings/tokens))
   - ต้องการ permission: `repo`
3. ตั้งค่า:
   - **Keywords**: คำที่ต้องการค้นหา (เช่น "น้ำมัน", "คลัง")
   - **เวลา**: เวลาที่ต้องการตรวจสอบ (ใส่เป็นเวลาไทย)
   - **อีเมล์**: อีเมล์ที่จะรับการแจ้งเตือน
   - **จำนวนวัน**: ย้อนหลังกี่วัน (แนะนำ 1-7)
4. กด **บันทึกการตั้งค่า**

### 3. เพิ่ม API Keys

ต้องการ 2 API keys:

#### Ratchakitcha Token
1. ไปที่ [www2.soc.go.th](https://www2.soc.go.th)
2. เข้าสู่ระบบรับข้อมูลข่าวสาร
3. คลิก "รับข้อมูล Token"
4. Copy token ที่ได้

#### Resend API Key
1. สร้าง account ที่ [resend.com](https://resend.com)
2. ไปที่ API Keys → Create API Key
3. Copy key ที่ได้

#### วิธีเพิ่ม Tokens
**วิธีที่ 1: ใช้ Web UI** (แนะนำ)
- เปิด `config_rachakitcha.html`
- เพิ่ม tokens ในส่วน "การตั้งค่าอื่นๆ"

**วิธีที่ 2: แก้ไข config.json**
```json
{
  "ratchakitchaToken": "YOUR_TOKEN_HERE",
  "resendApiKey": "YOUR_RESEND_KEY_HERE",
  "emailTo": "your-email@example.com"
}
```

### 4. ทดสอบ

1. ไปที่ **Actions** tab ใน GitHub
2. เลือก workflow "Check Ratchakitcha Daily"
3. คลิก **Run workflow** → **Run workflow**
4. รอสักครู่และตรวจสอบอีเมล์

## ⚙️ การตั้งค่า

### ตั้งเวลาทำงาน

ตั้งค่าได้ 2 วิธี:

**วิธีที่ 1: ใช้ Web UI** (แนะนำ)
1. เปิด `config_rachakitcha.html`
2. ในส่วน "ตารางเวลาตรวจสอบ"
3. ใส่เวลาเป็น**เวลาไทย** (เช่น 08:00)
4. ระบบจะแปลงเป็น UTC อัตโนมัติ

**วิธีที่ 2: แก้ไข Workflow File**
แก้ไขไฟล์ `.github/workflows/check-ratchakitcha.yml`:

```yaml
schedule:
  - cron: '0 1 * * *'  # 08:00 ICT
  - cron: '0 5 * * *'  # 12:00 ICT
```

**สูตรคำนวณ:**
```
UTC = (เวลาไทย - 7) mod 24
```

ตัวอย่าง:
- 08:00 ICT → 01:00 UTC → `0 1 * * *`
- 12:00 ICT → 05:00 UTC → `0 5 * * *`
- 18:00 ICT → 11:00 UTC → `0 11 * * *`

## 📁 โครงสร้างไฟล์

```
.
├── config_rachakitcha.html   # Web UI สำหรับตั้งค่า
├── check.js                   # Script หลัก (รองรับ pagination)
├── config.json                # ไฟล์ config
├── .github/
│   └── workflows/
│       └── check-ratchakitcha.yml  # GitHub Actions workflow
├── .gitignore
└── README.md
```

## 🔧 Advanced Usage

### การเพิ่ม Keywords

```javascript
"keywords": [
  "น้ำมัน",
  "คลัง",
  "ปิโตรเลียม",
  "ก๊าซปิโตรเลียมเหลว",
  "พลังงาน"
]
```

### การตั้งเวลาหลายช่วง

```yaml
schedule:
  - cron: '0 1 * * *'   # 08:00 ICT - เช้า
  - cron: '0 5 * * *'   # 12:00 ICT - เที่ยง
  - cron: '0 11 * * *'  # 18:00 ICT - เย็น
```

### การกรอง Pagination

Script รองรับการดึงข้อมูลมากกว่า 100 รายการ:
- ดึงทีละ 100 records
- Loop จนกว่าจะได้ครบ
- มี delay 500ms ระหว่างหน้า (ป้องกัน rate limit)

## 🐛 Troubleshooting

### ไม่ได้รับอีเมล์
1. ตรวจสอบว่า Resend API Key ถูกต้อง
2. เช็คว่าอีเมล์ไม่ตกไป Spam
3. ดู log ใน GitHub Actions

### เวลาไม่ตรง
1. เปิด `config_rachakitcha.html`
2. ดูกล่อง "แสดงการแปลงเวลา ICT → UTC"
3. ตรวจสอบว่า cron ถูกต้อง

### Token หมดอายุ
1. Ratchakitcha Token: ต้องขอใหม่ที่ soc.go.th
2. GitHub Token: สร้างใหม่ที่ github.com/settings/tokens

### ดึงข้อมูลไม่ครบ
- Script รองรับ pagination แล้ว
- ตรวจสอบ log ว่าดึงกี่หน้า
- ถ้ายังไม่ครบ ให้เพิ่ม delay ระหว่างหน้า

## 📝 การอัพเดท

### อัพเดท Keywords
1. เปิด `config_rachakitcha.html`
2. เพิ่ม/ลบ keywords
3. กดบันทึก

### อัพเดทเวลา
1. เปิด `config_rachakitcha.html`
2. แก้ไขเวลาในส่วน "ตารางเวลาตรวจสอบ"
3. กดบันทึก (จะอัพเดท workflow file อัตโนมัติ)

### เปลี่ยน GitHub Token
1. เปิด `config_rachakitcha.html`
2. กดปุ่ม "🗑️ ลบ Token"
3. Refresh หน้า
4. ใส่ Token ใหม่

## 🔒 ความปลอดภัย

- ❌ **อย่า commit** tokens ลง git
- ✅ ใช้ `config_rachakitcha.html` สำหรับตั้งค่า
- ✅ GitHub Token เก็บใน localStorage ของ browser
- ✅ Tokens จริงเก็บใน `config.json` (ไม่ควร public)

## 📚 เอกสารเพิ่มเติม

- [คู่มือการใช้งาน API ราชกิจจานุเบกษา](https://www.ratchakitcha.soc.go.th/)
- [วิธีสร้าง GitHub Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Resend Email API](https://resend.com/docs)

## 🤝 Contributing

ยินดีรับ Pull Requests!

## 📄 License

MIT License

## 👨‍💻 Author

สร้างด้วย ❤️ สำหรับการติดตามข่าวสารราชกิจจานุเบกษา

---

**หมายเหตุ:** ระบบนี้ใช้สำหรับติดตามข่าวสารเท่านั้น ไม่เกี่ยวข้องกับส่วนราชการ
