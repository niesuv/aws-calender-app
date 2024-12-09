from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Thông tin cấu hình
SPREADSHEET_ID = 'your-spreadsheet-id'  # ID của Google Sheet (lấy từ URL)
RANGE_NAME = 'Sheet1!A1:D10'  # Phạm vi dữ liệu cần đọc (thay đổi theo nhu cầu)

def read_google_sheet():
    # Đường dẫn tới file credentials.json (tải về từ Google Cloud Console)
    creds = Credentials.from_service_account_file(
        'path/to/credentials.json',
        scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
    )

    # Kết nối với Google Sheets API
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()

    # Đọc dữ liệu
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print("Không tìm thấy dữ liệu.")
    else:
        print("Dữ liệu đọc được:")
        for row in values:
            print(row)

if __name__ == '__main__':
    read_google_sheet()
