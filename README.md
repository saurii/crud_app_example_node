Crdud Application with Simple example
It includes following modules:
- Registration
- Login
- Post data by admin only
- Get Post by pagination
- Update and Delete Post by admin

Below are the end points and details:

1. Registration
End Point: /api/v1/student
Method: POST
Request example:
{
    "firstname": "akshay",
    "middlename": null,
    "lastname": "bangar",
    "roleid": 2,
    "mobileno": "9876543210",
    "username": "akshay@123",
    "password": "akshay@123",
    "createdby": "9876543210"
}

2. Login
End Point: /api/v1/user/login
Method: POST
Request example:
{
    "username": "admin@",
    "password": "admin@"
}

3. Post Data
End Point: /api/v1/post
Method: POST
Headers: 
{
    Content-Type: "application/json",
    Authorization: token
}
Request example:
{
    "title": "first post",
    "postdescription": "post description added here",
    "createdby": "admin@"
}

4. Get Post
End Point: /api/v1/post
Method: GET
Headers: 
{
    Content-Type: "application/json",
    Authorization: token
}
Request example:
Query parameters
{
    "page": 1,
    "pagesize": 100
}

5. Update post
End Point: /api/v1/post
Method: PUT
Headers: 
{
    Content-Type: "application/json",
    Authorization: token
}
Request example:
{
    "postid": 1,
    "title": "first poste updated",
    "postdescription": null,
    "lastmodifiedby": "admin@"
}

6. Delete Post
End Point: /api/v1/post
Method: DELETE
Headers: 
{
    Content-Type: "application/json",
    Authorization: token
}
Request example:
{
    "postid": 1,
    "lastmodifiedby": "admin@"
}