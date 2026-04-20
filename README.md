# 📢 ระบบแจ้งเตือนราชกิจจานุเบกษาอัตโนมัติ

## ✨ Features

- ✅ **เลือกวันที่ต้องการตรวจสอบ** (จันทร์-อาทิตย์)
- ✅ **ส่งอีเมล์หลายคนพร้อมกัน** (แบบ BCC)
- ✅ **ตั้งเวลาได้หลายช่วง**
- ✅ **รองรับ pagination**
- ✅ **Web UI สำหรับตั้งค่า**
- ✅ **บันทึก Token ใน localStorage**

## 🚀 Quick Start

1. **Fork Repository**
2. **เปิด** `config_rachakitcha.html`
3. **ใส่ GitHub Token** (สร้างที่ github.com/settings/tokens)
4. **เลือกวัน** และ **ตั้งเวลา**
5. **ใส่อีเมล์** (ทีละบรรทัด)
6. **บันทึก**

## 📅 ตัวอย่าง Cron

```yaml
# วันจ-ศ เวลา 08:00
- cron: '0 1 * * 1,2,3,4,5'

# ทุกวัน เวลา 08:00
- cron: '0 1 * * *'
```

## 📧 ส่งหลายคน (BCC)

```
email1@example.com
email2@example.com
email3@example.com
```

ใส่ทีละบรรทัด → ส่งแบบ BCC (ผู้รับไม่เห็นอีเมล์คนอื่น)

## 📄 License

MIT License
