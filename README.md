# algo8


for login 

api link : http://localhost:3080/login

Request Method : POST
Request Body : {
	"password": "123445",
	"username": "saloni"
} 
OR

{
"email":"saloni.sahu11@gmail.com",
"password": "123445",
}

Response Body : {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiODQ1MTBkMzAtMWVhYS0xMWViLTliMjctNDNlMjdlMjkzYzQyIiwiZW1haWwiOiJzYWxvbmkuc2FodTExQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic2Fsb25pIn0sImlhdCI6MTYwNDU1OTY3NywiZXhwIjoxNjA0NTYwNTc3fQ.BEC72aoc-47S8SFtiBIl7ILBHFNaPhXr8yYAOD2edag",
        "_id": "5fa2bb6766ada40a6844cbb0",
        "email": "saloni.sahu11@gmail.com",
        "username": "saloni",
        "password": "$2a$10$kcyWxstl4.s70H0v1xpMcuh7C4kDLVwZlU7hOzSxUkA.MbASpwT4i",
        "userId": "84510d30-1eaa-11eb-9b27-43e27e293c42"
}

for Register 

api link : http://localhost:3080/register
Request Method : POST
Request Body : {
	"email":"saloni.sahu11@gmail.com",
	"password": "123445",
	"username": "saloni"
}

Response Body : {
    "data": {},
    "error": false,
    "message": "User Registered Successfully",
    "statusCode": 200,
    "totalRecords": 1
}


for token refresh

api link : http://localhost:3080/refreshToken
Request method : POST,
Header : {Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiODQ1MTBkMzAtMWVhYS0xMWViLTliMjctNDNlMjdlMjkzYzQyIiwiZW1haWwiOiJzYWxvbmkuc2FodTExQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic2Fsb25pIn0sImlhdCI6MTYwNDU2NDY1MCwiZXhwIjoxNjA3MTU2NjUwfQ.Zav0WA-4uzGsPYFrlyYUR6sOETOL4MtvC1N6fqMWYi0}
Request Body : {
	"refreshToken" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiODQ1MTBkMzAtMWVhYS0xMWViLTliMjctNDNlMjdlMjkzYzQyIiwiZW1haWwiOiJzYWxvbmkuc2FodTExQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic2Fsb25pIn0sImlhdCI6MTYwNDUwMjE4NiwiZXhwIjoxNjA3MDk0MTg2fQ.AE4h8ZOivsb4SFfrrW0suZ0fXW-XYehZst7QvoppkAc"
}

Response Body : {
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiODQ1MTBkMzAtMWVhYS0xMWViLTliMjctNDNlMjdlMjkzYzQyIiwiZW1haWwiOiJzYWxvbmkuc2FodTExQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic2Fsb25pIn0sImlhdCI6MTYwNDU2NDc4MSwiZXhwIjoxNjA0NTY1NjgxfQ._2-mKXF7_mQrQlDXtvoKtMWYiySEFG-zAxrNw-xo9jI",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiODQ1MTBkMzAtMWVhYS0xMWViLTliMjctNDNlMjdlMjkzYzQyIiwiZW1haWwiOiJzYWxvbmkuc2FodTExQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic2Fsb25pIn0sImlhdCI6MTYwNDU2NDc4MSwiZXhwIjoxNjA3MTU2NzgxfQ.GDMZmpHkRYy-rcwPm8-qNHemS72JDfoBeZ_yVMSvWLc"
    },
    "error": false,
    "message": "Token provided successfully",
    "statusCode": 200,
    "totalRecords": 1
}



for creating csv from Mongodb collection

api link : http://localhost:3080/createCsv

Request Method : GET
Response Body : {
    "data": 's3 path link',
    "error": false,
    "message": "successfully uploaded csv on Aws",
    "statusCode": 200,
    "totalRecords": 1
}


#########################################################################


example of config file separation for dev and prod environments: Config folder (config.json and constants.js)

constants.js

module.exports = {
    crypt: false,
    FALSE: false,
    TRUE: true,
    SUCCESS: 200,
    NOT_ACCEPTABLE: 406,
    AUTH_FAIL: 401,
    ACCESS_FAIL: 403,
    port_no: 3080,
    env: "development" // production for prod build
}



########################################################################


Conversion of callback to promise : convertCallbacktoPromise.js


    
