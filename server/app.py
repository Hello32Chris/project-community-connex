#!/usr/bin/env python3
from models import Client, Store, GoodsService, Transaction
from flask import make_response, request, session
from config import db, bcrypt

# Local imports
from config import app, db

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

#---------------------------------------------------------------------------------------------------VIEW ALL CLIENTS [GET]-------------------
@app.route('/clients', methods=['GET'])
def clients():
    clients = Client.query.all()
    resp = make_response([client.to_dict(rules=('-password_hash', '-transactions.stores.password_hash')) for client in clients], 200)
    return resp

#---------------------------------------------------------------------------------------------------VIEW ALL STORES [GET]-------------------
@app.route('/stores', methods=['GET'])
def stores():
    stores = Store.query.all()
    resp = make_response([store.to_dict(rules=('-password_hash', '-transactions.stores.password_hash')) for store in stores], 200)
    return resp

#---------------------------------------------------------------------------------------------------CLIENTS BY ID [GET]-------------------
@app.route('/clients/<int:id>', methods=['GET', 'DELETE'])
def client_by_id(id):
    client_by_id = Client.query.filter_by(id = id).first()
    if client_by_id:
        if request.method == 'GET':
            resp = make_response(client_by_id.to_dict(rules=('-password_hash', '-transactions.stores.password_hash', '-transactions.client_id')), 200)
        elif request.method == 'DELETE':
            db.session.delete(client_by_id)
            db.session.commit()
            resp = make_response({}, 204)
    else:
        resp = make_response({"error" : "No Client found!"})
    return resp



#---------------------------------------------------------------------------------------------------VIEW ALL TRANSACTIONS [GET]-------------
@app.route('/transactions', methods=['GET'])
def transactions():
    transactions = Transaction.query.all()
    resp = make_response([transaction.to_dict(rules=('-client.password_hash', '-store.password_hash')) for transaction in transactions], 200)
    return resp

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



#---------------------------------------------------------------------------------------------------CREATE STORE [POST]-----------------------
@app.route('/create_store', methods=['POST'])
def create_store():
    form_data = request.get_json()
    new_store = Store(
        name=form_data['name'],
        email=form_data['email'],
    )
    hashed_password = bcrypt.generate_password_hash(form_data['password']).decode('utf-8')
    new_store.password_hash = hashed_password
    db.session.add(new_store)
    db.session.commit()
    resp = make_response(new_store.to_dict(), 201)
    
    return resp

#---------------------------------------------------------------------------------------------------CREATE NEW GOODS/SERVICE [POST]-------------
@app.route('/create_goods_service', methods=['POST'])
def create_goods_service():
    form_data = request.get_json()
    new_goods_service = GoodsService(
        name=form_data['name'],
        price=form_data['price'],
    )
    db.session.add(new_goods_service)
    db.session.commit()
    resp = make_response(new_goods_service.to_dict(), 201)
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
            resp = make_response(client.to_dict(), 201)
        else:
            resp = make_response({"ERROR" : "USER CANNOT LOG IN"}, 400)
    else:
        resp = make_response({"ERROR" : "USER NOT FOUND"}, 404)
    return resp


#---------------------------------------------------------------------------------------------------LOGIN FOR STORE [POST]-------------
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



#---------------------------------------------------------------------------------------------------CREATE NEW CLIENT [POST]-------------
@app.route('/create_client', methods=['POST'])
def create_client():
    form_data = request.get_json()
    new_client = Client(
        name=form_data['name'],
        email=form_data['email'],
    )
    hashed_password = bcrypt.generate_password_hash(form_data['password']).decode('utf-8')
    new_client.password_hash = hashed_password # Hash the password with bcrypt
    db.session.add(new_client)
    db.session.commit()

    resp = make_response(new_client.to_dict(), 201)
    return resp


#---------------------------------------------------------------------------------------------------CREATE TRANSACTION [POST]-------------
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


#--------------------------------------------------------------------------------------------------- SIGNUP METHOD [POST] unfinished-------------
@app.route('/client_signup', methods = ['POST'])
def signup():
    # allow for user to signup new account
    form_data = request.get_json()
    name = form_data['name']
    email = form_data['email']
    password = form_data['password']
    try:
        new_user = Client(
            name=name,
            email=email
        )
        # generates hashed password
        new_user.password_hash = password
        db.session.add(new_user)
        db.session.commit()
        # sets signed in user to session
        session['user_id'] = new_user.id
        resp = make_response(new_user.to_dict(),201)
    except:
        resp = make_response({"ERROR" : "Could not create New Account!"}, 400)
    return resp



# @app.route('/store_signup', methods = ['POST'])
# def signup():
#     # allow for user to signup new account
#     form_data = request.get_json()
#     email = form_data['email']
#     password = form_data['password']
#     try:
#         new_store = Client(
#             email=email
#         )
#         # generates hashed password
#         new_store.password_hash = password
#         db.session.add(new_store)
#         db.session.commit()
#         # sets signed in store to session
#         session['store_id'] = new_store.id
#         resp = make_response(new_store.to_dict(),201)
#     except:
#         resp = make_response({"ERROR" : "Could not create Store account!"}, 400)
#     return resp

# #--------------------------------------------------------------------------------------------------- CHECK CLIENT SESSION [GET]-------------
# @app.route('/check_client_session', methods = ['GET'])
# def check_session():
#     # check current session
#     client_id = session['client_id']
#     client = Client.query.filter(client.id == client_id).first()
#     if client:
#         resp = make_response(client.to_dict(), 200)
#     else:
#         resp = make_response({}, 404)
#     return resp


# #--------------------------------------------------------------------------------------------------- CHECK STORE SESSION [GET]-----------------

# @app.route('/check_store_session', methods = ['GET'])
# def check_session():
#     # check current session
#     store_id = session['store_id']
#     store = Store.query.filter(store.id == store_id).first()
#     if store:
#         resp = make_response(store.to_dict(), 200)
#     else:
#         resp = make_response({}, 404)
#     return resp





if __name__ == '__main__':
    app.run(port=5555, debug=True)
    
    








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