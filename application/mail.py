# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText
# from email.mime.base import MIMEBase
# from email import encoders
# from jinja2 import Template

# SMTP_SERVER_HOST = "smtp.gmail.com"
# SMTP_SERVER_PORT = 587
# SENDER_ADDRESS = "23f3004142@ds.study.iitm.ac.in"
# SENDER_PASSWORD = "rgvxheme dfqksmqm"  # your app password (without spaces is also fine)


# def send_email(to_address, subject, message, content = "html", attachment_file = None):   #default content -> html
#     msg = MIMEMultipart()
#     msg['From'] = SENDER_ADDRESS
#     msg['To'] = to_address
#     msg['Subject'] = subject

#     if content == "html":
#         msg.attach(MIMEText(message, "html"))
#     else:
#         msg.attach(MIMEText(message, "plain"))

#     if attachment_file:
#         with open(attachment_file, 'rb') as attachment:
#             part = MIMEBase("application", "octet-stream") # Add file as application/octet-stream
#             part.set_payload(attachment.read())

#         encoders.encode_base64(part) # email attachments are sent as base64 encoded.
#         part.add_header("Content-Disposition", f"attachment; filename = {attachment_file}") # refer https://www.ietf.org/rtc/rtc2183.txt
#         msg.attach(part) #add attachment to message

#     s = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
#     s.starttls()  # secure the connection
#     s.login(SENDER_ADDRESS, SENDER_PASSWORD)
#     s.send_message(msg)
#     s.quit()


#     return True

# import requests


# RESEND_API_KEY = "re_KgEwEHQb_QKZ4L5NcpVaGUNkWGKzVjuiQ"  # Store in env variables

# def send_email(to_address, subject, message, content="html", attachment_file=None):
#     url = "https://api.resend.com/emails"
#     headers = {
#         "Authorization": f"Bearer {RESEND_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     data = {
#         "from": "Quiz Master <noreply@yourdomain.com>",
#         "to": [to_address],
#         "subject": subject,
#         "html": message if content == "html" else None,
#         "text": message if content != "html" else None
#     }

#     # For attachments, Resend supports uploading files as base64
#     if attachment_file:
#         with open(attachment_file, "rb") as f:
#             import base64
#             file_content = base64.b64encode(f.read()).decode()
#         data["attachments"] = [
#             {
#                 "filename": attachment_file,
#                 "content": file_content
#             }
#         ]

#     response = requests.post(url, headers=headers, json=data)

#     return response.status_code == 200

# import requests
# import base64
# import os

# RESEND_API_KEY = "re_KgEwEHQb_QKZ4L5NcpVaGUNkWGKzVjuiQ"  # Store in environment variables

# def send_email(to_address, subject, message, content="html", attachment_file=None):
#     url = "https://api.resend.com/emails"
#     headers = {
#         "Authorization": f"Bearer {RESEND_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     data = {
#         "from": "Quiz Master <onboarding@resend.dev>",  # Use verified domain here
#         "to": [to_address],
#         "subject": subject,
#         "html": message if content == "html" else None,
#         "text": message if content != "html" else None
#     }

#     # Add attachment if provided
#     if attachment_file:
#         with open(attachment_file, "rb") as f:
#             file_content = base64.b64encode(f.read()).decode()
#         data["attachments"] = [{
#             "filename": os.path.basename(attachment_file),
#             "content": file_content
#         }]

#     response = requests.post(url, headers=headers, json=data)
#     if response.status_code in (200, 202):
#         print(f"[OK] Email sent to {to_address}")
#         return True
#     else:
#         print(f"[FAIL] Email to {to_address} failed: {response.text}")
#         return False
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
import base64

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
  # Store securely in env

def send_email(to_address, subject, message, content="html", attachment_file=None):
    # Build email
    email = Mail(
        from_email="23f3004142@ds.study.iitm.ac.in",   # must be verified in SendGrid
        to_emails=to_address,
        subject=subject,
        html_content=message if content == "html" else None,
        plain_text_content=message if content != "html" else None
    )

    # Add attachment if provided
    if attachment_file:
        with open(attachment_file, "rb") as f:
            file_data = f.read()
            encoded_file = base64.b64encode(file_data).decode()

        attached_file = Attachment(
            FileContent(encoded_file),
            FileName(os.path.basename(attachment_file)),
            FileType("application/octet-stream"),
            Disposition("attachment")
        )
        email.attachment = attached_file

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(email)

        if response.status_code in (200, 202):
            print(f"[OK] Email sent to {to_address}")
            return True
        else:
            print(f"[FAIL] Email to {to_address} failed: {response.status_code} {response.body}")
            return False
    except Exception as e:
        print(f"[FAIL] Email to {to_address} failed: {e}")
        return False
