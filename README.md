# 📢 ระบบแจ้งเตือนราชกิจจานุเบกษาอัตโนมัติ

ระบบตรวจสอบและแจ้งเตือนผ่านอีเมล์เมื่อมีประกาศราชกิจจานุเบกษาใหม่ที่เกี่ยวข้องกับ keywords ที่กำหนด

## 🌟 คุณสมบัติ

- ✅ ตรวจสอบอัตโนมัติทุกเช้า เวลา 07:00 น.
- ✅ ส่งอีเมล์รายงานสรุปทุกวัน
- ✅ เพิ่ม/ลด keywords ได้ง่าย
- ✅ ฟรี 100% ไม่มีค่าใช้จ่าย

## 📋 การตั้งค่าครั้งแรก

### 1. ตั้งค่า Secrets ใน GitHub

ไปที่ `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

เพิ่ม secrets ทั้ง 3 ตัว:

| ชื่อ Secret | ค่าที่ใส่ | หมายเหตุ |
|------------|---------|---------|
| `RATCHAKITCHA_TOKEN` | Token จาก https://www2.soc.go.th | ดูวิธีขอ Token ในเอกสาร PDF |
| `RESEND_API_KEY` | API Key จาก https://resend.com | เช่น `re_xxxxxxxxx` |
| `EMAIL_TO` | อีเมล์ที่จะรับแจ้งเตือน | เช่น `your@email.com` |

### 2. แก้ไข Keywords ที่ต้องการติดตาม

แก้ไขไฟล์ `config.json`:

```json
{
  "keywords": [
    "ปิโตรเลียม",
    "น้ำมัน",
    "พลังงาน",
    "ไฟฟ้า",
    "เพิ่ม keyword ที่นี่"
  ],
  "daysToCheck": 1
}
```

### 3. ทดสอบรันด้วยตัวเอง

1. ไปที่ `Actions`
2. เลือก workflow `Check Ratchakitcha Daily`
3. คลิก `Run workflow`
4. รอสักครู่ แล้วเช็คอีเมล์

## 🕐 กำหนดการทำงาน

- **อัตโนมัติ:** ทุกวัน เวลา 07:00 น. (เวลาไทย)
- **ด้วยตัวเอง:** คลิก "Run workflow" ใน Actions ได้ทุกเมื่อ

## 📧 ตัวอย่างอีเมล์ที่ได้รับ

อีเมล์จะมีข้อมูล:
- 📊 สรุปจำนวนประกาศที่พบ
- 🔍 แยกตาม keyword
- 📖 รายละเอียด: ชื่อเรื่อง, เล่ม, ตอน, วันที่ประกาศ
- 📥 ลิงก์ดาวน์โหลด PDF

## ⚙️ ปรับแต่งเพิ่มเติม

### เปลี่ยนเวลาที่ตรวจสอบ

แก้ไขไฟล์ `.github/workflows/check-ratchakitcha.yml`:

```yaml
schedule:
  - cron: '0 0 * * *'  # 07:00 น. (UTC 00:00 = ICT 07:00)
  - cron: '0 12 * * *' # 19:00 น. (เพิ่มรอบเย็น)
```

### เปลี่ยนจำนวนวันย้อนหลังที่เช็ค

แก้ไขไฟล์ `config.json`:

```json
{
  "daysToCheck": 3  // เช็คย้อนหลัง 3 วัน
}
```

## 🔧 แก้ไขปัญหา

### ไม่ได้รับอีเมล์

1. เช็ค Actions → ดู log มี error หรือไม่
2. ตรวจสอบ Secrets ว่าใส่ครบ 3 ตัว
3. ตรวจสอบ `EMAIL_TO` พิมพ์ถูกต้อง

### GitHub Actions ไม่ทำงาน

1. ตรวจสอบว่า Actions เปิดใช้งาน (Settings → Actions → Allow all actions)
2. Repository ต้องมี activity (ลอง commit อะไรสักอย่าง)

## 📚 เอกสารอ้างอิง

- [API ราชกิจจานุเบกษา](https://api.soc.go.th)
- [Resend Documentation](https://resend.com/docs)
- [GitHub Actions Cron](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)

## 📝 License

MIT License - ใช้งานได้ฟรี

---

Made with ❤️ for monitoring Thai Royal Gazette
