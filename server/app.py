#!/usr/bin/env python3
from models import Client, Store, GoodsService, Transaction, StoreProfile, subscription_table, cart_table
from flask import make_response, request, session, abort, g
from config import app, db, bcrypt
import random, string

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

#---------------------------------------------------------------------------------------------------VIEW ALL CLIENTS [GET]-------------------
@app.route('/clients', methods=['GET'])
def clients():
    clients = Client.query.all()
    resp = make_response([client.to_dict(rules=('-client_carts.store._password_hash', 
                                                '-client_carts.store.transactions',
                                                '-subscribed_stores.goods_services',
                                                '-_password_hash', 
                                                '-subscribed_stores._password_hash', 
                                                '-transactions.store._password_hash', 
                                                '-transactions.store.goods_services',
                                                '-transactions.client_id', 
                                                '-transactions.store.subscribed_clients')
                                         ) for client in clients], 200)
    return resp

#---------------------------------------------------------------------------------------------------VIEW ALL STORE PROFILES [GET]-------------------
@app.route('/profiles', methods=['GET'])
def profiles():
    profiles = StoreProfile.query.all()
    resp = make_response([profile.to_dict(rules=('-stores._password_hash', '-stores.subscribed_clients', '-stores.transactions' )) for profile in profiles], 200)
    return resp

#--------------------------view all carts----------------------------------------------------------VIEW ALL CARTS [GET]-------------------
@app.route('/carts', methods=['GET'])
def carts():
       # Query the carts using the ORM
    carts = db.session.query(cart_table).all()

    # Serialize the cart data
    cart_data = [{'client_id': cart.client_id, 'goods_service_id': cart.goods_service_id} for cart in carts]

    # Prepare the response data
    response_data = {
        'carts': cart_data
    }

    return make_response(response_data, 200)



#----------------------------------------------------------------------------------------------------------------- ADD TO CLIENT CART [POST]-------------------
@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    try:
        form_data = request.get_json()

        client_id = form_data['client_id']
        goods_service_id = form_data['goods_service_id']
        
        print(client_id, goods_service_id)

        # Check if both client_id and goods_service_id are provided
        if not client_id or not goods_service_id:
            resp = make_response({'error': 'Both client_id and goods_service_id are required'}, 400)

        # Check if the client and goods_service exist
        client = Client.query.filter_by(id = client_id).first()
        goods_service = GoodsService.query.filter_by(id = goods_service_id).first()
        
        client.client_carts.append(goods_service)
        db.session.commit()

        print(client, goods_service)
        if not client or not goods_service:
            resp = make_response({'error': 'Client or goods service not found'}, 404)
        
        # goods_service.goods_carts.append(client)

        resp = make_response({'message': 'Goods service added to the cart successfully'}, 200)

    except Exception as e:
        resp = make_response({'error': str(e)}, 500)
    return resp

# -------------------------------------------------------------------------------------------------- DELETE CART ITEMS --------------------------
@app.route('/delete_cart_items', methods=['POST'])
def delete_cart_items():
    try:
        form_data = request.get_json()
        client_id = int(form_data['clientId'])
        goods_id = int(form_data['goods_id'])
        print(client_id, goods_id)

        if not client_id and goods_id:
            return make_response({'error': 'Client ID is required'}, 400)

        # Delete items from cart_table based on client_id
        db.session.execute(cart_table.delete().where((cart_table.c.client_id == client_id) & (cart_table.c.goods_service_id == goods_id)))
        db.session.commit()

        return make_response({'message': 'Cart items deleted successfully'}, 200)

    except Exception as e:
        return make_response({'error': str(e)}, 500)

#--------------------------------------------------------------------------------------------------- VIEW ALL STORES [GET]-------------------
@app.route('/stores', methods=['GET'])
def stores():
    stores = Store.query.all()
    resp = make_response([store.to_dict(rules=('-_password_hash', '-subscribed_clients._password_hash', '-transactions.stores._password_hash', '-transactions.client._password_hash', '-transactions.client.subscribed_stores')) for store in stores], 200)
    return resp


#--------------------------------------------------------------------------------------------------- GET ALL SUBSCRIPTIONS -----------------
@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    # Query the subscription table to get all subscriptions
    subscriptions = db.session.query(subscription_table).all()

    # Extract client_ids and store_ids from the subscriptions
    subscriptions_data = [{'client_id': subscription.client_id, 'store_id': subscription.store_id} for subscription in subscriptions]

    # Create a JSON response
    response_data = {
        'subscriptions': subscriptions_data
    }

    return make_response(response_data, 200)

# # ----------------------------------------------------------------------------------------------------- DELETE SUBSCRIPTION BY ID------------------
@app.route('/subscriptions', methods=['DELETE'])
def delete_subscriptions():
    session = db.session
    data = request.get_json()
    client_id = data.get('client_id')
    store_id = data.get('store')
    
    if client_id is None or store_id is None:
        resp = make_response({ 'error' : 'client_id and store_id are required in the request'}, 400)
        
    try:
        subscription = session.query(subscription_table).filter_by(client_id=client_id, store_id=store_id).first()
        if subscription:
            session.delete(subscription)
            session.commit()
            
            store = session.query(Store).filter_by(id=store_id).first()
            if store:
                store.subscribed_clients = [client for client in store.subscribed_clients if client.id != client_id]
            resp = make_response({ 'message' : 'Subscription deleted successfully'}, 200)
            return resp
        else:
            resp = make_response({ 'error' : 'Subscription not found' }, 404)
            return resp
    except Exception as e:
        session.rollback()
        resp = make_response({ 'error' : str(e)}, 500)
        return resp
    finally:
        session.close()    
    

#--------------------------------------------------------------------------------------------------- CLIENTS BY ID [GET, PATCH, DELETE]-------------------
@app.route('/clients/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def client_by_id(id):
    client_by_id = Client.query.filter_by(id = id).first()
    if client_by_id:
        if request.method == 'GET':
            resp = make_response(client_by_id.to_dict(rules=('-_password_hash', '-transactions.store._password_hash', '-transactions.store.subscribed_clients', '-transactions.client_id')), 200)
        elif request.method == 'DELETE':
            db.session.delete(client_by_id)
            db.session.execute(cart_table.delete().where(cart_table.c.client_id == id))
            db.session.commit()
            session.pop('client_id', None)
            resp = make_response({}, 204)
        elif request.method == 'PATCH':
            form_data=request.get_json()
            try:
                for attr in form_data:
                    setattr(client_by_id, attr, form_data.get(attr))
                db.session.commit()
                resp=make_response(client_by_id.to_dict(), 202)
            except ValueError:
                resp=make_response({ 'errors' : 'No client found!'}, 404)
    else:
        resp = make_response({"error" : ['Validation Errors']})
    return resp


#--------------------------------------------------------------------------------------------------- STORES BY ID [GET, PATCH, DELETE]-------------------
@app.route('/stores/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def store_by_id(id):
    store_by_id = Store.query.filter_by(id = id).first()
    if store_by_id:
        if request.method == 'GET':
            resp = make_response(store_by_id.to_dict(rules=('-_password_hash', '-transactions.client.subscribed_stores', '-transactions.client._password_hash', '-transactions.store_id')), 200)
        elif request.method == 'DELETE':
            db.session.delete(store_by_id)
            db.session.commit()
            session.pop('store_id', None)
            resp = make_response({}, 204)
        elif request.method == 'PATCH':
            form_data=request.get_json()
            try:
                for attr in form_data:
                    setattr(store_by_id, attr, form_data.get(attr))
                db.session.commit()
                resp=make_response(store_by_id.to_dict(), 202)
            except ValueError:
                resp=make_response({ 'errors' : 'No store found!'}, 404)         
    else:
        resp = make_response({"error" : ['Validation Errors']})
    return resp


#---------------------------------------------------------------------------------------------------VIEW ALL TRANSACTIONS [GET]-------------
@app.route('/transactions', methods=['GET'])
def transactions():
    transactions = Transaction.query.all()
    resp = make_response([transaction.to_dict(rules=('-client._password_hash', '-client.subscribed_stores','-store._password_hash','-store.goods_services', '-store.subscribed_clients')) for transaction in transactions], 200)
    return resp


## ------------------------------------------------------------------------------------------------- PATCH STORE PROFILE [PATCH]-----
@app.route('/store_profiles/<int:profile_id>', methods=['PATCH'])
def update_store_profile(profile_id):
    store_profile = StoreProfile.query.filter_by(id = profile_id).first()
    data = request.get_json()

    if 'bio' in data:
        store_profile.bio = data['bio']

    if 'location' in data:
        store_profile.location = data['location']

    if 'phone_number' in data:
        store_profile.phone_number = data['phone_number']

    # Validate and commit the changes
    try:
        db.session.add(store_profile)
        db.session.commit()
        return make_response({'message': 'Store profile updated/created successfully'}, 200)
    except Exception as e:
        db.session.rollback()
        return make_response({'error': str(e)}, 500)


#---------------------------------------------------------------------------------------------------VIEW ALL GOODS AND SERVICES [GET]-------------
@app.route('/goods', methods=['GET'])
def goods():
    goods = GoodsService.query.all()
    resp = make_response([good.to_dict(rules=('-goods_carts._password_hash', '-goods_carts.subscribed_stores', '-goods_carts.transactions', '-store._password_hash', '-store.subscribed_clients', '-store.transactions' )) for good in goods])
    return resp


#--------------------------------------------------------------------------------------------------- CREATE NEW TRANSACTION [POST]---------------------------
@app.route('/create_transaction', methods=['POST'])
def create_transaction():
    try:
        form_data = request.get_json()
        
        total_amount = form_data['total_amount']
        store_id = form_data['store_id']
        client_id = form_data['client_id']
        goods_service_names = form_data['goods_service_names']

        if not total_amount or not store_id or not client_id:
            return make_response({'error': 'Total amount, store_id, and client_id are required'}, 400)

        store = Store.query.get(store_id)
        client = Client.query.get(client_id)

        if not store or not client:
            return make_response({'error': 'Store or client not found'}, 404)

        new_transaction = Transaction(total_amount=total_amount, store=store, client=client, goods_service_names=goods_service_names)
        db.session.add(new_transaction)
        db.session.execute(cart_table.delete().where(cart_table.c.client_id == client_id))
        db.session.commit()
        return make_response({'message': 'Transaction added successfully'}, 201)

    except Exception as e:
        # Return error response
        return make_response({'error': str(e)}, 500)


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
            print(session)
            print('Session started for Client')
            resp = make_response({'Message' : 'Login Successful', 'client' : client.to_dict()}, 201)
        else:
            resp = make_response({"ERROR" : "USER CANNOT LOG IN"}, 400)
            print('Could not start a session')
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
            print(session)
            print('Session started for Store')
            resp = make_response(store.to_dict(), 201)
        else:
            resp = make_response({"ERROR" : "USER CANNOT LOG IN"}, 400)
            print('Could not start a session')
    else:
        resp = make_response({"ERROR" : "USER NOT FOUND"}, 404)
    return resp


#--------------------------------------------------------------------------------------------------- LOG OUT FOR CLIENT [POST]-------------
@app.route('/client_logout', methods=['DELETE'])
def client_logout():
    session.pop('client_id', None)
    resp = make_response({'message': 'Logged out successfully'}, 204)
    print(session)
    print('Session Ended for Client\n')
    return resp


#--------------------------------------------------------------------------------------------------- LOG OUT FOR STORE [POST]-------------
@app.route('/store_logout', methods=['DELETE'])
def store_logout():
    session.pop('store_id', None)
    resp = make_response({'message': 'Logged out successfully'}, 204)
    print(session)
    print('Session Ended for Store\n')
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
        print('Session started for Client')
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
        
        new_store_profile = StoreProfile(store_id=new_store.id)
        db.session.add(new_store_profile)
        db.session.commit()
        # sets signed in store to session
        session['store_id'] = new_store.id
        print('Session started for Store')
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

#---------------------------------------------------------------------------------------------------REMOVE GOODS/SERVICE [DELETE]-------------
@app.route('/delete_goods_service/<int:goods_service_id>', methods=['DELETE'])
def delete_goods_service(goods_service_id):
    # Retrieve the GoodsService from the database
    goods_service = GoodsService.query.get(goods_service_id)

    # Check if the GoodsService exists
    if goods_service:
    # Delete the GoodsService from the database
        db.session.delete(goods_service)
        db.session.commit()
        return make_response({'message': 'GoodsService deleted successfully'}, 200)
    else:   
        return make_response({'error': 'GoodsService not found'}, 404)


# #--------------------------------------------------------------------------------------------------- CLIENT SUBSCRIBE TO STORE BY CODE [POST]-------------
@app.route('/subscribe_by_code', methods=['POST'])
def subscribe_to_store_by_code():
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
            return make_response({'message': f'Client {client_id} is already subscribed to store {store_code}'}, 400)
    else:
        return make_response({'error': 'Invalid client ID or store code'}), 404
    
 # #--------------------------------------------------------------------------------------------------- CLIENT SUBSCRIBE TO STORE [POST]-------------   
@app.route('/subscribe', methods=['POST'])
def subscribe_to_store():
    form_data = request.get_json()

    # I made it so it grabs the client currently logged in by default via the session
    client_id = session.get('client_id')
    print(client_id)
    store_code = form_data['store_code']
    print(store_code)

    # HERE I Retrieve the client and store objects
    client = Client.query.filter_by(id=client_id).first()
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
    
# #--------------------------------------------------------------------------------------------------- UNSUBSCRIBE FROM CLIENT [DELETE]-------------   
@app.route('/store_unsubscribe', methods=['DELETE'])
def unsubscribe_from_store():
    form_data = request.get_json()

    client_id = form_data['client_id']
    print(client_id)
    store_code = form_data['store_code']
    print(store_code)
    
    # if not client_id or not store_code:
    #     return make_response({'error': 'Client ID and store code are required'}, 400)  # Bad Request

    client = Client.query.filter_by(id=client_id).first()
    store = Store.query.filter_by(code=store_code).first()

    if client and store:
        # Check if the client is subscribed to the store
        if client in store.subscribed_clients:
            store.subscribed_clients.remove(client)
            db.session.commit()
            return make_response({'message': f'Client {client_id} unsubscribed from store {store_code} successfully'}, 200)
        else:
            return make_response({'message': f'Client {client_id} is not subscribed to store {store_code}'}, 404)
    else:
        return make_response({'error': 'Invalid client ID or store code'}, 404)



#--------------------------------------------------------------------------------------------------- CHECK CLIENT SESSION [GET]-------------
@app.route('/check_client_session', methods = ['GET'])
def check_client_session():
    # check current session
    client_id = session.get('client_id')
    if client_id:
        print('Checking Client Session')
        client = Client.query.filter_by(id = client_id).first()
        if client:
            resp = make_response(client.to_dict(rules=('-_password_hash', '-subscribed_stores._password_hash')), 200)
            print('\nClient Sessions Active\n')
            print(session)
        else:
            resp = make_response({}, 404)
            print('No Client Session found!')
    else:
        resp = make_response({}, 404)
        print('No Session found!')
    return resp


#--------------------------------------------------------------------------------------------------- CHECK STORE SESSION [GET]-----------------

@app.route('/check_store_session', methods = ['GET'])
def check_store_session():
    # check current session
    store_id = session.get('store_id')
    if store_id:
        print('Checking Store Session')
        store = Store.query.filter_by(id = store_id).first()
        if store: 
            resp = make_response(store.to_dict(rules=('-_password_hash', '-subscribed_clients._password_hash', '-transactions.client._password_hash', '-transactions.client.subscribed_stores')), 200)
            print('\nStore Sessions Active\n')
            print(session)
        else:
            resp = make_response({}, 404)
            print('No Store Session found!')
            print(session)
    else:
        resp = make_response({}, 404)
        print('\n<No Session found!>\n')
        print(session)
    return resp


#--------------------------------------------------------------------------------------------------- PROTECT CLIENT SESSION (Timeout) -----------------
@app.route('/protected')
def client_protected():
    if 'client_id' not in session:
        abort(401)  # Unauthorized
    client_id = session['client_id']
    # Use client_id to fetch client data or perform other actions
    return f'Protected content for client {client_id}'


#--------------------------------------------------------------------------------------------------- PROTECT STORE SESSION -----------------
@app.route('/protected')
def store_protected():
    if 'store_id' not in session:
        abort(401)  # Unauthorized
    store_id = session['store_id']
    # Use store_id to fetch store data or perform other actions
    return f'Protected content for store {store_id}'








if __name__ == '__main__':
    app.run(port=4444, debug=True)