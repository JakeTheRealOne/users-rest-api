# Users REST API - Return codes

When requesting the express.js server, the json reponse will always contains a "return" with a return code. All code and their description are listed below:

| Code   | Description                                |
|--------|--------------------------------------------|
| 322500 | Success                                    |
| 322501 | Server internal error                      |
| 322502 | Database internal error                    |
| 322503 | Not authorized                             |
| 322504 | Bad json input                             |
| 322505 | Invalid password                           |
| 322506 | Email already registered                   |
| 322507 | Invalid email                              |
| 322508 | Unkown user id                             |
| 322509 | Password length should be between 1 and 60 |
| 322510 | Web token is invalid (refresh needed)      |