# # Get random password
# curl --header "Content-Type: application/json" \
#   --request GET \
#   http://localhost:3225/motdepasse/10
# echo " "

# # Create user
# curl --header "Content-Type: application/json" \
#   --request POST \
#   -d '{"email": "bilal.vandenberge@umontreal.ca", "password": "ilikemen123", "username": "bilal", "isadmin": false}' \
#   http://localhost:3225/profils
# echo " "

# # Create admin user
# curl --header "Content-Type: application/json" \
#   --request POST \
#   -d '{"email": "admin@umontreal.ca", "password": "admin", "username": "admin", "isadmin": true}' \
#   http://localhost:3225/profils
# echo " "

# Login
token=$(curl --header "Content-Type: application/json" \
  --request POST \
  -d '{"email": "admin@umontreal.ca", "password": "admin"}' \
  http://localhost:3225/connexion | jq -r '.token')
echo " "

# # Delete user
# curl --header "Authorization: $token" \
#   --header "Content-Type: application/json" \
#   --request DELETE \
#   http://localhost:3225/profils/67
# echo " "

# # Read all users
# curl --header "Content-Type: application/json" \
#   --request GET \
#   http://localhost:3225/profils
# echo " "

# # Read user
# curl --header "Content-Type: application/json" \
#   --request GET \
#   http://localhost:3225/profils/67
# echo " "

# Modify user
curl --header "Authorization: $token" \
  --header "Content-Type: application/json" \
  --request PUT \
  -d '{"id": "fakeid"}' \
  http://localhost:3225/profils/69b1fd28369a8fde5c9ad54b