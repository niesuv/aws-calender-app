from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import json

SPREADSHEET_ID = '1f8Zib8dxksIa2Y0hzGFlDN4J_BrDML-6BQrHw79cg2k'
RANGE_NAME = 'Sheet'


def lambda_handler(event, context):
    
    body = event['body']
    body = json.loads(body)
    if event == None:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps("You are missing request body!")
        }

    creds = Credentials.from_service_account_file(
        'credentials.json',
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )

    # Kết nối với Google Sheets API
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    name, time, content = body['name'], body['time'], body['content']
    if name.strip() == '' or time.strip() == '' or content.strip() == '':
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps("Cannot pass empty")
        }
    values = [
        [name, time, content]
    ]
    body = {
        'values': values
    }

    result = sheet.values().append(
        spreadsheetId=SPREADSHEET_ID,
        range=RANGE_NAME,
        valueInputOption='RAW',  # RAW: Ghi trực tiếp, USER_ENTERED: Áp dụng công thức nếu có
        insertDataOption='INSERT_ROWS',  # INSERT_ROWS: Chèn hàng mới
        body=body
    ).execute()

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(values)
    }

