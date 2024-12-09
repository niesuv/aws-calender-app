from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import json

SPREADSHEET_ID = '1f8Zib8dxksIa2Y0hzGFlDN4J_BrDML-6BQrHw79cg2k'
RANGE_NAME = 'Sheet'

def lambda_handler(event, context):
    creds = Credentials.from_service_account_file(
        'credentials.json',
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )

    # Kết nối với Google Sheets API
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()

    # Đọc dữ liệu
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range='Sheet!A1:B2').execute()
    values = result.get('values', [])
    row1, row2 = values
    name1, todayView = row1
    name2, totalView = row2
    
    if name1 != 'view_today' or name2 != 'total_view':
        raise Exception()
    todayView = int(todayView) + 1
    totalView = int(totalView) + 1
    
    values = [
       [todayView],
       [totalView]
    ]
    body = {
        'values': values
    }
    
    result = sheet.values().update(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet!B1:B2',
        valueInputOption='RAW',  # RAW: giữ nguyên dữ liệu, USER_ENTERED: áp dụng công thức
        body=body
    ).execute()
    
    
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps("OK")  # Chuyển đối tượng Python thành JSON
    }
    