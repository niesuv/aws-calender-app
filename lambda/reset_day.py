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
    
    values = [
       [0]
    ]
    body = {
        'values': values
    }
    
    sheet.values().update(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet!B1:B1',
        valueInputOption='RAW',
        body=body
    ).execute()

    sheet.values().clear(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet!A3:C99999',
    ).execute()

    
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps("OK") 
    }
