import googleapiclient.discovery
import googleapiclient.errors
import json



# API key của bạn
API_KEY = 'AIzaSyAeb7db4eZFgnMJOfbD-GzQASd6q6BExpY'

# Hiển thị các video âm nhạc đang trending
def lambda_handler(event, context):
    youtube = get_youtube_service()
    trending_videos = get_trending_music(youtube)

    print(f"Top {len(trending_videos)} trending music videos:")
    if len(trending_videos) == 0:
        return
    video = trending_videos[2]
    title = video['snippet']['title']
    video_id = video['id']
    video_url = f"https://www.youtube.com/embed/{video_id}"
    return {
            'statusCode': 200,
            'body': json.dumps(video_url)
        }
    

# Tạo một đối tượng YouTube API
def get_youtube_service():
    return googleapiclient.discovery.build('youtube', 'v3', developerKey=API_KEY)

# Lấy video trending trong danh mục âm nhạc
def get_trending_music(youtube, region_code="US", video_category_id="10", max_results=10):
    request = youtube.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode=region_code,
        videoCategoryId=video_category_id,
        maxResults=max_results
    )
    response = request.execute()
    return response['items']


lambda_handler(1,1)