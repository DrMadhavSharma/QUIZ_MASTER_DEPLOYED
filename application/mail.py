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
#BREVO api implementation
# import os
# import base64
# import sib_api_v3_sdk
# from sib_api_v3_sdk.rest import ApiException
# BREVO_API_KEY = os.getenv("BREVO_API_KEY", "").strip()

# def send_email(to_address, subject, message, content="html", attachment_file=None):
#     configuration = sib_api_v3_sdk.Configuration()
#     configuration.api_key['api-key'] = BREVO_API_KEY

#     api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
#         sib_api_v3_sdk.ApiClient(configuration)
#     )

#     email_data = {
#         "to": [{"email": to_address}],
#         "sender": {"email": "madhavsharma8194@gmail.com"},  # MUST be verified in Brevo
#         "subject": subject,
#     }

#     # Content handling
#     if content == "html":
#         email_data["htmlContent"] = message
#     else:
#         email_data["textContent"] = message

#     # Attachment handling
#     if attachment_file:
#         with open(attachment_file, "rb") as f:
#             encoded_file = base64.b64encode(f.read()).decode()

#         email_data["attachment"] = [{
#             "content": encoded_file,
#             "name": os.path.basename(attachment_file)
#         }]

#     try:
#         api_instance.send_transac_email(email_data)
#         print(f"[OK] Email sent to {to_address}")
#         return True
#     except ApiException as e:
#         print(f"[FAIL] Email to {to_address} failed: {e}")
#         return False
#BREVO smtp implementation
import os
import smtplib
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

SMTP_SERVER = "smtp-relay.brevo.com"
SMTP_PORT = 587
SMTP_LOGIN = os.getenv("BREVO_SMTP_LOGIN")      # a0ef99001@smtp-brevo.com
SMTP_PASSWORD = os.getenv("BREVO_SMTP_KEY")     # SMTP key

SENDER_EMAIL = "noreply@yourdomain.com"  # can be unverified for now


def send_email(to_address, subject, message, content="html", attachment_file=None):
    if not SMTP_LOGIN or not SMTP_PASSWORD:
        raise RuntimeError("Brevo SMTP credentials missing")

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_address
    msg["Subject"] = subject

    # Body
    if content == "html":
        msg.attach(MIMEText(message, "html"))
    else:
        msg.attach(MIMEText(message, "plain"))

    # Attachment
    if attachment_file:
        with open(attachment_file, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())

        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f'attachment; filename="{os.path.basename(attachment_file)}"'
        )
        msg.attach(part)

    # SMTP send
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(SMTP_LOGIN, SMTP_PASSWORD)
    server.send_message(msg)
    server.quit()

    print(f"[OK] SMTP email sent to {to_address}")
    return True
