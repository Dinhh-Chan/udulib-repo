import requests

url = "http://localhost:8000/api/v1/academic_year"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzQ3OTkxNjY1fQ.yc87Z4oc6c_p5jo_WsMlVXisgi5_ew_MRQRVjmus1Yo"
}
data = {
    "year_name": "năm nhất",
    "year_order": 0
}

response = requests.post(url, headers=headers, json=data)
print(response.json())