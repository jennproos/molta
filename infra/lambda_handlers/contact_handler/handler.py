import json
import os
import re

import boto3

ses_client = boto3.client("ses")

RECIPIENT_EMAIL = os.environ["RECIPIENT_EMAIL"]
SENDER_EMAIL = os.environ["SENDER_EMAIL"]

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
VALID_INQUIRY_TYPES = {"Special Order", "Question", "Feedback"}

MAX_NAME_LEN = 100
MAX_EMAIL_LEN = 254
MAX_MESSAGE_LEN = 5000


def _response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body_dict),
    }


def lambda_handler(event, context):
    try:
        payload = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _response(400, {"message": "Invalid request body."})

    # Honeypot: real visitors never fill this hidden field.
    if (payload.get("company") or "").strip():
        return _response(200, {"message": "Thanks for reaching out!"})

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    inquiry_type = (payload.get("inquiryType") or "").strip()
    message = (payload.get("message") or "").strip()

    errors = []
    if not name or len(name) > MAX_NAME_LEN:
        errors.append("name")
    if not email or len(email) > MAX_EMAIL_LEN or not EMAIL_RE.match(email):
        errors.append("email")
    if inquiry_type not in VALID_INQUIRY_TYPES:
        errors.append("inquiryType")
    if not message or len(message) > MAX_MESSAGE_LEN:
        errors.append("message")

    if errors:
        return _response(400, {"message": "Invalid submission.", "fields": errors})

    subject = f"Molta Contact Form: {inquiry_type} from {name}"
    body_text = (
        f"Name: {name}\nEmail: {email}\nInquiry Type: {inquiry_type}\n\n"
        f"Message:\n{message}\n"
    )

    ses_client.send_email(
        Source=SENDER_EMAIL,
        Destination={"ToAddresses": [RECIPIENT_EMAIL]},
        Message={
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {"Text": {"Data": body_text, "Charset": "UTF-8"}},
        },
        ReplyToAddresses=[email],
    )

    return _response(200, {"message": "Thanks for reaching out! We'll be in touch soon."})
