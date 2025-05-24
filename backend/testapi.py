import requests 
payload = {
    "username": "cs-admin",
    "password":"cs-admin123123@"
}
reponse = requests.post('https://192.165.30.195:4000/login',json= payload, verify= False )
print(reponse.text)