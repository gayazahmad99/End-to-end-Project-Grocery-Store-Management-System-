from flask import Flask, request, jsonify, render_template
from sql_connection import get_sql_connection
import json

import uom_dao
import products_dao
import orders_dao

app = Flask(__name__)

connection = get_sql_connection()

# ================= FRONTEND PAGES =================
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/productsPage')
def products_page():
    return render_template('products.html')

@app.route('/ordersPage')
def orders_page():
    return render_template('orders.html')


# ================= API ROUTES =================
@app.route('/getUOM', methods=['GET'])
def get_uom():
    response = uom_dao.get_uoms(connection)
    return jsonify(response)


@app.route('/getProducts', methods=['GET'])
def get_all_products():
    products = products_dao.get_all_products(connection)
    return jsonify(products)


@app.route('/insertProduct', methods=['POST'])
def insert_new_product():
    request_payload = request.get_json()   # ✅ FIXED
    product_id = products_dao.insert_new_product(connection, request_payload)
    return jsonify({'product_id': product_id})

@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    request_payload = json.loads(request.form['data'])
    product_id = request_payload['product_id']

    response = products_dao.delete_product(connection, product_id)

    return jsonify(response)


@app.route('/updateProduct', methods=['POST'])
def update_product():
    request_payload = json.loads(request.form['data'])

    response = products_dao.update_product(connection, request_payload)

    return jsonify(response)



@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    orders = orders_dao.get_all_orders(connection)
    return jsonify(orders)


@app.route('/insertOrder', methods=['POST'])
def insert_order():
    request_payload = request.get_json()   # ✅ FIXED
    order_id = orders_dao.insert_order(connection, request_payload)
    return jsonify({'order_id': order_id})


@app.route('/updateOrder', methods=['POST'])
def update_order():
    request_payload = request.get_json()

    orders_dao.update_order(connection, request_payload)

    return jsonify({'status': 'Updates Orders success'})




if __name__ == "__main__":
    print("🚀 Server running........................")
    app.run(debug=True)
    print("End server running/////////////////////////////")