import json
import os
import re

import boto3

ses_client = boto3.client("ses")

RECIPIENT_EMAIL = os.environ["RECIPIENT_EMAIL"]
SENDER_EMAIL = os.environ["SENDER_EMAIL"]

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
VALID_SERVICES = {"pastryBox", "sandwiches", "breadSubscription"}
VALID_FULFILLMENT = {"Pickup", "Delivery"}

SERVICE_LABELS = {
    "pastryBox": "Pastry Box",
    "sandwiches": "Lunch Sandwiches (Group Order)",
    "breadSubscription": "Bread & English Muffin Subscription",
}

MAX_NAME_LEN = 100
MAX_EMAIL_LEN = 254
MAX_PHONE_LEN = 30
MAX_NOTES_LEN = 2000


def _response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body_dict),
    }


def _format_pastry_box_details(details):
    lines = []
    if details.get("purchaseType"):
        lines.append(f"Purchase type: {details['purchaseType']}")
    if details.get("frequency"):
        lines.append(f"Frequency: {details['frequency']}")
    if details.get("size"):
        lines.append(f"Size: {details['size']}")
    pastries = details.get("pastries")
    if isinstance(pastries, list) and pastries:
        lines.append(f"Pastries: {', '.join(str(p) for p in pastries)}")
    return lines


def _format_sandwiches_details(details):
    lines = []
    if details.get("preferredDate"):
        lines.append(f"Preferred date: {details['preferredDate']}")
    sandwiches = details.get("sandwiches")
    if isinstance(sandwiches, list) and sandwiches:
        lines.append("Sandwiches:")
        for item in sandwiches:
            if not isinstance(item, dict):
                continue
            name = item.get("name", "Unknown")
            quantity = item.get("quantity", "?")
            lines.append(f"  - {name} x {quantity}")
    return lines


def _format_bread_subscription_details(details):
    lines = []
    if details.get("frequency"):
        lines.append(f"Frequency: {details['frequency']}")
    products = details.get("products")
    if isinstance(products, list) and products:
        lines.append(f"Products: {', '.join(str(p) for p in products)}")
    return lines


DETAIL_FORMATTERS = {
    "pastryBox": _format_pastry_box_details,
    "sandwiches": _format_sandwiches_details,
    "breadSubscription": _format_bread_subscription_details,
}


def lambda_handler(event, context):
    try:
        payload = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _response(400, {"message": "Invalid request body."})

    # Honeypot: real visitors never fill this hidden field.
    if (payload.get("company") or "").strip():
        return _response(200, {"message": "Thanks for your request!"})

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    phone = (payload.get("phone") or "").strip()
    service = (payload.get("service") or "").strip()
    fulfillment = (payload.get("fulfillment") or "").strip()
    notes = (payload.get("notes") or "").strip()
    details = payload.get("details") if isinstance(payload.get("details"), dict) else {}

    errors = []
    if not name or len(name) > MAX_NAME_LEN:
        errors.append("name")
    if not email or len(email) > MAX_EMAIL_LEN or not EMAIL_RE.match(email):
        errors.append("email")
    if phone and len(phone) > MAX_PHONE_LEN:
        errors.append("phone")
    if service not in VALID_SERVICES:
        errors.append("service")
    if fulfillment not in VALID_FULFILLMENT:
        errors.append("fulfillment")
    if notes and len(notes) > MAX_NOTES_LEN:
        errors.append("notes")

    if errors:
        return _response(400, {"message": "Invalid submission.", "fields": errors})

    service_label = SERVICE_LABELS[service]
    detail_lines = DETAIL_FORMATTERS[service](details)

    subject = f"Molta Service Request: {service_label} from {name}"
    body_lines = [
        f"Service: {service_label}",
        f"Name: {name}",
        f"Email: {email}",
    ]
    if phone:
        body_lines.append(f"Phone: {phone}")
    body_lines.append(f"Fulfillment: {fulfillment}")
    body_lines.extend(detail_lines)
    if notes:
        body_lines.append(f"\nNotes:\n{notes}")

    ses_client.send_email(
        Source=SENDER_EMAIL,
        Destination={"ToAddresses": [RECIPIENT_EMAIL]},
        Message={
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {"Text": {"Data": "\n".join(body_lines), "Charset": "UTF-8"}},
        },
        ReplyToAddresses=[email],
    )

    return _response(200, {"message": "Thanks for your request! We'll be in touch soon."})
