import json
from http.client import responses


def insert_order(connection, data):
    data = json.loads(data)

    cursor = connection.cursor()

    query = ("INSERT INTO orders "
             "(customer_name, total) "
             "VALUES (%s, %s)")

    cursor.execute(query, (
        data["customer_name"],
        data["total"]
    ))

    connection.commit()

    return {"message": "success"}


def get_all_orders(connection,data):
    data = json.loads(data)
    cursor = connection.cursor()

    query = "SELECT * FROM orders"
    cursor.execute(query ,(
        data["customer_name"],
        data["total"]
    ))

    response = []

    for (order_id, customer_name, total) in cursor:
        response.append({
            "order_id": order_id,
            "customer_name": customer_name,
            "total": total
        })

    return response


def update_order(connection, order):
    cursor = connection.cursor()

    query = """
    UPDATE orders
    SET customer_name = %s, total = %s
    WHERE order_id = %s
    """

    data = (
        order["customer_name"],
        order["total"],
        order["order_id"]
    )

    cursor.execute(query, data)
    connection.commit()

    return True