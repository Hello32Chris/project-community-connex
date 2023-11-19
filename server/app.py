#!/usr/bin/env python3
from models import Client, Store, GoodsService, Transaction
from flask import make_response, request, session
from config import db, bcrypt
import random, string

# Local imports
from config import app, db

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

#---------------------------------------------------------------------------------------------------VIEW ALL CLIENTS [GET]-------------------
@app.route('/clients', methods=['GET'])
def clients():
    clients = Client.query.all()
    resp = make_response([client.to_dict(rules=('-_password_hash', '-transactions.stores._password_hash')) for client in clients], 200)
    return resp

#--------------------------------------------------------------------------------------------------- VIEW ALL STORES [GET]-------------------
@app.route('/stores', methods=['GET'])
def stores():
    stores = Store.query.all()
    resp = make_response([store.to_dict(rules=('-_password_hash', '-transactions.stores._password_hash')) for store in stores], 200)
    return resp

#--------------------------------------------------------------------------------------------------- CLIENTS BY ID [GET]-------------------
@app.route('/clients/<int:id>', methods=['GET', 'DELETE'])
def client_by_id(id):
    client_by_id = Client.query.filter_by(id = id).first()
    if client_by_id:
        if request.method == 'GET':
            resp = make_response(client_by_id.to_dict(rules=('-_password_hash', '-transactions.store._password_hash', '-transactions.store.subscribed_clients', '-transactions.client_id')), 200)
        elif request.method == 'DELETE':
            db.session.delete(client_by_id)
            db.session.commit()
            resp = make_response({}, 204)
    else:
        resp = make_response({"error" : "No Client found!"})
    return resp


#--------------------------------------------------------------------------------------------------- STORES BY ID [GET]-------------------
@app.route('/stores/<int:id>', methods=['GET', 'DELETE'])
def store_by_id(id):
    store_by_id = Store.query.filter_by(id = id).first()
    if store_by_id:
        if request.method == 'GET':
            resp = make_response(store_by_id.to_dict(rules=('-_password_hash', '-transactions.client.subscribed_stores', '-transactions.client._password_hash', '-transactions.store_id')), 200)
        elif request.method == 'DELETE':
            db.session.delete(store_by_id)
            db.session.commit()
            resp = make_response({}, 204)
    else:
        resp = make_response({"error" : "No Store found!"})
    return resp


#---------------------------------------------------------------------------------------------------VIEW ALL TRANSACTIONS [GET]-------------
@app.route('/transactions', methods=['GET'])
def transactions():
    transactions = Transaction.query.all()
    resp = make_response([transaction.to_dict(rules=('-client._password_hash', '-store._password_hash')) for transaction in transactions], 200)
    return resp


#---------------------------------------------------------------------------------------------------LOGIN FOR CLIENT [POST]-------------
@app.route('/client_login', methods = ['POST'])
def client_login():
    # check if user can signin to account
    form_data = request.get_json()
    
    email = form_data['email']
    password = form_data['password']
    
    client = Client.query.filter_by(email = email).first()
    if client:
        # authenticate client
        is_authenticated = client.authenticate(password)
        if is_authenticated:
            session['client_id'] = client.id
            resp = make_response({'Message' : 'Login Successful', 'client' : client.to_dict()}, 201)
        else:
            resp = make_response({"ERROR" : "USER CANNOT LOG IN"}, 400)
    else:
        resp = make_response({"ERROR" : "USER NOT FOUND"}, 404)
    return resp


#--------------------------------------------------------------------------------------------------- LOGIN FOR STORE [POST]-------------
@app.route('/store_login', methods = ['POST'])
def store_login():
    # check if user can signin to account
    form_data = request.get_json()
    
    email = form_data['email']
    password = form_data['password']
    
    store = Store.query.filter_by(email = email).first()
    if store:
        # authenticate store
        is_authenticated = store.authenticate(password)
        if is_authenticated:
            session['store_id'] = store.id
            resp = make_response(store.to_dict(), 201)
        else:
            resp = make_response({"ERROR" : "USER CANNOT LOG IN"}, 400)
    else:
        resp = make_response({"ERROR" : "USER NOT FOUND"}, 404)
    return resp


#--------------------------------------------------------------------------------------------------- LOG OUT FOR CLIENT & STORE   [POST]-------------
@app.route('/logout', methods=['GET'])
def logout():
    session.pop('client_id', None)
    resp = make_response({'message': 'Logged out successfully'}, 200)
    return resp



#--------------------------------------------------------------------------------------------------- CREATE TRANSACTION [POST]-------------
@app.route('/create_transaction', methods=['POST'])
def create_transaction():
    form_data = request.get_json()
    new_transaction = Transaction(
        total_amount=form_data['total_amount'],
        store_id=form_data['store_id'],
        client_id=form_data['client_id'],
    )
    db.session.add(new_transaction)
    db.session.commit()

    resp = make_response(new_transaction.to_dict(), 201)
    return resp


#--------------------------------------------------------------------------------------------------- NEW CLIENT SIGNUP [POST] -------------
@app.route('/client_signup', methods = ['POST'])
def client_signup():
    # allow for client to signup new account
    form_data = request.get_json()
    name = form_data['name']
    email = form_data['email']
    password = form_data['password']
    try:
        new_client = Client(
            name=name,
            email=email
        )
        # generates hashed password
        new_client.password_hash = password
        db.session.add(new_client)
        db.session.commit()
        # sets signed in client to session
        session['client_id'] = new_client.id
        resp = make_response(new_client.to_dict(),201)
    except:
        resp = make_response({"ERROR" : "Could not create New Account!"}, 400)
    return resp


# #--------------------------------------------------------------------------------------------------- NEW STORE SIGNUP [POST] -------------
@app.route('/store_signup', methods = ['POST'])
def store_signup():
    # Wrote a code that will create a random unique 5-letter code for every new store --- clients can then use code to subscribe
    def generate_store_code():
        return ''.join(random.choices(string.ascii_uppercase, k=5))

    def generate_unique_store_code():
        while True:
            new_store_code = generate_store_code()
            existing_store = Store.query.filter_by(code=new_store_code).first()
            if not existing_store:
                return new_store_code
    # allow for user to signup new account
    form_data = request.get_json()
    name = form_data['name']
    email = form_data['email']
    password = form_data['password']
    code = generate_unique_store_code()
    try:
        new_store = Store(
            name=name,
            email=email,
            code = code
        )
        # generates hashed password
        new_store.password_hash = password
        db.session.add(new_store)
        db.session.commit()
        # sets signed in store to session
        session['store_id'] = new_store.id
        resp = make_response(new_store.to_dict(),201)
    except:
        resp = make_response({"ERROR" : "Could not create Store account!"}, 400)
    return resp


#---------------------------------------------------------------------------------------------------CREATE NEW GOODS/SERVICE [POST]-------------
@app.route('/create_goods_service', methods=['POST'])
def create_goods_service():
    form_data = request.get_json()
    name=form_data['name']
    image=form_data['image']
    price=form_data['price']
    store_id=session.get('store_id')
    
    # Create a new GoodsService
    new_goods_service = GoodsService(
        name=name,
        image=image,
        price=price,
        store_id=store_id    
    )
    # Validate data (you may want to add more robust validation)
    if name is None or price is None or store_id is None:
        return make_response({'error': 'Invalid data'}, 400)


    # Add the new GoodsService to the database
    db.session.add(new_goods_service)
    db.session.commit()

    return make_response({'message': 'GoodsService created successfully'}, 201)


# #--------------------------------------------------------------------------------------------------- CLIENT SUBSCRIBE TO STORE [POST]-------------
@app.route('/subscribe', methods=['POST'])
def subscribe_to_store():
    form_data = request.get_json()

    # I made it so it grabs the client currently logged in by default via the session
    client_id = session.get('client_id')
    store_code = form_data['store_code']

    # HERE I Retrieve the client and store objects
    client = Client.query.get(client_id)
    store = Store.query.filter_by(code=store_code).first()

    if client and store:
        # Check if the client is already subscribed to the store
        if store not in client.subscribed_stores:
            client.subscribed_stores.append(store)
            db.session.commit()
            return make_response({'message': f'Client {client_id} subscribed to store {store_code} successfully'})
        else:
            return make_response({'message': f'Client {client_id} is already subscribed to store {store_code}'})
    else:
        return make_response({'error': 'Invalid client ID or store code'}), 404



#--------------------------------------------------------------------------------------------------- CHECK CLIENT SESSION [GET]-------------
@app.route('/check_client_session', methods = ['GET'])
def check_client_session():
    # check current session
    client_id = session['client_id']
    client = Client.query.filter(client.id == client_id).first()
    if client:
        resp = make_response(client.to_dict(), 200)
    else:
        resp = make_response({}, 404)
    return resp


#--------------------------------------------------------------------------------------------------- CHECK STORE SESSION [GET]-----------------

@app.route('/check_store_session', methods = ['GET'])
def check_store_session():
    # check current session
    store_id = session['store_id']
    store = Store.query.filter(store.id == store_id).first()
    if store:
        resp = make_response(store.to_dict(), 200)
    else:
        resp = make_response({}, 404)
    return resp





if __name__ == '__main__':
    app.run(port=5555, debug=True)
    
    

#--------------------------------------------------------------------------------------------------- CREATE NEW CLIENT [POST]-------------
# @app.route('/create_client', methods=['POST'])
# def create_client():
#     form_data = request.get_json()
#     new_client = Client(
#         name=form_data['name'],
#         email=form_data['email'],
#     )
#     hashed_password = bcrypt.generate_password_hash(form_data['password']).decode('utf-8')
#     new_client.password_hash = hashed_password # Hash the password with bcrypt
#     db.session.add(new_client)
#     db.session.commit()

#     resp = make_response(new_client.to_dict(), 201)
#     return resp



#---------------------------------------------------------------------------------------------------TRANSACTIONS BY STORE ID [GET]-------------
# @app.route('/transactions/<int:store_id>', methods=['GET'])
# def transactions_by_store(store_id):
#     store_by_id = Store.query.filter_by(id=store_id).first()
#     if store_by_id:
#         transactions = Transaction.query.filter_by(store_id=store_id).all()
#         print(transactions)

#     serialized_transactions = [transaction.to_dict() for transaction in transactions]
    
    
#     response_data = {
#         'store': store_by_id.to_dict(),
#         'transactions': serialized_transactions
#     }

#     # You might want to use make_response instead of jsonify for more customization
#     # response = make_response({jsonify(response_data)}, 200)

#     return jsonify(response_data)



# @app.route('/create_goods_service', methods=['POST'])
# def create_goods_service():
#     form_data = request.get_json()
#     new_goods_service = GoodsService(
#         name=form_data['name'],
#         price=form_data['price'],
#     )
#     db.session.add(new_goods_service)
#     db.session.commit()
#     resp = make_response(new_goods_service.to_dict(), 201)
#     return resp



# @app.route('/')
# def index():
#     return '<h1>Project Server</h1>'



# #-----------------CREATE_USER--------------------------
# @app.route('/create_user', methods=['POST'])
# def create_user():
#     form_data = request.get_json()
#     new_user = User(
#         username=form_data['username'],
#         email=form_data['email'],
#         is_store=form_data['is_store']
#         )
#     hashed_password = bcrypt.generate_password_hash(form_data['password']).decode('utf-8')
#     new_user.password_hash = hashed_password
#     db.session.add(new_user)
#     db.session.commit()
#     return make_response({'message': 'User created successfully'}, 201)


# #-----------------CREATE_GOODS_SERVICE--------------------------
# @app.route('/create_goods_service', methods=['POST'])
# def create_goods_service():
#     form_data = request.get_json()
#     new_goods_service = GoodsService(
#         name=form_data['name'],
#         price=form_data['price'],
#         store_id=form_data['store_id']
#         )
#     db.session.add(new_goods_service)
#     db.session.commit()
#     return make_response({}, 201)


# #-----------------VIEW_TRANSACTIONS--------------------------
# @app.route('/view_transactions/<int:user_id>', methods=['GET'])
# def view_transactions(user_id):
#     user = User.query.filter_by(id == user_id).first()
#     if user:
#         if request.method == 'GET':
#             transactions = user.transactions
#             resp = [transaction.to_dict(rules='', ) for transaction in transactions]
#             return make_response(resp, 200)
#     else:
#         resp = make_response({ "errors": "No Transactions Found!"}, 404)