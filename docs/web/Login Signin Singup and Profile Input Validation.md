
|**Page**|**Fields**|**Type**|**Required (Yes/No)**|
| :- | :- | - | :- |
|Signin with email|Email ID|Text|Yes|
|Signin with email|Password|Text|Yes|
|Signin with email|Remember Me check box|Checkbox|No|
|OTP popup|OTP field|Number Field|Yes|
|Signin with Mobile number|Country  code|Dropdown|Yes|
|Signin with Mobile number|Mobile number|Text|Yes|
|Signup with email|Email ID|Text|Yes|
|Signup with email|Terms and conditions checkbox|Checkbox|Yes|
|Signup with Mobile number|Country  code|Dropdown|Yes|
|Signup with Mobile number|Mobile number|Text|Yes|
|Signup with Mobile number|Terms and conditions checkbox|Checkbox|Yes|
|Page 1 - Profile setup -Basic Details|Profile image|File Upload|Yes|
|Page 1 - Profile setup -Basic Details|First name|Text|Yes|
|Page 1 - Profile setup -Basic Details|Last name|Text|Yes|
|Page 1 - Profile setup -Basic Details|Mobile number|Text|Yes|
|Page 1 - Profile setup -Basic Details|Email ID|Text|Yes|
|Page 1 - Profile setup -Basic Details|Address|Text|Yes|
|Page 1 - Profile setup -Basic Details|Country|Dropdown|Yes|
|Page 1 - Profile setup -Basic Details|Postal Code/Pin code|Text|Yes|
|Page 1 - Profile setup -Basic Details|Postal Code/Pin code|Text|Yes|
|Page 1 - Profile setup -Basic Details|Postal Code/Pin code|Text|Yes|
|Page 1 - Profile setup -Basic Details|Skills|Drop down|Yes|
|Page 1 - Profile setup -Basic Details|Portfolio link|Text|No|
|Page 1 - Profile setup -Basic Details|Service Categories|Drop down|Yes|
|Page 1 - Profile setup -Basic Details|Amount|Text|No|



|Page 1 - Profile setup -Basic Details|Amount|Text|No|
| :- | :- | - | :- |
|Profile Setup -Experience Details|Current Designation|Text|Yes|
|Profile Setup -Experience Details|Company/Employer|Text|Yes|
|Profile Setup -Experience Details|Experience|Text|yes|
|Profile Setup -Experience Details|Resume / CV|File upload|yes|
|Profile Setup -Experience Details|Resume / CV|File upload|yes|
|Page 2 - Background Verification|Government Id1|File upload|Yes|
|Page 2 - Background Verification|Government Id2|File upload|Yes|
|Page 2 - Background Verification|Certificate|File upload|Yes|
|Page 3 – Set password|New password|Text|Yes|
|Page 3 – Set password|Confirm New password|Text|Yes|
|Forgot Password|Email ID|Text|Yes|
|Reset Password|New password|Text|Yes|
|Reset Password|Confirm New password|Text|Yes|



|**Rule**|**Validation Rule**|**Lower Limit**|
| :- | :- | :- |
|Email verification|Confirm user email address by sending code to it and asking the user to verify the same code.|10 Characters|
|Password verification|Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.|8 Characters|
|N/A|N/A|N/A|
|OTP verification|only digits|4 Characters|
|Select country Code|Select country code from the Drop down list|N/A|
|Mobile No. Verification|UK accept 11 numbers and India accept 10 numbers|10 Characters|
|Email verification|Confirm user email address by sending code to it and asking the user to verify the same code.|10 Characters|
|Checkbox Selection|Accept Terms & Conditions of the application by selecting the checkbox.|N/A|
|Select country Code|Select country code from the Drop down list|N/A|
|Mobile No. Verification|UK accepts 11 numbers and India accepts 10 numbers|10 Characters|
|Checkbox Selection|Accept Terms & Conditions of the application by selecting the checkbox.|N/A|
|Image Upload|Only valid JPEG format are allowed.|50 KB size|
|First Name Validation|Special Characters and Numbers Not Allowed|2 Characters|
|Last Name Validation|Special Characters and Numbers Not Allowed|2 Characters|
|Mobile No. Verification|UK accept 11 numbers and India accept 10 numbers|10 Characters|
|Email verification|Confirm user email address by sending code to it and asking the user to verify the same code.|10 Characters|
|Address field should allow flexible input with character limit|Only letters, spaces,numbers and special characters such as  / , . - #are allowed.|6 Characters|
|Country  selection|Country must be selected from a predefined list (Drop down)|N/A|
|Postal Code Validation|User must input their respective country code.|Country specific minimum value|
|If country is India|Only 06 numerical characters|06 numbers only for India|
|If country is UK|6 to 8 alphanumeric characters, with a total of 01 Space allowed between the Characters (example W1K 3JP for Central London)|06 alphanumeric characters for UK|
|Skills required|Drop down|N/A|
|Not required|No spaces or special characters outside standard URL format If provided, the link should lead to a publicly accessible page(accept only profile page)|10 Characters|
|Service categories required|Drop down|N/A|
|Not required|Allow number, 10 minimum and maximum 99999||


|Not required|after decimal 2 character allow||
| :- | :- | :- |
|Current Designation|Only letters, spaces|2 Characters|
|Company/Employer verification|Only letters, spaces,numbers and special character (& - / .)|4 Characters|
|Experience  validation|1-99 years  limit|N/A|
|Resume validation|Only valid PDF format are allowed|50 KB size|
|Resume validation|Page min 1 and Max 5|50 KB size|
|Govt. ID  validation|Only valid PDF format are allowed|50 KB size|
|Financial ID  validation|Only valid PDF format are allowed|50 KB size|
|Certificate validation|Only valid PDF format are allowed|50 KB size|
|Password must be verified|Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.|8 Characters|
|Confirm Password verification|Password must match with the password in the previous field.|8 Characters|
|Email  verification|Confirm user email address by sending code to it and asking the user to verify the same code.|10 Characters|
|Password verification|Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.|8 Characters|
|Confirm Password verification|Password must match with the password in the previous field.|8 Characters|



|**Upper Limit**|
| :- |
|100 Characters|
|20 Characters|
|N/A|
|4 Characters|
|N/A|
|11 Characters|
|100 Characters|
|N/A|
|N/A|
|11 Characters|
|N/A|
|350 KB|
|50 Characters|
|50 Characters|
|11 Characters|
|100 Characters|
|50 Characters|
|N/A|
|Country specific maximum value|
|06 numbers only for India|
|08 alphanumeric characters for UK|
|N/A|
|200 Characters|
|N/A|
||


||
| :- |
|50 Characters|
|50 Characters|
|N/A|
|350 KB|
|350 KB|
|350 KB|
|350 KB|
|350 KB|
|20 Characters|
|20 Characters|
|100 Characters|
|20 Characters|
|20 Characters|

Page1
