const fs = require('fs');

// อ่านค่า config
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const RATCHAKITCHA_TOKEN = process.env.RATCHAKITCHA_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO = process.env.EMAIL_TO;

// ตรวจสอบว่ามี environment variables ครบไหม
if (!RATCHAKITCHA_TOKEN || !RESEND_API_KEY || !EMAIL_TO) {
  console.error('❌ Missing required environment variables');
  console.error('Required: RATCHAKITCHA_TOKEN, RESEND_API_KEY, EMAIL_TO');
  process.exit(1);
}

// ฟังก์ชันดึงข้อมูลจาก API ราชกิจจานุเบกษา
async function fetchRatchakitcha(keyword, daysBack = 1) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysBack);
  
  const dateBegin = formatDate(startDate);
  const dateEnd = formatDate(today);
  
  const url = `https://api.soc.go.th/webservice/api/rkjs/1/100?title=${encodeURIComponent(keyword)}&dateBegin=${dateBegin}&dateEnd=${dateEnd}`;
  
  console.log(`🔍 Searching for: ${keyword}`);
  console.log(`📅 Date range: ${dateBegin} to ${dateEnd}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${RATCHAKITCHA_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Error fetching data for "${keyword}":`, error.message);
    return null;
  }
}

// ฟังก์ชันแปลงวันที่เป็นรูปแบบ MM-DD-YYYY
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

// ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
function formatDateThai(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('th-TH', options);
}

// ฟังก์ชันสร้าง HTML สำหรับอีเมล์
function createEmailHTML(results) {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Sarabun', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #2980b9; margin-top: 30px; }
    .keyword { background: #3498db; color: white; padding: 2px 8px; border-radius: 3px; }
    .item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
    .title { font-weight: bold; color: #2c3e50; margin-bottom: 5px; }
    .meta { color: #7f8c8d; font-size: 0.9em; }
    .link { display: inline-block; margin-top: 10px; padding: 8px 15px; background: #3498db; color: white; text-decoration: none; border-radius: 4px; }
    .link:hover { background: #2980b9; }
    .summary { background: #e8f4f8; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .no-results { color: #95a5a6; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📢 รายงานราชกิจจานุเบกษาประจำวัน</h1>
    <div class="summary">
      <strong>วันที่:</strong> ${formatDateThai(new Date().toISOString())}<br>
      <strong>จำนวน Keywords:</strong> ${results.length}<br>
      <strong>พบประกาศใหม่:</strong> ${results.reduce((sum, r) => sum + r.items.length, 0)} รายการ
    </div>
  `;

  results.forEach(result => {
    html += `<h2>🔍 Keyword: <span class="keyword">${result.keyword}</span></h2>`;
    
    if (result.items.length === 0) {
      html += `<p class="no-results">ไม่พบประกาศใหม่</p>`;
    } else {
      html += `<p><strong>พบ ${result.items.length} รายการ</strong></p>`;
      
      result.items.forEach((item, index) => {
        html += `
        <div class="item">
          <div class="title">${index + 1}. ${item.doctitle}</div>
          <div class="meta">
            📖 เล่มที่ ${item.bookNo} ${item.section} | 
            📅 ${formatDateThai(item.publishDate)} | 
            📄 หน้า ${item.pageNo}
          </div>
          <a href="${item.filePath}" class="link" target="_blank">📥 ดาวน์โหลด PDF</a>
        </div>
        `;
      });
    }
  });

  html += `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 0.9em;">
      <p>🤖 ระบบแจ้งเตือนอัตโนมัติจาก GitHub Actions</p>
      <p>ตั้งค่า Keywords ได้ที่: <a href="https://github.com/leomcpemail-source/ratchakitcha-monitor">Repository</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

// ฟังก์ชันส่งอีเมล์ผ่าน Resend
async function sendEmail(results) {
  const hasNewItems = results.some(r => r.items.length > 0);
  const totalItems = results.reduce((sum, r) => sum + r.items.length, 0);
  
  // ถ้าไม่มีรายการใหม่เลย ให้ส่งอีเมล์แจ้งว่าไม่มีอัพเดต
  const subject = hasNewItems 
    ? `📢 พบประกาศราชกิจจาฯ ใหม่ ${totalItems} รายการ - ${formatDateThai(new Date().toISOString())}`
    : `✅ ไม่มีประกาศราชกิจจาฯ ใหม่ - ${formatDateThai(new Date().toISOString())}`;

  const htmlContent = createEmailHTML(results);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: EMAIL_TO,
        subject: subject,
        html: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to send email: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ Email sent successfully!', data);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
}

// ฟังก์ชันหลัก
async function main() {
  console.log('🚀 Starting Ratchakitcha Monitor...');
  console.log('📧 Email will be sent to:', EMAIL_TO);
  console.log('🔑 Keywords:', config.keywords);
  console.log('---');

  const results = [];

  // ค้นหาแต่ละ keyword
  for (const keyword of config.keywords) {
    const data = await fetchRatchakitcha(keyword, config.daysToCheck || 1);
    
    if (data && data.rkjs) {
      console.log(`✅ Found ${data.totalItem} items for "${keyword}"`);
      results.push({
        keyword: keyword,
        items: data.rkjs || []
      });
    } else {
      console.log(`⚠️  No data for "${keyword}"`);
      results.push({
        keyword: keyword,
        items: []
      });
    }
    
    // รอสักครู่ก่อนค้นหา keyword ถัดไป (ป้องกัน rate limit)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('---');
  console.log('📊 Summary:');
  console.log(`Total keywords checked: ${config.keywords.length}`);
  console.log(`Total items found: ${results.reduce((sum, r) => sum + r.items.length, 0)}`);
  console.log('---');

  // ส่งอีเมล์
  console.log('📧 Sending email...');
  const emailSent = await sendEmail(results);
  
  if (emailSent) {
    console.log('✅ Process completed successfully!');
  } else {
    console.log('❌ Process completed with errors');
    process.exit(1);
  }
}

// รัน
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
