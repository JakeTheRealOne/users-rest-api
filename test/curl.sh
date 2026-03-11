# Get random password
curl --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3225/motdepasse/10
echo " "

# Create user
curl --header "Content-Type: application/json" \
  --request POST \
  -d '{"email": "jakelevrai@outlook.be", "password": "ilikemen123", "username": "jake"}' \
  http://localhost:3225/profils
echo " "

# Delete user
curl --header "Content-Type: application/json" \
  --request DELETE \
  http://localhost:3225/profils/67
echo " "

# Read all users
curl --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3225/profils
echo " "

# Read user
curl --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3225/profils/67
echo " "

# Modify user
curl --header "Content-Type: application/json" \
  --request PUT \
  http://localhost:3225/profils/67
echo " "