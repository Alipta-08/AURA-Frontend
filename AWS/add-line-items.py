import json
import os
import logging
import psycopg2
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

DB_HOST     = os.environ['DB_HOST']
DB_NAME     = os.environ['DB_NAME']
DB_USER     = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_PORT     = 5432

def connect_db():
    return psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )


def lambda_handler(event, context):
    logger.info("Raw event: %s", json.dumps(event))

    # ------------------------------------------------------------------
    # 1)  Normalise Bedrock parameters  (exactly the style user requested)
    # ------------------------------------------------------------------
    if isinstance(event.get('parameters'), list):
        parameters = {param['name']: param['value'] for param in event['parameters']}
    else:
        parameters = event.get('parameters', {})

    logger.info("Normalized parameters: %s", json.dumps(parameters, indent=2))

    # ------------------------------------------------------------------
    # 2)  Extract parameters for a line‑item
    # ------------------------------------------------------------------
    requisition_id = parameters.get('requisition_id', '')
    item_name      = parameters.get('item_name', '')
    quantity       = parameters.get('quantity', '')
    material_code  = parameters.get('material_code', '')

    # ------------------------------------------------------------------
    # 3)  Basic validation
    # ------------------------------------------------------------------
    missing = [k for k in ['requisition_id', 'item_name', 'quantity'] if not parameters.get(k)]
    if missing:
        return _agent_error(event, f"Missing required field(s): {', '.join(missing)}", 400)

    try:
        quantity_int = int(quantity)
    except ValueError:
        return _agent_error(event, "Quantity must be an integer", 400)

    # ------------------------------------------------------------------
    # 4)  Insert into DB
    # ------------------------------------------------------------------
    conn = cur = None
    try:
        conn = connect_db()
        cur  = conn.cursor()

        insert_sql = """
            INSERT INTO requisitions_lineitems (
                requisition_id, item_name, material_code, quantity, created_at
            )
            VALUES (%s, %s, %s, %s, %s)
        """
        cur.execute(insert_sql, (
            requisition_id,
            item_name,
            material_code,
            quantity_int,
            datetime.utcnow()
        ))
        conn.commit()

    except Exception as err:
        logger.error("DB error: %s", err, exc_info=True)
        return _agent_error(event, f"Database error: {err}", 500)
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    # ------------------------------------------------------------------
    # 5)  Success response back to Bedrock Agent
    # ------------------------------------------------------------------
    body_text = (
        f"✓ Added '{item_name}' (Qty {quantity_int}) to requisition {requisition_id}."
    )

    return {
        "messageVersion": "1.0",
        "response": {
            "actionGroup": event.get("actionGroup"),
            "function":    event.get("function"),
            "functionResponse": {
                "responseBody": {
                    "TEXT": {"body": body_text},
                    "requisition_id": requisition_id,
                    "item_name": item_name,
                    "quantity": str(quantity_int),
                    "material_code": material_code
                }
            }
        }
    }


# ------------------------ helper for error replies --------------------

def _agent_error(event, message, status_code=400):
    return {
        "messageVersion": "1.0",
        "response": {
            "actionGroup": event.get("actionGroup"),
            "function":    event.get("function"),
            "functionResponse": {
                "responseBody": {
                    "TEXT": {"body": message}
                }
            }
        },
        "statusCode": status_code
    }
